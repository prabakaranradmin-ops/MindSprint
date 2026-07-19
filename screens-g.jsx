// screens-g.jsx — Feedback states (correct / try-again) · Coin shop · Settings

function CorrectFeedbackScreen() {
  return (
    <TabletFrame screenLabel="24 Feedback · Correct" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #DCEFFB 0%, #DCEFFB 50%, #E8F4D4 65%, #C8E6A4 100%)',
        filter: 'brightness(1.02)',
      }}/>
      {/* dimmed activity behind */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(61,40,24,0.25)' }}/>

      {/* celebration card */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        width: 560, background: '#fff', borderRadius: 40, padding: '44px 40px 36px',
        boxShadow: '0 20px 0 rgba(61,40,24,0.12), 0 40px 80px -20px rgba(61,40,24,0.4)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center',
      }}>
        {/* burst ring */}
        <div style={{ position: 'relative', width: 170, height: 170 }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(111,203,127,0.25) 0%, transparent 70%)',
          }}/>
          {['✦', '✧', '✦', '✧', '✦', '✧'].map((s, i) => (
            <div key={i} style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: `rotate(${i * 60}deg) translateY(-95px)`,
              fontSize: 22, color: i % 2 ? 'var(--sun-dark)' : 'var(--leaf-dark)',
            }}>{s}</div>
          ))}
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <Pip size={150} color="leaf" mood="proud" />
          </div>
        </div>
        <div className="display" style={{ fontSize: 46, color: 'var(--leaf-dark)' }}>That's it! 🎉</div>
        <div style={{ fontSize: 19, color: 'var(--ink-soft)', fontWeight: 700 }}>
          7 apples — you counted every one!
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
          <span className="star" style={{ width: 34, height: 34 }}/>
          <span style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 20, color: 'var(--ink)' }}>+1 star</span>
          <span style={{
            width: 26, height: 26, borderRadius: '50%', background: 'var(--sun)',
            boxShadow: 'inset 0 -3px 0 var(--sun-dark)', marginLeft: 12,
          }}/>
          <span style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 20, color: 'var(--ink)' }}>+5 coins</span>
        </div>
        <Btn color="leaf" size="big" style={{ marginTop: 10 }}>Next question →</Btn>
      </div>
    </TabletFrame>
  );
}

function TryAgainFeedbackScreen() {
  return (
    <TabletFrame screenLabel="25 Feedback · Try Again" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #DCEFFB 0%, #DCEFFB 50%, #E8F4D4 65%, #C8E6A4 100%)',
      }}/>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(61,40,24,0.18)' }}/>

      {/* gentle encouragement card — no red, no X, no buzzer imagery */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        width: 560, background: '#fff', borderRadius: 40, padding: '40px 40px 36px',
        boxShadow: '0 20px 0 rgba(61,40,24,0.12), 0 40px 80px -20px rgba(61,40,24,0.4)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center',
      }}>
        <Pip size={140} color="sky" mood="curious" />
        <div className="display" style={{ fontSize: 40, color: 'var(--sky-dark)' }}>So close!</div>
        <div style={{ fontSize: 19, color: 'var(--ink-soft)', fontWeight: 700, lineHeight: 1.45, maxWidth: 400 }}>
          Let's count together this time — tap each apple as we go.
        </div>
        {/* hearts stay visible & unchanged: mistakes don't punish */}
        <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="heart" style={{
              width: 26, height: 26, display: 'inline-block',
              background: 'var(--rose)',
              clipPath: 'path("M13 22s-8-5-8-11.5A4.5 4.5 0 0 1 13 7a4.5 4.5 0 0 1 8 3.5C21 17 13 22 13 22z")',
            }}/>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
          <Btn color="ghost">💡 Show me</Btn>
          <Btn color="sky" size="big">Try again</Btn>
        </div>
      </div>
    </TabletFrame>
  );
}

