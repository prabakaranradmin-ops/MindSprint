// variations.jsx — three art-direction takes on the splash screen

// V1: Bloom (cozy) — uses the default look
function SplashCozyVariant() {
  return (
    <TabletFrame screenLabel="V1 Cozy" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, #FFE9B8 0%, transparent 60%), linear-gradient(180deg, #FFF7E8 0%, #FDE3BE 100%)',
      }}/>
      <Sun size={110} style={{ position: 'absolute', top: 50, right: 70 }}/>
      <div className="cloud" style={{ width: 60, height: 60, top: 100, left: 110 }}/>
      <div className="cloud" style={{ width: 80, height: 80, top: 130, right: 200 }}/>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="display" style={{
            fontSize: 76, color: 'var(--coral)',
            textShadow: '0 6px 0 var(--coral-dark), 0 14px 24px rgba(225,95,31,0.3)',
            letterSpacing: '-0.02em',
          }}>Bloom</div>
          <div className="display" style={{ fontSize: 36, color: 'var(--leaf-dark)', letterSpacing: '0.18em', marginTop: 4 }}>ACADEMY</div>
        </div>
        <Pip size={200} color="leaf" wave />
        <Btn size="big" color="leaf">Tap to Play ▶</Btn>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
        background: 'linear-gradient(180deg, transparent, #C8E6A4)' }}/>

      <div style={{
        position: 'absolute', top: 14, left: 14,
        padding: '6px 12px', borderRadius: 999,
        background: 'rgba(255,255,255,0.7)',
        fontSize: 11, fontWeight: 800, color: 'var(--ink-soft)', letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>A · Cozy · Sticker</div>
    </TabletFrame>
  );
}

// V2: Bold cartoon — thick outlines, saturated colors, comic burst behind
function SplashBoldVariant() {
  return (
    <TabletFrame screenLabel="V2 Bold" screenBg="#FFE94A">
      {/* radial burst */}
      <svg viewBox="0 0 1024 720" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="bg-bold" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#FFF6A8" />
            <stop offset="100%" stopColor="#FFC93C" />
          </radialGradient>
        </defs>
        <rect width="1024" height="720" fill="url(#bg-bold)"/>
        {/* burst rays */}
        {Array.from({ length: 18 }).map((_, i) => {
          const angle = (i * 360 / 18) * Math.PI / 180;
          const x2 = 512 + Math.cos(angle) * 700;
          const y2 = 320 + Math.sin(angle) * 700;
          return <path key={i} d={`M 512 320 L ${x2} ${y2 - 20} L ${x2 + 30} ${y2 + 30} Z`} fill="#FFB100" opacity="0.5" />;
        })}
      </svg>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20,
      }}>
        {/* bold sticker logo */}
        <div style={{
          background: '#FF3D6E', color: '#fff',
          padding: '14px 36px',
          fontFamily: 'Fredoka', fontWeight: 700, fontSize: 84,
          letterSpacing: '-0.02em',
          border: '6px solid #1a1a1a',
          borderRadius: 18,
          boxShadow: '8px 8px 0 #1a1a1a',
          transform: 'rotate(-4deg)',
          WebkitTextStroke: '1px #1a1a1a',
        }}>BLOOM!</div>
        <div style={{
          background: '#1a1a1a', color: '#FFE94A',
          padding: '6px 24px',
          fontFamily: 'Fredoka', fontWeight: 700, fontSize: 24,
          letterSpacing: '0.2em', borderRadius: 999,
          transform: 'rotate(3deg)',
        }}>ACADEMY</div>

        {/* Pip with bold outline */}
        <div style={{
          filter: 'drop-shadow(4px 0 0 #1a1a1a) drop-shadow(-4px 0 0 #1a1a1a) drop-shadow(0 4px 0 #1a1a1a) drop-shadow(0 -4px 0 #1a1a1a)',
          marginTop: 8,
        }}>
          <Pip size={210} color="leaf" wave mood="happy" />
        </div>

        {/* bold button */}
        <button style={{
          background: '#FF3D6E', color: '#fff',
          padding: '20px 48px', borderRadius: 999,
          border: '5px solid #1a1a1a',
          fontFamily: 'Fredoka', fontWeight: 700, fontSize: 30, letterSpacing: '0.02em',
          boxShadow: '6px 6px 0 #1a1a1a',
          cursor: 'pointer',
        }}>PLAY ▶</button>
      </div>

      <div style={{
        position: 'absolute', top: 14, left: 14,
        padding: '6px 12px', borderRadius: 999,
        background: '#1a1a1a', color: '#FFE94A',
        fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>B · Bold cartoon</div>
    </TabletFrame>
  );
}

