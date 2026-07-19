/**
 * Bloom Academy — Playwright acceptance tests.
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
  await page.goto('/app.html');

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

test('§14 no-broken-promises — Music world is hidden from the map', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §14 no-broken-promises (Music hidden until Rhythm Tap exists)' });
  await seed(page, makeSave());
  await page.goto('/app.html');
  await expect(page.getByText('Numbers World')).toBeVisible();
  await expect(page.getByText('🔢 Numbers')).toBeVisible();
  await expect(page.getByText('🔬 Science')).toBeVisible();
  await expect(page.getByText(/Music/)).toHaveCount(0);
  await shot(page, testInfo, 'map-no-music-tab');
});

test('§14 daily hello bonus — +10 coins once per calendar date', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §14 daily hello bonus (flat +10, once per date, clock-safe)' });
  await seed(page, makeSave({ profile: { coins: 40, lastBonusDate: dateStr(-1) } }));
  await page.goto('/app.html');

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
  await page.goto('/app.html');
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
  await page.goto('/app.html');
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
  await page.goto('/app.html');

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
  await page.goto('/app.html');

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
  await page.goto('/app.html');
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
  await page.goto('/app.html');
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

test('§22.1 + §17.1-10 — interruption resume: Keep going restores the exact question', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §22.1 session resume / §17.1 test 10' });
  await seed(page, makeSave());
  await page.goto('/app.html');
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
  await page.goto('/app.html');
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

test('§11.2 + §17.1-12 — parent can download a backup file', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: 'REQUIREMENTS §11.2 local backup / §17.1 test 12 (export)' });
  await seed(page, makeSave());
  await page.goto('/app.html');
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
  await page.goto('/app.html');
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
  await page.goto('/app.html');
  await expect(page.getByText('Numbers World')).toBeVisible();
  await expect(page.getByText('Good to see you!')).toHaveCount(0);   // no double bonus
  await expect.poll(async () => (await readSave(page)).profile.coins).toBe(40);

  await enterStage(page);
  await completeStage(page);                                         // finish a stage "in the past"
  const save = await readSave(page);
  expect(save.profile.streak).toBe(5);                               // streak not revoked, not reset
  await shot(page, testInfo, 'streak-survives-clock-rollback');
});

test("§4 Pip's Shop — buy with coins, wear it, too-expensive items blocked", async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'requirement', description: "REQUIREMENTS §4 Pip's Shop (P1): owned/wearing, affordable, too-expensive states; per-profile ownership persists" });
  await seed(page, makeSave({ profile: { coins: 100 } }));
  await page.goto('/app.html');

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
  await page.goto('/app.html');

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
  await page.goto('/app.html');
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
  await page.goto('/app.html');
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
  await page.goto('/app.html');
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
