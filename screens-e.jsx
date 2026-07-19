// screens-e.jsx — Subject-themed world maps
// Each subject has its own world: Numbers · Orchard, Words · Forest,
// Science · Lab Garden, Music · Stage. Same node-on-path metaphor, different
// art direction per world so kids feel they're "going somewhere".

function WorldHeader({ title, kicker, accent }) {
  return (
    <div style={{
      position: 'absolute', top: 18, left: 0, right: 0, padding: '0 24px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <IconBtn>←</IconBtn>
        <div className="sticker" style={{ padding: '8px 18px', background: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 32, height: 32, borderRadius: 10, background: accent,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 16,
          }}>{kicker}</span>
          <div>
            <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 18, color: 'var(--ink)' }}>{title}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>World 2 of 6</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <Chip icon="coin" value="124" />
        <Chip icon="heart" value="5" />
        <IconBtn>⚙</IconBtn>
      </div>
    </div>
  );
}

function NumbersOrchardScreen() {
  return (
    <TabletFrame screenLabel="15 World · Numbers Orchard" screenBg="#FFE9B8">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #FFE08A 0%, #FFCE7A 35%, #FFB45C 60%, #FF9A4A 100%)',
      }}/>
      <Sun size={110} style={{ position: 'absolute', top: 60, right: 100 }}/>
      <div className="cloud" style={{ width: 70, height: 70, top: 80, left: 100 }}/>

      {/* trees in background */}
      {[
        [80, 380, 1.0], [200, 460, 0.8], [900, 360, 1.0], [780, 480, 0.9],
      ].map(([x, y, scale], i) => (
        <div key={i} style={{ position: 'absolute', left: x, top: y, transform: `scale(${scale})` }}>
          <div style={{
            position: 'absolute', bottom: 0, left: 30, width: 24, height: 70,
            background: '#8A5A36', borderRadius: 6,
          }}/>
          <div style={{
            position: 'absolute', bottom: 50, left: 0, width: 80, height: 80,
            background: '#6FCB7F', borderRadius: '50%',
            boxShadow: 'inset -8px -8px 0 #3D9E50',
          }}/>
          <Apple size={20} style={{ position: 'absolute', bottom: 70, left: 20 }}/>
          <Apple size={20} style={{ position: 'absolute', bottom: 90, left: 42 }}/>
        </div>
      ))}

      <WorldHeader title="Numbers · Orchard" kicker="1" accent="var(--coral)" />

      <svg viewBox="0 0 1024 720" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <path
          d="M 120 600 Q 250 600 320 510 T 480 380 Q 600 320 660 400 T 820 360 Q 900 320 880 230"
          fill="none" stroke="#FFF6E0" strokeWidth="42" strokeLinecap="round" opacity="0.92"
        />
        <path
          d="M 120 600 Q 250 600 320 510 T 480 380 Q 600 320 660 400 T 820 360 Q 900 320 880 230"
          fill="none" stroke="#E2A41B" strokeWidth="6" strokeLinecap="round" strokeDasharray="2 16"
        />
      </svg>

      {/* nodes: numbered as level + a tiny apple count */}
      <div className="node done" style={{ left: 120, top: 600 }}><span className="num">1</span></div>
      <div className="node done" style={{ left: 270, top: 580 }}><span className="num">2</span></div>
      <div className="node done" style={{ left: 340, top: 470 }}><span className="num">3</span></div>
      <div className="node current" style={{ left: 500, top: 380, background: 'var(--coral)' }}>
        4
        <Pip size={60} color="leaf" mood="happy" style={{ position: 'absolute', bottom: '88%', left: '50%', transform: 'translateX(-50%)' }}/>
      </div>
      <div className="node locked" style={{ left: 660, top: 400 }}/>
      <div className="node locked" style={{ left: 820, top: 360 }}/>
      {/* boss / chest */}
      <div style={{
        position: 'absolute', left: 870 - 50, top: 230 - 50, width: 100, height: 100,
        background: 'var(--sun)', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 50,
        boxShadow: '0 0 0 6px rgba(255,206,82,0.3), 0 8px 0 var(--sun-dark)',
      }}>🎁</div>
      <div style={{ position: 'absolute', left: 870 - 38, top: 330, fontFamily: 'Fredoka', fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>Big Reward</div>

      {/* current level preview */}
      <div className="sticker tilt-l" style={{
        position: 'absolute', bottom: 28, left: 28, padding: '14px 22px',
        background: '#fff', display: 'flex', alignItems: 'center', gap: 14, maxWidth: 360,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, background: 'var(--coral)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Fredoka', fontWeight: 700, fontSize: 26, boxShadow: '0 4px 0 var(--coral-dark)',
        }}>4</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 20, color: 'var(--ink)' }}>Count to 10</div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 700 }}>Tap the right number · 4 min</div>
        </div>
      </div>
      <Btn color="coral" size="big" style={{ position: 'absolute', bottom: 36, right: 36 }}>Play ▶</Btn>
    </TabletFrame>
  );
}

