// screens-b.jsx — Math activity, Reading activity, Reward, Parent dashboard

function MathActivityScreen() {
  return (
    <TabletFrame screenLabel="05 Math Activity" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #DCEFFB 0%, #DCEFFB 50%, #E8F4D4 65%, #C8E6A4 100%)',
      }}/>
      <Sun size={70} style={{ position: 'absolute', top: 50, right: 90 }}/>
      <div className="cloud" style={{ width: 50, height: 50, top: 70, left: 80 }}/>
      <div className="cloud" style={{ width: 70, height: 70, top: 50, left: 360 }}/>

      <TopBar
        left={<><IconBtn>←</IconBtn>
          <div style={{ minWidth: 220 }}>
            <ProgressBar value={0.6} />
            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--ink-soft)', fontWeight: 800 }}>Question 3 of 5</div>
          </div>
        </>}
        center={<>
          <Chip icon="heart" value="5" />
          <div className="chip" style={{ background: 'var(--sun)', color: 'var(--ink)' }}>
            <span>⏱</span><span>0:42</span>
          </div>
        </>}
        right={<><IconBtn>🔊</IconBtn><IconBtn>⏸</IconBtn></>}
      />

      {/* prompt */}
      <div style={{
        position: 'absolute', top: 110, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
      }}>
        <div className="sticker" style={{
          padding: '14px 28px', background: '#fff',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <Pip size={48} color="leaf" />
          <div className="display" style={{ fontSize: 28, color: 'var(--ink)' }}>
            How many apples?
          </div>
        </div>
      </div>

      {/* tree with apples */}
      <div style={{ position: 'absolute', top: 200, left: 80, width: 360, height: 320 }}>
        {/* trunk */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: 60, height: 110, background: '#8A5A36', borderRadius: '12px 12px 6px 6px',
          boxShadow: 'inset -8px 0 0 rgba(0,0,0,0.12)',
        }}/>
        {/* canopy */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 320, height: 240, background: 'var(--leaf)',
          borderRadius: '50%',
          boxShadow: 'inset -20px -20px 0 var(--leaf-dark)',
        }}/>
        {/* apples positioned on canopy */}
        {[
          [120, 70], [200, 60], [80, 130], [220, 140],
          [170, 100], [260, 100], [60, 60],
        ].map(([x, y], i) => (
          <Apple key={i} size={56} style={{ position: 'absolute', left: x, top: y }} />
        ))}
      </div>

      {/* answer choices */}
      <div style={{
        position: 'absolute', right: 60, top: 230, display: 'flex', flexDirection: 'column', gap: 18,
      }}>
        {[5, 7, 9].map((n, i) => {
          const colors = ['sky', 'coral', 'berry'];
          const palette = {
            sky:   ['var(--sky)',   'var(--sky-dark)'],
            coral: ['var(--coral)', 'var(--coral-dark)'],
            berry: ['var(--berry)', 'var(--berry-dark)'],
          };
          const [bg, sh] = palette[colors[i]];
          return (
            <button key={n} style={{
              border: 'none', cursor: 'pointer',
              width: 320, padding: '22px 28px',
              borderRadius: 28, background: '#fff',
              display: 'flex', alignItems: 'center', gap: 22,
              boxShadow: `0 6px 0 rgba(61,40,24,0.10), 0 14px 22px -8px rgba(61,40,24,0.18)`,
              fontFamily: 'Fredoka', fontWeight: 600, fontSize: 32, color: 'var(--ink)',
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: 18,
                background: bg, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 5px 0 ${sh}`,
                fontSize: 38,
              }}>{n}</div>
              <span>{n === 5 ? 'five' : n === 7 ? 'seven' : 'nine'}</span>
            </button>
          );
        })}
      </div>

      {/* hint */}
      <button style={{
        position: 'absolute', bottom: 30, left: 60,
        border: 'none', cursor: 'pointer', background: 'transparent',
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: 'Fredoka', fontWeight: 600, fontSize: 18, color: 'var(--ink-soft)',
      }}>
        <span style={{
          width: 40, height: 40, borderRadius: '50%', background: 'var(--sun)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 0 var(--sun-dark)', fontSize: 22,
        }}>💡</span>
        Hint
      </button>
    </TabletFrame>
  );
}

function ReadingActivityScreen() {
  return (
    <TabletFrame screenLabel="06 Reading Activity" screenBg="var(--cream-50)">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 60% at 50% 0%, #FFE9B8 0%, transparent 70%)',
      }}/>
      <TopBar
        left={<><IconBtn>←</IconBtn>
          <div style={{ minWidth: 220 }}>
            <ProgressBar value={0.4} />
            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--ink-soft)', fontWeight: 800 }}>Question 2 of 5</div>
          </div>
        </>}
        center={<Chip icon="heart" value="5" />}
        right={<><IconBtn>🔊</IconBtn><IconBtn>⏸</IconBtn></>}
      />

      {/* prompt */}
      <div style={{
        position: 'absolute', top: 100, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14,
      }}>
        <div className="sticker" style={{ padding: '14px 28px', display: 'flex', gap: 14, alignItems: 'center' }}>
          <button style={{
            border: 'none', cursor: 'pointer',
            width: 56, height: 56, borderRadius: '50%', background: 'var(--sky)',
            color: '#fff', fontSize: 24, boxShadow: '0 4px 0 var(--sky-dark)',
          }}>▶</button>
          <div className="display" style={{ fontSize: 26, color: 'var(--ink)' }}>
            Which one starts with…
          </div>
          <Letter ch="S" color="sky" size={84} />
        </div>
      </div>

      {/* picture options */}
      <div style={{
        position: 'absolute', top: 250, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 32,
      }}>
        {[
          { word: 'sun',  icon: <Sun size={100} />, color: 'sun', correct: true },
          { word: 'moon', icon: <div style={{
              width: 100, height: 100, borderRadius: '50%', background: '#E8E0F4',
              boxShadow: 'inset -18px -8px 0 #B8A8D0',
            }}/>, color: 'berry' },
          { word: 'tree', icon: <div style={{ position: 'relative', width: 100, height: 100 }}>
              <div style={{ position: 'absolute', bottom: 0, left: '40%', width: '20%', height: '40%', background: '#8A5A36', borderRadius: 4 }}/>
              <div style={{ position: 'absolute', top: 0, left: '5%', width: '90%', height: '70%', background: 'var(--leaf)', borderRadius: '50%', boxShadow: 'inset -10px -8px 0 var(--leaf-dark)' }}/>
            </div>, color: 'leaf' },
        ].map((opt, i) => (
          <button key={opt.word} style={{
            border: 'none', cursor: 'pointer',
            background: '#fff', borderRadius: 28,
            padding: 24, width: 220, height: 260,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 6px 0 rgba(61,40,24,0.10), 0 18px 26px -10px rgba(61,40,24,0.2)',
            transform: i === 1 ? 'translateY(-12px)' : 'none',
          }}>
            <div style={{
              width: 150, height: 150, borderRadius: 24,
              background: 'var(--cream-100)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{opt.icon}</div>
            <div className="display" style={{ fontSize: 28, color: 'var(--ink)' }}>{opt.word}</div>
          </button>
        ))}
      </div>

      {/* helper bottom */}
      <div style={{
        position: 'absolute', bottom: 32, left: 60, display: 'flex', alignItems: 'flex-end', gap: 14,
      }}>
        <Pip size={84} color="leaf" />
        <div className="bubble" style={{ marginBottom: 14, fontSize: 18, padding: '12px 18px' }}>
          Say the sound: <strong style={{ color: 'var(--sky-dark)' }}>sss…</strong>
        </div>
      </div>
      <button style={{
        position: 'absolute', bottom: 36, right: 60,
        border: 'none', cursor: 'pointer', background: 'transparent',
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: 'Fredoka', fontWeight: 600, fontSize: 18, color: 'var(--ink-soft)',
      }}>
        <span style={{
          width: 40, height: 40, borderRadius: '50%', background: 'var(--sun)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 0 var(--sun-dark)', fontSize: 22,
        }}>💡</span>
        Hint
      </button>
    </TabletFrame>
  );
}

function RewardScreen() {
  return (
    <TabletFrame screenLabel="07 Reward" screenBg="#FFF1D4">
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 70% at 50% 50%, #FFE08A 0%, #FFF1D4 60%, #FFE8B6 100%)',
      }}/>
      {/* confetti */}
      {[
        ['var(--coral)', 90, 120, -10],
        ['var(--sky)', 200, 80, 20],
        ['var(--berry)', 720, 90, -15],
        ['var(--leaf)', 880, 160, 10],
        ['var(--sun-dark)', 120, 540, 8],
        ['var(--rose)', 820, 540, -20],
        ['var(--sky-dark)', 660, 600, 0],
        ['var(--coral)', 300, 620, -10],
      ].map(([c, x, y, rot], i) => (
        <div key={i} style={{
          position: 'absolute', left: x, top: y,
          width: 18, height: 28, background: c,
          borderRadius: 4, transform: `rotate(${rot}deg)`,
        }}/>
      ))}

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 18,
      }}>
        <div className="display" style={{
          fontSize: 64, color: 'var(--coral)',
          textShadow: '0 6px 0 var(--coral-dark)',
          letterSpacing: '-0.01em',
        }}>Great job!</div>

        <Stars count={3} total={3} size={80} />

        <Pip size={200} color="leaf" wave />

        <div style={{ display: 'flex', gap: 18, marginTop: 6 }}>
          <div className="sticker" style={{
            padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 10,
            background: '#fff',
          }}>
            <span className="coin" style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--sun)', boxShadow: 'inset 0 -4px 0 var(--sun-dark)' }}/>
            <span style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 22, color: 'var(--ink)' }}>+25 coins</span>
          </div>
          <div className="sticker" style={{
            padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 10,
            background: '#fff',
          }}>
            <span style={{ fontSize: 26 }}>🏅</span>
            <span style={{ fontFamily: 'Fredoka', fontWeight: 600, fontSize: 22, color: 'var(--ink)' }}>Counting Pro</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <Btn color="ghost">↻ Play Again</Btn>
          <Btn size="big" color="leaf">Next Stage →</Btn>
        </div>
      </div>
    </TabletFrame>
  );
}

function ParentDashboardScreen() {
  return (
    <TabletFrame screenLabel="08 Parent Dashboard" screenBg="#F7F3EE">
      <div style={{ position: 'absolute', inset: 0, padding: '34px 40px' }}>
        {/* header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink-quiet)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Parent dashboard
            </div>
            <div className="display" style={{ fontSize: 32, color: 'var(--ink)', marginTop: 4 }}>
              Mia's Week
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {['Mia', 'Leo', '+ Add'].map((n, i) => (
              <div key={i} style={{
                padding: '10px 18px', borderRadius: 999,
                background: i === 0 ? 'var(--ink)' : '#fff',
                color: i === 0 ? '#fff' : 'var(--ink)',
                fontWeight: 800, fontSize: 14,
                border: i === 0 ? 'none' : '1.5px solid var(--cream-200)',
              }}>{n}</div>
            ))}
          </div>
        </div>

        {/* stat row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 24,
        }}>
          {[
            { label: 'Time this week', value: '2h 14m', delta: '+22m', color: 'var(--leaf-dark)' },
            { label: 'Stages cleared', value: '14', delta: '+5', color: 'var(--leaf-dark)' },
            { label: 'Stars earned',  value: '38',  delta: '+12', color: 'var(--leaf-dark)' },
            { label: 'Streak',        value: '6 days', delta: '🔥', color: 'var(--coral)' },
          ].map((s) => (
            <div key={s.label} style={{
              background: '#fff', borderRadius: 18, padding: 18,
              boxShadow: '0 2px 0 rgba(61,40,24,0.05), 0 8px 18px -8px rgba(61,40,24,0.12)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink-quiet)' }}>{s.label}</div>
              <div className="display" style={{ fontSize: 28, color: 'var(--ink)', marginTop: 4 }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: s.color, marginTop: 2 }}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* big card row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginTop: 18,
        }}>
          {/* progress chart */}
          <div style={{ background: '#fff', borderRadius: 22, padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="display" style={{ fontSize: 20, color: 'var(--ink)' }}>Daily play time</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Week', 'Month'].map((t, i) => (
                  <div key={t} style={{
                    padding: '6px 12px', borderRadius: 999, fontWeight: 800, fontSize: 12,
                    background: i === 0 ? 'var(--cream-100)' : 'transparent',
                    color: i === 0 ? 'var(--ink)' : 'var(--ink-quiet)',
                  }}>{t}</div>
                ))}
              </div>
            </div>
            <div style={{ height: 160, display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 22 }}>
              {[40, 55, 30, 70, 50, 85, 25].map((h, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: '100%',
                    height: h + '%',
                    background: i === 5 ? 'var(--coral)' : 'var(--sky)',
                    borderRadius: '12px 12px 4px 4px',
                  }}/>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--ink-quiet)' }}>
                    {['M','T','W','T','F','S','S'][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* skills */}
          <div style={{ background: '#fff', borderRadius: 22, padding: 22 }}>
            <div className="display" style={{ fontSize: 20, color: 'var(--ink)' }}>Skills focus</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
              {[
                { label: 'Counting 1–10', value: 0.92, color: 'var(--leaf)' },
                { label: 'Letter sounds', value: 0.64, color: 'var(--sky)' },
                { label: 'Shapes & sort', value: 0.40, color: 'var(--berry)' },
                { label: 'Patterns',      value: 0.18, color: 'var(--coral)' },
              ].map((r) => (
                <div key={r.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)' }}>{r.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink-quiet)' }}>{Math.round(r.value * 100)}%</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--cream-100)', borderRadius: 999 }}>
                    <div style={{ width: (r.value * 100) + '%', height: '100%', background: r.color, borderRadius: 999 }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* controls */}
        <div style={{
          marginTop: 18, display: 'flex', gap: 12, alignItems: 'center',
          background: '#fff', borderRadius: 18, padding: 16,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: 'var(--cream-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>⏰</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--ink)' }}>Daily play limit</div>
            <div style={{ fontSize: 13, color: 'var(--ink-quiet)', fontWeight: 700 }}>Set to 30 minutes · school days</div>
          </div>
          <div style={{
            width: 56, height: 30, borderRadius: 999, background: 'var(--leaf)',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', right: 3, top: 3, width: 24, height: 24,
              background: '#fff', borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}/>
          </div>
        </div>
      </div>
    </TabletFrame>
  );
}

Object.assign(window, { MathActivityScreen, ReadingActivityScreen, RewardScreen, ParentDashboardScreen });
