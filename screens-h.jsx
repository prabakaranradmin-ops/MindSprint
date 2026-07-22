// screens-h.jsx — Age-tier expansion (up to age 12)
// Senior tier (10–12): premium "tween" design — cool navy, Space Grotesk,
// XP/streak/score motivation, Pip as a small coach. Plus a Middle-tier (8–9)
// home used in the maturity-spectrum comparison.
//
// All Senior screens wrap content in <div className="senior tablet"> so the
// .senior CSS scope applies.

// ── small senior helpers ─────────────────────────────────────────
function SRing({ value = 0.7, size = 120, stroke = 12, label, sub }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <defs>
          <linearGradient id={'sr' + size} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2ED3C6" />
            <stop offset="100%" stopColor="#6C7BFF" />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`url(#sr${size})`} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value)} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 2,
      }}>
        <div className="s-display" style={{ fontSize: size * 0.26, color: 'var(--s-text)' }}>{label}</div>
        {sub && <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--s-text-quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{sub}</div>}
      </div>
    </div>
  );
}

function SPip({ size = 44 }) {
  // small coach version of Pip
  return (
    <div className="pip happy" style={{ '--pip-size': size + 'px', '--pip-body': 'var(--s-teal)', width: size, height: size }}>
      <div className="body" /><div className="belly" />
      <div className="eye left" /><div className="eye right" />
      <div className="mouth" />
    </div>
  );
}

// ── SENIOR HOME — dashboard, not a map ───────────────────────────
function SeniorHomeScreen() {
  const subjects = [
    { name: 'Mathematics', topic: 'Fractions & ratios', pct: 0.72, accent: 'var(--s-teal)',   glyph: '∑' },
    { name: 'Language',    topic: 'Reading & grammar',  pct: 0.54, accent: 'var(--s-indigo)', glyph: 'Aa' },
    { name: 'Science',     topic: 'Forces & energy',    pct: 0.38, accent: 'var(--s-lime)',   glyph: '⚛' },
    { name: 'Geography',   topic: 'Maps & climate',     pct: 0.20, accent: 'var(--s-amber)',  glyph: '◍' },
    { name: 'Logic',       topic: 'Patterns & code',    pct: 0.61, accent: 'var(--s-violet)', glyph: '{}' },
    { name: 'History',     topic: 'Ancient worlds',     pct: 0.10, accent: 'var(--s-coral)',  glyph: '⌛' },
  ];
  return (
    <TabletFrame screenLabel="28 Senior · Home" screenBg="#0F1B2D">
      <div className="senior tablet" style={{ background: 'transparent' }}>
        <div className="s-backdrop" />
        <div style={{ position: 'absolute', inset: 0, padding: '30px 34px', display: 'flex', flexDirection: 'column' }}>
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--s-text-quiet)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Wednesday · Level 14</div>
              <div className="s-display" style={{ fontSize: 34, marginTop: 4 }}>Welcome back, Aria</div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div className="s-chip"><span style={{ color: 'var(--s-amber)' }}>🔥</span> 12-day streak</div>
              <div className="s-chip"><span style={{ color: 'var(--s-teal)' }}>◆</span> 3,240 XP</div>
              <button className="s-icon">⚙</button>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#6C7BFF,#2ED3C6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>A</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, marginTop: 22, flex: 1, minHeight: 0 }}>
            {/* left: continue + subjects */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minHeight: 0 }}>
              {/* continue card */}
              <div className="s-card raised" style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(46,211,198,0.14)', border: '1px solid var(--s-line-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, color: 'var(--s-teal)' }}>∑</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--s-text-quiet)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Pick up where you left off</div>
                  <div className="s-display" style={{ fontSize: 22, marginTop: 3 }}>Equivalent Fractions · Lesson 4</div>
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="s-track" style={{ flex: 1 }}><i style={{ width: '72%' }} /></div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--s-text-soft)' }}>72%</span>
                  </div>
                </div>
                <button className="s-btn lg">Resume →</button>
              </div>

              {/* subject grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, flex: 1, minHeight: 0 }}>
                {subjects.map((s) => (
                  <div key={s.name} className="s-card" style={{ padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 11, background: `color-mix(in srgb, ${s.accent} 16%, transparent)`, border: '1px solid var(--s-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: s.accent, fontWeight: 800 }}>{s.glyph}</div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--s-text-quiet)' }}>{Math.round(s.pct * 100)}%</span>
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <div className="s-display" style={{ fontSize: 17 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--s-text-soft)', fontWeight: 700, marginTop: 1 }}>{s.topic}</div>
                    </div>
                    <div className="s-track" style={{ marginTop: 12 }}><i style={{ width: (s.pct * 100) + '%', background: s.accent }} /></div>
                  </div>
                ))}
              </div>
            </div>

            {/* right rail */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="s-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ alignSelf: 'flex-start', fontSize: 12, fontWeight: 800, color: 'var(--s-text-quiet)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Daily goal</div>
                <SRing value={0.65} size={132} label="65%" sub="26 / 40 XP" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--s-text-soft)', fontSize: 13, fontWeight: 700 }}>
                  <SPip size={26} /> Almost there — one more set!
                </div>
              </div>
              <div className="s-card" style={{ padding: 20, flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--s-text-quiet)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>This week</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 90, marginTop: 16 }}>
                  {[50, 30, 70, 45, 80, 60, 35].map((h, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: '100%', height: h + '%', borderRadius: 6, background: i === 4 ? 'linear-gradient(180deg,#2ED3C6,#17A99D)' : 'rgba(255,255,255,0.12)' }} />
                      <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--s-text-quiet)' }}>{['M','T','W','T','F','S','S'][i]}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--s-text-soft)', fontWeight: 700 }}>Best day</span>
                  <span className="s-display" style={{ color: 'var(--s-text)' }}>Friday · 80 XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TabletFrame>
  );
}