function WordsForestScreen() {
  return (
    <TabletFrame screenLabel="16 World · Words Forest" screenBg="#A8D8E8">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #BCE3F2 0%, #A8D8B0 50%, #6FAD7F 100%)',
      }}/>
      {/* trees - tall conifers behind */}
      {[
        [40, 350, 1.4], [140, 380, 1.0], [240, 360, 1.2],
        [780, 380, 1.1], [880, 360, 1.4], [960, 390, 0.9],
      ].map(([x, y, s], i) => (
        <div key={i} style={{
          position: 'absolute', left: x, top: y, transform: `scale(${s})`, opacity: 0.85,
        }}>
          <div style={{
            position: 'absolute', bottom: 0, left: 26, width: 18, height: 60,
            background: '#5A3F22', borderRadius: 4,
          }}/>
          <div style={{
            position: 'absolute', bottom: 50, left: 0, width: 0, height: 0,
            borderLeft: '36px solid transparent', borderRight: '36px solid transparent',
            borderBottom: '120px solid #3D9E50',
            filter: 'drop-shadow(-3px 0 0 rgba(0,0,0,0.1))',
          }}/>
        </div>
      ))}

      <WorldHeader title="Words · Forest" kicker="Aa" accent="var(--sky)" />

      {/* floating letter signs */}
      {[['B', 220, 200, '-6deg'], ['Cc', 660, 160, '6deg'], ['L', 900, 250, '-4deg']].map(([ch, x, y, rot], i) => (
        <div key={i} style={{
          position: 'absolute', left: x, top: y,
          background: '#fff', padding: '10px 18px', borderRadius: 14,
          fontFamily: 'Fredoka', fontWeight: 700, fontSize: 28, color: 'var(--sky-dark)',
          boxShadow: '0 4px 0 var(--cream-200)',
          transform: `rotate(${rot})`,
        }}>{ch}</div>
      ))}

      <svg viewBox="0 0 1024 720" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <path
          d="M 130 610 Q 230 540 360 540 T 540 470 Q 660 420 700 510 T 880 530 Q 920 470 880 380"
          fill="none" stroke="#F3E8C2" strokeWidth="44" strokeLinecap="round"
        />
        <path
          d="M 130 610 Q 230 540 360 540 T 540 470 Q 660 420 700 510 T 880 530 Q 920 470 880 380"
          fill="none" stroke="#3D9E50" strokeWidth="6" strokeLinecap="round" strokeDasharray="2 18"
        />
      </svg>

      {/* nodes */}
      <div className="node done" style={{ left: 130, top: 610, background: 'var(--sky)' }}><span className="num">1</span></div>
      <div className="node done" style={{ left: 290, top: 540, background: 'var(--sky)' }}><span className="num">2</span></div>
      <div className="node current" style={{ left: 460, top: 510, background: 'var(--sky)', boxShadow: '0 0 0 8px rgba(94,183,232,0.25), 0 8px 0 var(--sky-dark)' }}>
        3
        <Pip size={60} color="berry" style={{ position: 'absolute', bottom: '88%', left: '50%', transform: 'translateX(-50%)' }}/>
      </div>
      <div className="node locked" style={{ left: 640, top: 480 }}/>
      <div className="node locked" style={{ left: 760, top: 520 }}/>
      <div className="node locked" style={{ left: 880, top: 400 }}/>

      <Btn color="sky" size="big" style={{ position: 'absolute', bottom: 36, right: 36 }}>Continue ▶</Btn>

      <div className="sticker" style={{
        position: 'absolute', bottom: 32, left: 28, padding: '12px 20px',
        background: '#fff', display: 'flex', alignItems: 'center', gap: 12, maxWidth: 360,
      }}>
        <div style={{
          width: 50, height: 50, borderRadius: 14, background: 'var(--sky)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Fredoka', fontWeight: 700, fontSize: 24, boxShadow: '0 4px 0 var(--sky-dark)',
        }}>B</div>
        <div>
          <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 18, color: 'var(--ink)' }}>The letter B</div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 700 }}>Sounds & first words</div>
        </div>
      </div>
    </TabletFrame>
  );
}

