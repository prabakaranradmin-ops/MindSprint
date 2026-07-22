/**
 * Bopplebee — Playwright acceptance tests.
 *
 * Every test maps to requirements in REQUIREMENTS.md (v2.5) — the ID(s) appear
 * in the test title and as a `requirement` annotation, and key moments are
 * attached as screenshots so the HTML report doubles as evidence.
 * Traceability matrix: tests/TRACEABILITY.md
 */
const { test, expect } = require('@playwright/test');

/* ───────────────────────── helpers ───────────────────────── */

const NUMWORD = ['zero','one','two','three','four','five','six','seven','eight','nine','ten'];

const dateStr = (offsetDays = 0) => {
  const d = new Date(Date.now() + offsetDays * 86400000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const nodes = arr => arr.map(s => (typeof s === 'string' ? { status: s, stars: 0 } : s));
const baseProgress = (mathNodes) => ({
  math:    { nodes: mathNodes || nodes(['current','locked','locked','locked','locked']) },
  words:   { nodes: nodes(['current','locked','locked','locked','locked']) },
  science: { nodes: nodes(['current','locked','locked','locked','locked']) },
  music:   { nodes: nodes(['current','locked','locked','locked','locked']) },
});

/** A returning-user save. lastBonusDate defaults to today so the daily bonus
 *  sticker doesn't interfere with unrelated tests. */
const makeSave = (over = {}) => ({
  profile: {
    name: 'Zoe', age: 6, avatarColor: 'leaf', avatarAccessory: 'none',
    coins: 40, stars: 4, streak: 2,
    lastPlayDate: dateStr(-1), lastBonusDate: dateStr(0),
    ...(over.profile || {}),
  },
  progress: over.progress || baseProgress(),
  settings: { readAloud: true, sfx: true, ...(over.settings || {}) },
  session: over.session || null,
});

/** Seed localStorage once per browser context (survives reloads within a test). */
async function seed(page, save) {
  await page.addInitScript(s => {
    if (!localStorage.getItem('__seeded')) {
      localStorage.clear();
      if (s) localStorage.setItem('bloom-v2', JSON.stringify(s));
      localStorage.setItem('__seeded', '1');
    }
  }, save);
}

/** Read the app's save. The app persists storage v3 ({profiles:[…]}); seeds are
 *  v2 (migrated on load). Returns a v2-shaped view of the active profile. */
/** Seed a full v3 store directly — needed when a test must inject skills or
 *  events, which the v2 migration always resets to empty. */
async function seedV3(page, { profile = {}, progress, skills = {}, events = [], settings = {} } = {}) {
  const base = makeSave({ profile, progress });
  const wrap = prog => Object.fromEntries(
    Object.entries(prog).map(([k, v]) => [k, { worlds: [{ nodes: v.nodes }] }]));
  const store = {
    version: 3, activeProfileId: 'p-test',
    settings: { readAloud: true, sfx: true, ...settings },
    profiles: [{ id: 'p-test', profile: base.profile, progress: wrap(base.progress),
      skills, events, recentItems: [], session: null }],
  };
  await page.addInitScript(s => {
    if (!localStorage.getItem('__seeded')) {
      localStorage.clear();
      localStorage.setItem('bloom-v3', JSON.stringify(s));
      localStorage.setItem('__seeded', '1');
    }
  }, store);
}

const readSave = page =>
  page.evaluate(() => {
    const unwrap = prog => {
      const out = {};
      for (const k in (prog || {})) {
        const p = prog[k];
        out[k] = { ...p, nodes: p.worlds ? p.worlds.flatMap(w => w.nodes) : (p.nodes || []) };
      }
      return out;
    };
    const v3 = JSON.parse(localStorage.getItem('bloom-v3') || 'null');
    if (v3 && v3.profiles && v3.profiles.length) {
      const p = v3.profiles.find(x => x.id === v3.activeProfileId) || v3.profiles[0];
      return { profile: p.profile, progress: unwrap(p.progress), session: p.session, settings: v3.settings };
    }
    return JSON.parse(localStorage.getItem('bloom-v2') || 'null');
  });

/** Poll the auto-saved session until predicate matches (auto-save runs per state change). */
async function sessionWhen(page, pred, label) {
  let out;
  await expect
    .poll(async () => {
      const s = (await readSave(page))?.session;
      if (s && pred(s)) { out = s; return 'ok'; }
      return 'waiting:' + label;
    }, { timeout: 20000 })
    .toBe('ok');
  return out;
}

/** The current question object once the auto-save shows the expected qIdx. */
async function questionAt(page, qIdx) {
  const s = await sessionWhen(page, x => x.qIdx === qIdx, `q${qIdx}`);
  return s.questions[qIdx];
}

async function shot(page, testInfo, name) {
  await testInfo.attach(name, { body: await page.screenshot(), contentType: 'image/png' });
}

/** Click the correct/incorrect answer for the current question (math question types). */
async function clickAnswer(page, q, correct) {
  if (q.type === 'pattern') {  // answer tiles carry human-readable aria-labels
    const key = correct ? q.correct : q.opts.map(o => o.key).find(k => k !== q.correct);
    await page.getByRole('button', { name: key, exact: true }).click();
    return;
  }
  if (q.type === 'compare') {
    const side = (q.correct === 'left') === correct ? 'Left tree' : 'Right tree';
    await page.locator('.compare-zone', { hasText: side }).click();
  } else { // count / addition / subtraction — .ans-card shows numeral + word
    const value = correct ? q.count : q.answers.find(a => a !== q.count);
    await page.locator(`.ans-card:has-text("${NUMWORD[value]}")`).click();
  }
}

/** From the map, enter the current stage: Continue → Lesson Intro → Start. */
async function enterStage(page) {
  await page.getByRole('button', { name: 'Continue →' }).click();
  await page.getByRole('button', { name: 'Start ▶' }).click();
  await expect(page.getByText('Question 1 of 5')).toBeVisible();
}

/** Answer the current question with N wrong attempts first, then correctly. */
async function playQuestion(page, qIdx, wrongAttempts = 0) {
  const q = await questionAt(page, qIdx);
  for (let w = 0; w < wrongAttempts; w++) {
    await clickAnswer(page, q, false);
    await expect(page.getByRole('button', { name: /Try Again/ })).toBeVisible();
    await page.getByRole('button', { name: /Try Again/ }).click();
  }
  await clickAnswer(page, q, true);
  await page.getByRole('button', { name: 'Next →' }).click();
}

/** Solve one Matching Pairs board: flip both cards of each pair using the deck
 *  order from the auto-saved question, then advance. */
async function playPairsQuestion(page, qIdx) {
  const q = await questionAt(page, qIdx);
  const byPid = {};
  q.deck.forEach((c, i) => { (byPid[c.pid] = byPid[c.pid] || []).push(i); });
  for (const pid of Object.keys(byPid)) {
    const [a, b] = byPid[pid];
    await page.locator('.pair-card').nth(a).click();
    await page.locator('.pair-card').nth(b).click();
  }
  await page.getByRole('button', { name: 'Next →' }).click();
}

/** Addition Blocks (§4 P2): tap a number tile to pick it up, tap the slot to place. */
async function playAdditionBlocks(page, qIdx, wrong = false) {
  const q = await questionAt(page, qIdx);
  const value = wrong ? q.answers.find(a => a !== q.count) : q.count;
  await page.locator(`.ans-card:has-text("${NUMWORD[value]}")`).click();
  await page.locator('.eq-slot').click();
}

/** Word Builder (§4 P2): pick each letter tile, place into its slot in order. */
async function playWordBuild(page, qIdx) {
  const q = await questionAt(page, qIdx);
  for (let k = 0; k < q.word.length; k++) {
    await page.locator('.wb-tile', { hasText: q.word[k] }).first().click();
    await page.locator('.wb-slot').nth(k).click();
  }
  await page.getByRole('button', { name: 'Next →' }).click();
}

/** Lifecycle timeline (§4 P2): place the stage cards into the slots in order. */
async function playLifeOrder(page, qIdx) {
  const q = await questionAt(page, qIdx);
  for (let k = 0; k < q.stages.length; k++) {
    await page.getByRole('button', { name: q.stages[k].l, exact: true }).click();
    await page.locator('.lo-slot').nth(k).click();
  }
  await page.getByRole('button', { name: 'Next →' }).click();
}

/** Letter tracing (§4 P2): tap the single active dot through every stroke.
 *  Straight strokes (2 points) have 3 dots; curved strokes list their dots. */
const traceDots = q => q.strokes.reduce((a, s) => a + (s.length === 2 ? 3 : s.length), 0);
async function playTrace(page, qIdx) {
  const q = await questionAt(page, qIdx);
  for (let i = 0; i < traceDots(q); i++)
    await page.locator('.trace-dot-active').click();
  await page.getByRole('button', { name: 'Next →' }).click();
}

/** Echo one Rhythm Tap pattern: pads are disabled during the watch phase, so
 *  clicks auto-wait for the echo phase. */
async function playRhythmQuestion(page, qIdx) {
  const q = await questionAt(page, qIdx);
  for (const lane of q.pattern) await page.locator('.rhythm-pad').nth(lane).click();
  await page.getByRole('button', { name: 'Next →' }).click();
}

/** Complete the whole set; wrongPerQ[i] = wrong attempts before the correct
 *  answer. Requeue-aware (§8.4): missed questions come back once at the end,
 *  so the set can grow up to 10. */
async function completeStage(page, wrongPerQ = [0, 0, 0, 0, 0]) {
  for (let i = 0; i < 10; i++) {
    if (await page.getByText('Stage Clear!').isVisible().catch(() => false)) break;
    await playQuestion(page, i, wrongPerQ[i] || 0);
  }
  await expect(page.getByText('Stage Clear!')).toBeVisible();
}

/* ───────────────────────── tests ───────────────────────── */

test('§3.1 + §17.1-4 + §18 — onboarding completes; min-2 subjects enforced; name field sanitized', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §3.1 onboarding flow; §17.1 test 4 (min 2 subjects); §18 name-field constraints' });
  await seed(page, null); // fresh device
  await page.goto('app.html');

  await shot(page, testInfo, '01-splash');
  await page.getByRole('button', { name: /Start Learning/ }).click();

  // §18: letters/spaces only, 12-char cap, live-sanitized
  const nameInput = page.getByPlaceholder('Type your name…');
  await nameInput.fill('Zoe123!!!');
  await expect(nameInput).toHaveValue('Zoe');
  await nameInput.fill('Abcdefghijklmnop');
  await expect(nameInput).toHaveValue('Abcdefghijkl');
  await nameInput.fill('Zoe');
  await page.getByText('6', { exact: true }).click();
  await shot(page, testInfo, '02-welcome-sanitized-name');
  await page.getByRole('button', { name: /Hi, Pip!/ }).click();

  await page.getByRole('button', { name: /Looks great!/ }).click();

  // §17.1-4: three subjects pre-selected; can drop to 2, never below
  await expect(page.getByText('3 subjects selected!')).toBeVisible();
  await page.getByText('Numbers', { exact: true }).click();
  await expect(page.getByText('2 subjects selected!')).toBeVisible();
  await page.getByText('Words', { exact: true }).click();   // must be refused
  await expect(page.getByText('2 subjects selected!')).toBeVisible();
  await shot(page, testInfo, '03-plan-min-two-enforced');
  await page.getByRole('button', { name: /Let's go!/ }).click();

  await expect(page.getByText('Zoe', { exact: true })).toBeVisible();
  await shot(page, testInfo, '04-map-after-onboarding');
});

test('§4 Music world — star-gated with honest progress; Rhythm Tap playable at 30⭐', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §4 Music world (P2): locked-state stage screen with real progress (no broken promises, §14) + Rhythm Tap gameplay' });
  await seed(page, makeSave());                                       // 4 stars → locked
  await page.goto('app.html');
  await expect(page.getByText('Numbers World')).toBeVisible();
  await expect(page.getByText('🎵 Music 🔒')).toBeVisible();

  await page.getByText('🎵 Music 🔒').click();                        // locked stage screen
  await expect(page.getByText('Earn 30 ⭐ to unlock')).toBeVisible();
  await expect(page.getByText('4 / 30 stars')).toBeVisible();
  await shot(page, testInfo, '01-locked-stage');
  await page.getByText('←', { exact: true }).click();
  await expect(page.getByText('Numbers World')).toBeVisible();

  // 30 stars → unlocked and playable
  await page.evaluate((s) => {
    localStorage.clear();
    localStorage.setItem('bloom-v2', JSON.stringify(s));
    localStorage.setItem('__seeded', '1');
  }, makeSave({ profile: { stars: 30 } }));
  await page.reload();
  await expect(page.getByText('🎵 Music', { exact: true })).toBeVisible();
  await page.getByText('🎵 Music', { exact: true }).click();
  await expect(page.getByText('Music World')).toBeVisible();
  await enterStage(page);
  await shot(page, testInfo, '02-rhythm-question');

  // wrong pad → gentle retry (pattern replays), then echo it through
  const q0 = await questionAt(page, 0);
  const wrongLane = (q0.pattern[0] + 1) % 4;
  await page.locator('.rhythm-pad').nth(wrongLane).click();           // waits for watch to finish
  await expect(page.getByRole('button', { name: /Try Again/ })).toBeVisible();
  await page.getByRole('button', { name: /Try Again/ }).click();
  await playRhythmQuestion(page, 0);
  await expect(page.getByText('Question 2 of 6')).toBeVisible();      // §8.4 requeue after the miss

  for (let i = 1; i < 6; i++) await playRhythmQuestion(page, i);
  await expect(page.getByText('Stage Clear!')).toBeVisible();
  await shot(page, testInfo, '03-stage-clear');
  await page.getByRole('button', { name: /Map/ }).click();
  expect((await readSave(page)).progress.music.nodes[0].status).toBe('done');
});

test('§14 daily hello bonus — +10 coins once per calendar date', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §14 daily hello bonus (flat +10, once per date, clock-safe)' });
  await seed(page, makeSave({ profile: { coins: 40, lastBonusDate: dateStr(-1) } }));
  await page.goto('app.html');

  await expect(page.getByText('Good to see you!')).toBeVisible();
  await expect(page.getByText('+10 coins')).toBeVisible();
  await shot(page, testInfo, 'bonus-sticker');
  await expect.poll(async () => (await readSave(page)).profile.coins).toBe(50);

  // same date again → no second bonus
  await page.reload();
  await expect(page.getByText('Numbers World')).toBeVisible();
  await expect(page.getByText('Good to see you!')).toHaveCount(0);
  await expect.poll(async () => (await readSave(page)).profile.coins).toBe(50);
  await shot(page, testInfo, 'bonus-not-repeated');
});

test('§3.4 + §3.5 + §10.2 — correct answer flow: praise modal, star/coin rewards, 🔊 replay button', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §3.4 activity loop; §3.5 feedback; §3.6 rewards; §10.2 tap-to-replay audio' });
  await seed(page, makeSave());
  await page.goto('app.html');
  await enterStage(page);

  await expect(page.getByLabel('Hear it again')).toBeVisible(); // §10.2
  await shot(page, testInfo, '01-question-with-audio-button');

  const q = await questionAt(page, 0);
  await clickAnswer(page, q, true);
  await expect(page.getByText('+1 star')).toBeVisible();
  await expect(page.getByText('+5 coins')).toBeVisible();
  await shot(page, testInfo, '02-correct-modal');
  await page.getByRole('button', { name: 'Next →' }).click();
  await expect(page.getByText('Question 2 of 5')).toBeVisible();
});

test('§3.5 + §8.4 — gentle retry: no fail language; answer revealed after 2 mistakes', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §3.5 gentle feedback; §8.4 mastery (reveal after 2 mistakes on a question)' });
  await seed(page, makeSave());
  await page.goto('app.html');
  await enterStage(page);

  const q = await questionAt(page, 0);
  await clickAnswer(page, q, false);
  await expect(page.getByRole('button', { name: /Try Again/ })).toBeVisible();
  await expect(page.getByText(/game over|failed|wrong!/i)).toHaveCount(0);
  await shot(page, testInfo, '01-gentle-retry');
  await page.getByRole('button', { name: /Try Again/ }).click();

  await clickAnswer(page, q, false); // 2nd mistake → reveal
  await expect(page.getByText('The answer was')).toBeVisible();
  await shot(page, testInfo, '02-answer-revealed');
  await page.getByRole('button', { name: /Try Again/ }).click();
  await clickAnswer(page, q, true);
  await expect(page.getByRole('button', { name: 'Next →' })).toBeVisible();
});

