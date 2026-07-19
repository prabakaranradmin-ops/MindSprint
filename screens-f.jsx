// screens-f.jsx — Subject-specific activity types
// Numbers · Addition with blocks · drag blocks into the sum box
// Words   · Word builder · drag letters into a slotted word
// Science · Plant lifecycle · order the stages
// Music   · Rhythm tap · tap on the beat
// Shapes  · Pattern complete · what comes next?

function AdditionBlocksScreen() {
  return (
    <TabletFrame screenLabel="19 Math · Addition Blocks" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #FFF7E8 0%, #FDE3BE 60%, #E8C9B5 100%)',
      }}/>
      <TopBar
        left={<><IconBtn>←</IconBtn>
          <div style={{ minWidth: 220 }}>
            <ProgressBar value={0.4} />
            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--ink-soft)', fontWeight: 800 }}>Addition · 2 of 5</div>
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
          <Pip size={48} color="leaf" mood="curious" />
          <div className="display" style={{ fontSize: 26, color: 'var(--ink)' }}>
            Make the sum
          </div>
        </div>
      </div>

      {/* equation row */}
      <div style={{
        position: 'absolute', top: 200, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30,
        fontFamily: 'Fredoka', fontWeight: 700,
      }}>
        {/* 3 blocks group */}
        <div style={{
          background: '#fff', borderRadius: 22, padding: 18,
          display: 'flex', gap: 8, alignItems: 'center',
          boxShadow: '0 4px 0 rgba(61,40,24,0.08)',
        }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{
              width: 50, height: 50, borderRadius: 10, background: 'var(--coral)',
              boxShadow: '0 4px 0 var(--coral-dark)',
            }}/>
          ))}
        </div>
        <div style={{ fontSize: 70, color: 'var(--ink)' }}>+</div>
        <div style={{
          background: '#fff', borderRadius: 22, padding: 18,
          display: 'flex', gap: 8, alignItems: 'center',
          boxShadow: '0 4px 0 rgba(61,40,24,0.08)',
        }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} style={{
              width: 50, height: 50, borderRadius: 10, background: 'var(--sky)',
              boxShadow: '0 4px 0 var(--sky-dark)',
            }}/>
          ))}
        </div>
        <div style={{ fontSize: 70, color: 'var(--ink)' }}>=</div>
        {/* answer slot */}
        <div style={{
          background: '#FFF6E0', borderRadius: 22, padding: 18,
          border: '4px dashed var(--sun-dark)',
          minWidth: 280, height: 92,
          display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-start',
        }}>
          {/* 3 blocks dropped */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{
              width: 50, height: 50, borderRadius: 10, background: 'var(--sun)',
              boxShadow: '0 4px 0 var(--sun-dark)',
            }}/>
          ))}
          <div style={{ display: 'flex', gap: 4, marginLeft: 6 }}>
            <div style={{ width: 50, height: 50, borderRadius: 10, background: 'rgba(255,206,82,0.35)', border: '2px dashed var(--sun-dark)' }}/>
            <div style={{ width: 50, height: 50, borderRadius: 10, background: 'rgba(255,206,82,0.35)', border: '2px dashed var(--sun-dark)' }}/>
          </div>
        </div>
      </div>

      {/* number choice tray */}
      <div style={{
        position: 'absolute', bottom: 130, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 18,
      }}>
        <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 18, color: 'var(--ink-soft)', alignSelf: 'center' }}>
          Drag blocks →
        </div>
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} style={{
            width: 64, height: 64, borderRadius: 14, background: 'var(--sun)',
            color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Fredoka', fontWeight: 700, fontSize: 30,
            boxShadow: '0 5px 0 var(--sun-dark)',
            transform: n === 2 ? 'translateY(-12px) rotate(-4deg)' : 'none',
            position: 'relative',
          }}>
            {n}
            {n === 2 && (
              <div style={{
                position: 'absolute', top: -22, right: -10, fontSize: 28, transform: 'rotate(15deg)',
              }}>👆</div>
            )}
          </div>
        ))}
      </div>

      <button style={{
        position: 'absolute', bottom: 36, right: 36,
        border: 'none', cursor: 'pointer',
        background: 'var(--cream-200)', color: 'var(--ink-soft)',
        padding: '14px 28px', borderRadius: 999,
        fontFamily: 'Fredoka', fontWeight: 600, fontSize: 20,
        boxShadow: '0 4px 0 rgba(61,40,24,0.08)',
      }}>Check ✓</button>
    </TabletFrame>
  );
}