// V3: Modern flat — geometric, generous whitespace, soft single accent
function SplashFlatVariant() {
  return (
    <TabletFrame screenLabel="V3 Flat" screenBg="#F5F0E8">
      {/* subtle geometric scaffolding */}
      <svg viewBox="0 0 1024 720" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <circle cx="180" cy="160" r="80" fill="#E8DEC8" />
        <circle cx="880" cy="540" r="120" fill="#D8E8D0" />
        <rect x="780" y="100" width="80" height="80" rx="20" fill="#F0DAA8" transform="rotate(20 820 140)"/>
        <rect x="120" y="540" width="60" height="60" rx="14" fill="#E8C9B5" transform="rotate(-10 150 570)"/>
      </svg>

      {/* top-left wordmark */}
      <div style={{
        position: 'absolute', top: 60, left: 60,
        fontFamily: 'Fredoka', fontWeight: 500, fontSize: 18,
        color: '#7A6754', letterSpacing: '0.18em', textTransform: 'uppercase',
      }}>Bopplebee</div>

      {/* centered content */}
      <div style={{
        position: 'absolute', inset: 0, padding: '0 60px',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        alignItems: 'center', gap: 40,
      }}>
        <div>
          <div style={{
            fontFamily: 'Fredoka', fontWeight: 500, fontSize: 14,
            color: '#9A8770', letterSpacing: '0.16em', textTransform: 'uppercase',
          }}>Learn · Play · Bloom</div>
          <div className="display" style={{
            fontSize: 88, color: '#2E2418', lineHeight: 0.98,
            marginTop: 14, fontWeight: 500, letterSpacing: '-0.02em',
          }}>
            A garden<br/>of <span style={{ color: '#D86B3E' }}>curious</span><br/>minds.
          </div>
          <div style={{
            marginTop: 22, fontSize: 18, color: '#7A6754', fontWeight: 600, maxWidth: 360, lineHeight: 1.4,
          }}>
            Cozy daily lessons in math, words & wonder — built for little explorers.
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 32 }}>
            <button style={{
              background: '#2E2418', color: '#F5F0E8',
              padding: '16px 28px', borderRadius: 14, border: 'none', cursor: 'pointer',
              fontFamily: 'Fredoka', fontWeight: 500, fontSize: 18, letterSpacing: '0.04em',
            }}>Start playing →</button>
            <button style={{
              background: 'transparent', color: '#2E2418',
              padding: '16px 28px', borderRadius: 14,
              border: '2px solid #2E2418', cursor: 'pointer',
              fontFamily: 'Fredoka', fontWeight: 500, fontSize: 18, letterSpacing: '0.04em',
            }}>Parents</button>
          </div>
        </div>

        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* big soft accent circle */}
          <div style={{
            position: 'absolute', width: 420, height: 420, borderRadius: '50%',
            background: '#F4E3CE',
          }}/>
          <Pip size={300} color="leaf" feet={false} mood="curious" />
          {/* annotation tag */}
          <div style={{
            position: 'absolute', right: 20, top: 60,
            padding: '8px 16px', background: '#fff', borderRadius: 12,
            border: '1.5px solid #2E2418',
            fontFamily: 'Fredoka', fontWeight: 500, fontSize: 14, color: '#2E2418',
            transform: 'rotate(6deg)',
          }}>↗ meet Pip</div>
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 14, left: 14,
        padding: '6px 12px', borderRadius: 999,
        background: '#2E2418', color: '#F5F0E8',
        fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>C · Modern flat</div>
    </TabletFrame>
  );
}

// Card linking to the animated splash video
function SplashVideoCard() {
  return (
    <TabletFrame screenLabel="V4 Video" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #FFE9B8 0%, #F58FA8 60%, #B587E0 100%)',
      }}/>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 60,
      }}>
        <div style={{
          width: 120, height: 120, borderRadius: '50%', background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 0 rgba(0,0,0,0.15), 0 24px 40px rgba(0,0,0,0.25)',
        }}>
          <div style={{
            width: 0, height: 0,
            borderLeft: '40px solid var(--coral)',
            borderTop: '26px solid transparent', borderBottom: '26px solid transparent',
            marginLeft: 10,
          }}/>
        </div>
        <div className="display" style={{
          fontSize: 56, color: '#fff', textAlign: 'center', lineHeight: 1,
          textShadow: '0 6px 0 rgba(0,0,0,0.2)',
        }}>
          Animated<br/>splash intro
        </div>
        <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, textAlign: 'center', maxWidth: 440, lineHeight: 1.4 }}>
          A 6-second cinematic open with Pip springing in, the logo blooming, and a bounce on "Play".
        </div>
        <a
          href="splash-video.html" target="_blank" rel="noreferrer"
          style={{
            background: '#fff', color: 'var(--ink)',
            padding: '16px 32px', borderRadius: 999, textDecoration: 'none',
            fontFamily: 'Fredoka', fontWeight: 600, fontSize: 22,
            boxShadow: '0 6px 0 rgba(0,0,0,0.2)',
          }}
        >▶ Open animation</a>
      </div>

      <div style={{
        position: 'absolute', top: 14, left: 14,
        padding: '6px 12px', borderRadius: 999,
        background: 'rgba(0,0,0,0.5)', color: '#fff',
        fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>D · Animated</div>
    </TabletFrame>
  );
}

Object.assign(window, { SplashCozyVariant, SplashBoldVariant, SplashFlatVariant, SplashVideoCard });
