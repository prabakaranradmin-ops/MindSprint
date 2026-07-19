// screens-c.jsx — Drag-and-drop sort · Tracing · Matching pairs

function DragDropScreen() {
  return (
    <TabletFrame screenLabel="09 Drag-Drop Sort" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 100%, #C8E6A4 0%, transparent 60%), linear-gradient(180deg, #FFF7E8 0%, #FDE3BE 100%)',
      }}/>
      <TopBar
        left={<><IconBtn>←</IconBtn>
          <div style={{ minWidth: 220 }}>
            <ProgressBar value={0.5} />
            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--ink-soft)', fontWeight: 800 }}>Sort · 2 of 4</div>
          </div>
        </>}
        center={<Chip icon="heart" value="5" />}
        right={<><IconBtn>🔊</IconBtn><IconBtn>⏸</IconBtn></>}
      />

      <div style={{
        position: 'absolute', top: 100, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
      }}>
        <div className="sticker" style={{ padding: '12px 26px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <Pip size={48} color="berry" mood="curious" />
          <div className="display" style={{ fontSize: 26, color: 'var(--ink)' }}>
            Drag each shape into the right basket
          </div>
        </div>
      </div>

      {/* shapes row */}
      <div style={{
        position: 'absolute', top: 200, left: 60, right: 60,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: 140,
      }}>
        {/* small circle */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--coral)', boxShadow: '0 6px 0 var(--coral-dark)',
        }}/>
        {/* large square — being dragged */}
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 130, height: 130, borderRadius: 20,
            background: 'var(--sky)', boxShadow: '0 14px 30px rgba(0,0,0,0.25), 0 8px 0 var(--sky-dark)',
            transform: 'rotate(-6deg) scale(1.05)',
          }}/>
          {/* drag indicator hand */}
          <div style={{
            position: 'absolute', top: -20, right: -10, fontSize: 36,
            transform: 'rotate(20deg)',
          }}>👆</div>
          {/* dotted drag-from outline */}
          <div style={{
            position: 'absolute', top: -10, left: -20,
            width: 130, height: 130, borderRadius: 20,
            border: '3px dashed rgba(61,40,24,0.25)',
          }}/>
        </div>
        {/* small triangle */}
        <div style={{
          width: 0, height: 0,
          borderLeft: '50px solid transparent', borderRight: '50px solid transparent',
          borderBottom: '90px solid var(--leaf)',
          filter: 'drop-shadow(0 6px 0 var(--leaf-dark))',
        }}/>
        {/* large circle */}
        <div style={{
          width: 130, height: 130, borderRadius: '50%',
          background: 'var(--berry)', boxShadow: '0 8px 0 var(--berry-dark)',
        }}/>
      </div>

      {/* baskets */}
      <div style={{
        position: 'absolute', bottom: 60, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-around', padding: '0 60px',
      }}>
        {[
          { label: 'Small', color: 'sun',  icon: '◦' },
          { label: 'Large', color: 'rose', icon: '●' },
        ].map((b, i) => (
          <div key={b.label} style={{
            width: 360, height: 200, borderRadius: 32,
            background: i === 1 ? 'rgba(245,143,168,0.18)' : 'rgba(255,206,82,0.22)',
            border: i === 1 ? '4px dashed var(--rose-dark)' : '4px dashed var(--sun-dark)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
            position: 'relative',
          }}>
            <div className="display" style={{ fontSize: 30, color: 'var(--ink)' }}>{b.label}</div>
            {i === 1 && (
              /* already placed: large square that landed here would be shown */
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  width: 70, height: 70, borderRadius: 12,
                  background: 'var(--berry)', opacity: 0.85,
                }}/>
              </div>
            )}
            {i === 0 && (
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: '50%', background: 'var(--coral)', opacity: 0.85,
                }}/>
              </div>
            )}
          </div>
        ))}
      </div>
    </TabletFrame>
  );
}