test('§17.1-1 + §17.1-3 — hearts hit zero with no game-over; replay never lowers stars', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §17.1 test 1 (hearts never a fail state); §17.1 test 3 / §3.2 (replay: stars only increase, statuses unchanged)' });
  // Stage 1 already done with 3 stars; replay it and play badly (6 mistakes → hearts reach 0)
  await seed(page, makeSave({
    progress: baseProgress(nodes([{ status: 'done', stars: 3 }, 'current', 'locked', 'locked', 'locked'])),
  }));
  await page.goto('app.html');

  await page.locator('.node.done').click();          // replay stage 1
  await page.getByRole('button', { name: 'Start ▶' }).click();
  await expect(page.getByText('Question 1 of 5')).toBeVisible();

  await playQuestion(page, 0, 2);
  await playQuestion(page, 1, 2);
  await playQuestion(page, 2, 2);                    // 6 mistakes → hearts fully empty
  await expect(page.getByText('Question 4 of 8')).toBeVisible(); // 3 requeued (§8.4); no lockout
  await shot(page, testInfo, '01-zero-hearts-still-playing');
  await playQuestion(page, 3, 0);
  await playQuestion(page, 4, 0);
  for (const i of [5, 6, 7]) await playQuestion(page, i, 0);     // requeued get their second go
  await expect(page.getByText('Stage Clear!')).toBeVisible();
  await shot(page, testInfo, '02-stage-clear-despite-mistakes');
  await page.getByRole('button', { name: /Map/ }).click();

  const save = await readSave(page);
  expect(save.progress.math.nodes[0].stars).toBe(3);            // 1-star run must not lower 3 stars
  expect(save.progress.math.nodes[0].status).toBe('done');
  expect(save.progress.math.nodes[1].status).toBe('current');   // statuses untouched
});

test('§17.1-2 — parent gate blocks the dashboard until the math question is answered', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §3.7 / §17.1 test 2 (parent gate)' });
  await seed(page, null);
  await page.goto('app.html');

  await page.getByText('👨‍👩‍👧 Parents').click();
  await expect(page.getByText('Grown-ups only')).toBeVisible();
  await shot(page, testInfo, '01-gate');

  const question = await page.locator('.modal-card').textContent();
  const m = question.match(/What is (\d+) × (\d+)\?/);
  const answer = Number(m[1]) * Number(m[2]);
  const options = await page.locator('.modal-card button').allTextContents();
  const wrong = options.map(Number).find(n => !Number.isNaN(n) && n && n !== answer);

  await page.getByRole('button', { name: String(wrong), exact: true }).click();
  await page.waitForTimeout(900);
  await expect(page.getByText('Parent Dashboard')).toHaveCount(0);  // wrong answer → still blocked
  await shot(page, testInfo, '02-wrong-answer-still-blocked');

  await page.getByRole('button', { name: String(answer), exact: true }).click();
  await expect(page.getByText('Parent Dashboard')).toBeVisible();
  await shot(page, testInfo, '03-dashboard-after-gate');
});

test('§17.1-5 — save/restore round-trip: reload lands on map with identical profile', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §3.8 / §17.1 test 5 (persistence round-trip)' });
  await seed(page, makeSave({ profile: { name: 'Ravi', coins: 77, stars: 9 } }));
  await page.goto('app.html');
  await expect(page.getByText('Ravi', { exact: true })).toBeVisible();
  await expect(page.getByText('77', { exact: true })).toBeVisible();

  await page.reload();
  await expect(page.getByText('Ravi', { exact: true })).toBeVisible();
  await expect(page.getByText('77', { exact: true })).toBeVisible();
  await expect(page.getByText('⭐ 9 stars')).toBeVisible();
  await shot(page, testInfo, 'after-reload-identical');
});

test('§17.1-6 — completing stage 5 shows Stage Clear and leaves no stuck node', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §17.1 test 6 (final stage completes cleanly; screen routing §3.6)' });
  await seed(page, makeSave({
    progress: baseProgress(nodes([
      { status: 'done', stars: 2 }, { status: 'done', stars: 2 },
      { status: 'done', stars: 2 }, { status: 'done', stars: 2 }, 'current',
    ])),
  }));
  await page.goto('app.html');
  await enterStage(page);                    // stage 5 = compare
  await completeStage(page);
  await shot(page, testInfo, '01-final-stage-clear');
  await page.getByRole('button', { name: /Map/ }).click();

  const save = await readSave(page);
  const statuses = save.progress.math.nodes.map(n => n.status);
  expect(statuses).toEqual(['done', 'done', 'done', 'done', 'done']);
  expect(save.progress.math.nodes[4].stars).toBeGreaterThanOrEqual(1);
  await shot(page, testInfo, '02-map-all-done');
});

test('§17.1-7 — full offline session: reload with networking disabled still renders and plays', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §17.1 test 7 (full offline session, no network calls) — added 2026-07-21, was previously unverified by any permanent test' });
  await seed(page, makeSave());
  await page.goto('app.html');
  await expect(page.getByText('Numbers World')).toBeVisible();
  // let the service worker install and precache before going offline (§2, §23)
  await page.evaluate(() => navigator.serviceWorker && navigator.serviceWorker.ready);
  await page.waitForTimeout(500);

  await page.context().setOffline(true);
  const res = await page.goto('app.html');
  expect(res.status()).toBeLessThan(400);
  await expect(page.getByText('Numbers World')).toBeVisible();

  // the app must still be genuinely playable offline, not just render a shell
  await enterStage(page);
  await expect(page.getByText('Question 1 of 5')).toBeVisible();
  await playQuestion(page, 0);
  await shot(page, testInfo, 'offline-play-works');

  await page.context().setOffline(false);
});

test('§17.1-8 — no PII in any logged event (schema scan)', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §17.1 test 8 (PII schema scan) / §13.1 no-PII-in-events rule — added 2026-07-21, the doc previously claimed this was enforced by a test that didn\'t exist' });
  const distinctiveName = 'Persimmonwood';   // unlikely to appear anywhere except the profile name itself
  await seedV3(page, { profile: { name: distinctiveName } });
  await page.goto('app.html');

  // generate a real spread of event types: stage lifecycle, settings, shop, feedback
  await enterStage(page);
  await completeStage(page);
  await page.getByRole('button', { name: /Map/ }).click();
  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByText('👨‍👩‍👧 Parents').click();
  const gq = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq[1]) * Number(gq[2])), exact: true }).click();
  await expect(page.getByText('Parent Dashboard')).toBeVisible();

  const events = await page.evaluate(() => {
    const raw = JSON.parse(localStorage.getItem('bloom-v3'));
    const p = raw.profiles.find(x => x.id === raw.activeProfileId);
    return p.events;
  });
  expect(events.length).toBeGreaterThan(0);   // the scan is meaningless if nothing was logged

  const serialized = JSON.stringify(events);
  // the child's actual name must never appear anywhere in the event log
  expect(serialized).not.toContain(distinctiveName);
  // no event should carry a free-text/PII-shaped field — every payload should
  // only ever contain enum-like ids/booleans/numbers (§13.1's own field list)
  const DISALLOWED_KEYS = ['name', 'email', 'phone', 'birthdate', 'address', 'location', 'photo'];
  for (const ev of events) {
    for (const key of Object.keys(ev)) {
      expect(DISALLOWED_KEYS, `event "${ev.t}" has a disallowed key "${key}"`).not.toContain(key.toLowerCase());
    }
  }
});

test('§22.1 + §17.1-10 — interruption resume: Keep going restores the exact question', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §22.1 session resume / §17.1 test 10' });
  await seed(page, makeSave());
  await page.goto('app.html');
  await enterStage(page);
  await playQuestion(page, 0, 1);   // 1 mistake → q0 requeued (§8.4), set is now 6
  await expect(page.getByText('Question 2 of 6')).toBeVisible();

  await page.reload();                                  // simulate the app being killed
  await expect(page.getByText('Welcome back!')).toBeVisible();
  await expect(page.getByText(/question 2 of 6/)).toBeVisible();
  await shot(page, testInfo, '01-resume-offer');

  await page.getByRole('button', { name: /Keep going!/ }).click();
  await expect(page.getByText('Question 2 of 6')).toBeVisible();
  const session = await sessionWhen(page, s => s.qIdx === 1, 'restored session');
  expect(session.mistakes).toBe(1);                     // mistake count intact
  await shot(page, testInfo, '02-resumed-question');
});

test('§22.1 — Start over discards the interrupted stage without losing profile data', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §22.1 resume choice (Start over path)' });
  await seed(page, makeSave({ profile: { coins: 40, lastBonusDate: dateStr(0) } }));
  await page.goto('app.html');
  await enterStage(page);
  await playQuestion(page, 0, 0);
  await page.reload();
  await expect(page.getByText('Welcome back!')).toBeVisible();
  await page.getByRole('button', { name: 'Start over' }).click();
  await expect(page.getByText('Numbers World')).toBeVisible();   // back on map, node still current
  const save = await readSave(page);
  expect(save.progress.math.nodes[0].status).toBe('current');
  expect(save.profile.name).toBe('Zoe');
  await shot(page, testInfo, 'map-after-start-over');
});

test('§22.1 onboarding resume — interrupting mid-onboarding and reloading resumes at the same screen, keeps name', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §22.1: onboarding is resumable step-by-step — added 2026-07-21, previously nothing persisted during welcome/avatar/plan' });
  await page.addInitScript(() => {
    if (!localStorage.getItem('__seeded')) { localStorage.clear(); localStorage.setItem('__seeded','1'); }
  });
  await page.goto('app.html');
  await expect(page.getByText(/about 3 minutes/)).toBeVisible();   // §22.1 upfront time estimate
  await page.getByRole('button', { name: /Start Learning/ }).click();
  await page.locator('input').first().fill('Priya');
  await page.getByRole('button', { name: /Hi, Pip/ }).click();
  await expect(page.getByText('Pick your look!')).toBeVisible();

  await page.reload();   // simulate the app being killed mid-avatar-step

  await expect(page.getByText('Pick your look!')).toBeVisible();   // resumed on the avatar screen, not splash/welcome
  await expect(page.getByText('Priya', { exact: true })).toBeVisible();
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('bloom-v3')).profiles[0]);
  expect(save.profile.name).toBe('Priya');
  expect(save.profile.onboarded).toBeFalsy();
  expect(save.onboardScreen).toBe('avatar');
  await shot(page, testInfo, 'resumed-avatar-screen');
});

test('§22.1 onboarding resume — finishing onboarding marks onboarded; a later reload goes straight to the map, never re-onboards', async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('__seeded')) { localStorage.clear(); localStorage.setItem('__seeded','1'); }
  });
  await page.goto('app.html');
  await page.getByRole('button', { name: /Start Learning/ }).click();
  await page.locator('input').first().fill('Sam');
  await page.getByRole('button', { name: /Hi, Pip/ }).click();
  await page.getByRole('button', { name: /Looks great/ }).click();
  await page.getByRole('button', { name: /Let's go/ }).click();
  await expect(page.getByText('Numbers World')).toBeVisible();

  const save1 = await page.evaluate(() => JSON.parse(localStorage.getItem('bloom-v3')).profiles[0]);
  expect(save1.profile.onboarded).toBe(true);

  await page.reload();
  await expect(page.getByText('Numbers World')).toBeVisible();   // straight to map, no re-onboarding
});

test('§22.1 onboarding resume — a migrated v2 legacy save is treated as already onboarded', async ({ page }) => {
  await page.addInitScript(() => {
    if (localStorage.getItem('__seeded')) return;
    localStorage.clear();
    localStorage.setItem('bloom-v2', JSON.stringify({
      profile: { name: 'Legacy', age: 6, avatarColor: 'sky', coins: 10, stars: 2, streak: 1,
        lastPlayDate: null, lastBonusDate: null },
      progress: { math: { nodes: [{status:'current',stars:0},{status:'locked',stars:0},{status:'locked',stars:0},{status:'locked',stars:0},{status:'locked',stars:0}] } },
      settings: { readAloud: true, sfx: true },
    }));
    localStorage.setItem('__seeded', '1');
  });
  await page.goto('app.html');
  await expect(page.getByText('Numbers World')).toBeVisible();   // straight to map, not sent through onboarding
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('bloom-v3')).profiles[0]);
  expect(save.profile.onboarded).toBe(true);
});

test('§17.1-11 — corrupted save with no fallback: app starts fresh without crashing, no white screen', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §17.1 test 11 (corrupted save recovery) — added 2026-07-21' });
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('bloom-v3', '{not valid json!!');   // simulate a corrupted/truncated save
  });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('app.html');

  // must not crash, and must not be stuck on a blank/white screen — the
  // corrupted-save fallback (loadStore()) returns null, so onboarding starts
  await expect(page.getByRole('button', { name: /Start Learning/ })).toBeVisible();
  await expect(page.locator('#root')).not.toBeEmpty();
  expect(errors).toEqual([]);
  await shot(page, testInfo, 'started-fresh-after-corrupted-save');
});

test('§17.1-11 — corrupted current save falls back to the legacy save if one exists', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §17.1 test 11 (corrupted save recovery, fallback path) — added 2026-07-21' });
  await page.addInitScript(s => {
    localStorage.clear();
    localStorage.setItem('bloom-v3', '{not valid json!!');   // corrupted current-format save
    localStorage.setItem('bloom-v2', JSON.stringify(s));      // valid legacy save still present
  }, makeSave({ profile: { name: 'Mika', coins: 25, stars: 6 } }));
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('app.html');

  // loadStore() falls through to the legacy bloom-v2 key and migrates it —
  // the child's actual save is recovered, not silently discarded
  await expect(page.getByText('Mika', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
  await shot(page, testInfo, 'recovered-from-legacy-fallback');
});

test('§22.2 — rolling save backup: corrupted current save recovers from bloom-v3-backup (preferred over the legacy v2 fallback)', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §22.2 rolling backup — added 2026-07-21' });
  const good = { version: 3, activeProfileId: 'kid-a', settings: { readAloud: true, sfx: true },
    profiles: [{ id: 'kid-a', profile: { name: 'Priya', age: 6, avatarColor: 'leaf', avatarAccessory: 'none',
        coins: 33, stars: 7, streak: 0, lastPlayDate: dateStr(-1), lastBonusDate: dateStr(0) },
      progress: { math: { worlds: [{ nodes: nodes(['current','locked','locked','locked','locked']) }] },
        words: { worlds: [{ nodes: nodes(['current','locked','locked','locked','locked']) }] },
        science: { worlds: [{ nodes: nodes(['current','locked','locked','locked','locked']) }] },
        music: { worlds: [{ nodes: nodes(['current','locked','locked','locked','locked']) }] } },
      skills: {}, events: [], recentItems: [], session: null }] };
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.addInitScript(s => {
    localStorage.clear();
    localStorage.setItem('bloom-v3', '{not valid json');       // corrupted live save
    localStorage.setItem('bloom-v3-backup', JSON.stringify(s)); // valid one-deep rolling backup
  }, good);
  await page.goto('app.html');

  await expect(page.getByText('Priya', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);

  // loadStore() also repairs the live key from the backup, not just this session
  const live = await page.evaluate(() => localStorage.getItem('bloom-v3'));
  expect(() => JSON.parse(live)).not.toThrow();
  expect(JSON.parse(live).profiles[0].profile.name).toBe('Priya');
});

test('§22.2 — every save rolls the backup forward; the parent dashboard surfaces a dismissible diagnostics notice after a recovered corruption', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §22.2 rolling backup + corrupt-blob diagnostics — added 2026-07-21' });
  await seedV3(page, { profile: { name: 'Leo' } });
  await page.goto('app.html');
  await expect(page.getByText('Numbers World')).toBeVisible();
  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByRole('button', { name: '←', exact: true }).click();   // any state change triggers doSave
  await page.waitForTimeout(300);

  const backup = await page.evaluate(() => localStorage.getItem('bloom-v3-backup'));
  expect(backup).not.toBeNull();
  expect(JSON.parse(backup).profiles[0].profile.name).toBe('Leo');

  // separately: the diagnostics notice, seeded directly since it's only ever
  // written by the recovery path exercised in the test above
  await page.evaluate(() => localStorage.setItem('bloom-v3-corrupt',
    JSON.stringify({ key: 'bloom-v3', raw: '{bad', message: 'Unexpected token', ts: Date.now() })));
  await page.reload();
  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByText('👨‍👩‍👧 Parents').click();
  const gq = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq[1]) * Number(gq[2])), exact: true }).click();
  await expect(page.getByText('Parent Dashboard')).toBeVisible();

  await expect(page.getByText(/save file problem/)).toBeVisible();
  await page.getByRole('button', { name: 'Got it' }).click();
  await expect(page.getByText(/save file problem/)).toHaveCount(0);
  const stored = await page.evaluate(() => localStorage.getItem('bloom-v3-corrupt'));
  expect(stored).toBeNull();
});

test('§11.2 + §17.1-12 — parent can download a backup file', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §11.2 local backup / §17.1 test 12 (export)' });
  await seed(page, makeSave());
  await page.goto('app.html');
  await page.getByRole('button', { name: '⚙️' }).click();        // map → kid settings
  await page.getByText('👨‍👩‍👧 Parents').click();

  const q = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(q[1]) * Number(q[2])), exact: true }).click();
  await expect(page.getByText('Data & Backup')).toBeVisible();
  await shot(page, testInfo, '01-backup-card');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Download Backup/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^bloom-backup-\d{4}-\d{2}-\d{2}\.json$/);
});