function ShopScreen() {
  const items = [
    { icon: '👒', name: 'Sun hat',   price: 40,  owned: true },
    { icon: '🎀', name: 'Bow',       price: 40,  owned: false, affordable: true },
    { icon: '🤓', name: 'Glasses',   price: 60,  owned: false, affordable: true },
    { icon: '👑', name: 'Crown',     price: 150, owned: false, affordable: false },
    { icon: '🦸', name: 'Cape',      price: 120, owned: false, affordable: true },
    { icon: '🪄', name: 'Wand',      price: 200, owned: false, affordable: false },
    { icon: '🎩', name: 'Top hat',   price: 90,  owned: false, affordable: true },
    { icon: '🐤', name: 'Pet chick', price: 250, owned: false, affordable: false },
  ];
  return (
    <TabletFrame screenLabel="26 Shop" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #FFE9B8 0%, transparent 55%), var(--cream-50)',
      }}/>
      <TopBar
        left={<><IconBtn>←</IconBtn>
          <div className="display" style={{ fontSize: 26, color: 'var(--ink)' }}>Pip's Shop</div>
        </>}
        right={<>
          <Chip icon="coin" value="124" />
        </>}
      />

      {/* Pip modeling current outfit */}
      <div style={{
        position: 'absolute', left: 50, top: 130, width: 300,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 280, height: 320, background: '#fff', borderRadius: 32,
          boxShadow: '0 8px 0 rgba(61,40,24,0.08)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
          position: 'relative',
        }}>
          <div style={{ position: 'relative' }}>
            <Pip size={190} color="berry" mood="happy" />
            {/* worn hat */}
            <div style={{ position: 'absolute', top: -34, left: '50%', transform: 'translateX(-50%) rotate(-6deg)', fontSize: 56 }}>👒</div>
          </div>
          <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 20, color: 'var(--ink)' }}>Looking good!</div>
        </div>
        <div style={{
          padding: '10px 20px', borderRadius: 999, background: 'var(--cream-100)',
          fontSize: 14, fontWeight: 800, color: 'var(--ink-soft)', textAlign: 'center',
        }}>
          Earn coins by finishing stages ⭐
        </div>
      </div>

      {/* grid */}
      <div style={{
        position: 'absolute', left: 380, right: 44, top: 130, bottom: 40,
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 18,
      }}>
        {items.map((it) => (
          <div key={it.name} style={{
            background: '#fff', borderRadius: 24, padding: 16,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: it.owned
              ? '0 0 0 3px var(--leaf), 0 5px 0 var(--leaf-dark)'
              : '0 5px 0 rgba(61,40,24,0.08)',
            opacity: !it.owned && !it.affordable ? 0.55 : 1,
            position: 'relative',
          }}>
            {it.owned && (
              <div style={{
                position: 'absolute', top: -9, right: -9,
                width: 30, height: 30, borderRadius: '50%', background: 'var(--leaf)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 900, fontSize: 15, boxShadow: '0 2px 0 var(--leaf-dark)',
              }}>✓</div>
            )}
            <div style={{ fontSize: 52, marginTop: 8 }}>{it.icon}</div>
            <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 16, color: 'var(--ink)' }}>{it.name}</div>
            {it.owned ? (
              <div style={{
                padding: '7px 18px', borderRadius: 999, background: 'var(--cream-100)',
                fontFamily: 'Fredoka', fontWeight: 600, fontSize: 14, color: 'var(--ink-soft)',
              }}>Wearing</div>
            ) : (
              <button style={{
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 18px', borderRadius: 999,
                background: it.affordable ? 'var(--sun)' : 'var(--cream-200)',
                boxShadow: it.affordable ? '0 3px 0 var(--sun-dark)' : 'none',
                fontFamily: 'Fredoka', fontWeight: 600, fontSize: 15, color: 'var(--ink)',
              }}>
                <span style={{
                  width: 16, height: 16, borderRadius: '50%',
                  background: it.affordable ? '#fff' : 'var(--sun)',
                  boxShadow: 'inset 0 -2px 0 var(--sun-dark)',
                }}/>
                {it.price}
              </button>
            )}
          </div>
        ))}
      </div>
    </TabletFrame>
  );
}

// CORRECT_ANSWER is the only value that unlocks the parent gate.
// In production, rotate the question each session so kids can't memorise it.
const GATE_QUESTION = 'What is 7 × 4?';
const GATE_CHOICES  = [24, 28, 32];
const GATE_ANSWER   = 28;

