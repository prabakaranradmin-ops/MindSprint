// screens-a.jsx — Splash, Home (world map), Subjects, Lesson intro

function SplashScreen() {
  return (
    <TabletFrame screenLabel="01 Splash" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, #FFE9B8 0%, transparent 60%), linear-gradient(180deg, #FFF7E8 0%, #FDE3BE 100%)',
      }}/>
      {/* decorative clouds */}
      <div className="cloud" style={{ width: 60, height: 60, top: 80, left: 90 }}/>
      <div className="cloud" style={{ width: 80, height: 80, top: 130, right: 120 }}/>
      <Sun size={120} style={{ position: 'absolute', top: 40, right: 60 }}/>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 28,
      }}>
        {/* logo */}
        <div style={{ textAlign: 'center' }}>
          <div className="display" style={{
            fontSize: 84, color: 'var(--coral)',
            lineHeight: 0.95,
            textShadow: '0 6px 0 var(--coral-dark), 0 14px 24px rgba(225,95,31,0.3)',
            letterSpacing: '-0.02em',
          }}>Bloom</div>
          <div className="display" style={{
            fontSize: 48, color: 'var(--leaf-dark)',
            letterSpacing: '0.18em',
            marginTop: 6,
          }}>ACADEMY</div>
        </div>

        <Pip size={220} color="leaf" wave />

        <Btn size="big" color="leaf">Tap to Play ▶</Btn>
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <button className="chip" style={{ border: 'none', cursor: 'pointer' }}>
            👤 Sign In
          </button>
          <button className="chip" style={{ border: 'none', cursor: 'pointer' }}>
            👨‍👩‍👧 Parents
          </button>
        </div>
      </div>

      {/* ground */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
        background: 'linear-gradient(180deg, transparent, #C8E6A4)',
      }}/>
    </TabletFrame>
  );
}

function HomeMapScreen() {
  return (
    <TabletFrame screenLabel="02 Home Map" screenBg="#DCEFFB">
      <div className="meadow"/>
      {/* clouds */}
      <div className="cloud" style={{ width: 50, height: 50, top: 70, left: 140 }}/>
      <div className="cloud" style={{ width: 70, height: 70, top: 110, left: 460 }}/>
      <div className="cloud" style={{ width: 60, height: 60, top: 60, right: 200 }}/>
      <Sun size={90} style={{ position: 'absolute', top: 50, right: 80 }}/>

      {/* hills */}
      <div className="hill" style={{ width: 320, height: 200, bottom: -60, left: -40 }}/>
      <div className="hill" style={{ width: 380, height: 220, bottom: -80, right: -80, opacity: 0.4 }}/>

      {/* top bar */}
      <div style={{
        position: 'absolute', top: 18, left: 0, right: 0, padding: '0 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 0 rgba(61,40,24,0.10)', overflow: 'hidden', padding: 4,
          }}>
            <Pip size={48} color="berry" />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, color: 'var(--ink)' }}>Mia</div>
            <div style={{ fontFamily: 'Fredoka', fontSize: 14, color: 'var(--ink-soft)' }}>Level 4</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Chip icon="coin" value="124" />
          <Chip icon="heart" value="5" />
          <IconBtn>⚙</IconBtn>
        </div>
      </div>

      {/* winding path */}
      <svg
        viewBox="0 0 1024 720"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <path
          d="M 130 600 Q 280 540 320 460 T 480 340 Q 580 290 620 360 T 760 440 Q 880 470 900 360 T 850 200"
          fill="none"
          stroke="#FFF6E0"
          strokeWidth="44"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 130 600 Q 280 540 320 460 T 480 340 Q 580 290 620 360 T 760 440 Q 880 470 900 360 T 850 200"
          fill="none"
          stroke="#E2A41B"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="2 18"
        />
      </svg>

      {/* nodes */}
      <div className="node done" style={{ left: 130, top: 600 }}><span className="num">1</span></div>
      <div className="node done" style={{ left: 290, top: 470 }}><span className="num">2</span></div>
      <div className="node done" style={{ left: 470, top: 350 }}><span className="num">3</span></div>
      <div className="node current" style={{ left: 640, top: 370 }}>
        4
        <Pip size={64} color="leaf" style={{ position: 'absolute', bottom: '90%', left: '50%', transform: 'translateX(-50%)' }}/>
      </div>
      <div className="node locked" style={{ left: 800, top: 440 }}/>
      <div className="node locked" style={{ left: 870, top: 220 }}/>

      {/* world label */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div className="sticker tilt-l" style={{
          padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 10,
          background: '#fff',
        }}>
          <span style={{ fontSize: 24 }}>🌳</span>
          <div>
            <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 18, color: 'var(--ink)' }}>Meadow World</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 700 }}>3 of 6 stages cleared</div>
          </div>
        </div>
        <Btn color="coral">Continue →</Btn>
      </div>
    </TabletFrame>
  );
}