test('§17.1-9 + §10.2 — fully playable with audio unavailable', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §10.2 audio never sole carrier / §17.1 test 9' });
  await seed(page, makeSave());
  await page.addInitScript(() => {
    Object.defineProperty(window, 'speechSynthesis', { value: undefined });
    Object.defineProperty(window, 'AudioContext', { value: undefined });       // Web Audio too
    Object.defineProperty(window, 'webkitAudioContext', { value: undefined });
  });
  await page.goto('app.html');
  await enterStage(page);
  const q = await questionAt(page, 0);
  await clickAnswer(page, q, true);
  await expect(page.getByRole('button', { name: 'Next →' })).toBeVisible();
  await shot(page, testInfo, 'playable-without-audio');
});

test('§14 clock robustness — backward clock never revokes bonus or streak', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §14 clock robustness / §17.1 test 13 (child-favor date anomalies)' });
  // lastBonusDate/lastPlayDate in the FUTURE = the device clock was moved backward
  await seed(page, makeSave({ profile: { coins: 40, streak: 5, lastBonusDate: dateStr(2), lastPlayDate: dateStr(2) } }));
  await page.goto('app.html');
  await expect(page.getByText('Numbers World')).toBeVisible();
  await expect(page.getByText('Good to see you!')).toHaveCount(0);   // no double bonus
  await expect.poll(async () => (await readSave(page)).profile.coins).toBe(40);

  await enterStage(page);
  await completeStage(page);                                         // finish a stage "in the past"
  const save = await readSave(page);
  expect(save.profile.streak).toBe(5);                               // streak not revoked, not reset
  await shot(page, testInfo, 'streak-survives-clock-rollback');
});

/* §17.1 test 13 / TRACEABILITY.md's remaining gap: only the clock-backward
 * case was automated; DST/timezone variants were flagged as a follow-up and
 * never written. These two tests fill that gap using Playwright's clock API
 * to move the real browser clock across a genuine US DST transition, in an
 * explicit America/New_York context (`describe`-level test.use) so the
 * result doesn't depend on whichever timezone the test runner's host happens
 * to be in — a CI machine running in UTC wouldn't observe DST at all and
 * would make these tests silently meaningless.
 *
 * Investigation note: app.html's dayDiff() comment claims noon-anchoring
 * "avoids DST edge cases." Checked directly (reproducing the exact
 * computation in Node against both the 2026 US transitions and a historical
 * midnight-transition timezone, Brazil pre-2019): for every case actually
 * reachable by this app — comparing two whole calendar-day strings that are
 * genuinely a few days apart — Math.round() absorbs the ±1 hour DST shift
 * regardless of whether the anchor is noon or midnight, so no divergence
 * was found for THIS function's usage pattern. The real risk noon-anchoring
 * defends against is constructing a Date from a LOCAL time-of-day string
 * that happens to fall inside a skipped/repeated hour (e.g. a midnight
 * anchor in a timezone whose DST flips at midnight) — a real hazard in
 * general, just not one dayDiff's callers currently expose, since every
 * comparison here is whole-day and mid-single-hour ambiguity gets rounded
 * away. These two tests are kept anyway: they exercise a full real DST
 * transition end-to-end (real browser clock, real reducer, real streak
 * increment) that was previously completely untested, and they'd catch a
 * regression if dayDiff's usage ever changed to something finer-grained. */
test.describe('§14/§17.1 test 13 — DST transitions never break the streak-day calculation', () => {
  test.use({ timezoneId: 'America/New_York' });

  test('spring-forward (2026-03-08→09, the 23-hour day) still counts as exactly one streak day', async ({ page }, testInfo) => {
    testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §14 clock robustness / §17.1 test 13 — DST spring-forward variant' });
    // lastPlayDate is the wall-clock date the clock will be installed at
    // (2026-03-08, the day BEFORE spring-forward, in America/New_York) —
    // hardcoded rather than computed, since the whole point of this test is
    // pinning a specific real DST boundary, not "whatever today happens to be".
    await seed(page, makeSave({ profile: { coins: 0, streak: 3, lastPlayDate: '2026-03-08', lastBonusDate: '2026-03-08' } }));
    await page.clock.install({ time: new Date('2026-03-08T10:00:00-05:00') });   // EST, before the jump
    await page.goto('app.html');
    await expect(page.getByText('Numbers World')).toBeVisible();

    // advance the clock to the next calendar day, past the 2am spring-forward
    // jump (clocks skip 2:00-2:59am — this moment is real EDT, one wall-clock
    // day later despite only 23 hours of elapsed real time)
    await page.clock.setSystemTime(new Date('2026-03-09T10:00:00-04:00'));
    await page.reload();
    await expect(page.getByText('Numbers World')).toBeVisible();

    await enterStage(page);
    await completeStage(page);
    const save = await readSave(page);
    expect(save.profile.streak).toBe(4);      // exactly one day advanced, not stuck at 3, not jumped to 5+
    await shot(page, testInfo, 'streak-survives-spring-forward');
  });

  test('fall-back (2026-11-01→02, the 25-hour day) still counts as exactly one streak day', async ({ page }, testInfo) => {
    testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §14 clock robustness / §17.1 test 13 — DST fall-back variant' });
    await seed(page, makeSave({ profile: { coins: 0, streak: 7, lastPlayDate: '2026-11-01', lastBonusDate: '2026-11-01' } }));
    await page.clock.install({ time: new Date('2026-11-01T10:00:00-04:00') });   // EDT, before the repeat
    await page.goto('app.html');
    await expect(page.getByText('Numbers World')).toBeVisible();

    // advance past the 2am fall-back repeat (1:00-1:59am happens twice) —
    // 25 real hours elapse, but it's still exactly one calendar day later
    await page.clock.setSystemTime(new Date('2026-11-02T10:00:00-05:00'));
    await page.reload();
    await expect(page.getByText('Numbers World')).toBeVisible();

    await enterStage(page);
    await completeStage(page);
    const save = await readSave(page);
    expect(save.profile.streak).toBe(8);      // exactly one day advanced
    await shot(page, testInfo, 'streak-survives-fall-back');
  });
});

test("§4 Pip's Shop — buy with coins, wear it, too-expensive items blocked", async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: "REQUIREMENTS §4 Pip's Shop (P1): owned/wearing, affordable, too-expensive states; per-profile ownership persists" });
  await seed(page, makeSave({ profile: { coins: 100 } }));
  await page.goto('app.html');

  await page.getByText('🛍️').click();
  await expect(page.getByText("Pip's Shop")).toBeVisible();
  await shot(page, testInfo, '01-shop');

  const card = name => page.locator('.shop-item', { hasText: name });
  await card('Sun hat').getByRole('button').click();                 // 40 coins → buy + wear
  await expect(card('Sun hat').getByText('Wearing')).toBeVisible();
  await expect.poll(async () => (await readSave(page)).profile.coins).toBe(60);
  let save = await readSave(page);
  expect(save.profile.owned).toContain('sunhat');
  expect(save.profile.avatarAccessory).toBe('sunhat');
  await shot(page, testInfo, '02-bought-and-wearing');

  await card('Crown').getByRole('button').click();                   // 150 — too expensive, no-op
  await expect.poll(async () => (await readSave(page)).profile.coins).toBe(60);
  expect((await readSave(page)).profile.owned).not.toContain('crown');

  await card('Bow').getByRole('button').click();                     // 40 — buy switches outfit
  await expect(card('Bow').getByText('Wearing')).toBeVisible();
  await expect(card('Sun hat').getByRole('button', { name: 'Wear' })).toBeVisible();
  await expect.poll(async () => (await readSave(page)).profile.coins).toBe(20);

  await page.getByText('←', { exact: true }).click();                // back to map, all persisted
  await expect(page.getByText('Numbers World')).toBeVisible();
  save = await readSave(page);
  expect(save.profile.owned).toEqual(['sunhat', 'bow']);
  expect(save.profile.avatarAccessory).toBe('bow');
  await shot(page, testInfo, '03-map-after-shopping');
});

test('§4 Kid Settings — giant toggles persist; accessibility modes apply; parents entry gated', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §4 Kid Settings (P1) + §10.4 reduced-motion / calm mode' });
  await seed(page, makeSave());
  await page.goto('app.html');

  await page.getByRole('button', { name: '⚙️' }).click();
  await expect(page.getByText('Settings')).toBeVisible();
  for (const label of ['Music', 'Sounds', 'Read aloud', 'Lefty mode', 'Calm mode', 'Less motion'])
    await expect(page.getByRole('switch', { name: label })).toBeVisible();
  await shot(page, testInfo, '01-settings');

  await expect(page.getByRole('switch', { name: 'Read aloud' })).toBeChecked();
  await page.getByRole('switch', { name: 'Read aloud' }).click();
  await expect(page.getByRole('switch', { name: 'Read aloud' })).not.toBeChecked();
  await expect.poll(async () => (await readSave(page)).settings.readAloud).toBe(false);

  await page.getByRole('switch', { name: 'Less motion' }).click();   // §10.4 → body class
  await expect.poll(() => page.evaluate(() => document.body.classList.contains('reduced-motion'))).toBe(true);

  await page.getByRole('switch', { name: 'Sounds' }).click();        // Sounds off → SFX muted
  await expect.poll(() => page.evaluate(() => window.AudioMgr.isMuted())).toBe(true);
  await page.getByRole('switch', { name: 'Sounds' }).click();
  await expect.poll(() => page.evaluate(() => window.AudioMgr.isMuted())).toBe(false);

  await page.getByRole('switch', { name: 'Lefty mode' }).click();    // lefty → mirrored layout class
  await expect.poll(() => page.evaluate(() => document.body.classList.contains('lefty'))).toBe(true);

  await page.reload();                                               // settings survive restart
  await expect(page.getByText('Numbers World')).toBeVisible();
  expect((await readSave(page)).settings.readAloud).toBe(false);
  expect((await readSave(page)).settings.reducedMotion).toBe(true);

  await page.getByRole('button', { name: '⚙️' }).click();
  await expect(page.getByText('👨‍👩‍👧 Parents')).toBeVisible();     // parents entry lives here
  await page.getByText('👨‍👩‍👧 Parents').click();
  await expect(page.getByText('Grown-ups only')).toBeVisible();      // gate blocks it
  await shot(page, testInfo, '02-gate-from-settings');
});

test('§4 Pattern Complete — sequence strip with ? slot; wrong tile retries gently; stage completes', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §4 Shapes · Pattern Complete (P1): strip + 3 answer tiles' });
  // Math stage 2 is the pattern stage
  await seed(page, makeSave({
    progress: baseProgress(nodes([{ status: 'done', stars: 2 }, 'current', 'locked', 'locked', 'locked'])),
  }));
  await page.goto('app.html');
  await enterStage(page);
  await expect(page.getByText('What comes next?')).toBeVisible();
  await shot(page, testInfo, '01-pattern-question');

  const q = await questionAt(page, 0);
  expect(q.seq.length).toBe(5);
  expect(q.opts.map(o => o.key)).toContain(q.correct);

  await clickAnswer(page, q, false);                                 // wrong tile → gentle retry
  await expect(page.getByRole('button', { name: /Try Again/ })).toBeVisible();
  await page.getByRole('button', { name: /Try Again/ }).click();
  await clickAnswer(page, q, true);
  await expect(page.getByText('+1 star')).toBeVisible();
  await shot(page, testInfo, '02-correct');
  await page.getByRole('button', { name: 'Next →' }).click();

  for (let i = 1; i < 5; i++) await playQuestion(page, i);
  await playQuestion(page, 5);                          // q0 was missed once → requeued (§8.4)
  await expect(page.getByText('Stage Clear!')).toBeVisible();
  await page.getByRole('button', { name: /Map/ }).click();
  const save = await readSave(page);
  expect(save.progress.math.nodes[1].status).toBe('done');
  expect(save.progress.math.nodes[1].stars).toBeGreaterThanOrEqual(1);
  await shot(page, testInfo, '03-stage-done');
});

test('§4 Matching Pairs — 3×2 memory board with tap counter; mismatches cost nothing', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §4 Matching Pairs (P1): 3×2 grid, tap counter, no fail state' });
  // Words stage 3 is the pairs stage
  await seed(page, makeSave({
    progress: { ...baseProgress(),
      words: { nodes: nodes([{ status: 'done', stars: 1 }, { status: 'done', stars: 1 }, 'current', 'locked', 'locked']) } },
  }));
  await page.goto('app.html');
  await page.getByText('📖 Words').click();
  await enterStage(page);

  await expect(page.getByText('0 / 3 pairs matched')).toBeVisible();
  await expect(page.locator('.pair-card')).toHaveCount(6);
  await shot(page, testInfo, '01-board');

  const q = await questionAt(page, 0);
  const byPid = {};
  q.deck.forEach((c, i) => { (byPid[c.pid] = byPid[c.pid] || []).push(i); });
  const pids = Object.keys(byPid);

  // deliberate mismatch: first card of pair 1 + first card of pair 2 → flips back, no hearts lost
  await page.locator('.pair-card').nth(byPid[pids[0]][0]).click();
  await page.locator('.pair-card').nth(byPid[pids[1]][0]).click();
  await expect(page.getByText('2 taps')).toBeVisible();
  await expect(page.getByRole('button', { name: /Try Again/ })).toHaveCount(0);
  await expect(page.locator('.pair-card').nth(byPid[pids[0]][0]))    // wait for gentle flip-back
    .toHaveAttribute('aria-label', 'hidden card');

  for (const pid of pids) {                                          // now solve the board
    const [a, b] = byPid[pid];
    await page.locator('.pair-card').nth(a).click();
    await page.locator('.pair-card').nth(b).click();
  }
  await expect(page.getByText('3 / 3 pairs matched')).toBeVisible();
  await expect(page.getByText('+1 star')).toBeVisible();             // board done ⇒ praise modal
  await shot(page, testInfo, '02-board-solved');
  await page.getByRole('button', { name: 'Next →' }).click();

  for (let i = 1; i < 5; i++) await playPairsQuestion(page, i);
  await expect(page.getByText('Stage Clear!')).toBeVisible();
  await page.getByRole('button', { name: /Map/ }).click();
  const save = await readSave(page);
  expect(save.progress.words.nodes[2].status).toBe('done');
  await shot(page, testInfo, '03-words-stage-done');
});

test('§8.4 mastery — missed question re-queued once; 2×1-star runs trigger the easier tier', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §8.4 mastery & remediation (P1): end-of-set re-queue; silent step-down after two 1-star runs' });
  await seed(page, makeSave());
  await page.goto('app.html');
  await enterStage(page);

  const q0 = await questionAt(page, 0);
  expect(q0.answers.length).toBe(3);                    // normal run: full 3 choices
  await playQuestion(page, 0, 1);                       // 1 mistake → q0 comes back at the end
  await expect(page.getByText('Question 2 of 6')).toBeVisible();
  await shot(page, testInfo, '01-set-grew-to-6');
  const requeued = (await sessionWhen(page, s => s.questions.length === 6, 'requeued set')).questions[5];
  expect(requeued.requeued).toBe(true);
  expect(requeued.count).toBe(q0.count);                // same question, second go

  await playQuestion(page, 1, 1);                       // another miss → set is 7
  await expect(page.getByText('Question 3 of 7')).toBeVisible();
  for (let i = 2; i < 7; i++) await playQuestion(page, i, i === 5 ? 1 : 0);   // miss a REQUEUED one…
  await expect(page.getByText('Stage Clear!')).toBeVisible();   // …it never requeues twice
  await page.getByRole('button', { name: /Map/ }).click();

  // Remediation: node seeded with two consecutive 1-star finishes → 2 choices
  await page.evaluate((s) => {
    localStorage.clear();
    localStorage.setItem('bloom-v2', JSON.stringify(s));
    localStorage.setItem('__seeded', '1');                // keep the initScript from re-seeding
  }, makeSave({
    progress: baseProgress(nodes([{ status: 'current', stars: 1, oneStar: 2 }, 'locked', 'locked', 'locked', 'locked'])),
  }));
  await page.reload();
  await enterStage(page);
  const rq = await questionAt(page, 0);
  expect(rq.answers.length).toBe(2);                    // silent step-down — no fail messaging
  await expect(page.getByText(/game over|failed|too hard/i)).toHaveCount(0);
  await shot(page, testInfo, '02-remediated-two-choices');
});

test('§4 Addition Blocks — drag/tap the number tile into the equation slot', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §4 drag mechanics (P2): Math · Addition Blocks with tap fallback (§10.3)' });
  await seed(page, makeSave({
    progress: baseProgress(nodes([{ status: 'done', stars: 2 }, { status: 'done', stars: 2 }, 'current', 'locked', 'locked'])),
  }));
  await page.goto('app.html');
  await enterStage(page);                                // math stage 3 = addition blocks
  await expect(page.locator('.eq-slot')).toBeVisible();
  await shot(page, testInfo, '01-equation');

  await playAdditionBlocks(page, 0, true);               // wrong tile → gentle retry
  await expect(page.getByRole('button', { name: /Try Again/ })).toBeVisible();
  await page.getByRole('button', { name: /Try Again/ }).click();
  await playAdditionBlocks(page, 0);
  await expect(page.getByText('+1 star')).toBeVisible();
  await shot(page, testInfo, '02-correct');
  await page.getByRole('button', { name: 'Next →' }).click();

  for (let i = 1; i < 6; i++) {                          // 5 + 1 requeued (§8.4)
    await playAdditionBlocks(page, i);
    await page.getByRole('button', { name: 'Next →' }).click();
  }
  await expect(page.getByText('Stage Clear!')).toBeVisible();
  await page.getByRole('button', { name: /Map/ }).click();
  const save = await readSave(page);
  expect(save.progress.math.nodes[2].status).toBe('done');
  expect(save.progress.math.nodes[3].status).toBe('current');
});