function SettingsScreen() {
  // ── kid-facing toggles (live state) ──────────────────────────────────────
  const [toggles, setToggles] = React.useState({
    Music: true, Sounds: true, 'Read aloud': true, 'Lefty mode': false,
  });

  // ── parent gate state ─────────────────────────────────────────────────────
  const [gateUnlocked, setGateUnlocked] = React.useState(false);
  const [wrongAnswer,  setWrongAnswer]  = React.useState(false);
  // dailyLimit for the parent-dashboard section (minutes)
  const [dailyLimit, setDailyLimit]     = React.useState(30);

  function handleToggle(label) {
    setToggles((prev) => {
      const next = { ...prev, [label]: !prev[label] };
      // Wire Sounds toggle → AudioMgr mute (if audio-manager.jsx is loaded)
      if (label === 'Sounds' && window.AudioMgr) {
        window.AudioMgr.setMute(!next[label]);
      }
      return next;
    });
    if (window.AudioMgr) window.AudioMgr.tap();
  }

  function handleGateChoice(n) {
    if (window.AudioMgr) window.AudioMgr.tap();
    if (n === GATE_ANSWER) {
      setGateUnlocked(true);
      setWrongAnswer(false);
      if (window.AudioMgr) setTimeout(() => window.AudioMgr.correct(), 80);
    } else {
      setWrongAnswer(true);
      setTimeout(() => setWrongAnswer(false), 900);
    }
  }

  function handleLockParent() {
    setGateUnlocked(false);
  }

  const kidToggles = [
    { icon: '🎵', label: 'Music' },
    { icon: '🔔', label: 'Sounds' },
    { icon: '🗣️', label: 'Read aloud' },
    { icon: '✋', label: 'Lefty mode' },
  ];

  return (
    <TabletFrame screenLabel="27 Settings" screenBg="var(--cream-50)">
      <TopBar
        left={<><IconBtn>←</IconBtn>
          <div className="display" style={{ fontSize: 26, color: 'var(--ink)' }}>Settings</div>
        </>}
      />

      {/* kid settings — icon-first, giant toggles */}
      <div style={{
        position: 'absolute', left: 60, top: 120, width: 500,
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-quiet)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>For you</div>
        {kidToggles.map((s) => {
          const on = toggles[s.label];
          return (
            <div key={s.label}
              onClick={() => handleToggle(s.label)}
              style={{
                background: '#fff', borderRadius: 22, padding: '16px 22px',
                display: 'flex', alignItems: 'center', gap: 16,
                boxShadow: '0 4px 0 rgba(61,40,24,0.07)',
                cursor: 'pointer',
              }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16, background: 'var(--cream-100)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
              }}>{s.icon}</div>
              <div style={{ flex: 1, fontFamily: 'Fredoka', fontWeight: 600, fontSize: 22, color: 'var(--ink)' }}>{s.label}</div>
              <div style={{
                width: 72, height: 40, borderRadius: 999,
                background: on ? 'var(--leaf)' : 'var(--cream-200)',
                position: 'relative',
                transition: 'background 0.15s',
                boxShadow: on ? 'inset 0 3px 0 rgba(0,0,0,0.08)' : 'inset 0 3px 0 rgba(61,40,24,0.06)',
              }}>
                <div style={{
                  position: 'absolute', top: 4, left: on ? 36 : 4,
                  width: 32, height: 32, background: '#fff', borderRadius: '50%',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                  transition: 'left 0.15s',
                }}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* parent gate / dashboard — right column */}
      <div style={{
        position: 'absolute', right: 60, top: 120, width: 380,
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-quiet)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Grown-ups only</div>

        {!gateUnlocked ? (
          /* ── LOCKED STATE ─────────────────────────────────────────────── */
          <div style={{
            background: 'var(--ink)', borderRadius: 26, padding: 26, color: '#fff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
              }}>🔐</div>
              <div>
                <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 20 }}>Parent zone</div>
                <div style={{ fontSize: 13, opacity: 0.7, fontWeight: 700 }}>Progress, limits &amp; account</div>
              </div>
            </div>
            <div style={{
              marginTop: 20, background: 'rgba(255,255,255,0.1)', borderRadius: 18, padding: 18, textAlign: 'center',
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, opacity: 0.85 }}>To enter, tap the answer:</div>
              <div className="display" style={{ fontSize: 28, marginTop: 8 }}>{GATE_QUESTION}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'center' }}>
                {GATE_CHOICES.map((n) => (
                  <div key={n}
                    onClick={() => handleGateChoice(n)}
                    style={{
                      padding: '10px 22px', borderRadius: 14,
                      background: wrongAnswer ? 'rgba(255,100,80,0.35)' : 'rgba(255,255,255,0.15)',
                      fontFamily: 'Fredoka', fontWeight: 600, fontSize: 20,
                      cursor: 'pointer',
                      transition: 'background 0.15s, transform 0.08s',
                      transform: wrongAnswer ? 'translateX(3px)' : 'none',
                    }}>{n}</div>
                ))}
              </div>
              {wrongAnswer && (
                <div style={{ fontSize: 13, opacity: 0.8, marginTop: 10, color: '#FFB8B0' }}>
                  Try again — hint: 7 groups of 4
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── UNLOCKED — parent dashboard preview ─────────────────────── */
          <div style={{
            background: '#F7F3EE', borderRadius: 26, padding: 24,
            boxShadow: '0 6px 0 rgba(61,40,24,0.08)',
          }}>
            {/* header with lock button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, background: 'var(--leaf)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                  boxShadow: '0 3px 0 var(--leaf-dark)',
                }}>✓</div>
                <div>
                  <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 18, color: 'var(--ink)' }}>Parent zone</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-quiet)', fontWeight: 700 }}>COPPA compliant · no ads · no chat</div>
                </div>
              </div>
              <button onClick={handleLockParent} style={{
                border: 'none', background: 'var(--cream-200)', borderRadius: 10,
                padding: '6px 12px', fontSize: 12, fontWeight: 800, color: 'var(--ink-soft)',
                cursor: 'pointer',
              }}>🔒 Lock</button>
            </div>

            {/* quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              {[
                { label: 'Today', value: '18 min' },
                { label: 'Stages', value: '12 done' },
                { label: 'Stars',  value: '36 ⭐' },
                { label: 'Streak', value: '5 days 🔥' },
              ].map((s) => (
                <div key={s.label} style={{
                  background: '#fff', borderRadius: 14, padding: '10px 14px',
                  boxShadow: '0 2px 0 rgba(61,40,24,0.06)',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-quiet)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                  <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 20, color: 'var(--ink)', marginTop: 2 }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* daily limit control */}
            <div style={{
              background: '#fff', borderRadius: 14, padding: '12px 16px',
              boxShadow: '0 2px 0 rgba(61,40,24,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)' }}>Daily limit</div>
                <div style={{ fontSize: 11, color: 'var(--ink-quiet)', fontWeight: 700 }}>App stops after limit</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => setDailyLimit(l => Math.max(10, l - 10))} style={{
                  width: 32, height: 32, borderRadius: '50%', border: 'none',
                  background: 'var(--cream-100)', fontFamily: 'Fredoka', fontWeight: 700, fontSize: 18,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>−</button>
                <div style={{ fontFamily: 'Fredoka', fontWeight: 700, fontSize: 20, color: 'var(--ink)', minWidth: 60, textAlign: 'center' }}>
                  {dailyLimit} min
                </div>
                <button onClick={() => setDailyLimit(l => Math.min(120, l + 10))} style={{
                  width: 32, height: 32, borderRadius: '50%', border: 'none',
                  background: 'var(--coral)', color: '#fff', fontFamily: 'Fredoka', fontWeight: 700, fontSize: 18,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 3px 0 var(--coral-dark)',
                }}>+</button>
              </div>
            </div>

            {/* COPPA trust note */}
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--ink-quiet)', fontWeight: 700, lineHeight: 1.5, textAlign: 'center' }}>
              No advertising SDKs · No PII collected · COPPA §312.4 compliant<br/>
              External links (if any) open outside the app after this gate.
            </div>
          </div>
        )}

        <div style={{
          background: '#fff', borderRadius: 22, padding: '16px 22px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 4px 0 rgba(61,40,24,0.07)',
        }}>
          <Pip size={54} color="leaf" />
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 700, lineHeight: 1.4 }}>
            No ads · no in-app chat · COPPA friendly. Grown-up areas sit behind the math gate.
          </div>
        </div>
      </div>
    </TabletFrame>
  );
}

Object.assign(window, {
  CorrectFeedbackScreen, TryAgainFeedbackScreen, ShopScreen, SettingsScreen,
});