function WordBuilderScreen() {
  return (
    <TabletFrame screenLabel="20 Words · Builder" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #E8F0FB 0%, #C8DDF5 60%, #A8C8E8 100%)',
      }}/>
      <TopBar
        left={<><IconBtn>←</IconBtn>
          <div style={{ minWidth: 220 }}>
            <ProgressBar value={0.66} />
            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--ink-soft)', fontWeight: 800 }}>Build · 4 of 6</div>
          </div>
        </>}
        center={<Chip icon="heart" value="4" />}
        right={<>
          <button style={{
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            background: '#fff', borderRadius: 999, padding: '10px 16px',
            boxShadow: '0 3px 0 rgba(61,40,24,0.10)',
            fontWeight: 800, fontSize: 14,
          }}>
            <span style={{
              width: 28, height: 28, borderRadius: '50%', background: 'var(--sky)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              boxShadow: '0 2px 0 var(--sky-dark)',
            }}>▶</span>
            Hear word
          </button>
          <IconBtn>⏸</IconBtn>
        </>}
      />

      {/* image clue */}
      <div style={{
        position: 'absolute', top: 130, left: 80, width: 280, height: 240,
        background: '#fff', borderRadius: 28, padding: 20,
        boxShadow: '0 8px 0 rgba(61,40,24,0.08)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
        transform: 'rotate(-3deg)',
      }}>
        {/* cat illustration with primitives */}
        <div style={{ position: 'relative', width: 140, height: 140 }}>
          <div style={{
            position: 'absolute', inset: '20% 10% 0 10%', background: '#F5D9A8',
            borderRadius: '50% 50% 45% 45%',
          }}/>
          {/* ears */}
          <div style={{
            position: 'absolute', top: 10, left: 12, width: 0, height: 0,
            borderLeft: '20px solid transparent', borderRight: '20px solid transparent',
            borderBottom: '34px solid #F5D9A8', transform: 'rotate(-15deg)',
          }}/>
          <div style={{
            position: 'absolute', top: 10, right: 12, width: 0, height: 0,
            borderLeft: '20px solid transparent', borderRight: '20px solid transparent',
            borderBottom: '34px solid #F5D9A8', transform: 'rotate(15deg)',
          }}/>
          {/* eyes */}
          <div style={{ position: 'absolute', top: '55%', left: '32%', width: 10, height: 14, background: 'var(--ink)', borderRadius: '50%' }}/>
          <div style={{ position: 'absolute', top: '55%', right: '32%', width: 10, height: 14, background: 'var(--ink)', borderRadius: '50%' }}/>
          {/* nose */}
          <div style={{ position: 'absolute', top: '72%', left: '46%', width: 12, height: 8, background: 'var(--rose)', borderRadius: '40%' }}/>
        </div>
        <div className="display" style={{ fontSize: 22, color: 'var(--ink-soft)' }}>A cat!</div>
      </div>

      {/* word slots */}
      <div style={{
        position: 'absolute', top: 180, left: 420, right: 60,
        display: 'flex', alignItems: 'center', gap: 22, justifyContent: 'center',
      }}>
        {/* Slot C - filled */}
        {[
          { letter: 'C', filled: true,  color: 'sky' },
          { letter: 'A', filled: true,  color: 'sky' },
          { letter: '_', filled: false, color: null },
        ].map((s, i) => (
          <div key={i} style={{
            width: 110, height: 130, borderRadius: 22,
            background: s.filled ? 'var(--sky)' : 'var(--cream-100)',
            color: s.filled ? '#fff' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Fredoka', fontWeight: 700, fontSize: 76,
            boxShadow: s.filled
              ? '0 6px 0 var(--sky-dark)'
              : 'inset 0 0 0 4px rgba(61,40,24,0.15), 0 2px 0 rgba(61,40,24,0.08)',
            border: !s.filled ? '4px dashed rgba(61,40,24,0.25)' : 'none',
            position: 'relative',
          }}>{s.letter}
            {!s.filled && (
              <div style={{
                position: 'absolute', bottom: -28, left: '50%', transform: 'translateX(-50%)',
                fontSize: 11, fontWeight: 800, color: 'var(--ink-soft)', whiteSpace: 'nowrap', letterSpacing: '0.1em',
              }}>DROP HERE</div>
            )}
          </div>
        ))}
      </div>

      {/* draggable letters */}
      <div style={{
        position: 'absolute', bottom: 50, left: 60, right: 60,
        background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)',
        borderRadius: 24, padding: 24,
        display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center',
      }}>
        <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 16, color: 'var(--ink-soft)' }}>
          Pick a letter:
        </div>
        {['B', 'T', 'P', 'R', 'M'].map((ch, i) => (
          <div key={ch} style={{
            width: 72, height: 80, borderRadius: 16,
            background: '#fff', color: 'var(--ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Fredoka', fontWeight: 700, fontSize: 38,
            boxShadow: '0 5px 0 var(--cream-200)',
            transform: ch === 'T' ? 'translateY(-16px) rotate(-6deg) scale(1.08)' : 'none',
            position: 'relative',
            border: ch === 'T' ? '3px solid var(--sky)' : 'none',
          }}>{ch}
            {ch === 'T' && (
              <div style={{
                position: 'absolute', top: -28, right: -14, fontSize: 28, transform: 'rotate(20deg)',
              }}>👆</div>
            )}
          </div>
        ))}
      </div>
    </TabletFrame>
  );
}