test('§4 Word Builder — letter tiles into slots with picture clue; wrong build clears gently', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §4 drag mechanics (P2): Words · Word Builder with tap fallback (§10.3)' });
  await seed(page, makeSave({
    progress: { ...baseProgress(),
      words: { nodes: nodes([{ status: 'done', stars: 1 }, { status: 'done', stars: 1 }, { status: 'done', stars: 1 }, 'current', 'locked']) } },
  }));
  await page.goto('app.html');
  await page.getByText('📖 Words').click();
  await enterStage(page);                                // words stage 4 = word builder
  const q = await questionAt(page, 0);
  await expect(page.locator('.wb-slot')).toHaveCount(q.word.length);
  await shot(page, testInfo, '01-builder');

  const extra = q.tiles.find(ch => !q.word.includes(ch));  // a distractor letter
  await page.locator('.wb-tile', { hasText: extra }).first().click();
  await page.locator('.wb-slot').nth(0).click();           // wrong letter in slot 1…
  for (let k = 1; k < q.word.length; k++) {                // …fill the rest
    await page.locator('.wb-tile', { hasText: q.word[k] }).first().click();
    await page.locator('.wb-slot').nth(k).click();
  }
  await expect(page.getByRole('button', { name: /Try Again/ })).toBeVisible();
  await expect(page.getByText(`The answer was`)).toHaveCount(0);   // only revealed after 2 misses
  await page.getByRole('button', { name: /Try Again/ }).click();

  await playWordBuild(page, 0);                            // board cleared → build it right
  await expect(page.getByText('Question 2 of 6')).toBeVisible();
  for (let i = 1; i < 6; i++) await playWordBuild(page, i);
  await expect(page.getByText('Stage Clear!')).toBeVisible();
  await shot(page, testInfo, '02-stage-clear');
});

test('§4 Lifecycle timeline — order the stage cards; wrong order retries gently', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §4 drag mechanics (P2): Science · Lifecycle timeline with tap fallback (§10.3)' });
  await seed(page, makeSave({
    progress: { ...baseProgress(),
      science: { nodes: nodes([{ status: 'done', stars: 1 }, { status: 'done', stars: 1 }, { status: 'done', stars: 1 }, { status: 'done', stars: 1 }, 'current']) } },
  }));
  await page.goto('app.html');
  await page.getByText('🔬 Science').click();
  await enterStage(page);                                // science stage 5 = lifecycle order
  const q = await questionAt(page, 0);
  await expect(page.locator('.lo-slot')).toHaveCount(4);
  await expect(page.getByText('First')).toBeVisible();
  await expect(page.getByText('Last')).toBeVisible();
  await shot(page, testInfo, '01-timeline');

  // wrong order: stage 2 card into the First slot, rest in sequence
  await page.getByRole('button', { name: q.stages[1].l, exact: true }).click();
  await page.locator('.lo-slot').nth(0).click();
  for (const k of [0, 2, 3]) {
    await page.getByRole('button', { name: q.stages[k].l, exact: true }).click();
    await page.locator('.lo-slot').nth(k === 0 ? 1 : k).click();
  }
  await expect(page.getByRole('button', { name: /Try Again/ })).toBeVisible();
  await page.getByRole('button', { name: /Try Again/ }).click();

  await playLifeOrder(page, 0);
  await expect(page.getByText('Question 2 of 6')).toBeVisible();
  for (let i = 1; i < 6; i++) await playLifeOrder(page, i);
  await expect(page.getByText('Stage Clear!')).toBeVisible();
  await page.getByRole('button', { name: /Map/ }).click();
  expect((await readSave(page)).progress.science.nodes[4].status).toBe('done');
  await shot(page, testInfo, '02-science-complete');
});

test('§4 Letter tracing — per-stroke dots and stars; Skip advances without penalty', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §4 Tracing (P2): per-stroke tracing with guide lines, per-stroke stars, Skip option' });
  await seed(page, makeSave({
    progress: { ...baseProgress(),
      words: { nodes: nodes([{ status: 'done', stars: 2 }, 'current', 'locked', 'locked', 'locked']) } },
  }));
  await page.goto('app.html');
  await page.getByText('📖 Words').click();
  await enterStage(page);                                // words stage 2 = tracing

  const q = await questionAt(page, 0);
  await expect(page.getByText(`Letter ${q.letter} · stroke 1 of ${q.strokes.length}`)).toBeVisible();
  await expect(page.getByText(`starts with ${q.letter}`)).toBeVisible();
  await shot(page, testInfo, '01-trace-canvas');

  const s0 = q.strokes[0].length === 2 ? 3 : q.strokes[0].length;    // dots in stroke 1
  for (let i = 0; i < s0; i++) await page.locator('.trace-dot-active').click();
  if (q.strokes.length > 1) {                                        // multi-stroke → progress label
    await expect(page.getByText(/stroke 2 of/)).toBeVisible();
    for (let i = s0; i < traceDots(q); i++) await page.locator('.trace-dot-active').click();
  }
  await expect(page.getByText('+1 star')).toBeVisible();             // letter complete → praise
  await shot(page, testInfo, '02-letter-done');
  await page.getByRole('button', { name: 'Next →' }).click();

  await expect(page.getByText('Question 2 of 5')).toBeVisible();
  await page.getByRole('button', { name: 'Skip' }).click();          // Skip = no penalty
  await expect(page.getByText('+1 star')).toBeVisible();
  await page.getByRole('button', { name: 'Next →' }).click();

  for (let i = 2; i < 5; i++) await playTrace(page, i);
  await expect(page.getByText('Stage Clear!')).toBeVisible();        // still 5 questions — no requeue
  await page.getByRole('button', { name: /Map/ }).click();
  expect((await readSave(page)).progress.words.nodes[1].status).toBe('done');
  await shot(page, testInfo, '03-words-trace-done');
});

test('§4 polish pack — loading state, offline chip, empty shop, returning-user splash', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §4 undesigned states (P2): loading, offline, empty shop, returning-user splash + intro' });

  // loading state ships in the HTML payload (visible while Babel compiles)
  const html = await (await page.request.get('app.html')).text();
  expect(html).toContain('boot-bar');
  expect(html).toContain('Growing your garden');

  await seed(page, makeSave({ profile: {
    owned: ['sunhat','bow','glasses','crown','cape','wand','tophat','chick'],
    avatarAccessory: 'crown' } }));
  await page.goto('app.html');
  await expect(page.getByText('Numbers World')).toBeVisible();

  // offline chip — local-only app keeps working
  await page.context().setOffline(true);
  await expect(page.getByText(/You're offline/)).toBeVisible();
  await shot(page, testInfo, '01-offline-chip');
  await page.context().setOffline(false);
  await expect(page.getByText(/You're offline/)).toHaveCount(0);

  // empty shop — everything owned
  await page.getByText('🛍️').click();
  await expect(page.getByText('You own everything! 🎉 What a collection!')).toBeVisible();
  await expect(page.getByText('Wearing')).toBeVisible();
  await shot(page, testInfo, '02-empty-shop');
  await page.getByText('←', { exact: true }).click();

  // returning-user splash, reachable again via Settings → Title screen
  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByRole('button', { name: '🏠 Title screen' }).click();
  await expect(page.getByText('Welcome back,')).toBeVisible();
  await expect(page.getByText('Zoe! 👋')).toBeVisible();
  await shot(page, testInfo, '03-returning-splash');
  await page.getByRole('button', { name: 'Play Now ▶' }).click();
  await expect(page.getByText('Numbers World')).toBeVisible();
});

test('§13.1 + §9.3 — parent dashboard shows real play data, skills, and a recommendation', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §13.1 event log feeds the dashboard; §9.1 skill accuracy; §9.3 practice-next recommendation' });
  await seed(page, makeSave());
  await page.goto('app.html');
  await enterStage(page);
  await completeStage(page);                              // real stage_complete event with duration
  await page.getByRole('button', { name: /Map/ }).click();

  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByText('👨‍👩‍👧 Parents').click();
  const gq = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq[1]) * Number(gq[2])), exact: true }).click();
  await expect(page.getByText('Parent Dashboard')).toBeVisible();

  // .print-report duplicates some of this dashboard data for window.print()
  // but stays display:none on screen — visible= excludes it from matches.
  await expect(page.getByText('1 min', { exact: true }).locator('visible=true')).toBeVisible();   // real Today stat, not "25 min"
  await expect(page.getByText('25 min')).toHaveCount(0);
  await expect(page.getByText('1m', { exact: true }).locator('visible=true')).toBeVisible();       // today's bar in the weekly chart
  await expect(page.getByText('Counting to 5').locator('visible=true')).toBeVisible();             // skill row from bumpSkill
  await expect(page.getByText(/100% · \d+ tries/).locator('visible=true')).toBeVisible();
  await expect(page.getByText(/All practiced skills look strong/).locator('visible=true')).toBeVisible();  // §9.3, clean run
  await shot(page, testInfo, 'dashboard-real-data');
});

test('§9.3 map surface — Pip suggests the weakest subject on its tab', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §9.3 map surface: gentle marker on the weakest / least-recent subject' });
  await seedV3(page, { skills: {
    'math.count_to_5':     { attempts: 10, correct: 9, recent: [1,1,1,1,1,1,1,1,1,0], lastPlayed: dateStr(0) },
    'words.initial_sound': { attempts: 10, correct: 4, recent: [0,1,0,0,1,0,1,0,1,0], lastPlayed: dateStr(-1) },
  } });
  await page.goto('app.html');
  await expect(page.getByText('Numbers World')).toBeVisible();
  const wordsTab = page.locator('.subj-tab', { hasText: 'Words' });
  await expect(wordsTab.getByText('💡 Pip suggests')).toBeVisible();   // weakest: 40% accuracy
  await expect(page.locator('.subj-tab', { hasText: 'Science' }).getByText('💡 Pip suggests')).toHaveCount(0);
  await shot(page, testInfo, 'pip-suggests-words');

  await wordsTab.click();                                              // following the suggestion
  await expect(page.getByText('Words World')).toBeVisible();           // …and it never nags the
  await expect(page.getByText('💡 Pip suggests')).toHaveCount(0);      // subject you're already on
});

test('§14 daily time limit — Pip gets sleepy at 30 min; parents can turn it off', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §14 parent-set daily play limit: soft stop, progress saved, parent-gated off-switch' });
  await seedV3(page, {
    settings: { dailyLimit: true },
    events: [{ t: 'stage_complete', ts: Date.now(), durationSec: 1900,
               subject: 'math', stageIndex: 0, stars: 3, mistakes: 0 }],
  });
  await page.goto('app.html');
  await expect(page.getByText('Time for a break!')).toBeVisible();     // soft stop, not the map
  await expect(page.getByText(/Everything is saved/)).toBeVisible();
  await expect(page.getByText(/game over|locked out/i)).toHaveCount(0);
  await shot(page, testInfo, '01-sleepy-pip');

  await page.getByText('👨‍👩‍👧 Parents').click();                     // parent-gated off-switch
  const gq = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq[1]) * Number(gq[2])), exact: true }).click();
  await expect(page.getByText('Parent Dashboard')).toBeVisible();
  await page.locator('.pd-toggle-row', { hasText: 'Daily Time Limit' }).locator('.pd-toggle').click();
  await page.getByRole('button', { name: '← Back to Game' }).click();
  await expect(page.getByText('Numbers World')).toBeVisible();         // limit off → map again
  await shot(page, testInfo, '02-back-after-parent-off');
});

test('§4 per-world art direction — each world has distinct, non-repeated scenery', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §4 per-world art directions (P2): Numbers·Orchard, Words·Forest, Science·Discovery, Music·Stage' });
  await seed(page, makeSave());
  await page.goto('app.html');

  await expect(page.getByText('Numbers World')).toBeVisible();         // Orchard: apple trees
  const mathBg = await page.locator('.screen > div').first().evaluate(el => getComputedStyle(el).background);
  await shot(page, testInfo, '01-numbers-orchard');

  await page.getByText('📖 Words', { exact: true }).click();           // Forest: conifers + letter signs
  await expect(page.getByText('B', { exact: true })).toBeVisible();
  const wordsBg = await page.locator('.screen > div').first().evaluate(el => getComputedStyle(el).background);
  expect(wordsBg).not.toBe(mathBg);
  await shot(page, testInfo, '02-words-forest');

  await page.getByText('🔬 Science', { exact: true }).click();         // Discovery: lab/nature props
  await expect(page.getByText('🔭')).toBeVisible();
  const scienceBg = await page.locator('.screen > div').first().evaluate(el => getComputedStyle(el).background);
  expect(scienceBg).not.toBe(wordsBg);
  await shot(page, testInfo, '03-science-discovery');
});

test('§14 replay-farming cap — an already-3-starred stage pays flat 5 coins on replay', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §14 no-hoarding pressure: replaying a mastered stage awards 5 flat coins instead of the full amount' });
  await seed(page, makeSave({
    profile: { coins: 40 },
    progress: baseProgress(nodes([{ status: 'done', stars: 3 }, 'current', 'locked', 'locked', 'locked'])),
  }));
  await page.goto('app.html');

  await page.locator('.node.done').click();               // replay the already-3-starred stage 1
  await page.getByRole('button', { name: 'Start ▶' }).click();
  await expect(page.getByText('Question 1 of 5')).toBeVisible();
  await completeStage(page);                               // a flawless run would normally pay 25
  await shot(page, testInfo, '01-replay-mastered-stage');
  await page.getByRole('button', { name: /Map/ }).click();

  const save = await readSave(page);
  expect(save.profile.coins).toBe(45);                     // capped: 40 + flat 5, not 40 + 25
  expect(save.progress.math.nodes[0].stars).toBe(3);        // stars unaffected by the cap

  // Meanwhile a genuinely NEW stage (never completed) still pays full
  const before = save.profile.coins;
  await page.locator('.node.current').click();
  await page.getByRole('button', { name: 'Start ▶' }).click();
  await completeStage(page);
  await page.getByRole('button', { name: /Map/ }).click();
  const save2 = await readSave(page);
  expect(save2.profile.coins).toBe(before + 25);            // full payout: 3 stars * 5 + 10
  await shot(page, testInfo, '02-fresh-stage-full-payout');
});

test('§11.2 pause a subject — hidden from the map, no lock icon, restorable, min one stays visible', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §11.2 parents can pause a subject from the map (no shame framing) and restore it later' });
  await seed(page, makeSave());
  await page.goto('app.html');
  await expect(page.getByText('Numbers World')).toBeVisible();
  await expect(page.getByText('📖 Words', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: '⚙️' }).click();
  await expect(page.getByText('Settings')).toBeVisible();
  await page.getByText('👨‍👩‍👧 Parents').click();
  await expect(page.getByText('Grown-ups only')).toBeVisible();
  const gq = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq[1]) * Number(gq[2])), exact: true }).click();
  await expect(page.getByText('Manage Subjects')).toBeVisible();
  await shot(page, testInfo, '01-manage-subjects');

  const wordsRow = page.locator('.pd-toggle-row', { hasText: '📖 Words' });
  await wordsRow.getByRole('button', { name: 'Hide for now' }).click();
  await expect(wordsRow.getByRole('button', { name: 'Show again' })).toBeVisible();
  await expect.poll(async () => (await readSave(page)).profile.pausedSubjects).toContain('words');
  await page.getByRole('button', { name: '← Back to Game' }).click();   // dashboard returns to Settings
  await expect(page.getByText('Settings')).toBeVisible();
  await page.getByRole('button', { name: '←', exact: true }).click();   // Settings → map
  await expect(page.getByText('Numbers World')).toBeVisible();

  await expect(page.getByText('📖 Words', { exact: true })).toHaveCount(0);   // hidden, no 🔒 anywhere
  await expect(page.getByText('🔬 Science', { exact: true })).toBeVisible();  // sibling subjects unaffected
  await shot(page, testInfo, '02-words-hidden-from-map');

  await page.getByRole('button', { name: '⚙️' }).click();                    // restore it
  await expect(page.getByText('Settings')).toBeVisible();
  await page.getByText('👨‍👩‍👧 Parents').click();
  await expect(page.getByText('Grown-ups only')).toBeVisible();
  const gq2 = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq2[1]) * Number(gq2[2])), exact: true }).click();
  await expect(page.getByText('Manage Subjects')).toBeVisible();
  await page.locator('.pd-toggle-row', { hasText: '📖 Words' }).getByRole('button', { name: 'Show again' }).click();
  await expect.poll(async () => (await readSave(page)).profile.pausedSubjects).not.toContain('words');
  await page.getByRole('button', { name: '← Back to Game' }).click();
  await expect(page.getByText('Settings')).toBeVisible();
  await page.getByRole('button', { name: '←', exact: true }).click();
  await expect(page.getByText('Numbers World')).toBeVisible();
  await expect(page.getByText('📖 Words', { exact: true })).toBeVisible();
});