function ScienceLabScreen() {
  return (
    <TabletFrame screenLabel="17 World · Science Lab" screenBg="#DCEFFB">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #C8DDF5 0%, #E8F0FB 50%, #F8DEB8 100%)',
      }}/>
      {/* science props as floating sticker */}
      <div style={{ position: 'absolute', top: 100, left: 80, fontSize: 60, transform: 'rotate(-10deg)' }}>🧪</div>
      <div style={{ position: 'absolute', top: 160, right: 120, fontSize: 50, transform: 'rotate(15deg)' }}>🔭</div>
      <div style={{ position: 'absolute', bottom: 200, right: 80, fontSize: 56, transform: 'rotate(-8deg)' }}>🌱</div>
      <div style={{ position: 'absolute', bottom: 130, left: 60, fontSize: 50, transform: 'rotate(12deg)' }}>🌍</div>

      <WorldHeader title="Science · Discovery" kicker="🔬" accent="var(--leaf-dark)" />

      <svg viewBox="0 0 1024 720" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <path
          d="M 160 600 Q 320 580 380 460 T 540 380 Q 660 340 720 430 T 880 290"
          fill="none" stroke="#FFF6E0" strokeWidth="42" strokeLinecap="round"
        />
        <path
          d="M 160 600 Q 320 580 380 460 T 540 380 Q 660 340 720 430 T 880 290"
          fill="none" stroke="#3D9E50" strokeWidth="6" strokeLinecap="round" strokeDasharray="2 16"
        />
      </svg>

      <div className="node done" style={{ left: 160, top: 600, background: 'var(--leaf)' }}><span className="num">1</span></div>
      <div className="node done" style={{ left: 340, top: 540, background: 'var(--leaf)' }}><span className="num">2</span></div>
      <div className="node current" style={{ left: 480, top: 420, background: 'var(--leaf)', boxShadow: '0 0 0 8px rgba(111,203,127,0.25), 0 8px 0 var(--leaf-dark)' }}>
        3
        <Pip size={60} color="sky" mood="curious" style={{ position: 'absolute', bottom: '88%', left: '50%', transform: 'translateX(-50%)' }}/>
      </div>
      <div className="node locked" style={{ left: 640, top: 400 }}/>
      <div className="node locked" style={{ left: 760, top: 460 }}/>
      <div className="node locked" style={{ left: 880, top: 290 }}/>

      <div className="sticker tilt-r" style={{
        position: 'absolute', bottom: 30, left: 30, padding: '14px 22px',
        background: '#fff', display: 'flex', alignItems: 'center', gap: 14, maxWidth: 380,
      }}>
        <div style={{ fontSize: 36 }}>🌱</div>
        <div>
          <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 18, color: 'var(--ink)' }}>Plant a seed</div>
          <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 700 }}>Order the steps · 5 min</div>
        </div>
      </div>
      <Btn color="leaf" size="big" style={{ position: 'absolute', bottom: 36, right: 36 }}>Start ▶</Btn>
    </TabletFrame>
  );
}

function MusicStageScreen() {
  return (
    <TabletFrame screenLabel="18 World · Music Stage" screenBg="#3E2A5C">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 20%, #6B4794 0%, #3E2A5C 100%)',
      }}/>
      {/* stage lights */}
      <svg viewBox="0 0 1024 720" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="ml1" x1="50%" y1="0%" x2="20%" y2="100%">
            <stop offset="0%" stopColor="#FFD25E" stopOpacity="0.45"/>
            <stop offset="100%" stopColor="#FFD25E" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="ml2" x1="50%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#F58FA8" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#F58FA8" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polygon points="200,0 0,500 200,500" fill="url(#ml1)"/>
        <polygon points="824,0 1024,500 824,500" fill="url(#ml2)"/>
      </svg>

      {/* floating notes */}
      {['♪', '♫', '♩', '♬'].map((n, i) => {
        const x = [120, 260, 760, 900][i], y = [200, 130, 180, 240][i];
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: y, color: '#FFD25E',
            fontSize: 48, opacity: 0.85,
            transform: `rotate(${i % 2 ? -10 : 12}deg)`,
          }}>{n}</div>
        );
      })}

      {/* world header in light text */}
      <div style={{
        position: 'absolute', top: 18, left: 0, right: 0, padding: '0 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="icon-btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>←</button>
          <div style={{
            padding: '8px 18px', borderRadius: 999,
            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', gap: 10,
            border: '1px solid rgba(255,255,255,0.18)',
          }}>
            <span style={{
              width: 32, height: 32, borderRadius: 10, background: 'var(--rose)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}>🎵</span>
            <div>
              <div style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 18, color: '#fff' }}>Music · Stage</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Locked · Earn 30 stars</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Chip icon="coin" value="124" />
          <Chip icon="heart" value="5" />
        </div>
      </div>

      {/* curtain at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 220,
        background: 'linear-gradient(180deg, #8C2C3C 0%, #5A1A26 100%)',
      }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute', bottom: 0, left: `${i * 12.5 + 6}%`,
            width: '6%', height: '100%', background: 'rgba(0,0,0,0.18)',
            borderRadius: '40% 40% 0 0 / 6% 6% 0 0',
          }}/>
        ))}
      </div>

      {/* big locked stage in center */}
      <div style={{
        position: 'absolute', left: '50%', top: 280, transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
      }}>
        <div style={{
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          border: '4px solid rgba(255,255,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 80,
        }}>🔒</div>
        <div className="display" style={{ fontSize: 36, color: '#fff', textAlign: 'center' }}>
          Coming soon!
        </div>
        <div style={{
          padding: '8px 16px', borderRadius: 999,
          background: 'rgba(255,255,255,0.15)', color: '#FFD25E',
          fontFamily: 'Fredoka', fontWeight: 600, fontSize: 16,
        }}>Earn 30 ⭐ to unlock</div>
        <div style={{ width: 240, marginTop: 4 }}>
          <ProgressBar value={0.5} />
        </div>
        <div style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 800, fontSize: 14 }}>15 / 30 stars</div>
      </div>
    </TabletFrame>
  );
}

Object.assign(window, {
  NumbersOrchardScreen, WordsForestScreen, ScienceLabScreen, MusicStageScreen,
});
