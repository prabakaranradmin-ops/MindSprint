// screens-d.jsx — Onboarding: Welcome · Avatar · Learning plan

function WelcomeScreen() {
  return (
    <TabletFrame screenLabel="12 Welcome" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #FFE9B8 0%, #FDE3BE 40%, #C8E6A4 100%)',
      }}/>
      {/* decorative clouds + sun */}
      <Sun size={100} style={{ position: 'absolute', top: 50, right: 60 }}/>
      <div className="cloud" style={{ width: 60, height: 60, top: 100, left: 110 }}/>
      <div className="cloud" style={{ width: 50, height: 50, top: 60, left: 400 }}/>

      {/* step indicator */}
      <div style={{
        position: 'absolute', top: 38, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8,
      }}>
        {[1, 2, 3].map((_, i) => (
          <div key={i} style={{
            width: i === 0 ? 36 : 12, height: 12, borderRadius: 999,
            background: i === 0 ? 'var(--coral)' : 'rgba(61,40,24,0.18)',
            transition: 'all 0.2s',
          }}/>
        ))}
      </div>

      {/* big mascot wave */}
      <div style={{
        position: 'absolute', left: 80, bottom: 60,
      }}>
        <Pip size={320} color="leaf" wave mood="happy" />
      </div>

      {/* welcome panel */}
      <div className="sticker tilt-r" style={{
        position: 'absolute', right: 70, top: 130, width: 440, padding: 36,
        background: '#fff',
      }}>
        <div style={{
          fontSize: 12, fontWeight: 800, color: 'var(--ink-quiet)',
          textTransform: 'uppercase', letterSpacing: '0.12em',
        }}>Welcome, friend!</div>
        <div className="display" style={{ fontSize: 44, color: 'var(--ink)', marginTop: 8, lineHeight: 1.05 }}>
          Hi! I'm Pip.<br/>What's your name?
        </div>

        <div style={{
          marginTop: 26, position: 'relative',
        }}>
          <input
            defaultValue="Mia"
            style={{
              width: '100%', padding: '20px 24px',
              borderRadius: 22, border: '3px solid var(--cream-200)',
              background: 'var(--cream-50)',
              fontFamily: 'Fredoka', fontWeight: 600, fontSize: 32, color: 'var(--ink)',
              outline: 'none',
            }}
          />
          <div style={{
            position: 'absolute', right: 18, top: 18, width: 12, height: 44,
            background: 'var(--coral)', borderRadius: 4,
            animation: 'caretBlink 1s steps(2) infinite',
          }}/>
        </div>

        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, color: 'var(--ink-soft)', fontWeight: 700 }}>
            How old are you?
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[4, 5, 6, 7, 8].map((n) => (
              <div key={n} style={{
                width: 44, height: 44, borderRadius: '50%',
                background: n === 6 ? 'var(--coral)' : '#fff',
                color: n === 6 ? '#fff' : 'var(--ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fredoka', fontWeight: 700, fontSize: 18,
                boxShadow: n === 6
                  ? '0 4px 0 var(--coral-dark)'
                  : '0 2px 0 var(--cream-200), inset 0 0 0 2px var(--cream-200)',
              }}>{n}</div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
          <Btn color="coral" size="big">Hi, Pip! →</Btn>
        </div>
      </div>
    </TabletFrame>
  );
}