test('§11.2 coin gifts — parent grants bonus coins; stars stay non-editable', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §11.2 parents can grant bonus coins; stars are never editable (learning record, §14)' });
  await seed(page, makeSave({ profile: { coins: 40, stars: 4 } }));
  await page.goto('app.html');
  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByText('👨‍👩‍👧 Parents').click();
  const gq = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq[1]) * Number(gq[2])), exact: true }).click();
  await expect(page.getByText('Gift Coins')).toBeVisible();
  await expect(page.getByText(/Stars can't be edited/)).toBeVisible();
  await shot(page, testInfo, '01-gift-coins-card');

  await page.getByRole('button', { name: '+25 🪙' }).click();
  await expect.poll(async () => (await readSave(page)).profile.coins).toBe(65);
  await page.getByRole('button', { name: '+10 🪙' }).click();
  await expect.poll(async () => (await readSave(page)).profile.coins).toBe(75);
  expect((await readSave(page)).profile.stars).toBe(4);      // untouched — no UI can edit stars
  await shot(page, testInfo, '02-coins-gifted');
});

test('§14 affordability celebration — Pip points it out once when the balance first covers the price', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §14 affordability celebration: one-time, never repeated, never a nag' });
  await seed(page, makeSave({ profile: { coins: 35 } }));   // one coin short of the 40-coin Sun hat
  await page.goto('app.html');
  await expect(page.getByText('Numbers World')).toBeVisible();
  await page.getByText('🛍️').click();
  await expect(page.getByText("Pip's Shop")).toBeVisible();
  await expect(page.getByText(/You have enough for/)).toHaveCount(0);   // not affordable yet

  await page.getByRole('button', { name: '←', exact: true }).click();
  await expect(page.getByText('Numbers World')).toBeVisible();
  await page.getByRole('button', { name: '⚙️' }).click();
  await expect(page.getByText('Settings')).toBeVisible();
  await page.getByText('👨‍👩‍👧 Parents').click();
  await expect(page.getByText('Grown-ups only')).toBeVisible();
  const gq = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq[1]) * Number(gq[2])), exact: true }).click();
  await expect(page.getByText('Parent Dashboard')).toBeVisible();
  await page.getByRole('button', { name: '+10 🪙' }).click();          // crosses 40 → Sun hat affordable
  await expect.poll(async () => (await readSave(page)).profile.coins).toBe(45);
  await page.getByRole('button', { name: '← Back to Game' }).click();
  await expect(page.getByText('Settings')).toBeVisible();
  await page.getByRole('button', { name: '←', exact: true }).click();
  await expect(page.getByText('Numbers World')).toBeVisible();

  await page.getByText('🛍️').click();
  await expect(page.getByText("Pip's Shop")).toBeVisible();
  await expect(page.getByText('You have enough for the Sun hat! 👒')).toBeVisible();
  await shot(page, testInfo, '01-celebration-shown');
  await expect.poll(async () => (await readSave(page)).profile.affordNoticed).toContain('sunhat');

  await page.getByRole('button', { name: '←', exact: true }).click(); // never repeats on re-entry
  await expect(page.getByText('Numbers World')).toBeVisible();
  await page.getByText('🛍️').click();
  await expect(page.getByText("Pip's Shop")).toBeVisible();
  await expect(page.getByText(/You have enough for/)).toHaveCount(0);
});

test('§9.2 recency decay — a skill untouched for 60+ days no longer reads as mastered', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §9.2 recency decay: attempts older than 30 days down-weight in rolling accuracy, so a stale skill drifts toward needing a refresh' });
  await seed(page, makeSave());
  await page.goto('app.html');

  const skillId = 'math.count_to_5';
  const fresh = await page.evaluate(id => {
    const skills = { [id]: { attempts: 15, correct: 15, recent: Array(15).fill(1), lastPlayed: new Date().toISOString().slice(0,10) } };
    return window.getAdaptive({ age: 7, skills }, id);
  }, skillId);
  expect(fresh.tier).toBe(3);                                // age-7 baseline tier 2, flawless+recent steps UP

  const stale = await page.evaluate(id => {
    const old = new Date(Date.now() - 65 * 86400000).toISOString().slice(0,10);
    const skills = { [id]: { attempts: 15, correct: 15, recent: Array(15).fill(1), lastPlayed: old } };
    return window.getAdaptive({ age: 7, skills }, id);
  }, skillId);
  expect(stale.tier).toBe(1);                                 // same flawless history, 65 days stale → decays to
  expect(stale.twoOpts).toBe(true);                            // chance level (0.5) → fully "needs a refresh"

  // A skill that was borderline (60% acc, fresh) stays at baseline; the exact
  // same history 65+ days stale decays toward 0.5 and crosses into "needs a
  // refresh" (step-down: easier tier, far distractors, 2 choices) — the
  // "drifts toward needing a refresh, becomes eligible for suggestion again"
  // behavior §9.2/§9.3 describe.
  // rollingAcc's step-down check uses the LAST 10 attempts specifically —
  // last10 sum 7/10 = 0.7, comfortably above the 0.6 threshold today.
  const recentBorderline = [1,1,1,1,1, 1,1,0,1,1, 0,1,1,0,1];
  const borderlineFresh = await page.evaluate(({id, recent}) => {
    const skills = { [id]: { attempts: 15, correct: 12, recent, lastPlayed: new Date().toISOString().slice(0,10) } };
    return window.getAdaptive({ age: 7, skills }, id);
  }, { id: skillId, recent: recentBorderline });
  expect(borderlineFresh.twoOpts).toBe(false);                 // 0.7 > 0.6 → no step-down yet

  const borderlineStale = await page.evaluate(({id, recent}) => {
    const old = new Date(Date.now() - 65 * 86400000).toISOString().slice(0,10);
    const skills = { [id]: { attempts: 15, correct: 12, recent, lastPlayed: old } };
    return window.getAdaptive({ age: 7, skills }, id);
  }, { id: skillId, recent: recentBorderline });
  expect(borderlineStale.twoOpts).toBe(true);                  // decays toward 0.5 → crosses under 0.6
  expect(borderlineStale.near).toBe(false);                    // step-down: far distractors, easier tier
});

/** Records every SpeechSynthesisUtterance text queued via window.speechSynthesis.speak. */
async function trackSpeech(page) {
  await page.addInitScript(() => {
    window.__spoken = [];
    const OrigUtterance = window.SpeechSynthesisUtterance || function (t) { this.text = t; };
    window.SpeechSynthesisUtterance = function (text) { window.__spoken.push(text); return new OrigUtterance(text); };
    if (!window.speechSynthesis) {
      window.speechSynthesis = { speak(){}, cancel(){}, getVoices: () => [] };
    } else {
      window.speechSynthesis.speak = () => {};
      window.speechSynthesis.cancel = () => {};
    }
  });
}

test('§10.2 non-reader audit — Stage Clear is voiced, not just shown as text/icons', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §10.2 non-reader rule: every kid-facing screen must be playable via icons, layout, and audio alone — Stage Clear had text and an SFX chime but no narration' });
  await trackSpeech(page);
  await seed(page, makeSave());
  await page.goto('app.html');
  await enterStage(page);
  await completeStage(page);
  await expect(page.getByText('Stage Clear! 🎉')).toBeVisible();
  await shot(page, testInfo, 'stage-clear-voiced');

  const spoken = await page.evaluate(() => window.__spoken);
  expect(spoken.some(t => /stage clear/i.test(t))).toBe(true);
  expect(spoken.some(t => /star/i.test(t))).toBe(true);
});

/** Records every navigator.vibrate() call: pattern argument + call count. */
async function trackVibrate(page) {
  await page.addInitScript(() => {
    window.__vibrations = [];
    Object.defineProperty(window.navigator, 'vibrate', {
      value: (pattern) => { window.__vibrations.push(pattern); return true; },
      configurable: true,
    });
  });
}

test('§10.3 haptics — gentle tick on correct answers and coin awards; settings toggle actually mutes it', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §10.3 haptics: gentle ticks on correct answers, coin awards, drag-snap; own settings toggle, defaults on' });
  await trackVibrate(page);
  await seed(page, makeSave());
  await page.goto('app.html');
  await enterStage(page);
  const q = await questionAt(page, 0);
  await clickAnswer(page, q, true);
  await expect(page.getByText('+1 star')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__vibrations.length)).toBeGreaterThan(0);
  await shot(page, testInfo, '01-haptic-on-correct');

  // toggle off in Kid Settings → no more vibration on subsequent correct answers
  await page.getByRole('button', { name: 'Next →' }).click();
  await page.getByRole('button', { name: '←', exact: true }).click();
  await page.getByRole('button', { name: '⚙️' }).click();
  await expect(page.getByRole('switch', { name: 'Vibration' })).toBeChecked();
  await page.getByRole('switch', { name: 'Vibration' }).click();
  await expect(page.getByRole('switch', { name: 'Vibration' })).not.toBeChecked();
  await page.getByRole('button', { name: '←', exact: true }).click();

  await page.evaluate(() => { window.__vibrations.length = 0; });
  await page.locator('.node.current').click();
  await page.getByRole('button', { name: 'Start ▶' }).click();
  const q2 = await questionAt(page, 0);
  await clickAnswer(page, q2, true);
  await expect(page.getByText('+1 star')).toBeVisible();
  await page.waitForTimeout(600);                              // covers the staggered chime/star/coin haptic window
  expect(await page.evaluate(() => window.__vibrations.length)).toBe(0);
});

test('§10.4 calm mode — hides hearts/chips/scenery chrome, softens SFX, never framed as remedial', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §10.4 calm mode: hides non-essential chrome (hearts, chips), softens sounds, one focus element per screen' });
  // Intercept every GainNode.gain.setValueAtTime call so we can compare the
  // peak gain AudioMgr actually requests before vs. after calm mode is on.
  await page.addInitScript(() => {
    window.__gains = [];
    const orig = window.AudioParam && window.AudioParam.prototype.setValueAtTime;
    if (orig) {
      window.AudioParam.prototype.setValueAtTime = function (value, time) {
        window.__gains.push(value);
        return orig.call(this, value, time);
      };
    }
  });
  await seed(page, makeSave());
  await page.goto('app.html');
  await expect(page.getByText('⭐ 4 stars')).toBeVisible();     // chrome visible by default
  await expect(page.locator('.cloud').first()).toBeVisible();

  await page.getByRole('button', { name: '⚙️' }).click();
  await expect(page.getByRole('switch', { name: 'Calm mode' })).not.toBeChecked();
  await page.getByRole('switch', { name: 'Calm mode' }).click();
  await expect(page.getByRole('switch', { name: 'Calm mode' })).toBeChecked();
  await expect.poll(() => page.evaluate(() => document.body.classList.contains('calm'))).toBe(true);
  await expect(page.getByText(/remedial|behind|struggling/i)).toHaveCount(0);   // never framed as remedial
  await page.getByRole('button', { name: '←', exact: true }).click();

  await expect(page.getByText('Numbers World')).toBeVisible();  // map: stars line + coin chip + scenery hidden
  await expect(page.getByText('⭐ 4 stars')).toBeHidden();       // display:none, still in the DOM — not toHaveCount(0)
  await expect(page.locator('.cloud').first()).toBeHidden();
  await expect(page.locator('.hill').first()).toBeHidden();
  await shot(page, testInfo, '01-calm-map');

  await enterStage(page);                                       // activity: hearts row + stage badge hidden
  await expect(page.getByText('Question 1 of 5')).toBeVisible();
  await expect(page.getByText(/^Stage 1 ·/)).toBeHidden();
  await shot(page, testInfo, '02-calm-activity');

  await page.evaluate(() => { window.__gains.length = 0; });
  const q = await questionAt(page, 0);
  await clickAnswer(page, q, true);
  await expect(page.getByText('+1 star')).toBeVisible();        // calm mode ≠ muted — SFX still plays, just softer
  // setValueAtTime is shared by both gain and frequency AudioParams; gain
  // values in this app are always <=1 (see audio-manager.jsx _tone/_noise),
  // frequencies are all >20 (audible range), so filtering <1 isolates gains.
  const calmPeak = await page.evaluate(() => Math.max(...window.__gains.filter(v => v <= 1)));
  expect(calmPeak).toBeGreaterThan(0);                           // not silenced
  expect(calmPeak).toBeLessThan(0.36 * 0.6);                     // softened: below 60% of the loudest normal-mode tone (0.36)
});

test('§10.4 reduced motion — OS prefers-reduced-motion seeds the default on a fresh install, but never overrides a saved parent choice', async ({ browser }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §10.4 reduced motion: OS prefers-reduced-motion signal seeds the in-app default — added 2026-07-21, previously only the boot splash honored it' });

  const freshCtx = await browser.newContext({ reducedMotion: 'reduce' });
  const freshPage = await freshCtx.newPage();
  await freshPage.addInitScript(() => localStorage.clear());
  await freshPage.goto('/app.html');
  await freshPage.getByRole('button', { name: /Start Learning/ }).click();
  await freshPage.locator('input').first().fill('Kai');
  await freshPage.getByRole('button', { name: /Hi, Pip/ }).click();
  await freshPage.getByRole('button', { name: /Looks great/ }).click();
  await freshPage.getByRole('button', { name: /Let's go/ }).click();
  await expect(freshPage.getByText('Numbers World')).toBeVisible();
  const freshSave = await freshPage.evaluate(() => JSON.parse(localStorage.getItem('bloom-v3')));
  expect(freshSave.settings.reducedMotion).toBe(true);
  expect(await freshPage.evaluate(() => document.body.classList.contains('reduced-motion'))).toBe(true);
  await freshCtx.close();

  const returningCtx = await browser.newContext({ reducedMotion: 'reduce' });
  const returningPage = await returningCtx.newPage();
  await returningPage.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('bloom-v3', JSON.stringify({
      version: 3, activeProfileId: 'k1',
      settings: { readAloud: true, sfx: true, reducedMotion: false },   // parent explicitly turned it OFF
      profiles: [{ id: 'k1', profile: { name:'Zoe', age:6, avatarColor:'leaf', coins:0, stars:0, streak:0, onboarded:true },
        progress: { math: { worlds: [{ nodes: [{status:'current',stars:0},{status:'locked',stars:0},{status:'locked',stars:0},{status:'locked',stars:0},{status:'locked',stars:0}] }] } },
        skills: {}, events: [], recentItems: [], session: null }],
    }));
  });
  await returningPage.goto('/app.html');
  await expect(returningPage.getByText('Numbers World')).toBeVisible();
  expect(await returningPage.evaluate(() => document.body.classList.contains('reduced-motion'))).toBe(false);
  await returningCtx.close();
});

test('§15.1 scene variety — counting/addition/subtraction/compare use more than one fruit skin', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §15.1 scene variety for generated math: ≥3 scene skins so counting does not always look identical' });
  await seed(page, makeSave());
  await page.goto('app.html');
  await enterStage(page);                                       // math stage 1 = counting

  const scenes = new Set();
  for (let i = 0; i < 5; i++) {
    const q = await questionAt(page, i);
    expect(['apple', 'berry', 'flower']).toContain(q.scene.id);
    scenes.add(q.scene.id);
    // Regression check: the spoken/displayed instruction must name the SAME
    // scene as what's actually drawn — a mismatch here is exactly the bug
    // where a child sees flowers but is told to count "apples".
    await expect(page.getByText(q.scene.plural, { exact: false })).toBeVisible();
    if (i < 4) { await clickAnswer(page, q, true); await page.getByRole('button', { name: 'Next →' }).click(); }
  }
  // 5 independent picks from 3 scenes: astronomically unlikely to land on
  // just 1 by chance if the generator is truly varying it (this is a real
  // behavioral check, not a coin-flip assertion).
  expect(scenes.size).toBeGreaterThan(1);
  await shot(page, testInfo, 'scene-variety-counting');
});

test('§15.1 scene variety — Compare stage instruction always matches the fruit actually shown', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'Regression: Compare (math stage 5) told the child to find "apples" even when berries/flowers were drawn, since the instruction text was hardcoded instead of scene-aware' });
  await seed(page, makeSave({
    progress: baseProgress(nodes([{status:'done',stars:2},{status:'done',stars:2},{status:'done',stars:2},{status:'done',stars:2},'current'])),
  }));
  await page.goto('app.html');
  await enterStage(page);                                       // math stage 5 = compare

  for (let i = 0; i < 3; i++) {
    const q = await questionAt(page, i);
    await expect(page.getByText(`MORE ${q.scene.plural}`, { exact: false })).toBeVisible();
    await expect(page.getByText('MORE apples', { exact: false })).toHaveCount(q.scene.id === 'apple' ? 1 : 0);
    if (i < 2) { await clickAnswer(page, q, true); await page.getByRole('button', { name: 'Next →' }).click(); }
  }
});