function TracingScreen() {
  return (
    <TabletFrame screenLabel="10 Tracing" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, #FFF6E0 0%, var(--cream-50) 70%)',
      }}/>
      <TopBar
        left={<><IconBtn>←</IconBtn>
          <div style={{ minWidth: 220 }}>
            <ProgressBar value={0.66} />
            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--ink-soft)', fontWeight: 800 }}>Letter A · stroke 2 of 3</div>
          </div>
        </>}
        center={<>
          <button style={{
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
            background: '#fff', borderRadius: 999, padding: '10px 18px',
            boxShadow: '0 3px 0 rgba(61,40,24,0.10)',
          }}>
            <span style={{
              width: 32, height: 32, borderRadius: '50%', background: 'var(--sky)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16,
              boxShadow: '0 3px 0 var(--sky-dark)',
            }}>▶</span>
            <span style={{ fontWeight: 800, fontSize: 15 }}>Hear it</span>
          </button>
        </>}
        right={<><IconBtn>🔊</IconBtn><IconBtn>⏸</IconBtn></>}
      />

      {/* big tracing letter */}
      <div style={{
        position: 'absolute', top: 110, left: 60, width: 560, height: 540,
        background: '#fff', borderRadius: 32,
        boxShadow: 'inset 0 0 0 2px var(--cream-200)',
        overflow: 'hidden',
      }}>
        {/* dotted writing guides */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '20%', height: 1, borderTop: '2px dashed var(--cream-200)' }}/>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, borderTop: '2px dashed var(--cream-200)' }}/>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '80%', height: 1, borderTop: '2px dashed var(--cream-200)' }}/>

        {/* letter A as ghost outline + traced stroke */}
        <svg viewBox="0 0 400 440" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {/* left stroke — already traced (solid coral) */}
          <line x1="200" y1="60" x2="80" y2="380" stroke="var(--coral)" strokeWidth="36" strokeLinecap="round" />
          {/* right stroke — ghost, in progress */}
          <line x1="200" y1="60" x2="320" y2="380" stroke="var(--cream-200)" strokeWidth="36" strokeLinecap="round" strokeDasharray="6 14" />
          {/* partial trace on right stroke */}
          <line x1="200" y1="60" x2="252" y2="200" stroke="var(--coral)" strokeWidth="36" strokeLinecap="round" />
          {/* crossbar — ghost */}
          <line x1="140" y1="260" x2="260" y2="260" stroke="var(--cream-200)" strokeWidth="32" strokeLinecap="round" strokeDasharray="6 14" />
          {/* arrow at trace point */}
          <circle cx="252" cy="200" r="16" fill="#fff" stroke="var(--coral-dark)" strokeWidth="4" />
        </svg>

        {/* finger pointer */}
        <div style={{
          position: 'absolute', left: '62%', top: '42%', fontSize: 48,
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
          transform: 'rotate(-10deg)',
        }}>👆</div>

        {/* stars earned this stroke */}
        <div style={{
          position: 'absolute', top: 18, right: 18, display: 'flex', gap: 6,
        }}>
          <span className="star" style={{ width: 32, height: 32 }}/>
          <span className="star empty" style={{ width: 32, height: 32 }}/>
          <span className="star empty" style={{ width: 32, height: 32 }}/>
        </div>
      </div>

      {/* side guidance */}
      <div style={{ position: 'absolute', top: 130, right: 50, width: 320, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="sticker" style={{ padding: 22, background: '#fff' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink-quiet)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Word
          </div>
          <div className="display" style={{ fontSize: 38, color: 'var(--ink)', marginTop: 4 }}>Apple</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
            <Apple size={64} />
            <div style={{ fontFamily: 'Fredoka', fontSize: 20, color: 'var(--ink-soft)' }}>
              starts with <strong style={{ color: 'var(--coral-dark)' }}>A</strong>
            </div>
          </div>
        </div>

        <div className="sticker" style={{ padding: 18, background: '#FFF6E0', display: 'flex', alignItems: 'center', gap: 14 }}>
          <Pip size={70} color="leaf" mood="happy" />
          <div style={{ fontFamily: 'Fredoka', fontSize: 18, color: 'var(--ink)' }}>
            Follow the arrow with your finger!
          </div>
        </div>

        <Btn color="ghost">Skip</Btn>
      </div>
    </TabletFrame>
  );
}

function MatchingScreen() {
  // 3x2 grid of cards, two flipped & matched
  const cards = [
    { face: '🐶', word: 'dog',  state: 'matched',  color: 'leaf' },
    { face: '🐝', word: 'bee',  state: 'face-down' },
    { face: '🐱', word: 'cat',  state: 'face-up',  color: 'coral' },
    { face: '🐰', word: 'rabbit', state: 'face-down' },
    { face: '🦊', word: 'fox',  state: 'face-down' },
    { face: '🐶', word: 'dog',  state: 'matched',  color: 'leaf' },
  ];
  return (
    <TabletFrame screenLabel="11 Matching Pairs" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #E8DCFF 0%, #FFF7E8 100%)',
      }}/>
      <TopBar
        left={<><IconBtn>←</IconBtn>
          <div>
            <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 20, color: 'var(--ink)' }}>Animal sounds</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 800 }}>2 / 3 pairs matched</div>
          </div>
        </>}
        center={<>
          <Chip icon="heart" value="4" />
          <div className="chip" style={{ background: 'var(--sun)', color: 'var(--ink)' }}>
            <span>👆</span><span>4 taps</span>
          </div>
        </>}
        right={<><IconBtn>🔊</IconBtn><IconBtn>⏸</IconBtn></>}
      />

      <div style={{
        position: 'absolute', top: 110, left: 0, right: 0, display: 'flex', justifyContent: 'center',
      }}>
        <div className="sticker" style={{ padding: '10px 24px' }}>
          <div className="display" style={{ fontSize: 22, color: 'var(--ink)' }}>
            Match the pairs!
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 180, left: 80, right: 80, bottom: 60,
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 24,
      }}>
        {cards.map((c, i) => {
          if (c.state === 'face-down') {
            return (
              <div key={i} style={{
                background: 'var(--berry)', borderRadius: 24,
                boxShadow: '0 8px 0 var(--berry-dark), 0 18px 24px -10px rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 60, color: '#fff',
                fontFamily: 'Fredoka', fontWeight: 700,
              }}>?</div>
            );
          }
          const palette = {
            leaf:  ['var(--leaf)',  'var(--leaf-dark)'],
            coral: ['var(--coral)', 'var(--coral-dark)'],
          };
          const [bg, sh] = palette[c.color] || palette.coral;
          return (
            <div key={i} style={{
              background: '#fff', borderRadius: 24,
              boxShadow: c.state === 'matched'
                ? `0 0 0 4px ${bg}, 0 6px 0 ${sh}`
                : `0 6px 0 ${sh}, 0 18px 24px -10px rgba(0,0,0,0.2)`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 8, position: 'relative',
            }}>
              {c.state === 'matched' && (
                <div style={{
                  position: 'absolute', top: -8, right: -8,
                  width: 36, height: 36, borderRadius: '50%', background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 900, fontSize: 18, boxShadow: `0 3px 0 ${sh}`,
                }}>✓</div>
              )}
              <div style={{ fontSize: 80 }}>{c.face}</div>
              <div className="display" style={{ fontSize: 22, color: 'var(--ink)' }}>{c.word}</div>
            </div>
          );
        })}
      </div>
    </TabletFrame>
  );
}

Object.assign(window, { DragDropScreen, TracingScreen, MatchingScreen });