// ── SENIOR QUIZ — timed multiple choice ──────────────────────────
function SeniorQuizScreen() {
  const options = [
    { key: 'A', text: '3 / 4', state: 'idle' },
    { key: 'B', text: '2 / 3', state: 'idle' },
    { key: 'C', text: '6 / 8', state: 'correct' },
    { key: 'D', text: '1 / 2', state: 'idle' },
  ];
  return (
    <TabletFrame screenLabel="29 Senior · Quiz" screenBg="#0F1B2D">
      <div className="senior tablet" style={{ background: 'transparent' }}>
        <div className="s-backdrop" />
        <div style={{ position: 'absolute', inset: 0, padding: '26px 40px', display: 'flex', flexDirection: 'column' }}>
          {/* top bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button className="s-icon">✕</button>
            <div className="s-track" style={{ flex: 1 }}><i style={{ width: '60%' }} /></div>
            <div className="s-chip" title="Speed bonus — never a time limit"><span style={{ color: 'var(--s-amber)' }}>⚡</span> +15 speed bonus</div>
            <div className="s-chip"><span style={{ color: 'var(--s-teal)' }}>◆</span> +40 XP</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--s-text-quiet)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Question 6 of 10 · Fractions</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 800, color: 'var(--s-text-soft)' }}>
              <span style={{ color: 'var(--s-teal-deep)' }}>∞</span> Take your time — no time limit
            </div>
          </div>

          {/* question */}
          <div className="s-card raised" style={{ padding: 26, marginTop: 12 }}>
            <div className="s-display" style={{ fontSize: 26, lineHeight: 1.3 }}>
              Which fraction is <span style={{ color: 'var(--s-teal)' }}>equivalent</span> to <span style={{ color: 'var(--s-teal)' }}>¾</span>?
            </div>
            <div style={{ marginTop: 8, fontSize: 15, color: 'var(--s-text-soft)', fontWeight: 700 }}>
              Tip: multiply the numerator and denominator by the same number.
            </div>
          </div>

          {/* options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 18, flex: 1, minHeight: 0 }}>
            {options.map((o) => {
              const isCorrect = o.state === 'correct';
              return (
                <button key={o.key} className="s-card" style={{
                  padding: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', textAlign: 'left',
                  border: isCorrect ? '1.5px solid var(--s-teal)' : '1px solid var(--s-line)',
                  background: isCorrect ? 'rgba(46,211,198,0.12)' : 'var(--s-surface)',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 16,
                    background: isCorrect ? 'var(--s-teal)' : 'rgba(255,255,255,0.06)',
                    color: isCorrect ? '#04201E' : 'var(--s-text-soft)',
                    border: '1px solid var(--s-line)',
                  }}>{isCorrect ? '✓' : o.key}</div>
                  <span className="s-display" style={{ fontSize: 24, color: 'var(--s-text)' }}>{o.text}</span>
                </button>
              );
            })}
          </div>

          {/* footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
            <button className="s-btn ghost">Skip</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--s-text-soft)', fontSize: 13, fontWeight: 700 }}>
                <SPip size={26} /> Nice — that's right!
              </div>
              <button className="s-btn lg">Next question →</button>
            </div>
          </div>
        </div>
      </div>
    </TabletFrame>
  );
}

// ── SENIOR RESULTS — score, XP, review ───────────────────────────
function SeniorResultsScreen() {
  const review = [
    { q: 'Simplify 8/12', your: '2/3', ok: true },
    { q: '¾ + ⅛ = ?', your: '7/8', ok: true },
    { q: 'Which is larger: ⅗ or ½?', your: '½', ok: false, right: '⅗' },
    { q: '0.25 as a fraction', your: '1/4', ok: true },
  ];
  return (
    <TabletFrame screenLabel="30 Senior · Results" screenBg="#0F1B2D">
      <div className="senior tablet" style={{ background: 'transparent' }}>
        <div className="s-backdrop" />
        <div style={{ position: 'absolute', inset: 0, padding: '30px 40px', display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24 }}>
          {/* left summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--s-text-quiet)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Set complete</div>
              <div className="s-display" style={{ fontSize: 32, marginTop: 4 }}>Fractions · Lesson 4</div>
            </div>
            <div className="s-card raised" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <SRing value={0.8} size={168} stroke={14} label="80%" sub="8 / 10 correct" />
              <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                {[['+120', 'XP earned', 'var(--s-teal)'], ['×5', 'Best streak', 'var(--s-amber)'], ['2:14', 'Time', 'var(--s-indigo)']].map(([v, l, c]) => (
                  <div key={l} style={{ flex: 1, textAlign: 'center', padding: '12px 6px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--s-line)' }}>
                    <div className="s-display" style={{ fontSize: 20, color: c }}>{v}</div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--s-text-quiet)', marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="s-btn ghost" style={{ flex: 1 }}>↻ Retry</button>
              <button className="s-btn indigo lg" style={{ flex: 1.4 }}>Continue →</button>
            </div>
          </div>

          {/* right: review answers */}
          <div className="s-card" style={{ padding: 22, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="s-display" style={{ fontSize: 20 }}>Review your answers</div>
              <div className="s-chip"><span style={{ color: 'var(--s-coral)' }}>●</span> 2 to revisit</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16, overflow: 'hidden' }}>
              {review.map((r, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14,
                  background: r.ok ? 'rgba(46,211,198,0.06)' : 'rgba(255,107,107,0.08)',
                  border: `1px solid ${r.ok ? 'var(--s-line)' : 'rgba(255,107,107,0.3)'}`,
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: r.ok ? 'var(--s-teal)' : 'var(--s-coral)', color: r.ok ? '#04201E' : '#fff', fontWeight: 800,
                  }}>{r.ok ? '✓' : '✕'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--s-text)' }}>{r.q}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--s-text-soft)', marginTop: 2 }}>
                      Your answer: <span style={{ color: r.ok ? 'var(--s-teal)' : 'var(--s-coral)' }}>{r.your}</span>
                      {!r.ok && <> · Correct: <span style={{ color: 'var(--s-teal)' }}>{r.right}</span></>}
                    </div>
                  </div>
                  {!r.ok && <button className="s-btn ghost" style={{ fontSize: 13, padding: '8px 16px' }}>Explain</button>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TabletFrame>
  );
}