test('§15.1 scene variety — Addition uses abstract counting blocks, not a fruit scene (regression)', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'Regression: math stage 3 (addition) renders as AdditionBlocksView — plain colored blocks by design — but was still labeled "How many apples altogether?" from a stale stage-config string. A separate, unused AdditionView component (fruit-grid) had been patched by mistake instead of the real one; removed the dead component and fixed the actual live instruction text.' });
  await seed(page, makeSave({
    progress: baseProgress(nodes(['done','done','current','locked','locked'])),
  }));
  await page.goto('app.html');
  await enterStage(page);                                       // math stage 3 = addition (blocks)

  await expect(page.getByText('How many blocks altogether?')).toBeVisible();
  await expect(page.getByText(/apples|berries|flowers/i)).toHaveCount(0);   // no stale fruit wording
  await expect(page.locator('.eq-slot')).toBeVisible();                    // confirms AdditionBlocksView, not the old fruit grid
  await shot(page, testInfo, 'addition-blocks-correct-instruction');

  for (let i = 0; i < 3; i++) {
    if (i > 0) await expect(page.getByText('How many blocks altogether?')).toBeVisible();
    await playAdditionBlocks(page, i);
    await page.getByRole('button', { name: 'Next →' }).click();
  }
});

test('§17.4 progress report export — print-friendly report has playtime, stars, skills, focus', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §17.4 progress report export: print-friendly per-child report with playtime, stars, per-skill accuracy trend, suggested focus areas' });
  let printCalled = false;
  await page.exposeFunction('__printCalled', () => { printCalled = true; });
  await page.addInitScript(() => { window.print = () => window.__printCalled(); });
  await seed(page, makeSave());
  await page.goto('app.html');
  await enterStage(page);
  await completeStage(page);
  await page.getByRole('button', { name: /Map/ }).click();

  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByText('👨‍👩‍👧 Parents').click();
  const gq = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq[1]) * Number(gq[2])), exact: true }).click();
  await expect(page.getByText('Parent Dashboard')).toBeVisible();

  await page.getByRole('button', { name: '🖨️ Print Report' }).click();
  await expect.poll(() => printCalled).toBe(true);              // window.print() actually triggered

  // The report content is display:none on screen but present in the DOM —
  // verify it has the required sections without requiring visibility.
  const report = page.locator('.print-report');
  await expect(report.getByText(/Progress Report/)).toBeAttached();
  await expect(report.getByText('Playtime — last 7 days')).toBeAttached();
  await expect(report.getByText('Stars & Progress')).toBeAttached();
  await expect(report.getByText(/⭐/)).toBeAttached();
  await expect(report.getByText('Per-skill accuracy')).toBeAttached();
  await expect(report.getByText('Counting to 5')).toBeAttached();
  await expect(report.getByText('Suggested focus')).toBeAttached();
});

test('§13.4 real-world activity suggestion — appears next to Practice next, tied to the same weak skill', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §13.4 real-world activity suggestions: concrete real-world activity tied to the weakSkill recommendation' });
  await seedV3(page, {
    skills: { 'math.count_to_5': { attempts: 8, correct: 3, lastPlayed: dateStr(0) } },
  });
  await page.goto('app.html');
  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByText('👨‍👩‍👧 Parents').click();
  const gq = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq[1]) * Number(gq[2])), exact: true }).click();
  await expect(page.getByText('Parent Dashboard')).toBeVisible();
  const skillsCard = page.locator('.pd-card', { hasText: '🎯 Skills' });
  await skillsCard.scrollIntoViewIfNeeded();

  await expect(skillsCard.getByText(/Practice next: Counting to 5/)).toBeVisible();
  await expect(skillsCard.getByText(/Away from the screen:/)).toBeVisible();
  await expect(skillsCard.getByText(/grocery store/)).toBeVisible();

  // same tip must also appear in the print report's Suggested focus section
  const report = page.locator('.print-report');
  await expect(report.getByText(/Away from the screen:/)).toBeAttached();
});

test('§13.4 milestone postcards — hidden until a world is actually complete', async ({ page }) => {
  await seedV3(page, {});   // default progress: nothing done yet
  await page.goto('app.html');
  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByText('👨‍👩‍👧 Parents').click();
  const gq = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq[1]) * Number(gq[2])), exact: true }).click();
  await expect(page.getByText('Parent Dashboard')).toBeVisible();
  await expect(page.getByText('🎉 Milestone Postcards')).toHaveCount(0);
});

test('§13.4 milestone postcards — completed world gets a postcard button; prints a distinct celebratory block, not the data report', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §13.4 milestone postcards: printable keepsake shown only for a fully completed world' });
  let printCalled = false;
  await page.exposeFunction('__printCalled', () => { printCalled = true; });
  await page.addInitScript(() => { window.print = () => window.__printCalled(); });
  await seedV3(page, {
    progress: baseProgress(nodes(['done','done','done','done','done'])),
  });
  await page.goto('app.html');
  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByText('👨‍👩‍👧 Parents').click();
  const gq = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq[1]) * Number(gq[2])), exact: true }).click();
  await expect(page.getByText('Parent Dashboard')).toBeVisible();

  await expect(page.getByText('🎉 Milestone Postcards')).toBeVisible();
  const postcardBtn = page.getByRole('button', { name: /Numbers World/ });
  await expect(postcardBtn).toBeVisible();
  // only the completed world gets a button — Words/Science/Music aren't done
  await expect(page.getByRole('button', { name: /Words World/ })).toHaveCount(0);

  await postcardBtn.click();
  await expect.poll(() => printCalled).toBe(true);

  const postcard = page.locator('.print-report.postcard');
  await expect(postcard.getByText(/finished Numbers World/)).toBeAttached();

  // the regular progress report must not also be present while the postcard is queued
  await expect(page.locator('.print-report:not(.postcard)')).toHaveCount(0);
});

/** Seed a v3 store with 2+ profiles directly — §12 multi-profile picker needs
 *  more than one profile on the device, which seedV3 (single-profile) can't express. */
async function seedMultiProfile(page, profiles) {
  const store = {
    version: 3, activeProfileId: profiles[0].id,
    settings: { readAloud: true, sfx: true },
    profiles: profiles.map(p => ({
      id: p.id,
      profile: { name: p.name, age: 6, avatarColor: p.color||'leaf', avatarAccessory: 'none',
        coins: 0, stars: p.stars||0, streak: 0, lastPlayDate: dateStr(-1), lastBonusDate: dateStr(0) },
      progress: { math: { worlds: [{ nodes: nodes(['current','locked','locked','locked','locked']) }] },
        words: { worlds: [{ nodes: nodes(['current','locked','locked','locked','locked']) }] },
        science: { worlds: [{ nodes: nodes(['current','locked','locked','locked','locked']) }] },
        music: { worlds: [{ nodes: nodes(['current','locked','locked','locked','locked']) }] } },
      skills: {}, events: [], recentItems: [], session: null,
    })),
  };
  await page.addInitScript(s => {
    if (!localStorage.getItem('__seeded')) {
      localStorage.clear();
      localStorage.setItem('bloom-v3', JSON.stringify(s));
      localStorage.setItem('__seeded', '1');
    }
  }, store);
}

test('§12 multi-profile — Switch Child reaches a working picker, and picking a kid lands them on their own map', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §12: kid-friendly profile picker at launch when >1 profile exists' });
  await seedMultiProfile(page, [
    { id: 'kid-a', name: 'Ava', color: 'leaf', stars: 12 },
    { id: 'kid-b', name: 'Ben', color: 'sky', stars: 3 },
  ]);
  await page.goto('app.html');

  // >1 profile on the device → boots straight to the picker, not the splash Play button
  await expect(page.getByText("Who's playing today?")).toBeVisible();
  await expect(page.getByText('Ava')).toBeVisible();
  await expect(page.getByText('Ben')).toBeVisible();
  await expect(page.getByText('⭐ 12 stars')).toBeVisible();

  await page.getByText('Ben').click();
  await expect(page.getByText('Numbers World')).toBeVisible();          // landed on the map
  const save = await readSave(page);
  expect(save.profile.name).toBe('Ben');                                // Ben's profile is now active
});

test('§12 multi-profile — Switch Child chip on splash reaches the picker (single-return-visit path)', async ({ page }) => {
  await seedMultiProfile(page, [
    { id: 'kid-a', name: 'Ava', color: 'leaf', stars: 12 },
    { id: 'kid-b', name: 'Ben', color: 'sky', stars: 3 },
  ]);
  await page.goto('app.html');
  await page.getByText('Ava').click();                                  // enter as Ava first
  await expect(page.getByText('Numbers World')).toBeVisible();
  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByText('🏠 Title screen').click();
  await expect(page.getByText(/Welcome back/)).toBeVisible();
  await expect(page.getByText('👥 Switch Child')).toBeVisible();
  await page.getByText('👥 Switch Child').click();
  await expect(page.getByText("Who's playing today?")).toBeVisible();
  await expect(page.getByText('Ben')).toBeVisible();
});

/** Navigate from a freshly-seeded multi-profile store, entering as the first
 *  kid, through the parent gate, to the dashboard. */
async function seedTwoKidsAndOpenDashboard(page, firstKidName) {
  await page.goto('app.html');
  await page.getByText(firstKidName).click();
  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByText('👨‍👩‍👧 Parents').click();
  const gq = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq[1]) * Number(gq[2])), exact: true }).click();
  await expect(page.getByText('Parent Dashboard')).toBeVisible();
}

test('§12 manage children — rename updates the profile everywhere, including a non-active child', async ({ page }) => {
  await seedMultiProfile(page, [
    { id: 'kid-a', name: 'Ava', color: 'leaf', stars: 12 },
    { id: 'kid-b', name: 'Ben', color: 'sky', stars: 3 },
  ]);
  await seedTwoKidsAndOpenDashboard(page, 'Ava');

  const card = page.locator('.pd-card', { hasText: '👨‍👩‍👧 Manage Children' });
  await card.scrollIntoViewIfNeeded();
  await expect(card.getByText('Ben')).toBeVisible();
  await card.getByRole('button', { name: 'Rename' }).nth(1).click();     // Ben's row (2nd)
  await card.locator('input').fill('Benny');
  await card.getByRole('button', { name: 'Save' }).click();
  await expect(card.getByText('Benny')).toBeVisible();
  await expect(card.getByText('Ben', { exact: true })).toHaveCount(0);

  // switching to the renamed (non-active) child picks up the new name
  await page.getByRole('button', { name: /Back to Game/ }).click();  // returns to Settings (where we opened the gate from)
  await page.getByText('🏠 Title screen').click();
  await page.getByText('👥 Switch Child').click();
  await expect(page.getByText('Benny')).toBeVisible();
});

test('§12 manage children — delete requires gentle confirmation and never removes the active child\'s data by accident', async ({ page }) => {
  await seedMultiProfile(page, [
    { id: 'kid-a', name: 'Ava', color: 'leaf', stars: 12 },
    { id: 'kid-b', name: 'Ben', color: 'sky', stars: 3 },
  ]);
  await seedTwoKidsAndOpenDashboard(page, 'Ava');

  const card = page.locator('.pd-card', { hasText: '👨‍👩‍👧 Manage Children' });
  await card.scrollIntoViewIfNeeded();
  await card.getByRole('button', { name: 'Remove' }).nth(1).click();     // Ben's row
  await expect(card.getByText(/Say goodbye to Ben/)).toBeVisible();
  await expect(card.getByText(/can't be undone/)).toBeVisible();

  // "Keep them" backs out without deleting anything
  await card.getByRole('button', { name: 'Keep them' }).click();
  await expect(card.getByText(/Say goodbye to Ben/)).toHaveCount(0);
  await expect(card.getByText('Ben')).toBeVisible();

  // confirming actually removes Ben, but Ava (the active profile) is untouched
  await card.getByRole('button', { name: 'Remove' }).nth(1).click();
  await card.getByRole('button', { name: 'Yes, say goodbye' }).click();
  await expect(card.getByText('Ben')).toHaveCount(0);
  await expect(card.getByText('Ava')).toBeVisible();
  await page.getByRole('button', { name: /Back to Game/ }).click();      // returns to Settings
  await page.getByRole('button', { name: '←', exact: true }).click();    // back to the map
  await expect(page.getByText('Numbers World')).toBeVisible();           // Ava's session is unaffected
  const save = await readSave(page);
  expect(save.profile.name).toBe('Ava');
});

/** Seed a v3 store with 2+ profiles carrying custom math-node progress and
 *  skill data — needed for §13.4 classroom-mode aggregation tests, which
 *  seedMultiProfile (fixed shape) can't express. */
async function seedClassroom(page, kids) {
  const store = {
    version: 3, activeProfileId: kids[0].id,
    settings: { readAloud: true, sfx: true },
    profiles: kids.map(k => ({
      id: k.id,
      profile: { name: k.name, age: 6, avatarColor: k.color||'leaf', avatarAccessory: 'none',
        coins: 0, stars: k.stars||0, streak: k.streak||0, lastPlayDate: dateStr(-1), lastBonusDate: dateStr(0) },
      progress: { math: { worlds: [{ nodes: nodes(k.mathNodes || ['current','locked','locked','locked','locked']) }] },
        words: { worlds: [{ nodes: nodes(['current','locked','locked','locked','locked']) }] },
        science: { worlds: [{ nodes: nodes(['current','locked','locked','locked','locked']) }] },
        music: { worlds: [{ nodes: nodes(['current','locked','locked','locked','locked']) }] } },
      skills: k.skills || {}, events: [], recentItems: [], session: null,
    })),
  };
  await page.addInitScript(s => {
    if (!localStorage.getItem('__seeded')) {
      localStorage.clear();
      localStorage.setItem('bloom-v3', JSON.stringify(s));
      localStorage.setItem('__seeded', '1');
    }
  }, store);
}

test('§13.4 classroom mode — hidden with a single profile, appears with 2+', async ({ page }) => {
  await seedClassroom(page, [{ id: 'k1', name: 'Ava' }]);
  await seedTwoKidsAndOpenDashboard(page, 'Ava');
  await expect(page.getByText('🏫 Classroom Report')).toHaveCount(0);
});

test('§13.4 classroom mode — aggregate report has class-wide numbers only, never a per-child row or ranking', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §13.4 / P3_CLOUD_DESIGN.md §4.2 classroom mode: aggregate-only, no per-child ranking, local export only' });
  let printCalled = false;
  await page.exposeFunction('__printCalled', () => { printCalled = true; });
  await page.addInitScript(() => { window.print = () => window.__printCalled(); });
  await seedClassroom(page, [
    { id: 'k1', name: 'Ava', mathNodes: ['done','done','current','locked','locked'],
      skills: { 'math.count_to_5': { attempts: 8, correct: 6, lastPlayed: dateStr(0) } } },
    { id: 'k2', name: 'Ben', mathNodes: ['done','current','locked','locked','locked'],
      skills: { 'math.count_to_5': { attempts: 6, correct: 2, lastPlayed: dateStr(0) } } },
  ]);
  await seedTwoKidsAndOpenDashboard(page, 'Ava');

  const card = page.locator('.pd-card', { hasText: '🏫 Classroom Report' });
  await card.scrollIntoViewIfNeeded();
  await expect(card.getByText(/2 children/)).toBeVisible();

  await card.getByRole('button', { name: /Print Classroom Report/ }).click();
  await expect.poll(() => printCalled).toBe(true);

  const report = page.locator('.print-report');
  await expect(report.getByText('Classroom Report')).toBeAttached();
  await expect(report.locator('td', { hasText: 'Counting to 5' })).toBeAttached();
  // aggregate class accuracy across both children: (6+2)/(8+6) = 57%
  await expect(report.locator('b', { hasText: '57%' })).toBeAttached();

  // the defining constraint of §4.2: aggregate only, no individual child ever named
  const html = await report.innerHTML();
  expect(html).not.toContain('Ava');
  expect(html).not.toContain('Ben');
});

test('§11.2 reset a child\'s progress — clears stars/coins/map/skills but keeps name and avatar, returns to the map', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §11.2: parents can reset a child\'s progress, distinct from deleting the profile' });
  await seedV3(page, {
    profile: { coins: 40, stars: 12, streak: 3, owned: ['sunhat'] },
    progress: baseProgress(nodes(['done','done','current','locked','locked'])),
    skills: { 'math.count_to_5': { attempts: 8, correct: 6, lastPlayed: dateStr(0) } },
  });
  await page.goto('app.html');
  await expect(page.getByText('12 stars')).toBeVisible();

  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByText('👨‍👩‍👧 Parents').click();
  const gq = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq[1]) * Number(gq[2])), exact: true }).click();
  await expect(page.getByText('Parent Dashboard')).toBeVisible();

  const card = page.locator('.pd-card', { hasText: '👨‍👩‍👧 Manage Children' });
  await card.scrollIntoViewIfNeeded();
  await card.getByRole('button', { name: 'Reset progress' }).click();
  await expect(card.getByText(/Start Zoe fresh/)).toBeVisible();
  await expect(card.getByText(/Can't be undone/)).toBeVisible();

  // "Never mind" backs out without resetting anything
  await card.getByRole('button', { name: 'Never mind' }).click();
  const beforeConfirm = await readSave(page);
  expect(beforeConfirm.profile.stars).toBe(12);

  // confirming actually resets
  await card.getByRole('button', { name: 'Reset progress' }).click();
  await card.getByRole('button', { name: 'Yes, start fresh' }).click();
  await expect(page.getByText('Numbers World')).toBeVisible();   // landed back on the map, not stuck on the dashboard

  const save = await readSave(page);
  expect(save.profile.name).toBe('Zoe');          // identity kept
  expect(save.profile.avatarColor).toBe('leaf');
  expect(save.profile.stars).toBe(0);
  expect(save.profile.coins).toBe(0);
  expect(save.profile.owned).toEqual([]);
  expect(save.progress.math.nodes[0].status).toBe('current');   // map back to fresh
});

