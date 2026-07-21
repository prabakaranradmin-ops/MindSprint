/* §17.2: bank schema validation — runs on every content change. Verifies the
 * §15.1 contract for content.js: stable unique IDs, required fields, exactly
 * one correct option where a bank uses ok:true, and no duplicate options.
 *
 * Run: node --test tests/unit
 */
const { test, describe } = require('node:test');
const assert = require('node:assert');
const loadContent = require('../../content.js.export.cjs');

const C = loadContent();

/** Every bank item must have a stable, unique string id. */
function assertUniqueIds(bank, name) {
  const ids = bank.map(item => item.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.equal(dupes.length, 0, `${name}: duplicate ids found: ${[...new Set(dupes)].join(', ')}`);
  for (const id of ids) {
    assert.equal(typeof id, 'string', `${name}: every item id must be a string`);
    assert.ok(id.length > 0, `${name}: item id must not be empty`);
  }
}

/** Every bank item must carry a difficulty tier 1-3 (§8.3/§9.2 adaptive filtering). */
function assertDifficultyTags(bank, name) {
  for (const item of bank) {
    assert.ok([1, 2, 3].includes(item.difficulty),
      `${name} item "${item.id}": difficulty must be 1, 2, or 3, got ${JSON.stringify(item.difficulty)}`);
  }
}

/** For banks whose items carry an `opts` array of {ok: bool} choices: exactly
 *  one correct option, and no two options with the same visible value. */
function assertSingleCorrectOpt(bank, name, keyField) {
  for (const item of bank) {
    const correct = item.opts.filter(o => o.ok === true);
    assert.equal(correct.length, 1,
      `${name} item "${item.id}": expected exactly 1 correct option, found ${correct.length}`);
    const values = item.opts.map(o => o[keyField]);
    assert.equal(new Set(values).size, values.length,
      `${name} item "${item.id}": duplicate option values in ${JSON.stringify(values)}`);
  }
}

describe('stageConfigs (§8.1/§8.2) — every stage names a real skill and curriculum tag', () => {
  const allSkillIds = new Set(Object.keys(C.skillLabels));

  for (const [subject, stages] of Object.entries(C.stageConfigs)) {
    test(`${subject}: every stage has type/skill/label/instruction, and the skill is labeled`, () => {
      for (const [i, cfg] of stages.entries()) {
        assert.ok(cfg.type, `${subject}[${i}]: missing type`);
        assert.ok(cfg.skill, `${subject}[${i}]: missing skill`);
        assert.ok(cfg.label, `${subject}[${i}]: missing label`);
        assert.ok(cfg.instruction, `${subject}[${i}]: missing instruction`);
        assert.ok(allSkillIds.has(cfg.skill),
          `${subject}[${i}]: skill "${cfg.skill}" has no entry in skillLabels (§9.1)`);
      }
    });

    test(`${subject}: every stage carries a curriculum tag (§8.2 alignment)`, () => {
      for (const [i, cfg] of stages.entries()) {
        assert.ok(cfg.curriculum && cfg.curriculum.length > 0,
          `${subject}[${i}] (${cfg.label}): missing curriculum tag`);
      }
    });
  }
});

describe('stageConfigsWorld2 (D2, §3.2) — content-only, not yet wired to any UI', () => {
  const allSkillIds = new Set(Object.keys(C.skillLabels));

  test('exactly the same 4 subjects as World 1, 5 stages each', () => {
    assert.deepEqual(Object.keys(C.stageConfigsWorld2).sort(), Object.keys(C.stageConfigs).sort());
    for (const [subject, stages] of Object.entries(C.stageConfigsWorld2)) {
      assert.equal(stages.length, 5, `${subject}: World 2 must have exactly 5 stages, like World 1`);
    }
  });

  for (const [subject, stages] of Object.entries(C.stageConfigsWorld2)) {
    test(`${subject} World 2: every stage has type/skill/label/instruction, and the skill is labeled`, () => {
      for (const [i, cfg] of stages.entries()) {
        assert.ok(cfg.type, `${subject} W2[${i}]: missing type`);
        assert.ok(cfg.skill, `${subject} W2[${i}]: missing skill`);
        assert.ok(cfg.label, `${subject} W2[${i}]: missing label`);
        assert.ok(cfg.instruction, `${subject} W2[${i}]: missing instruction`);
        assert.ok(allSkillIds.has(cfg.skill),
          `${subject} W2[${i}]: skill "${cfg.skill}" has no entry in skillLabels (§9.1)`);
      }
    });
    test(`${subject} World 2: every stage carries a curriculum tag (§8.2 alignment)`, () => {
      for (const [i, cfg] of stages.entries()) {
        assert.ok(cfg.curriculum && cfg.curriculum.length > 0,
          `${subject} W2[${i}] (${cfg.label}): missing curriculum tag`);
      }
    });
    test(`${subject} World 2: reuses the same skill AREA as World 1 (harder tier of the same skills, per D2)`, () => {
      // "same skill area" = same dot-prefix family (e.g. math.count_to_5 and
      // math.count_to_9 are both "counting," just different documented tiers)
      // — D2 requires a harder tier of the same skills, not literally
      // identical skill ids, since a few genuinely-harder variants (like
      // count_to_9) were already reserved in skillLabels for exactly this.
      const w1Areas = new Set(C.stageConfigs[subject].map(c => c.skill.replace(/_(to|within)_\d+$/, '')));
      for (const [i, cfg] of stages.entries()) {
        const area = cfg.skill.replace(/_(to|within)_\d+$/, '');
        assert.ok(w1Areas.has(area),
          `${subject} W2[${i}]: skill "${cfg.skill}" isn't a variant of any World 1 skill area — D2 specifies World 2 as a harder tier of the SAME skills, not new ones`);
      }
    });
  }
});

describe('phonics bank', () => {
  test('unique ids, difficulty tags, exactly one correct option per item', () => {
    assertUniqueIds(C.phonics, 'phonics');
    assertDifficultyTags(C.phonics, 'phonics');
    assertSingleCorrectOpt(C.phonics, 'phonics', 'w');
  });
  test('every item has a single uppercase letter', () => {
    for (const p of C.phonics) assert.match(p.letter, /^[A-Z]$/, `phonics "${p.id}": letter must be a single A-Z char`);
  });
});

describe('wordpic bank', () => {
  test('unique ids, difficulty tags, exactly one correct option per item', () => {
    assertUniqueIds(C.wordpic, 'wordpic');
    assertDifficultyTags(C.wordpic, 'wordpic');
    assertSingleCorrectOpt(C.wordpic, 'wordpic', 'e');
  });
});

describe('traceLetters bank', () => {
  test('unique ids, difficulty tags, at least one stroke with at least 2 points', () => {
    assertUniqueIds(C.traceLetters, 'traceLetters');
    assertDifficultyTags(C.traceLetters, 'traceLetters');
    for (const t of C.traceLetters) {
      assert.ok(Array.isArray(t.strokes) && t.strokes.length > 0, `traceLetters "${t.id}": needs at least one stroke`);
      for (const stroke of t.strokes) {
        assert.ok(stroke.length >= 2, `traceLetters "${t.id}": each stroke needs at least 2 points`);
        for (const pt of stroke) {
          assert.equal(pt.length, 2, `traceLetters "${t.id}": each point must be [x,y]`);
          assert.ok(pt.every(n => typeof n === 'number'), `traceLetters "${t.id}": point coords must be numbers`);
        }
      }
    }
  });
  test('every letter also has a matching phonics entry (tracing ties to its word)', () => {
    const phonicsLetters = new Set(C.phonics.map(p => p.letter));
    for (const t of C.traceLetters) {
      assert.ok(phonicsLetters.has(t.letter),
        `traceLetters "${t.id}" (letter ${t.letter}): no matching phonics bank entry for the word tie-in card`);
    }
  });
});

describe('phonemeIds manifest (§15.3) — every letter used in phonics/traceLetters has a sprite id', () => {
  test('phonemeIds is a non-empty list of unique lowercase ids', () => {
    assert.ok(Array.isArray(C.phonemeIds) && C.phonemeIds.length > 0, 'phonemeIds must be a non-empty array');
    assert.equal(new Set(C.phonemeIds).size, C.phonemeIds.length, 'phonemeIds must not contain duplicates');
    for (const id of C.phonemeIds) {
      assert.equal(id, id.toLowerCase(), `phonemeIds "${id}": must be lowercase (audio-manager.jsx looks up by lowercased letter)`);
    }
  });
  test('every phonics/traceLetters letter resolves to a phonemeIds entry', () => {
    const ids = new Set(C.phonemeIds);
    for (const p of C.phonics) {
      assert.ok(ids.has(p.letter.toLowerCase()),
        `phonics "${p.id}" (letter ${p.letter}): no matching phonemeIds entry — AudioMgr.phonics() would silently no-op`);
    }
    for (const t of C.traceLetters) {
      assert.ok(ids.has(t.letter.toLowerCase()),
        `traceLetters "${t.id}" (letter ${t.letter}): no matching phonemeIds entry — AudioMgr.phonics() would silently no-op`);
    }
  });
});

describe('lifecycleSeqs bank', () => {
  test('unique ids, each sequence has 3+ ordered stages with icon+label', () => {
    assertUniqueIds(C.lifecycleSeqs, 'lifecycleSeqs');
    for (const s of C.lifecycleSeqs) {
      assert.ok(s.topic, `lifecycleSeqs "${s.id}": missing topic`);
      assert.ok(s.q, `lifecycleSeqs "${s.id}": missing prompt (q)`);
      assert.ok(Array.isArray(s.stages) && s.stages.length >= 3,
        `lifecycleSeqs "${s.id}": needs at least 3 stages, got ${s.stages && s.stages.length}`);
      for (const st of s.stages) {
        assert.ok(st.e && st.l, `lifecycleSeqs "${s.id}": every stage needs an icon (e) and label (l)`);
      }
    }
  });
});

describe('living / size / sinkfloat / hotcold banks — binary-category sort items', () => {
  const cases = [
    ['living', C.living, 'cat', ['living', 'non-living']],
    ['size', C.size, 'cat', ['big', 'small']],
  ];
  for (const [name, bank, field, allowed] of cases) {
    test(`${name}: unique ids, difficulty tags, category is one of ${allowed.join('/')}`, () => {
      assertUniqueIds(bank, name);
      assertDifficultyTags(bank, name);
      for (const item of bank) {
        assert.ok(allowed.includes(item[field]),
          `${name} "${item.id}": ${field}="${item[field]}" not in ${JSON.stringify(allowed)}`);
        assert.ok(item.e && item.l, `${name} "${item.id}": missing emoji (e) or label (l)`);
      }
    });
  }
  test('sinkfloat: unique ids, difficulty tags, sinks is boolean', () => {
    assertUniqueIds(C.sinkfloat, 'sinkfloat');
    assertDifficultyTags(C.sinkfloat, 'sinkfloat');
    for (const item of C.sinkfloat) assert.equal(typeof item.sinks, 'boolean', `sinkfloat "${item.id}": sinks must be boolean`);
  });
  test('hotcold: unique ids, difficulty tags, hot is boolean', () => {
    assertUniqueIds(C.hotcold, 'hotcold');
    assertDifficultyTags(C.hotcold, 'hotcold');
    for (const item of C.hotcold) assert.equal(typeof item.hot, 'boolean', `hotcold "${item.id}": hot must be boolean`);
  });
});

describe('habitat bank — every animal\'s home is a real habitat, wrong answers are too', () => {
  test('h and every entry in w reference a key that exists in habitats', () => {
    assertUniqueIds(C.habitat, 'habitat');
    assertDifficultyTags(C.habitat, 'habitat');
    const validHabitats = new Set(Object.keys(C.habitats));
    for (const item of C.habitat) {
      assert.ok(validHabitats.has(item.h), `habitat "${item.id}": home "${item.h}" is not a defined habitat`);
      assert.ok(Array.isArray(item.w) && item.w.length >= 2, `habitat "${item.id}": needs at least 2 wrong-answer habitats`);
      for (const w of item.w) {
        assert.ok(validHabitats.has(w), `habitat "${item.id}": wrong-answer habitat "${w}" is not defined`);
        assert.notEqual(w, item.h, `habitat "${item.id}": a wrong answer must not equal the correct habitat`);
      }
    }
  });
});

describe('lifecycle bank — every "next" stage is plausible, wrong answers never equal the correct one', () => {
  test('next.e/next.l present, wrong array has 2+ distinct entries not equal to next', () => {
    assertUniqueIds(C.lifecycle, 'lifecycle');
    assertDifficultyTags(C.lifecycle, 'lifecycle');
    for (const item of C.lifecycle) {
      assert.ok(item.next && item.next.e && item.next.l, `lifecycle "${item.id}": missing next.e/next.l`);
      assert.ok(Array.isArray(item.wrong) && item.wrong.length >= 2, `lifecycle "${item.id}": needs 2+ wrong options`);
      for (const w of item.wrong) {
        assert.notEqual(w.l, item.next.l, `lifecycle "${item.id}": a wrong option must not equal the correct next stage`);
      }
    }
  });
});

describe('cross-bank freshness rule (§15.1) — global id uniqueness', () => {
  test('no id is reused across different banks', () => {
    const allBanks = {
      phonics: C.phonics, wordpic: C.wordpic, traceLetters: C.traceLetters,
      lifecycleSeqs: C.lifecycleSeqs, living: C.living, size: C.size,
      sinkfloat: C.sinkfloat, hotcold: C.hotcold, habitat: C.habitat, lifecycle: C.lifecycle,
    };
    const seen = new Map();
    for (const [bankName, bank] of Object.entries(allBanks)) {
      for (const item of bank) {
        if (seen.has(item.id)) {
          assert.fail(`id "${item.id}" used in both "${seen.get(item.id)}" and "${bankName}" — ids must be globally unique`);
        }
        seen.set(item.id, bankName);
      }
    }
  });
});