function AvatarScreen() {
  return (
    <TabletFrame screenLabel="13 Avatar" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 30%, #E8DCFF 0%, transparent 60%), var(--cream-50)',
      }}/>

      {/* step indicator */}
      <div style={{
        position: 'absolute', top: 38, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8,
      }}>
        {[1, 2, 3].map((_, i) => (
          <div key={i} style={{
            width: i === 1 ? 36 : 12, height: 12, borderRadius: 999,
            background: i <= 1 ? 'var(--coral)' : 'rgba(61,40,24,0.18)',
          }}/>
        ))}
      </div>

      <TopBar
        left={<><IconBtn>←</IconBtn></>}
        right={<>
          <div style={{
            padding: '8px 16px', borderRadius: 999,
            background: '#fff', color: 'var(--ink-soft)',
            fontSize: 14, fontWeight: 800,
            boxShadow: '0 3px 0 rgba(61,40,24,0.08)',
          }}>Step 2 / 3</div>
        </>}
      />

      <div style={{ position: 'absolute', top: 90, left: 0, right: 0, textAlign: 'center' }}>
        <div className="display" style={{ fontSize: 40, color: 'var(--ink)' }}>
          Pick your buddy
        </div>
        <div style={{ fontSize: 18, color: 'var(--ink-soft)', fontWeight: 700, marginTop: 4 }}>
          They'll learn with you on every adventure.
        </div>
      </div>

      {/* big preview */}
      <div style={{
        position: 'absolute', left: 80, top: 200, width: 360, height: 420,
        background: '#fff', borderRadius: 32,
        boxShadow: '0 8px 0 rgba(61,40,24,0.08), 0 22px 36px -12px rgba(61,40,24,0.18)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 24, gap: 14, position: 'relative',
      }}>
        <div style={{
          fontSize: 12, fontWeight: 800, color: 'var(--ink-quiet)',
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>Your buddy</div>
        <Pip size={240} color="berry" mood="proud" />
        <div className="display" style={{ fontSize: 30, color: 'var(--ink)' }}>Pip</div>

        <div style={{
          marginTop: 8, display: 'flex', alignItems: 'center', gap: 14,
          background: 'var(--cream-50)', padding: '10px 18px', borderRadius: 999,
        }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-soft)' }}>Name</span>
          <input
            defaultValue="Pip"
            style={{
              border: 'none', background: 'transparent', outline: 'none',
              fontFamily: 'Fredoka', fontWeight: 600, fontSize: 18, color: 'var(--ink)',
              width: 120, textAlign: 'center',
            }}
          />
          <span style={{ fontSize: 18 }}>✏️</span>
        </div>
      </div>

      {/* choices column */}
      <div style={{
        position: 'absolute', right: 80, top: 200, width: 480,
        display: 'flex', flexDirection: 'column', gap: 18,
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            Color
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {[
              ['leaf',  'var(--leaf)',  'var(--leaf-dark)'],
              ['berry', 'var(--berry)', 'var(--berry-dark)'],
              ['sky',   'var(--sky)',   'var(--sky-dark)'],
              ['coral', 'var(--coral)', 'var(--coral-dark)'],
              ['sun',   'var(--sun)',   'var(--sun-dark)'],
            ].map(([key, bg, sh], i) => (
              <div key={key} style={{
                width: 78, height: 78, borderRadius: 22,
                background: bg, boxShadow: `0 5px 0 ${sh}`,
                position: 'relative',
                outline: i === 1 ? '4px solid var(--ink)' : 'none', outlineOffset: 4,
              }}>
                {i === 1 && (
                  <div style={{
                    position: 'absolute', top: -10, right: -10,
                    width: 32, height: 32, borderRadius: '50%', background: 'var(--ink)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900,
                  }}>✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            Accessory
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'None',     icon: '✕',  active: false },
              { label: 'Sun hat',  icon: '👒', active: true },
              { label: 'Glasses',  icon: '🤓', active: false },
              { label: 'Bow',      icon: '🎀', active: false },
              { label: 'Crown',    icon: '👑', active: false, locked: true },
              { label: 'Cape',     icon: '🦸', active: false, locked: true },
              { label: 'Wand',     icon: '🪄', active: false, locked: true },
              { label: 'Pet',      icon: '🐤', active: false, locked: true },
            ].map((opt) => (
              <div key={opt.label} style={{
                background: '#fff', borderRadius: 18, padding: 12,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                boxShadow: opt.active
                  ? '0 0 0 3px var(--coral), 0 4px 0 var(--coral-dark)'
                  : '0 3px 0 rgba(61,40,24,0.08)',
                opacity: opt.locked ? 0.5 : 1,
                position: 'relative',
              }}>
                {opt.locked && (
                  <div style={{
                    position: 'absolute', top: 4, right: 4, fontSize: 12,
                  }}>🔒</div>
                )}
                <div style={{ fontSize: 30 }}>{opt.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-soft)' }}>{opt.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <button style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            fontFamily: 'Fredoka', fontWeight: 600, fontSize: 18, color: 'var(--ink-soft)',
          }}>↺ Surprise me</button>
          <Btn color="coral" size="big">Looks great! →</Btn>
        </div>
      </div>
    </TabletFrame>
  );
}

function LearningPlanScreen() {
  const subjects = [
    { title: 'Numbers', sub: 'Count, add, subtract', icon: '1️⃣', color: 'coral', checked: true },
    { title: 'Words',   sub: 'Letters, phonics',    icon: 'Aa', color: 'sky',   checked: true },
    { title: 'Shapes',  sub: 'Patterns, sort',      icon: '◆',  color: 'leaf',  checked: true },
    { title: 'Science', sub: 'Plants, weather',     icon: '🔬', color: 'berry', checked: false },
    { title: 'Music',   sub: 'Beat, sounds',        icon: '🎵', color: 'rose',  checked: false },
    { title: 'World',   sub: 'Animals, places',     icon: '🌍', color: 'sun',   checked: false },
  ];
  return (
    <TabletFrame screenLabel="14 Learning Plan" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 100%, #DCEFFB 0%, transparent 60%), var(--cream-50)',
      }}/>

      <div style={{
        position: 'absolute', top: 38, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8,
      }}>
        {[1, 2, 3].map((_, i) => (
          <div key={i} style={{
            width: i === 2 ? 36 : 12, height: 12, borderRadius: 999,
            background: 'var(--coral)',
          }}/>
        ))}
      </div>

      <TopBar
        left={<><IconBtn>←</IconBtn></>}
        right={<>
          <div style={{
            padding: '8px 16px', borderRadius: 999,
            background: '#fff', color: 'var(--ink-soft)', fontSize: 14, fontWeight: 800,
            boxShadow: '0 3px 0 rgba(61,40,24,0.08)',
          }}>Step 3 / 3</div>
        </>}
      />

      <div style={{ position: 'absolute', top: 90, left: 0, right: 0, textAlign: 'center' }}>
        <div className="display" style={{ fontSize: 40, color: 'var(--ink)' }}>What sounds fun?</div>
        <div style={{ fontSize: 18, color: 'var(--ink-soft)', fontWeight: 700, marginTop: 4 }}>
          Pick at least 2 — you can change these anytime.
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 200, left: 60, right: 60, bottom: 110,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20,
      }}>
        {subjects.map((s) => {
          const palette = {
            coral: ['var(--coral)', 'var(--coral-dark)'],
            sky:   ['var(--sky)',   'var(--sky-dark)'],
            leaf:  ['var(--leaf)',  'var(--leaf-dark)'],
            berry: ['var(--berry)', 'var(--berry-dark)'],
            rose:  ['var(--rose)',  'var(--rose-dark)'],
            sun:   ['var(--sun)',   'var(--sun-dark)'],
          };
          const [bg, sh] = palette[s.color];
          return (
            <div key={s.title} style={{
              background: '#fff', borderRadius: 26, padding: 22,
              display: 'flex', alignItems: 'center', gap: 16,
              boxShadow: s.checked
                ? `0 0 0 4px ${bg}, 0 6px 0 ${sh}`
                : '0 5px 0 rgba(61,40,24,0.08), 0 14px 22px -10px rgba(61,40,24,0.15)',
              position: 'relative',
              cursor: 'pointer',
            }}>
              {s.checked && (
                <div style={{
                  position: 'absolute', top: -10, right: -10,
                  width: 36, height: 36, borderRadius: '50%', background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 900, fontSize: 18, boxShadow: `0 3px 0 ${sh}`,
                }}>✓</div>
              )}
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: bg, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fredoka', fontWeight: 700, fontSize: 28,
                boxShadow: `0 4px 0 ${sh}`,
              }}>{s.icon}</div>
              <div>
                <div className="display" style={{ fontSize: 22, color: 'var(--ink)' }}>{s.title}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 700 }}>{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute', bottom: 28, left: 60, right: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Pip size={70} color="leaf" mood="happy" />
          <div style={{ fontFamily: 'Fredoka', fontSize: 18, color: 'var(--ink)' }}>
            3 picked — great mix!
          </div>
        </div>
        <Btn color="leaf" size="big">Let's go! 🌱</Btn>
      </div>
    </TabletFrame>
  );
}

Object.assign(window, { WelcomeScreen, AvatarScreen, LearningPlanScreen });