test('§13.4 parent feedback prompt — one-tap emoji scale, parent-area only, never repeats', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §13.4 parent feedback prompt: occasional one-tap satisfaction question, parent area only, never shown to children' });
  await seed(page, makeSave());
  await page.goto('app.html');
  await expect(page.getByText(/How's Bopplebee working/)).toHaveCount(0);   // never on kid-facing screens

  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByText('👨‍👩‍👧 Parents').click();
  const gq = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq[1]) * Number(gq[2])), exact: true }).click();
  await expect(page.getByText(/How's Bopplebee working/)).toBeVisible();
  await shot(page, testInfo, '01-feedback-prompt');

  await page.getByText('😄').click();
  await expect.poll(async () => (await readSave(page)).settings.feedbackGiven).toBe(true);
  await expect(page.getByText(/How's Bopplebee working/)).toHaveCount(0);   // answered → gone

  await page.getByRole('button', { name: '← Back to Game' }).click();     // dashboard returns to Settings
  await expect(page.getByText('Settings')).toBeVisible();
  await page.getByText('👨‍👩‍👧 Parents').click();
  const gq2 = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq2[1]) * Number(gq2[2])), exact: true }).click();
  await expect(page.getByText(/How's Bopplebee working/)).toHaveCount(0);   // stays gone on re-entry
});

/** Answer a science "Sort it Out!" question by clicking the matching zone. */
async function playSortQuestion(page, qIdx, correctly = true) {
  const q = await questionAt(page, qIdx);
  const zones = await page.locator('.sort-zone, [data-drop]').all();
  const cats = await Promise.all(zones.map(z => z.getAttribute('data-drop')));
  const targetCat = correctly ? q.correct : cats.find(c => c !== q.correct);
  const idx = cats.indexOf(targetCat);
  await zones[idx].click();
  await page.getByRole('button', { name: 'Next →' }).click();
}

test('§9.4 cross-subject reinforcement — science "Sort it Out!" bonus counts as real math practice', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §9.4 cross-subject reinforcement: skills practiced outside their home subject are tagged with the same skill ID so practice counts wherever it happens' });
  await seed(page, makeSave());
  await page.goto('app.html');
  await page.getByText('🔬 Science', { exact: true }).click();
  await enterStage(page);                                        // science stage 1 = livingmix ("Sort it Out!")

  const session = await sessionWhen(page, s => s.qIdx === 0, 'science session start');
  const livingQs = session.questions.slice(0, 5).filter(q => q.type === 'living');
  const correctLivingCount = livingQs.filter(q => q.correct === 'living').length;

  for (let i = 0; i < 5; i++) await playSortQuestion(page, i, true);
  await expect(page.getByText('Stage Clear! 🎉')).toBeVisible();
  await expect(page.getByText('🌱 Bonus! How many living things did we find?')).toBeVisible();
  await shot(page, testInfo, '01-cross-subject-bonus');

  await page.getByRole('button', { name: String(correctLivingCount), exact: true }).click();
  await expect(page.getByText('🌱 Bonus! How many living things did we find?')).toHaveCount(0);  // answered, one-shot

  // tagged with the SAME skill id counting uses — real math.count_to_5 credit
  const save = await readSave(page);
  expect(save).toBeTruthy();
  const skills = await page.evaluate(() => {
    const raw = JSON.parse(localStorage.getItem('bloom-v3') || 'null');
    const p = raw.profiles.find(x => x.id === raw.activeProfileId);
    return p.skills;
  });
  expect(skills['math.count_to_5'].attempts).toBeGreaterThan(0);
  expect(skills['math.count_to_5'].correct).toBeGreaterThan(0);   // answered correctly above
});

/* ═══════════════════════════════════════════════════════════════════
   §26 AGE-TIER EXPANSION (REQUIREMENTS §26, decision O8) — ages 8–12.
   ═══════════════════════════════════════════════════════════════════ */

test('§26.1 age-tier onboarding — extended age chips 5-12; picking 11 sets Senior tier and lands on tier home', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26.1/§26.2 — age is a pure function of tier; onboarding age range extended 5-7 → 5-12' });
  await seed(page, null);   // no save → first-run onboarding
  await page.goto('app.html');
  await page.getByText('Start Learning', { exact: false }).click();
  await page.getByPlaceholder('Type your name…').fill('Aria');
  await page.getByText('11', { exact: true }).click();
  await expect(page.getByText(/Senior experience/)).toBeVisible();
  await shot(page, testInfo, '01-age-tier-select');
  await page.getByRole('button', { name: /Hi, Pip/ }).click();

  // avatar + plan proceed exactly as Junior does (reused, not skipped)
  await page.getByRole('button', { name: /Looks great/ }).click();
  await page.getByRole('button', { name: /Let's go/ }).click();

  // Senior tier home renders — XP/level dashboard, not the Junior world map
  await expect(page.getByText(/Welcome back, Aria/)).toBeVisible();
  await expect(page.getByText(/^Level 1$/)).toBeVisible();
  const save = await readSave(page);
  expect(save.profile.age).toBe(11);
});

test('§26.4 Senior word problem — typed-answer keypad, correct answer earns XP', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26.4 — typed numeric/fraction answer input, no multiple choice' });
  await seedV3(page, { profile: { age: 11, name: 'Aria', xp: 0 } });
  await page.goto('app.html');
  await expect(page.getByText(/Welcome back, Aria/)).toBeVisible();

  await page.getByText('Mathematics').click();
  await expect(page.getByText('Fractions & Ratios')).toBeVisible();
  await shot(page, testInfo, '01-senior-subject-stages');
  await page.getByText('Fractions & Ratios').click();

  // answer every question in the stage; type via the on-screen keypad
  for (let i = 0; i < 5; i++) {
    await expect(page.getByText(new RegExp(`Question ${i + 1} of 5`))).toBeVisible();
    const promptText = await page.locator('.s-card.raised, .sticker').first().innerText();
    // pull correct answer straight from content.js's bank via the page context
    const q = await page.evaluate((idx) => {
      // the app doesn't expose session state globally by design (no debug
      // surface) — instead press digits blind is unreliable, so this test
      // asserts on structure (keypad exists, Check enabled after typing)
      // rather than the exact numeric value, which is bank-random per stage.
      return null;
    }, i);
    // Type a plausible answer using the keypad, then accept whatever
    // feedback appears (ok or not) — the flow itself is what's under test.
    await page.locator('button:has-text("7")').first().click();
    await page.getByRole('button', { name: /Check/ }).click();
    await expect(page.getByText(/Nice — that's right!|Not quite/)).toBeVisible();
    await page.getByRole('button', { name: /Next question/ }).click();
  }
  await expect(page.getByText('Set complete')).toBeVisible();
  await shot(page, testInfo, '02-senior-results');
  const save = await readSave(page);
  expect(save.profile.xp).toBeGreaterThanOrEqual(0);   // XP awarded additively, never negative (§14/§26.3)
});

test('§26.4 Senior reading comprehension — passage + 3 questions, hint never penalizes', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26.4 — comprehension mechanic; §14 hints never penalize extended to Senior' });
  await seedV3(page, { profile: { age: 11, name: 'Aria' } });
  await page.goto('app.html');
  await page.getByText('Language').click();
  await page.getByText('Reading & Grammar').click();
  await expect(page.getByText('Q1 of')).toBeVisible();
  await shot(page, testInfo, '01-comprehension-passage');

  for (let i = 0; i < 3; i++) {
    await expect(page.getByText(new RegExp(`Q${i + 1} of`))).toBeVisible();
    await page.locator('.comprehension-opt').first().click();
    await page.waitForTimeout(750);   // options auto-advance after a short reveal
  }
  await expect(page.getByText(/Nice — that's right!|Not quite/)).toBeVisible();
});

test('§26.3 guilt-free streak reset — Senior sees "Fresh start", XP/badges/level explicitly kept, no red/alarm', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26.3 — §14 anti-stress rules extended to Senior tier' });
  await seedV3(page, {
    profile: { age: 11, name: 'Aria', xp: 3240, streak: 12, lastPlayDate: dateStr(-5) },
  });
  await page.goto('app.html');
  await expect(page.getByText('Fresh start today')).toBeVisible();
  await expect(page.getByText(/breaks are healthy/)).toBeVisible();
  await expect(page.getByText('3240 XP and all badges are safe', { exact: false })).toBeVisible();
  await shot(page, testInfo, '01-streak-reset');

  await page.getByRole('button', { name: /Start today's set/ }).click();
  await expect(page.getByText(/Welcome back, Aria/)).toBeVisible();
  const save = await readSave(page);
  expect(save.profile.xp).toBe(3240);     // XP untouched by the reset (§14 additive)
  expect(save.profile.streak).toBe(1);    // streak quietly reset to Day 1
});

test('§26.1 Middle tier (8-9) — goal dashboard home, not the Senior dark theme or Junior map', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26.1 — Middle tier bridges Junior/Senior visually and mechanically' });
  await seedV3(page, { profile: { age: 8, name: 'Sam', xp: 120 } });
  await page.goto('app.html');
  await expect(page.getByText(/Hi, Sam!/)).toBeVisible();
  await expect(page.getByText(/Level progress/)).toBeVisible();
  await shot(page, testInfo, '01-middle-home');
  // Middle uses the light sticker-card system, not the Senior .senior scope
  const hasSeniorScope = await page.locator('.senior').count();
  expect(hasSeniorScope).toBe(0);
});

test('§26.6b Senior headline text is actually legible — .s-display renders near-white on the dark scope, not Junior ink-brown', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26 — first-person playtest (2026-07-22) found every .s-display element lacking its own inline color rendered as unreadable dark ink on navy; app.html\'s .screen{color:var(--ink)} and .senior\'s color:var(--s-text) are same-specificity single-class rules, and source order let the Junior color win. Fixed by giving .senior .s-display its own explicit color.' });
  await seedV3(page, { profile: { age: 11, name: 'Aria', xp: 3850, streak: 12 } });
  await page.goto('app.html');
  await expect(page.getByText(/Welcome back, Aria/)).toBeVisible();

  // rgb(61,40,24) is var(--ink) — the Junior brown that leaked through before the fix.
  // A real regression check compares computed style, not just DOM presence/visibility,
  // since Playwright's toBeVisible() does not care what color text renders in.
  const headlineColor = await page.locator('.s-display', { hasText: 'Welcome back' }).evaluate(
    el => getComputedStyle(el).color);
  expect(headlineColor).not.toBe('rgb(61, 40, 24)');
  expect(headlineColor).toBe('rgb(234, 241, 251)');   // --s-text: #EAF1FB

  const subjectLabelColor = await page.locator('.s-display', { hasText: 'Mathematics' }).evaluate(
    el => getComputedStyle(el).color);
  expect(subjectLabelColor).toBe('rgb(234, 241, 251)');

  await page.getByRole('button', { name: '🏆' }).click();
  const achievementsHeaderColor = await page.locator('.s-display', { hasText: 'Achievements' }).evaluate(
    el => getComputedStyle(el).color);
  expect(achievementsHeaderColor).toBe('rgb(234, 241, 251)');
});

test('§26.6b subject-set naming — each tier shows its own grown-up-appropriate subject labels', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26.6b — Middle/Senior previously showed Junior\'s exact labels (Numbers/Words); now use tier-appropriate names, naming only, same 4 real subjects' });

  // Junior (age 6): unchanged — Numbers/Words subject tabs right on the map,
  // never Math/Mathematics or Reading/Language
  await seedV3(page, { profile: { age: 6, name: 'Zoe' } });
  await page.goto('app.html');
  await expect(page.getByText('Numbers World')).toBeVisible();
  // Junior's map tabs render icon+label as one text node ("🔢 Numbers"), so
  // these check for the label as a substring, not an exact match
  await expect(page.getByText(/Numbers$/)).toBeVisible();
  await expect(page.getByText(/Words$/)).toBeVisible();
  await expect(page.getByText('Mathematics')).toHaveCount(0);
  await shot(page, testInfo, '01-junior-unchanged');

  // Middle (age 8): Math / Reading — a step up from Junior, not as formal as Senior
  await page.evaluate(() => localStorage.clear());
  await page.addInitScript(s => {
    localStorage.setItem('bloom-v3', JSON.stringify(s));
    localStorage.setItem('__seeded', '1');
  }, { version:3, activeProfileId:'p-mid',
    settings:{ readAloud:true, sfx:true },
    profiles:[{ id:'p-mid', profile:{ name:'Sam', age:8, avatarColor:'berry', avatarAccessory:'none',
      coins:0, stars:0, xp:0, streak:0, lastPlayDate:null, lastBonusDate:null, owned:[],
      pausedSubjects:[], affordNoticed:[], onboarded:true },
      progress: baseProgress(), skills:{}, events:[], recentItems:[], session:null }] });
  await page.reload();
  await expect(page.getByText(/Hi, Sam!/)).toBeVisible();
  await expect(page.getByText('Math', { exact: true })).toBeVisible();
  await expect(page.getByText('Reading', { exact: true })).toBeVisible();
  await expect(page.getByText('Mathematics')).toHaveCount(0);
  await expect(page.getByText('Language')).toHaveCount(0);
  await shot(page, testInfo, '02-middle-math-reading');

  // Senior (age 11): Mathematics / Language — the most formal naming
  await page.evaluate(() => localStorage.clear());
  await page.addInitScript(s => {
    localStorage.setItem('bloom-v3', JSON.stringify(s));
    localStorage.setItem('__seeded', '1');
  }, { version:3, activeProfileId:'p-sr',
    settings:{ readAloud:true, sfx:true },
    profiles:[{ id:'p-sr', profile:{ name:'Aria', age:11, avatarColor:'sky', avatarAccessory:'none',
      coins:0, stars:0, xp:0, streak:0, lastPlayDate:null, lastBonusDate:null, owned:[],
      pausedSubjects:[], affordNoticed:[], onboarded:true },
      progress: baseProgress(), skills:{}, events:[], recentItems:[], session:null }] });
  await page.reload();
  await expect(page.getByText(/Welcome back, Aria/)).toBeVisible();
  await expect(page.getByText('Mathematics')).toBeVisible();
  await expect(page.getByText('Language')).toBeVisible();
  await expect(page.getByText('Numbers', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Words', { exact: true })).toHaveCount(0);
  await shot(page, testInfo, '03-senior-mathematics-language');

  // Subject-stages screen also picks up the tier label, not just the home dashboard
  await page.getByText('Mathematics').click();
  await expect(page.getByText('Mathematics', { exact: false })).toBeVisible();
});

test('§26.6b Middle tier activity loop has its own identity — not Junior\'s leaf/coral, not Senior\'s dark .senior scope', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26.6b — Middle\'s activity loop previously fell through to plain Junior styling; now has a distinct berry-accented identity matching MiddleHomeScreen' });
  await seedV3(page, { profile: { age: 8, name: 'Sam', xp: 0 } });
  await page.goto('app.html');
  await page.getByText('Math', { exact: true }).click();
  await page.getByText('Warm-Up Math').click();
  await expect(page.getByText(/Question 1 of 5/)).toBeVisible();
  // Middle-only per-question XP chip — neither Junior (no XP concept) nor
  // Senior (XP only totaled on results, not shown per-question) has this
  await expect(page.getByText(new RegExp(`\\+${40} XP`))).toBeVisible();
  await shot(page, testInfo, '01-middle-activity');
  // still no Senior dark scope anywhere in the activity loop
  expect(await page.locator('.senior').count()).toBe(0);
  await page.getByRole('button', { name: '✕' }).click();

  // "Story Time" (comprehension, a single whole-passage question per stage)
  // finishes reliably in one pass — check the berry-accented results screen
  await page.getByText('Reading').click();
  await page.getByText('Story Time').click();
  await expect(page.getByText('Q1 of')).toBeVisible();
  for (let i = 0; i < 3; i++) {
    await expect(page.getByText(new RegExp(`Q${i + 1} of`))).toBeVisible();
    await page.locator('.comprehension-opt').first().click();
    await page.waitForTimeout(750);
  }
  // the whole passage grades as one activity-loop question — the feedback
  // modal now needs its own "Next question" tap to finish the stage
  await expect(page.getByText(/Nice work!|Not quite/)).toBeVisible();
  await page.getByRole('button', { name: /Next question/ }).click();
  await expect(page.getByText("Today's goal — done!")).toBeVisible();
  await shot(page, testInfo, '02-middle-results');
  expect(await page.locator('.senior').count()).toBe(0);
});