// ── SENIOR ACHIEVEMENTS ──────────────────────────────────────────
function SeniorAchievementsScreen() {
  const badges = [
    { icon: '🔥', name: 'On Fire', sub: '10-day streak', done: true, accent: 'var(--s-amber)' },
    { icon: '⚡', name: 'Speedster', sub: 'Quiz under 2 min', done: true, accent: 'var(--s-teal)' },
    { icon: '🎯', name: 'Sharpshooter', sub: '100% on a set', done: true, accent: 'var(--s-indigo)' },
    { icon: '📐', name: 'Fraction Boss', sub: 'Finish fractions', done: false, accent: 'var(--s-violet)', pct: 0.7 },
    { icon: '🧠', name: 'Deep Thinker', sub: '500 questions', done: false, accent: 'var(--s-lime)', pct: 0.44 },
    { icon: '🌍', name: 'Explorer', sub: 'Try all subjects', done: false, accent: 'var(--s-coral)', pct: 0.5 },
    { icon: '🏆', name: 'Champion', sub: 'Reach level 20', done: false, accent: 'var(--s-amber)', pct: 0.7 },
    { icon: '💎', name: 'Perfectionist', sub: '5 perfect sets', done: false, accent: 'var(--s-teal)', pct: 0.2 },
  ];
  return (
    <TabletFrame screenLabel="31 Senior · Achievements" screenBg="#0F1B2D">
      <div className="senior tablet" style={{ background: 'transparent' }}>
        <div className="s-backdrop" />
        <div style={{ position: 'absolute', inset: 0, padding: '30px 40px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="s-icon">←</button>
            <div className="s-display" style={{ fontSize: 30, flex: 1 }}>Achievements</div>
            <div className="s-chip"><span style={{ color: 'var(--s-teal)' }}>◆</span> 3 of 8 unlocked</div>
          </div>

          {/* level bar */}
          <div className="s-card raised" style={{ padding: 22, marginTop: 20, display: 'flex', alignItems: 'center', gap: 22 }}>
            <div style={{ width: 66, height: 66, borderRadius: 18, background: 'linear-gradient(135deg,#6C7BFF,#2ED3C6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="s-display" style={{ fontSize: 28, color: '#fff' }}>14</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div className="s-display" style={{ fontSize: 20 }}>Level 14 · Scholar</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--s-text-soft)' }}>3,240 / 3,600 XP</div>
              </div>
              <div className="s-track" style={{ marginTop: 10, height: 10 }}><i style={{ width: '78%' }} /></div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--s-text-quiet)', marginTop: 6 }}>360 XP to Level 15 — unlocks the Champion badge</div>
            </div>
          </div>

          {/* badge grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 18, flex: 1, minHeight: 0 }}>
            {badges.map((b) => (
              <div key={b.name} className="s-card" style={{
                padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, justifyContent: 'center',
                opacity: b.done ? 1 : 0.9, position: 'relative',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
                  background: b.done ? `color-mix(in srgb, ${b.accent} 22%, transparent)` : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${b.done ? b.accent : 'var(--s-line)'}`,
                  filter: b.done ? 'none' : 'grayscale(0.6)',
                }}>{b.done ? b.icon : '🔒'}</div>
                <div className="s-display" style={{ fontSize: 15, textAlign: 'center', color: b.done ? 'var(--s-text)' : 'var(--s-text-soft)' }}>{b.name}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--s-text-quiet)', textAlign: 'center' }}>{b.sub}</div>
                {!b.done && b.pct != null && (
                  <div className="s-track" style={{ width: '80%', height: 6, marginTop: 2 }}><i style={{ width: (b.pct * 100) + '%', background: b.accent }} /></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </TabletFrame>
  );
}

// ── MIDDLE-TIER (8–9) HOME — bridge between junior & senior ───────
function MiddleHomeScreen() {
  const subjects = [
    { name: 'Math', topic: 'Times tables', pct: 0.7, color: 'var(--coral)', dark: 'var(--coral-dark)', icon: '×' },
    { name: 'Reading', topic: 'Chapter books', pct: 0.5, color: 'var(--sky)', dark: 'var(--sky-dark)', icon: 'Aa' },
    { name: 'Science', topic: 'Weather', pct: 0.35, color: 'var(--leaf)', dark: 'var(--leaf-dark)', icon: '🔬' },
    { name: 'Puzzles', topic: 'Logic grids', pct: 0.6, color: 'var(--berry)', dark: 'var(--berry-dark)', icon: '◆' },
  ];
  return (
    <TabletFrame screenLabel="27b Middle · Home" screenBg="#F3EFE7">
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#FFF7E8,#EFEAF6)' }} />
      <div style={{ position: 'absolute', inset: 0, padding: '28px 32px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fff', boxShadow: '0 3px 0 rgba(61,40,24,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
              <Pip size={44} color="berry" />
            </div>
            <div>
              <div className="display" style={{ fontSize: 24, color: 'var(--ink)' }}>Hi, Sam!</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-soft)' }}>Level 9 · Grade 3</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Chip icon="coin" value="480" />
            <div className="chip"><span>🔥</span><span>7</span></div>
            <IconBtn>⚙</IconBtn>
          </div>
        </div>

        {/* daily goal strip */}
        <div className="sticker" style={{ marginTop: 18, padding: 18, display: 'flex', alignItems: 'center', gap: 18, background: '#fff' }}>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: 'var(--sun)', boxShadow: '0 4px 0 var(--sun-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🎯</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span className="display" style={{ fontSize: 18, color: 'var(--ink)' }}>Today's goal — 3 of 5 sets</span>
              <span style={{ fontWeight: 800, color: 'var(--ink-soft)', fontSize: 14 }}>60%</span>
            </div>
            <ProgressBar value={0.6} />
          </div>
          <Btn color="coral">Continue →</Btn>
        </div>

        {/* subject cards — grid, more info than junior, still chunky */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16, marginTop: 18, flex: 1, minHeight: 0 }}>
          {subjects.map((s) => (
            <div key={s.name} className="sticker" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 18, background: '#fff' }}>
              <div style={{ width: 72, height: 72, borderRadius: 18, background: s.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Fredoka', fontWeight: 700, fontSize: 32, boxShadow: `0 5px 0 ${s.dark}` }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div className="display" style={{ fontSize: 24, color: 'var(--ink)' }}>{s.name}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 700 }}>{s.topic}</div>
                <div style={{ marginTop: 10 }}><ProgressBar value={s.pct} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TabletFrame>
  );
}

Object.assign(window, {
  SeniorHomeScreen, SeniorQuizScreen, SeniorResultsScreen, SeniorAchievementsScreen, MiddleHomeScreen,
  SPip, SRing,
});