function PlantLifecycleScreen() {
  // Order plant lifecycle stages: seed → sprout → plant → flower
  return (
    <TabletFrame screenLabel="21 Science · Lifecycle" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #DCEFFB 0%, #E8F4D4 60%, #C8E6A4 100%)',
      }}/>
      <TopBar
        left={<><IconBtn>←</IconBtn>
          <div style={{ minWidth: 220 }}>
            <ProgressBar value={0.33} />
            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--ink-soft)', fontWeight: 800 }}>Plants · 1 of 3</div>
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
          <Pip size={48} color="leaf" mood="curious" />
          <div className="display" style={{ fontSize: 26, color: 'var(--ink)' }}>
            How does a flower grow?
          </div>
        </div>
      </div>

      {/* timeline */}
      <div style={{
        position: 'absolute', top: 220, left: 60, right: 60, height: 280,
      }}>
        {/* horizontal line */}
        <div style={{
          position: 'absolute', top: '50%', left: 60, right: 60, height: 6,
          background: 'var(--cream-200)', borderRadius: 6,
        }}/>
        {/* arrows between slots */}
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            left: 60 + (i + 1) * ((1024 - 60 - 60 - 120) / 4) + 100, fontSize: 28, color: 'var(--leaf-dark)',
            fontWeight: 900,
          }}>→</div>
        ))}

        {/* 4 slot positions */}
        {[
          { i: 0, label: 'First', filled: true,  card: '🌰', name: 'Seed' },
          { i: 1, label: '',      filled: true,  card: '🌱', name: 'Sprout' },
          { i: 2, label: '',      filled: false, card: null, name: null },
          { i: 3, label: 'Last',  filled: false, card: null, name: null },
        ].map((s, idx) => {
          const total = 4;
          const usable = 1024 - 60 - 60 - 120;
          const left = 60 + 60 + (idx * usable / (total - 1));
          return (
            <div key={idx} style={{
              position: 'absolute', top: 30, left: left - 70, width: 140,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}>
              <div style={{
                width: 130, height: 160, borderRadius: 24,
                background: s.filled ? '#fff' : 'rgba(255,255,255,0.4)',
                border: s.filled ? 'none' : '4px dashed rgba(61,40,24,0.25)',
                boxShadow: s.filled ? '0 5px 0 rgba(61,40,24,0.10)' : 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                {s.filled && <>
                  <div style={{ fontSize: 64 }}>{s.card}</div>
                  <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 16, color: 'var(--ink)' }}>{s.name}</div>
                </>}
              </div>
              {s.label && (
                <div style={{
                  padding: '4px 12px', borderRadius: 999,
                  background: 'var(--leaf)', color: '#fff',
                  fontFamily: 'Fredoka', fontWeight: 700, fontSize: 13,
                  boxShadow: '0 2px 0 var(--leaf-dark)',
                }}>{s.label}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* tray with remaining cards */}
      <div style={{
        position: 'absolute', bottom: 30, left: 60, right: 60,
        background: 'rgba(255,255,255,0.7)', borderRadius: 24, padding: 18,
        display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center',
      }}>
        <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 16, color: 'var(--ink-soft)' }}>
          Drag to finish the line:
        </div>
        {[
          { icon: '🌼', name: 'Flower' },
          { icon: '🌿', name: 'Plant' },
        ].map((c, i) => (
          <div key={i} style={{
            width: 130, height: 140, borderRadius: 22, background: '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
            boxShadow: '0 5px 0 rgba(61,40,24,0.10)',
            transform: i === 1 ? 'translateY(-12px) rotate(-4deg) scale(1.05)' : 'none',
            position: 'relative',
          }}>
            <div style={{ fontSize: 58 }}>{c.icon}</div>
            <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{c.name}</div>
            {i === 1 && (
              <div style={{ position: 'absolute', top: -22, right: -18, fontSize: 28, transform: 'rotate(15deg)' }}>👆</div>
            )}
          </div>
        ))}
      </div>
    </TabletFrame>
  );
}

function RhythmTapScreen() {
  return (
    <TabletFrame screenLabel="22 Music · Rhythm" screenBg="#3E2A5C">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, #7B57A6 0%, #3E2A5C 100%)',
      }}/>

      <div style={{
        position: 'absolute', top: 18, left: 0, right: 0, padding: '0 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="icon-btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>←</button>
          <div style={{ minWidth: 220 }}>
            <div style={{ height: 12, background: 'rgba(255,255,255,0.18)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: '55%', height: '100%', background: 'linear-gradient(90deg, #FFD25E, #F58FA8)', borderRadius: 999 }}/>
            </div>
            <div style={{ marginTop: 4, fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 800 }}>Beat 11 / 20</div>
          </div>
        </div>
        <div style={{
          padding: '8px 14px', borderRadius: 999,
          background: 'rgba(255,255,255,0.12)', color: '#fff',
          fontFamily: 'Fredoka', fontWeight: 600, fontSize: 18,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>🎯</span><span>×12 combo</span>
        </div>
      </div>

      {/* score / song title */}
      <div style={{ position: 'absolute', top: 90, left: 0, right: 0, textAlign: 'center' }}>
        <div className="display" style={{ fontSize: 28, color: '#fff' }}>Twinkle Twinkle</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Beginner · ⭐⭐⭐
        </div>
      </div>

      {/* beat lanes — falling notes onto tap pad */}
      <div style={{
        position: 'absolute', top: 160, left: 100, right: 100, bottom: 200,
      }}>
        {[
          { x: 0,   y: 80,  color: 'var(--rose)' },
          { x: 1,   y: 150, color: 'var(--sun)' },
          { x: 2,   y: 220, color: 'var(--leaf)' },
          { x: 3,   y: 290, color: 'var(--sky)' },
          { x: 0,   y: 60,  color: 'var(--rose)', ghost: true },
          { x: 2,   y: 30,  color: 'var(--leaf)', ghost: true },
        ].map((n, i) => {
          const w = (1024 - 200) / 4;
          return (
            <div key={i} style={{
              position: 'absolute', left: n.x * w + (w/2) - 38, top: n.y,
              width: 76, height: 76, borderRadius: '50%',
              background: n.color,
              boxShadow: `0 8px 0 rgba(0,0,0,0.25)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 34, color: 'rgba(255,255,255,0.9)',
              opacity: n.ghost ? 0.4 : 1,
              transform: n.ghost ? 'scale(0.85)' : 'scale(1)',
            }}>♪</div>
          );
        })}
      </div>

      {/* tap pads */}
      <div style={{
        position: 'absolute', bottom: 60, left: 100, right: 100,
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
      }}>
        {['var(--rose)', 'var(--sun)', 'var(--leaf)', 'var(--sky)'].map((c, i) => (
          <div key={i} style={{
            height: 110, borderRadius: 20,
            background: c,
            opacity: i === 0 ? 1 : 0.45,
            boxShadow: i === 0
              ? `0 0 0 4px rgba(255,255,255,0.5), 0 6px 0 rgba(0,0,0,0.3)`
              : `0 6px 0 rgba(0,0,0,0.3)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Fredoka', fontWeight: 700, fontSize: 26, color: '#fff',
            position: 'relative',
          }}>
            {i === 0 ? 'TAP!' : ''}
            {i === 0 && (
              <>
                {/* hit ring */}
                <div style={{
                  position: 'absolute', inset: -16, borderRadius: 28,
                  border: '4px solid rgba(255,255,255,0.7)',
                }}/>
              </>
            )}
          </div>
        ))}
      </div>

      {/* hit indicators (above pads) */}
      <div style={{
        position: 'absolute', bottom: 180, left: 100, right: 100,
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
      }}>
        {['', 'Good!', 'Perfect!', ''].map((txt, i) => (
          <div key={i} style={{ textAlign: 'center', height: 26 }}>
            {txt && (
              <div style={{
                display: 'inline-block',
                background: txt === 'Perfect!' ? '#FFD25E' : '#fff',
                color: 'var(--ink)',
                fontFamily: 'Fredoka', fontWeight: 700, fontSize: 16,
                padding: '4px 12px', borderRadius: 999,
                transform: 'translateY(-8px)',
              }}>{txt}</div>
            )}
          </div>
        ))}
      </div>
    </TabletFrame>
  );
}

function PatternCompleteScreen() {
  return (
    <TabletFrame screenLabel="23 Shapes · Pattern" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #FFF7E8 0%, #FDE8E0 100%)',
      }}/>
      <TopBar
        left={<><IconBtn>←</IconBtn>
          <div style={{ minWidth: 220 }}>
            <ProgressBar value={0.5} />
            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--ink-soft)', fontWeight: 800 }}>Patterns · 3 of 6</div>
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
            What comes next?
          </div>
        </div>
      </div>

      {/* pattern strip */}
      <div style={{
        position: 'absolute', top: 220, left: 60, right: 60, height: 140,
        background: '#fff', borderRadius: 28, padding: 22,
        boxShadow: '0 6px 0 rgba(61,40,24,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: 14,
      }}>
        {/* sequence: red circle, blue square, yellow triangle, red circle, blue square, ? */}
        {[
          { type: 'circle', color: 'var(--coral)', shadow: 'var(--coral-dark)' },
          { type: 'square', color: 'var(--sky)',   shadow: 'var(--sky-dark)' },
          { type: 'tri',    color: 'var(--sun)',   shadow: 'var(--sun-dark)' },
          { type: 'circle', color: 'var(--coral)', shadow: 'var(--coral-dark)' },
          { type: 'square', color: 'var(--sky)',   shadow: 'var(--sky-dark)' },
          { type: 'q',      color: null,           shadow: null },
        ].map((p, i) => {
          if (p.type === 'q') {
            return (
              <div key={i} style={{
                width: 92, height: 92, borderRadius: 22,
                background: 'rgba(0,0,0,0.06)',
                border: '4px dashed rgba(61,40,24,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fredoka', fontWeight: 700, fontSize: 44, color: 'var(--ink-quiet)',
              }}>?</div>
            );
          }
          if (p.type === 'circle') return (
            <div key={i} style={{
              width: 90, height: 90, borderRadius: '50%', background: p.color,
              boxShadow: `0 6px 0 ${p.shadow}`,
            }}/>
          );
          if (p.type === 'square') return (
            <div key={i} style={{
              width: 90, height: 90, borderRadius: 18, background: p.color,
              boxShadow: `0 6px 0 ${p.shadow}`,
            }}/>
          );
          if (p.type === 'tri') return (
            <div key={i} style={{
              width: 0, height: 0,
              borderLeft: '46px solid transparent', borderRight: '46px solid transparent',
              borderBottom: `82px solid ${p.color}`,
              filter: `drop-shadow(0 6px 0 ${p.shadow})`,
            }}/>
          );
        })}
      </div>

      {/* answer choices */}
      <div style={{
        position: 'absolute', bottom: 60, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 24,
      }}>
        {[
          { type: 'tri',    color: 'var(--sun)',  shadow: 'var(--sun-dark)' },
          { type: 'circle', color: 'var(--leaf)', shadow: 'var(--leaf-dark)' },
          { type: 'square', color: 'var(--berry)', shadow: 'var(--berry-dark)' },
        ].map((p, i) => (
          <button key={i} style={{
            width: 140, height: 140, borderRadius: 24, background: '#fff', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: i === 0
              ? '0 0 0 4px var(--leaf), 0 6px 0 var(--leaf-dark)'
              : '0 6px 0 rgba(61,40,24,0.10), 0 14px 22px -10px rgba(61,40,24,0.2)',
          }}>
            {p.type === 'circle' && <div style={{ width: 80, height: 80, borderRadius: '50%', background: p.color, boxShadow: `0 5px 0 ${p.shadow}` }}/>}
            {p.type === 'square' && <div style={{ width: 80, height: 80, borderRadius: 16, background: p.color, boxShadow: `0 5px 0 ${p.shadow}` }}/>}
            {p.type === 'tri' && (
              <div style={{
                width: 0, height: 0,
                borderLeft: '40px solid transparent', borderRight: '40px solid transparent',
                borderBottom: `72px solid ${p.color}`,
                filter: `drop-shadow(0 5px 0 ${p.shadow})`,
              }}/>
            )}
          </button>
        ))}
      </div>
    </TabletFrame>
  );
}

Object.assign(window, {
  AdditionBlocksScreen, WordBuilderScreen, PlantLifecycleScreen,
  RhythmTapScreen, PatternCompleteScreen,
});
