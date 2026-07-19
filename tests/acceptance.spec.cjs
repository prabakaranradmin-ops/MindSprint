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

const readSave = page =>
  page.evaluate(() => JSON.parse(localStorage.getItem('bloom-v2') || 'null'));

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

/** Complete all 5 questions; wrongPerQ[i] = wrong attempts before the correct answer. */
async function completeStage(page, wrongPerQ = [0, 0, 0, 0, 0]) {
  for (let i = 0; i < 5; i++) await playQuestion(page, i, wrongPerQ[i]);
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
  await expect(page.getByText('Question 4 of 5')).toBeVisible(); // still playable — no lockout
  await shot(page, testInfo, '01-zero-hearts-still-playing');
  await playQuestion(page, 3, 0);
  await playQuestion(page, 4, 0);
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
  await playQuestion(page, 0, 1);                       // 1 mistake, then correct → now on Q2
  await expect(page.getByText('Question 2 of 5')).toBeVisible();

  await page.reload();                                  // simulate the app being killed
  await expect(page.getByText('Welcome back!')).toBeVisible();
  await expect(page.getByText(/question 2 of 5/)).toBeVisible();
  await shot(page, testInfo, '01-resume-offer');

  await page.getByRole('button', { name: /Keep going!/ }).click();
  await expect(page.getByText('Question 2 of 5')).toBeVisible();
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
  await page.getByRole('button', { name: '⚙️' }).click();        // map → splash
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
  await page.addInitScript(() => { Object.defineProperty(window, 'speechSynthesis', { value: undefined }); });
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
