// screens-i.jsx — Age-tier onboarding, §14 guardrail states, mature activities
//   AgeTierSelectScreen  — age input auto-selects Junior/Middle/Senior
//   StreakResetScreen    — §14 guilt-free streak reset (Senior)
//   SeniorTypedAnswerScreen — free-text numeric/word answer with on-screen keypad
//   SeniorComprehensionScreen — reading passage + comprehension questions

// ── Onboarding: age → auto-tier ──────────────────────────────────
function AgeTierSelectScreen() {
  // Age 11 chosen → Senior tier auto-selected
  const tiers = [
    { id: 'junior', ages: '5–7',   name: 'Junior',  desc: 'Playful worlds, big buttons, mascot-guided', tone: '#6FCB7F', range: [5, 7], glyph: '🌱' },
    { id: 'middle', ages: '8–9',   name: 'Middle',  desc: 'Goal dashboard, richer subjects, light coaching', tone: '#5EB7E8', range: [8, 9], glyph: '🚀' },
    { id: 'senior', ages: '10–12', name: 'Senior',  desc: 'Pro dashboard, XP & levels, quizzes & review', tone: '#6C7BFF', range: [10, 12], glyph: '⚡' },
  ];
  const selectedAge = 11;
  const activeTier = tiers.find(t => selectedAge >= t.range[0] && selectedAge <= t.range[1]).id;
  return (
    <TabletFrame screenLabel="00b Onboarding · Age & tier" screenBg="var(--cream-50)">
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 20%, #E8DCFF 0%, transparent 60%), var(--cream-50)' }} />
      <div style={{ position: 'absolute', top: 38, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} style={{ width: i === 0 ? 36 : 12, height: 12, borderRadius: 999, background: i === 0 ? 'var(--coral)' : 'rgba(61,40,24,0.18)' }} />
        ))}
      </div>

      <div style={{ position: 'absolute', top: 92, left: 0, right: 0, textAlign: 'center' }}>
        <div className="display" style={{ fontSize: 40, color: 'var(--ink)' }}>How old are you?</div>
        <div style={{ fontSize: 17, color: 'var(--ink-soft)', fontWeight: 700, marginTop: 4 }}>
          We'll set up the right experience — you can change it anytime.
        </div>
      </div>

      {/* age chips */}
      <div style={{ position: 'absolute', top: 190, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10 }}>
        {[5,6,7,8,9,10,11,12].map((n) => {
          const on = n === selectedAge;
          return (
            <div key={n} style={{
              width: 60, height: 60, borderRadius: '50%',
              background: on ? 'var(--berry)' : '#fff',
              color: on ? '#fff' : 'var(--ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Fredoka', fontWeight: 700, fontSize: 24,
              boxShadow: on ? '0 5px 0 var(--berry-dark)' : '0 3px 0 var(--cream-200), inset 0 0 0 2px var(--cream-200)',
            }}>{n}</div>
          );
        })}
      </div>

      {/* tier cards — auto-highlighted */}
      <div style={{ position: 'absolute', top: 300, left: 60, right: 60, bottom: 110, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
        {tiers.map((t) => {
          const on = t.id === activeTier;
          return (
            <div key={t.id} className="sticker" style={{
              padding: 24, background: '#fff', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative',
              boxShadow: on ? `0 0 0 4px ${t.tone}, 0 8px 0 rgba(61,40,24,0.08)` : '0 6px 0 rgba(61,40,24,0.07), 0 18px 30px -12px rgba(61,40,24,0.15)',
              opacity: on ? 1 : 0.62,
            }}>
              {on && (
                <div style={{ position: 'absolute', top: -12, right: 18, padding: '5px 14px', borderRadius: 999, background: t.tone, color: '#fff', fontFamily: 'Fredoka', fontWeight: 600, fontSize: 13, boxShadow: '0 3px 0 rgba(0,0,0,0.12)' }}>
                  ✓ Auto-selected
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: 15, background: `color-mix(in srgb, ${t.tone} 20%, #fff)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{t.glyph}</div>
                <div>
                  <div className="display" style={{ fontSize: 24, color: 'var(--ink)' }}>{t.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: t.tone }}>Ages {t.ages}</div>
                </div>
              </div>
              <div style={{ fontSize: 15, color: 'var(--ink-soft)', fontWeight: 700, lineHeight: 1.4 }}>{t.desc}</div>
            </div>
          );
        })}
      </div>

      <div style={{ position: 'absolute', bottom: 30, left: 60, right: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Pip size={64} color="berry" mood="happy" />
          <div style={{ fontFamily: 'Fredoka', fontSize: 17, color: 'var(--ink)' }}>Great — I'll set you up as <strong style={{ color: 'var(--berry-dark)' }}>Senior</strong>!</div>
        </div>
        <Btn color="berry" size="big">Continue →</Btn>
      </div>
    </TabletFrame>
  );
}

// ── §14 guardrail: guilt-free streak reset (Senior) ──────────────
function StreakResetScreen() {
  return (
    <TabletFrame screenLabel="32 Senior · Streak reset (§14)" screenBg="#0F1B2D">
      <div className="senior tablet" style={{ background: 'transparent' }}>
        <div className="s-backdrop" />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div className="s-card raised" style={{ width: 560, padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, textAlign: 'center' }}>
            {/* soft, no red, no alarm */}
            <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(46,211,198,0.14)', border: '1.5px solid var(--s-line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46 }}>🌤️</div>
            <div className="s-display" style={{ fontSize: 30 }}>Fresh start today</div>
            <div style={{ fontSize: 16, color: 'var(--s-text-soft)', fontWeight: 700, lineHeight: 1.5, maxWidth: 420 }}>
              Your streak reset to <strong style={{ color: 'var(--s-text)' }}>Day 1</strong> — no worries, breaks are healthy. Your <strong style={{ color: 'var(--s-text)' }}>3,240 XP and all badges are safe.</strong>
            </div>
            {/* reassurance row — progress kept */}
            <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 4 }}>
              {[['◆ 3,240', 'XP kept', 'var(--s-teal)'], ['3', 'Badges kept', 'var(--s-indigo)'], ['Lv 14', 'Level kept', 'var(--s-violet)']].map(([v, l, c]) => (
                <div key={l} style={{ flex: 1, padding: '14px 6px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--s-line)' }}>
                  <div className="s-display" style={{ fontSize: 18, color: c }}>{v}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--s-text-quiet)', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, color: 'var(--s-text-soft)', fontSize: 14, fontWeight: 700 }}>
              <SPip size={28} /> Ready when you are — let's build a new one!
            </div>
            <button className="s-btn lg" style={{ marginTop: 4 }}>Start today's set →</button>
          </div>
        </div>
      </div>
    </TabletFrame>
  );
}

// ── Senior typed-answer activity ─────────────────────────────────
function SeniorTypedAnswerScreen() {
  const keys = ['7','8','9','4','5','6','1','2','3','.','0','⌫'];
  return (
    <TabletFrame screenLabel="33 Senior · Typed answer" screenBg="#0F1B2D">
      <div className="senior tablet" style={{ background: 'transparent' }}>
        <div className="s-backdrop" />
        <div style={{ position: 'absolute', inset: 0, padding: '26px 40px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          {/* left: problem */}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button className="s-icon">✕</button>
              <div className="s-track" style={{ flex: 1 }}><i style={{ width: '40%' }} /></div>
              <div className="s-chip"><span style={{ color: 'var(--s-teal)' }}>◆</span> +50 XP</div>
            </div>

            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--s-text-quiet)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 22 }}>Question 4 of 10 · Word problem</div>

            <div className="s-card raised" style={{ padding: 26, marginTop: 12 }}>
              <div className="s-display" style={{ fontSize: 23, lineHeight: 1.4 }}>
                A recipe needs <span style={{ color: 'var(--s-teal)' }}>¾ cup</span> of flour per batch. How many cups are needed for <span style={{ color: 'var(--s-teal)' }}>3 batches</span>?
              </div>
              <div style={{ marginTop: 10, fontSize: 14, color: 'var(--s-text-soft)', fontWeight: 700 }}>Enter your answer as a decimal or fraction.</div>
            </div>

            {/* answer field */}
            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1, height: 76, borderRadius: 16, background: 'var(--s-surface)', border: '1.5px solid var(--s-teal)', display: 'flex', alignItems: 'center', padding: '0 22px', gap: 4 }}>
                <span className="s-display" style={{ fontSize: 34, color: 'var(--s-text)' }}>2.25</span>
                <span style={{ width: 3, height: 38, background: 'var(--s-teal)', borderRadius: 2, animation: 'caretBlink 1s steps(2) infinite' }} />
                <span style={{ marginLeft: 'auto', fontSize: 15, fontWeight: 800, color: 'var(--s-text-quiet)' }}>cups</span>
              </div>
              <button className="s-btn lg" style={{ height: 76 }}>Check →</button>
            </div>

            {/* keypad */}
            <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, flex: 1, minHeight: 0 }}>
              {keys.map((k) => (
                <button key={k} className="s-card" style={{
                  border: '1px solid var(--s-line)', cursor: 'pointer',
                  fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 24, color: 'var(--s-text)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: k === '⌫' ? 'rgba(255,255,255,0.03)' : 'var(--s-surface)',
                }}>{k}</button>
              ))}
            </div>
          </div>

          {/* right: helper */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="s-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <SPip size={34} />
                <div className="s-display" style={{ fontSize: 17 }}>Coach tip</div>
              </div>
              <div style={{ fontSize: 15, color: 'var(--s-text-soft)', fontWeight: 700, lineHeight: 1.5, marginTop: 12 }}>
                Multiply the fraction by the number of batches: <span style={{ color: 'var(--s-teal)' }}>¾ × 3</span>. Convert to a decimal if that's easier.
              </div>
            </div>
            <div className="s-card" style={{ padding: 20, flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--s-text-quiet)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Scratch pad</div>
              <div style={{ marginTop: 12, borderRadius: 12, border: '1px dashed var(--s-line-2)', flex: 1, minHeight: 120, padding: 14, fontFamily: 'Space Grotesk', color: 'var(--s-text-soft)', fontSize: 16 }}>
                ¾ + ¾ + ¾<br/>= 9/4<br/>= 2¼
              </div>
            </div>
            <button className="s-btn ghost">💡 Hint (no XP penalty)</button>
          </div>
        </div>
      </div>
    </TabletFrame>
  );
}

// ── Senior reading comprehension ─────────────────────────────────
function SeniorComprehensionScreen() {
  return (
    <TabletFrame screenLabel="34 Senior · Reading comprehension" screenBg="#0F1B2D">
      <div className="senior tablet" style={{ background: 'transparent' }}>
        <div className="s-backdrop" />
        <div style={{ position: 'absolute', inset: 0, padding: '26px 40px', display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 22 }}>
          {/* passage */}
          <div className="s-card" style={{ padding: 26, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="s-chip"><span style={{ color: 'var(--s-indigo)' }}>📖</span> Passage · Level 5</div>
              <button className="s-icon" style={{ width: 38, height: 38 }}>🔊</button>
            </div>
            <div className="s-display" style={{ fontSize: 24, marginTop: 14 }}>The Lighthouse Keeper</div>
            <div style={{ marginTop: 12, fontSize: 16, lineHeight: 1.7, color: 'var(--s-text-soft)', fontWeight: 600, overflow: 'hidden' }}>
              <p style={{ margin: '0 0 12px' }}>Every evening, Mara climbed the ninety-seven steps to the top of the lighthouse. Her grandfather had kept the light for forty years, and now the task was hers.</p>
              <p style={{ margin: '0 0 12px' }}>The lamp had to be lit before the sun dropped below the horizon. Sailors far out at sea depended on its steady beam to steer clear of the jagged rocks that ringed the bay.</p>
              <p style={{ margin: 0 }}>One stormy night, the power failed. Mara did not panic. She remembered her grandfather's oil lantern, stored in the cellar for exactly this kind of emergency, and carried it up the winding stairs.</p>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--s-text-quiet)' }}>
              <span style={{ color: 'var(--s-teal)' }}>↕</span> Scroll to re-read anytime — the passage stays with you.
            </div>
          </div>

          {/* questions */}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="s-track" style={{ flex: 1 }}><i style={{ width: '33%' }} /></div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--s-text-soft)' }}>Q1 of 3</div>
            </div>

            <div className="s-card raised" style={{ padding: 22, marginTop: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--s-text-quiet)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Comprehension</div>
              <div className="s-display" style={{ fontSize: 21, marginTop: 6, lineHeight: 1.35 }}>Why did Mara stay calm when the power failed?</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14, flex: 1, minHeight: 0 }}>
              {[
                { k: 'A', t: 'She knew a backup oil lantern was stored in the cellar.', correct: true },
                { k: 'B', t: 'The sailors told her what to do over the radio.', correct: false },
                { k: 'C', t: 'The storm stopped before it got dark.', correct: false },
                { k: 'D', t: 'Her grandfather climbed the stairs to help her.', correct: false },
              ].map((o) => (
                <button key={o.k} className="s-card" style={{
                  padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left',
                  border: o.correct ? '1.5px solid var(--s-teal)' : '1px solid var(--s-line)',
                  background: o.correct ? 'rgba(46,211,198,0.12)' : 'var(--s-surface)',
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 15,
                    background: o.correct ? 'var(--s-teal)' : 'rgba(255,255,255,0.06)',
                    color: o.correct ? '#04201E' : 'var(--s-text-soft)', border: '1px solid var(--s-line)',
                  }}>{o.correct ? '✓' : o.k}</div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--s-text)', lineHeight: 1.35 }}>{o.t}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--s-text-soft)', fontSize: 13, fontWeight: 700 }}>
                <SPip size={26} /> Find the sentence that proves it.
              </div>
              <button className="s-btn lg">Next →</button>
            </div>
          </div>
        </div>
      </div>
    </TabletFrame>
  );
}

Object.assign(window, {
  AgeTierSelectScreen, StreakResetScreen, SeniorTypedAnswerScreen, SeniorComprehensionScreen,
});