function SubjectsScreen() {
  const cards = [
    { title: 'Numbers',  sub: 'Counting & add', color: 'coral', icon: '1️⃣', stars: 8,  total: 12, tilt: 'tilt-l' },
    { title: 'Words',    sub: 'Letters & read', color: 'sky',   icon: 'Aa', stars: 5,  total: 10, tilt: 'tilt-r' },
    { title: 'Science',  sub: 'Plants & sky',   color: 'leaf',  icon: '🔬', stars: 2,  total: 8,  tilt: 'tilt-l' },
    { title: 'Music',    sub: 'Sounds & beat',  color: 'berry', icon: '🎵', stars: 0,  total: 6,  tilt: 'tilt-r', locked: true },
  ];
  const palette = {
    coral: ['var(--coral)', 'var(--coral-dark)'],
    sky:   ['var(--sky)',   'var(--sky-dark)'],
    leaf:  ['var(--leaf)',  'var(--leaf-dark)'],
    berry: ['var(--berry)', 'var(--berry-dark)'],
  };
  return (
    <TabletFrame screenLabel="03 Subjects" screenBg="var(--cream-50)">
      <TopBar
        left={<>
          <IconBtn>←</IconBtn>
          <div>
            <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 22, color: 'var(--ink)' }}>Pick a subject</div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 700 }}>What do you want to learn today?</div>
          </div>
        </>}
        right={<><Chip icon="coin" value="124" /><Chip icon="heart" value="5" /></>}
      />

      <div style={{
        position: 'absolute', inset: '110px 40px 40px 40px',
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 28,
      }}>
        {cards.map((c, i) => {
          const [bg, shadow] = palette[c.color];
          return (
            <div key={c.title} className={'sticker ' + c.tilt} style={{
              padding: 24,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              opacity: c.locked ? 0.55 : 1, position: 'relative',
              cursor: c.locked ? 'default' : 'pointer',
            }}>
              {c.locked && (
                <div style={{
                  position: 'absolute', top: 16, right: 16,
                  width: 44, height: 44, borderRadius: '50%', background: 'var(--cream-200)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>🔒</div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{
                  width: 96, height: 96, borderRadius: 24, background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 44, color: '#fff', fontFamily: 'Fredoka', fontWeight: 700,
                  boxShadow: `0 6px 0 ${shadow}`,
                }}>{c.icon}</div>
                <div>
                  <div className="display" style={{ fontSize: 34, color: 'var(--ink)' }}>{c.title}</div>
                  <div style={{ color: 'var(--ink-soft)', fontWeight: 700, fontSize: 16 }}>{c.sub}</div>
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-soft)' }}>
                    {c.stars} / {c.total} stars
                  </span>
                  <span className="star" style={{ width: 24, height: 24 }}/>
                </div>
                <ProgressBar value={c.stars / c.total} />
              </div>
            </div>
          );
        })}
      </div>
    </TabletFrame>
  );
}

function LessonIntroScreen() {
  return (
    <TabletFrame screenLabel="04 Lesson Intro" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 50% at 30% 80%, #FFE9B8 0%, transparent 60%)',
      }}/>
      <TopBar
        left={<><IconBtn>←</IconBtn>
          <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 20, color: 'var(--ink)' }}>
            Numbers · Stage 4
          </div>
        </>}
        right={<><IconBtn>🔊</IconBtn></>}
      />

      <div style={{
        position: 'absolute', left: 60, bottom: 90, display: 'flex', alignItems: 'flex-end', gap: 24,
      }}>
        <Pip size={260} color="leaf" wave />
        <div style={{ marginBottom: 60, maxWidth: 480 }}>
          <Bubble>
            <div className="display" style={{ fontSize: 32, color: 'var(--ink)' }}>
              Let's count apples! 🍎
            </div>
            <div style={{ fontSize: 18, color: 'var(--ink-soft)', marginTop: 4, fontWeight: 700 }}>
              Tap the right number for each tree.
            </div>
          </Bubble>
        </div>
      </div>

      {/* objective card */}
      <div className="sticker" style={{
        position: 'absolute', top: 110, right: 40, width: 280, padding: 22,
        background: '#FFF6E0',
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Today you'll learn
        </div>
        <div className="display" style={{ fontSize: 26, color: 'var(--ink)', marginTop: 6 }}>
          Counting 1 → 10
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14, alignItems: 'center' }}>
          <span className="star" style={{ width: 28, height: 28 }}/>
          <span className="star" style={{ width: 28, height: 28 }}/>
          <span className="star" style={{ width: 28, height: 28 }}/>
          <span style={{ fontWeight: 800, color: 'var(--ink-soft)', marginLeft: 6, fontSize: 14 }}>
            Earn up to 3
          </span>
        </div>
        <div style={{ marginTop: 16, fontSize: 15, color: 'var(--ink-soft)', fontWeight: 700, lineHeight: 1.4 }}>
          ⏱ About 4 minutes
        </div>
      </div>

      <Btn
        size="big" color="coral"
        style={{ position: 'absolute', right: 60, bottom: 60 }}
      >Start ▶</Btn>

      {/* ground */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
        background: 'linear-gradient(180deg, transparent, #C8E6A4)',
      }}/>
    </TabletFrame>
  );
}

Object.assign(window, { SplashScreen, HomeMapScreen, SubjectsScreen, LessonIntroScreen });