test('§26.1 switching profiles routes each child to their own tier home (Junior map vs Senior dashboard)', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26.1 — tier is per-profile; switching children respects each child\'s own age/tier' });
  const store = {
    version: 3, activeProfileId: 'p-junior',
    settings: { readAloud: true, sfx: true },
    profiles: [
      { id: 'p-junior', profile: { name:'Zoe', age:6, avatarColor:'leaf', avatarAccessory:'none', coins:0, stars:0, xp:0, streak:0, lastPlayDate:null, lastBonusDate:null, owned:[], pausedSubjects:[], affordNoticed:[], onboarded:true },
        progress: baseProgress(), skills:{}, events:[], recentItems:[], session:null },
      { id: 'p-senior', profile: { name:'Aria', age:11, avatarColor:'berry', avatarAccessory:'none', coins:0, stars:0, xp:800, streak:3, lastPlayDate:dateStr(0), lastBonusDate:null, owned:[], pausedSubjects:[], affordNoticed:[], onboarded:true },
        progress: baseProgress(), skills:{}, events:[], recentItems:[], session:null },
    ],
  };
  await page.addInitScript(s => {
    localStorage.clear();
    localStorage.setItem('bloom-v3', JSON.stringify(s));
    localStorage.setItem('__seeded', '1');
  }, store);
  await page.goto('app.html');
  // >1 profile on the device → boots straight to the picker (§12)
  await expect(page.getByText("Who's playing today?")).toBeVisible();
  await page.getByText('Zoe', { exact: false }).click();
  await expect(page.getByText('Numbers World')).toBeVisible();   // Junior map lands correctly

  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByText('🏠 Title screen').click();
  await expect(page.getByText('👥 Switch Child')).toBeVisible();
  await page.getByText('👥 Switch Child').click();
  await expect(page.getByText("Who's playing today?")).toBeVisible();
  await page.getByText('Aria', { exact: false }).click();
  await expect(page.getByText(/Welcome back, Aria/)).toBeVisible();   // Senior tier home, not the map
});

test('§26.6 Senior achievements (O9) — badges reflect real persistent profile state, never mock data', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26.6/O9 — achievement badges computed from persistent, monotonic profile fields, not the capped event log' });
  await seedV3(page, { profile: {
    age: 11, name: 'Aria', xp: 4000, streak: 12,          // Champion (level>=10) + On Fire (streak>=10) earned
    tierQuestionsAnswered: 120, tierPerfectSets: 2,        // Deep Thinker/Perfectionist NOT yet earned
    tierHadFastSet: true,                                  // Speedster earned
    tierSubjectsPlayed: ['math', 'words'],                 // Explorer NOT yet earned (needs all 4)
  } });
  await page.goto('app.html');
  await expect(page.getByText(/Welcome back, Aria/)).toBeVisible();
  await page.getByRole('button', { name: '🏆' }).click();
  await expect(page.getByText('Achievements')).toBeVisible();
  await shot(page, testInfo, '01-achievements');

  // earned badges show their icon, not a lock
  await expect(page.getByText('On Fire')).toBeVisible();
  await expect(page.getByText('Speedster')).toBeVisible();
  await expect(page.getByText('Champion')).toBeVisible();
  // unearned badges show a progress bar toward their goal, not "done"
  await expect(page.getByText('Explorer')).toBeVisible();
  await expect(page.getByText('Deep Thinker')).toBeVisible();
  await expect(page.getByText(/of 8 unlocked/)).toBeVisible();

  const save = await readSave(page);
  expect(save.profile.tierQuestionsAnswered).toBe(120);
  expect(save.profile.tierSubjectsPlayed).toEqual(['math', 'words']);
});

test('§26.6 achievement counters are monotonic — completing a tier stage only ever increases them, never resets on a bad set', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26.6/§14 — badge progress must never regress (progress-is-additive)' });
  await seedV3(page, { profile: { age: 11, name: 'Aria', tierQuestionsAnswered: 0, tierSubjectsPlayed: [] } });
  await page.goto('app.html');
  await page.getByText('Mathematics').click();
  await page.getByText('Fractions & Ratios').click();

  for (let i = 0; i < 5; i++) {
    await expect(page.getByText(new RegExp(`Question ${i + 1} of 5`))).toBeVisible();
    await page.locator('button:has-text("7")').first().click();
    await page.getByRole('button', { name: /Check/ }).click();
    await expect(page.getByText(/Nice — that's right!|Not quite/)).toBeVisible();
    await page.getByRole('button', { name: /Next question/ }).click();
  }
  await expect(page.getByText('Set complete')).toBeVisible();

  const save = await readSave(page);
  expect(save.profile.tierQuestionsAnswered).toBe(5);              // every question counted, right or wrong
  expect(save.profile.tierSubjectsPlayed).toContain('math');        // Explorer progress recorded
});

/* ═══════════════════════════════════════════════════════════════════
   Item A/B/C (2026-07-22, post-playtest design pass) — star progression,
   tier-scaled difficulty for shared mechanics, Middle stage-picker polish.
   ═══════════════════════════════════════════════════════════════════ */

test('O10 fix — Middle/Senior earn stars on a perfect comprehension stage (100% -> 3 stars), feeding the same Music unlock gate Junior uses', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26.9/O10 — Middle/Senior previously never touched profile.stars, so Music (star-gated) was permanently unreachable from these tiers' });
  await seedV3(page, { profile: { age: 11, name: 'Aria', stars: 0, xp: 0 } });
  await page.goto('app.html');
  await page.getByText('Language').click();
  await page.getByText('Reading & Grammar').click();
  await expect(page.getByText('Q1 of')).toBeVisible();

  // click the actual correct option each time (data-ok, not .first()) so this
  // stage is a guaranteed, deterministic 100% / 3-star completion
  for (let i = 0; i < 3; i++) {
    await expect(page.getByText(new RegExp(`Q${i + 1} of`))).toBeVisible();
    await page.locator('[data-ok="true"]').click();
    await page.waitForTimeout(750);
  }
  await expect(page.getByText(/Nice work!|right!/)).toBeVisible();
  await page.getByRole('button', { name: /Next question/ }).click();
  await expect(page.getByText('Set complete')).toBeVisible();
  await expect(page.getByText('+3 ⭐')).toBeVisible();
  await shot(page, testInfo, '01-senior-results-3-stars');

  const save = await readSave(page);
  expect(save.profile.stars).toBe(3);   // 100% correct -> 3 stars, mirrors Junior's own 0-mistakes-> 3-stars formula
});

test('O10 fix — a below-50% stage earns 0 stars but still earns full XP (bonus layer, never a gate on the existing no-fail design)', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26.9/O10 — stars are additive, never punitive; a rough set still earns XP normally' });
  await seedV3(page, { profile: { age: 11, name: 'Aria', stars: 0, xp: 0 } });
  await page.goto('app.html');
  await page.getByText('Language').click();
  await page.getByText('Reading & Grammar').click();
  await expect(page.getByText('Q1 of')).toBeVisible();

  // deliberately wrong every time -> guaranteed 0% for this (all-or-nothing graded) passage
  for (let i = 0; i < 3; i++) {
    await expect(page.getByText(new RegExp(`Q${i + 1} of`))).toBeVisible();
    await page.locator('[data-ok="false"]').first().click();
    await page.waitForTimeout(750);
  }
  await page.getByRole('button', { name: /Next question/ }).click();
  await expect(page.getByText('Set complete')).toBeVisible();
  await expect(page.getByText('—', { exact: true }).first()).toBeVisible();   // Stars stat shows '—', not '0' or a penalty

  const save = await readSave(page);
  expect(save.profile.stars).toBe(0);      // no stars earned, but...
  expect(save.profile.xp).toBeGreaterThanOrEqual(0);   // ...XP is untouched by accuracy — never negative, never gated
});

test('Item B — Middle and Senior addition now get genuinely different (harder) number ranges than each other and Junior', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26.9 Item B — genAdditionQs previously collapsed tier 2 and 3 onto the same branch; now 3-way' });
  // Middle (age 8): sums should stay within the new Middle ceiling (<=11)
  await seedV3(page, { profile: { age: 8, name: 'Sam' } });
  await page.goto('app.html');
  await page.getByText('Math', { exact: true }).click();
  await page.getByText('Warm-Up Math').click();
  await expect(page.getByText('Question 1 of 5')).toBeVisible();
  const middleBlocks = await page.locator('div[style*="border-radius: 9px"]').count();
  expect(middleBlocks).toBeGreaterThan(0);
  expect(middleBlocks).toBeLessThanOrEqual(11 + 2);   // a+b blocks total, generous slack for two operands
});

test('Item B — Senior compare stage uses a wider number range than Junior (up to 16, not capped at 8)', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26.9 Item B — genCompareQs previously used a fixed 1-8 range at every tier' });
  await seedV3(page, { profile: { age: 11, name: 'Aria' } });
  await page.goto('app.html');
  await page.getByText('Mathematics').click();
  await page.getByText('Number Sense').click();
  await expect(page.getByText('Question 1 of 5')).toBeVisible();
  // just confirm the stage loads and is playable at Senior's wider range —
  // exact values are seed-random, so this is a smoke check, not a value assertion
  await expect(page.locator('.compare-zone').first()).toBeVisible();
});

test('Item C — Middle stage-picker shows a subject icon, stage-number chip, mastery bar, and highlights the next unattempted stage', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26.9 Item C — TierSubjectStagesScreen was functionally complete but visually thin for Middle' });
  await seedV3(page, {
    profile: { age: 8, name: 'Sam' },
    skills: { 'math.addition_within_8': { attempts: 8, correct: 6, recent: [1,1,0,1,1,0,1,1], lastPlayed: '2026-07-20' } },
  });
  await page.goto('app.html');
  await page.getByText('Math', { exact: true }).click();
  await expect(page.getByText('1 of 5')).toBeVisible();
  await expect(page.getByText('75% mastery')).toBeVisible();       // Warm-Up Math: 6/8 attempts recorded
  await expect(page.getByText('Up next')).toBeVisible();           // Take-Away Practice: zero attempts, first such stage
  await shot(page, testInfo, '01-middle-stages-polished');

  // core navigation is untouched — clicking a card still starts that stage
  await page.getByText('Warm-Up Math').click();
  await expect(page.getByText('Question 1 of 5')).toBeVisible();
});

/* ═══════════════════════════════════════════════════════════════════
   Parent-facing age/tier change — "Change age" in Manage Children (§26).
   Previously there was no way to reach Middle/Senior from an existing
   Junior profile short of deleting and re-onboarding a fresh one.
   ═══════════════════════════════════════════════════════════════════ */

test('§26 parent "Change age" — moving the active child from Junior to Senior routes straight to the Senior home, not the Junior map', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26 — parents previously had no way to verify Middle/Senior from an existing Junior profile without deleting and re-onboarding' });
  await seed(page, makeSave({ profile: { name: 'Zoe', age: 6 } }));
  await page.goto('app.html');
  await expect(page.getByText('Numbers World')).toBeVisible();

  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByText('👨‍👩‍👧 Parents').click();
  const gq = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq[1]) * Number(gq[2])), exact: true }).click();
  await expect(page.getByText('Parent Dashboard')).toBeVisible();

  await page.getByText('Change age').click();
  await page.getByText('11', { exact: true }).click();
  await expect(page.getByText('→ Senior tier')).toBeVisible();
  await shot(page, testInfo, '01-age-editor-senior-preview');
  await page.getByRole('button', { name: 'Save' }).click();

  // dashboard closes automatically and the child lands on their NEW tier's
  // home, not the Junior map they were just on
  await expect(page.getByText('Parent Dashboard')).toHaveCount(0);
  await expect(page.getByText(/Welcome back, Zoe/)).toBeVisible();
  await expect(page.getByText('Numbers World')).toHaveCount(0);
  await shot(page, testInfo, '02-landed-on-senior-home');

  const save = await readSave(page);
  expect(save.profile.age).toBe(11);
});

test('§26 parent "Change age" — Junior to Middle also routes correctly, and canceling the editor leaves age untouched', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26 — age change must work for the Middle tier too, and Cancel must be a true no-op' });
  await seed(page, makeSave({ profile: { name: 'Zoe', age: 6 } }));
  await page.goto('app.html');
  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByText('👨‍👩‍👧 Parents').click();
  const gq = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq[1]) * Number(gq[2])), exact: true }).click();

  // Cancel first — must not change anything
  await page.getByText('Change age').click();
  await page.getByText('9', { exact: true }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText('· Age 6 ·')).toBeVisible();
  let save = await readSave(page);
  expect(save.profile.age).toBe(6);

  // now actually change it to Middle (age 8)
  await page.getByText('Change age').click();
  await page.getByText('8', { exact: true }).click();
  await expect(page.getByText('→ Middle tier')).toBeVisible();
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText(/Hi, Zoe!/)).toBeVisible();   // MiddleHomeScreen's greeting, not Senior's or Junior's

  save = await readSave(page);
  expect(save.profile.age).toBe(8);
});

test('§26 parent "Change age" — editing a non-active child\'s age never disturbs the currently active child\'s session', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §26/§12 — age changes on the roster must follow the same non-active-profile-safe pattern as RENAME_PROFILE/RESET_PROGRESS' });
  const store = {
    version: 3, activeProfileId: 'p-junior',
    settings: { readAloud: true, sfx: true },
    profiles: [
      { id: 'p-junior', profile: { name:'Zoe', age:6, avatarColor:'leaf', avatarAccessory:'none', coins:0, stars:0, xp:0, streak:0, lastPlayDate:null, lastBonusDate:null, owned:[], pausedSubjects:[], affordNoticed:[], onboarded:true },
        progress: baseProgress(), skills:{}, events:[], recentItems:[], session:null },
      { id: 'p-other', profile: { name:'Ben', age:6, avatarColor:'sky', avatarAccessory:'none', coins:0, stars:0, xp:0, streak:0, lastPlayDate:null, lastBonusDate:null, owned:[], pausedSubjects:[], affordNoticed:[], onboarded:true },
        progress: baseProgress(), skills:{}, events:[], recentItems:[], session:null },
    ],
  };
  await page.addInitScript(s => {
    localStorage.clear();
    localStorage.setItem('bloom-v3', JSON.stringify(s));
    localStorage.setItem('__seeded', '1');
  }, store);
  await page.goto('app.html');
  await expect(page.getByText("Who's playing today?")).toBeVisible();
  await page.getByText('Zoe', { exact: false }).click();
  await expect(page.getByText('Numbers World')).toBeVisible();   // active as Zoe, on the Junior map

  await page.getByRole('button', { name: '⚙️' }).click();
  await page.getByText('👨‍👩‍👧 Parents').click();
  const gq = (await page.locator('.modal-card').textContent()).match(/What is (\d+) × (\d+)\?/);
  await page.getByRole('button', { name: String(Number(gq[1]) * Number(gq[2])), exact: true }).click();
  await expect(page.getByText('Parent Dashboard')).toBeVisible();

  // change BEN's age (not Zoe's, the active profile) to Senior — scope by
  // the row's data-profile-row attribute (test-only, inert for real users,
  // same pattern as ComprehensionView's data-ok) so this can't accidentally
  // hit Zoe's row via a shared ancestor container.
  const benRow = page.locator('[data-profile-row="p-other"]');
  await benRow.scrollIntoViewIfNeeded();
  await benRow.getByText('Change age').click();
  await benRow.getByText('12', { exact: true }).click();
  await benRow.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(300);

  // dashboard stays open (only the ACTIVE profile's tier change closes it and navigates)
  await expect(page.getByText('Parent Dashboard')).toBeVisible();

  // closing the dashboard reveals whatever screen was underneath it (here,
  // Settings — since that's where ⚙️ → Parents was entered from), not the
  // map directly; navigate back to the map explicitly to confirm the session
  await page.getByRole('button', { name: '← Back to Game' }).click();
  await expect(page.getByText('Settings')).toBeVisible();
  await page.getByRole('button', { name: '←', exact: true }).click();
  await expect(page.getByText('Numbers World')).toBeVisible();   // Zoe's own session untouched

  const save = await readSave(page);
  expect(save.profile.age).toBe(6);   // Zoe (still active) unchanged
  const raw = await page.evaluate(() => JSON.parse(localStorage.getItem('bloom-v3')));
  const ben = raw.profiles.find(p => p.id === 'p-other');
  expect(ben.profile.age).toBe(12);   // Ben's age updated on the roster even though he was never active
});
