/* §17.2: question generators are unit-tested with a seeded RNG so failures
 * reproduce deterministically. Runs the real logic extracted straight out of
 * app.html (tests/helpers/loadGameLogic.cjs) — no duplicated implementation
 * to drift out of sync.
 *
 * Run: node --test tests/unit
 *
 * Note: the extracted logic runs inside a vm sandbox with its own realm, so
 * plain-object results have a different Object.prototype than host object
 * literals. We use non-strict node:assert (structural equality) rather than
 * node:assert/strict (which is deepStrictEqual and would fail on prototype
 * mismatch alone, even when every value is identical) — and we seed G.Math,
 * not the host Math, since the sandbox has its own Math.random.
 */
const { test, describe } = require('node:test');
const assert = require('node:assert');
const { loadGameLogic } = require('../helpers/loadGameLogic.cjs');
const { withSeed } = require('../helpers/seededRandom.cjs');

const G = loadGameLogic();
const seeded = (seed, fn) => withSeed(seed, fn, G.Math);

describe('seeded reproducibility', () => {
  test('seed 1234 yields the exact same math stage-1 question set on every run', () => {
    const run = () => seeded(1234, () =>
      G.generateQuestions('math', 0, { age: 6, skills: {}, recentItems: [] }));
    const a = run();
    const b = run();
    assert.deepEqual(a, b, 'same seed must produce identical output');
  });

  test('different seeds produce different question sets (sanity: seeding actually varies output)', () => {
    const a = seeded(1, () => G.generateQuestions('math', 0, { age: 6, skills: {}, recentItems: [] }));
    const b = seeded(2, () => G.generateQuestions('math', 0, { age: 6, skills: {}, recentItems: [] }));
    assert.notDeepEqual(a, b);
  });
});

describe('genCountQs — every answer set has exactly one correct value', () => {
  for (const seed of [1, 42, 1234, 9999]) {
    test(`seed ${seed}`, () => {
      const qs = seeded(seed, () => G.genCountQs(9, null, 10));
      for (const q of qs) {
        const correctCount = q.answers.filter(a => a === q.count).length;
        assert.equal(correctCount, 1,
          `seed ${seed}, question ${q.id}: expected exactly one correct answer among ${JSON.stringify(q.answers)} for count=${q.count}`);
        assert.equal(new Set(q.answers).size, q.answers.length, 'answers must not contain duplicates');
      }
    });
  }
});

describe('genAdditionQs / genSubtractionQs — arithmetic is actually correct', () => {
  test('addition: a + b always equals count, and count is the correct answer', () => {
    const qs = seeded(7, () => G.genAdditionQs(null, 20));
    for (const q of qs) {
      assert.equal(q.a + q.b, q.count);
      assert.ok(q.answers.includes(q.count));
    }
  });
  test('subtraction: a - b always equals count and is non-negative', () => {
    const qs = seeded(7, () => G.genSubtractionQs(null, 20));
    for (const q of qs) {
      assert.equal(q.a - q.b, q.count);
      assert.ok(q.count >= 0, `count ${q.count} must not be negative`);
      assert.ok(q.answers.includes(q.count));
    }
  });
});

describe('genCompareQs — correct side always has more', () => {
  test('left/right correctness is consistent across many seeds', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const qs = seeded(seed, () => G.genCompareQs(null, 10));
      for (const q of qs) {
        const shouldBeLeft = q.left > q.right;
        assert.equal(q.correct, shouldBeLeft ? 'left' : 'right',
          `seed ${seed}: left=${q.left} right=${q.right} but correct=${q.correct}`);
        assert.notEqual(q.left, q.right, 'compare questions must never tie');
      }
    }
  });
});

describe('adaptive step-down (§9.2) reduces choice count where the mechanic allows', () => {
  test('twoOpts caps genCountQs answers at 2 instead of 3', () => {
    const normal = seeded(1, () => G.genCountQs(9, { tier: 1, near: false, twoOpts: false }, 5));
    const stepped = seeded(1, () => G.genCountQs(9, { tier: 1, near: false, twoOpts: true }, 5));
    for (const q of normal) assert.equal(q.answers.length, 3);
    for (const q of stepped) assert.equal(q.answers.length, 2);
  });
});

describe('getAdaptive (§9.2/§9.3) — deterministic tier/near/twoOpts rules', () => {
  test('age seeds the baseline tier and distractor proximity', () => {
    assert.deepEqual(G.getAdaptive({ age: 5, skills: {} }, 'x'), { tier: 1, near: false, twoOpts: false });
    assert.deepEqual(G.getAdaptive({ age: 6, skills: {} }, 'x'), { tier: 1, near: true, twoOpts: false });
    assert.deepEqual(G.getAdaptive({ age: 7, skills: {} }, 'x'), { tier: 2, near: true, twoOpts: false });
  });
  test('10+ attempts at <=60% rolling accuracy steps down', () => {
    const skills = { 'math.x': { attempts: 10, correct: 5, recent: Array(10).fill(0).map((_, i) => i % 2), lastPlayed: null } };
    const out = G.getAdaptive({ age: 6, skills }, 'math.x');
    assert.equal(out.twoOpts, true);
    assert.equal(out.near, false);
  });
  test('15+ attempts at >=90% rolling accuracy steps up, capped at tier 3', () => {
    const skills = { 'math.x': { attempts: 15, correct: 15, recent: Array(15).fill(1), lastPlayed: null } };
    const out = G.getAdaptive({ age: 7, skills }, 'math.x');
    assert.equal(out.tier, 3);
    assert.equal(out.near, true);
  });
});

describe('recency decay (§9.2) — stale skills lose their edge deterministically', () => {
  test('a flawless skill 65+ days stale decays toward chance level and steps DOWN, not just fails to step up', () => {
    // decayAccuracy pulls fully-stale accuracy toward 0.5 (chance level), which
    // is below the 0.6 step-down threshold — a "forgotten" flawless record is
    // treated as genuinely needing a refresh, not merely "no longer mastered".
    const today = new Date().toISOString().slice(0, 10);
    const old = new Date(Date.now() - 65 * 86400000).toISOString().slice(0, 10);
    const freshSkills = { x: { attempts: 15, correct: 15, recent: Array(15).fill(1), lastPlayed: today } };
    const staleSkills = { x: { attempts: 15, correct: 15, recent: Array(15).fill(1), lastPlayed: old } };
    assert.equal(G.getAdaptive({ age: 7, skills: freshSkills }, 'x').tier, 3);   // flawless + recent → steps up
    assert.equal(G.getAdaptive({ age: 7, skills: staleSkills }, 'x').tier, 1);   // same record, 65d stale → steps down
  });

  test('a skill just above the step-down line today crosses under it once fully decayed', () => {
    const old = new Date(Date.now() - 65 * 86400000).toISOString().slice(0, 10);
    // last-10 window = 7/10 = 0.7, comfortably above the 0.6 threshold
    const recent = [1,1,1,1,1, 1,1,0,1,1, 0,1,1,0,1];
    const fresh = { x: { attempts: 15, correct: 12, recent, lastPlayed: new Date().toISOString().slice(0,10) } };
    const stale = { x: { attempts: 15, correct: 12, recent, lastPlayed: old } };
    assert.equal(G.getAdaptive({ age: 7, skills: fresh }, 'x').twoOpts, false);
    assert.equal(G.getAdaptive({ age: 7, skills: stale }, 'x').twoOpts, true);
  });
});
