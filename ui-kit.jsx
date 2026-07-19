// ui-kit.jsx — shared building blocks for Bloom Academy screens
// Components: TabletFrame, StatusBar, Pip (mascot), Star row, Bubble, Sticker,
// Btn, IconBtn, Chip, MediaSlot, ProgressBar, TopBar.

function TabletFrame({ children, label, screenBg, screenLabel }) {
  return (
    <div
      data-screen-label={screenLabel || label}
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        background: '#2A1E14',
        borderRadius: 38,
        padding: 14,
        boxShadow:
          'inset 0 0 0 2px rgba(255,255,255,0.06), 0 30px 60px -20px rgba(40,25,10,0.35)',
        position: 'relative',
      }}
    >
      {/* camera dot */}
      <div
        style={{
          position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)',
          width: 8, height: 8, borderRadius: '50%',
          background: '#0d0703', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
        }}
      />
      <div
        className="tablet"
        style={{ borderRadius: 26, background: screenBg || 'var(--cream-50)' }}
      >
        {children}
      </div>
    </div>
  );
}

function StatusBar({ time = '9:41', tone = 'ink-soft' }) {
  return (
    <div className="statusbar" style={{ color: 'var(--ink-soft)' }}>
      <span>{time}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 11 }}>100%</span>
        <span style={{
          width: 26, height: 12, borderRadius: 3,
          border: '1.5px solid currentColor', position: 'relative',
        }}>
          <i style={{
            position: 'absolute', inset: 1.5, background: 'currentColor', borderRadius: 1.5,
          }}/>
        </span>
      </span>
    </div>
  );
}

function Pip({ size = 180, color = 'leaf', mood = 'happy', wave, arms, feet = true, style }) {
  // color: leaf | berry | sky | coral | sun
  const bodyMap = {
    leaf:  ['var(--leaf)',  'var(--leaf-dark)'],
    berry: ['var(--berry)', 'var(--berry-dark)'],
    sky:   ['var(--sky)',   'var(--sky-dark)'],
    coral: ['var(--coral)', 'var(--coral-dark)'],
    sun:   ['var(--sun)',   'var(--sun-dark)'],
  };
  const [body] = bodyMap[color] || bodyMap.leaf;
  return (
    <div
      className={`pip ${mood} ${wave ? 'wave' : ''}`}
      style={{ '--pip-size': size + 'px', '--pip-body': body, ...style }}
    >
      {feet && <div className="foot left" />}
      {feet && <div className="foot right" />}
      <div className="sprout" />
      <div className="leaf-blade" />
      <div className="body" />
      <div className="belly" />
      {arms && !wave && <div className="arm left" />}
      {(arms || wave) && <div className="arm right" />}
      <div className="eye left" />
      <div className="eye right" />
      <div className="cheek left" />
      <div className="cheek right" />
      <div className="mouth" />
    </div>
  );
}

function Stars({ count = 3, total = 3, size = 60 }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={'star' + (i < count ? '' : ' empty')}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

function Bubble({ children, style }) {
  return <div className="bubble" style={style}>{children}</div>;
}

function Btn({ children, color = 'coral', size = 'md', style, ...rest }) {
  const cls = `btn ${color !== 'coral' ? color : ''} ${size === 'big' ? 'big' : ''}`;
  return <button className={cls.trim()} style={style} {...rest}>{children}</button>;
}

function IconBtn({ children, style, ...rest }) {
  return <button className="icon-btn" style={style} {...rest}>{children}</button>;
}

function Chip({ icon = 'coin', value, style }) {
  return (
    <div className="chip" style={style}>
      <span className={icon} />
      <span>{value}</span>
    </div>
  );
}

function MediaSlot({ w, h, label, style, radius = 'var(--r-md)' }) {
  return (
    <div
      className="media-slot"
      style={{
        width: w, height: h, borderRadius: radius, ...style,
      }}
    >
      {label}
    </div>
  );
}

function ProgressBar({ value = 0.5, style }) {
  return (
    <div className="bar" style={style}>
      <i style={{ width: (value * 100) + '%' }} />
    </div>
  );
}

function TopBar({ left, center, right, style }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 24px 0 24px', ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{left}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{center}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{right}</div>
    </div>
  );
}

// Tiny decorative shapes
function Sun({ size = 80, style }) {
  return (
    <div style={{ width: size, height: size, position: 'relative', ...style }}>
      <div style={{
        position: 'absolute', inset: '18%', borderRadius: '50%',
        background: 'var(--sun)', boxShadow: 'inset 0 -8px 0 var(--sun-dark)',
      }}/>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', left: '47%', top: '2%', width: '6%', height: '18%',
          background: 'var(--sun-dark)', borderRadius: 6,
          transform: `rotate(${i * 45}deg)`, transformOrigin: '50% 240%',
        }}/>
      ))}
    </div>
  );
}

function Apple({ size = 56, style }) {
  return (
    <div style={{ width: size, height: size, position: 'relative', ...style }}>
      <div style={{
        position: 'absolute', inset: '12% 0 0 0', background: '#E54B4B',
        borderRadius: '50%', boxShadow: 'inset -6px -6px 0 rgba(0,0,0,0.12), inset 8px 8px 0 rgba(255,255,255,0.2)',
      }}/>
      <div style={{
        position: 'absolute', left: '52%', top: 0, width: '12%', height: '20%',
        background: '#7B4F2C', borderRadius: 4, transform: 'rotate(8deg)',
      }}/>
      <div style={{
        position: 'absolute', left: '58%', top: '8%', width: '22%', height: '14%',
        background: 'var(--leaf)', borderRadius: '0 80% 0 80%',
        transform: 'rotate(-20deg)',
      }}/>
    </div>
  );
}

function Letter({ ch, color = 'sky', size = 110 }) {
  const map = {
    sky:   ['var(--sky)',   'var(--sky-dark)'],
    coral: ['var(--coral)', 'var(--coral-dark)'],
    berry: ['var(--berry)', 'var(--berry-dark)'],
    leaf:  ['var(--leaf)',  'var(--leaf-dark)'],
    sun:   ['var(--sun)',   'var(--sun-dark)'],
  };
  const [bg, shadow] = map[color] || map.sky;
  return (
    <div style={{
      width: size, height: size, borderRadius: 22,
      background: bg, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Fredoka', fontWeight: 700, fontSize: size * 0.55,
      boxShadow: `0 6px 0 ${shadow}, 0 16px 24px -8px rgba(0,0,0,0.2)`,
      transform: 'rotate(-3deg)',
    }}>{ch}</div>
  );
}

Object.assign(window, {
  TabletFrame, StatusBar, Pip, Stars, Bubble, Btn, IconBtn, Chip,
  MediaSlot, ProgressBar, TopBar, Sun, Apple, Letter,
});
