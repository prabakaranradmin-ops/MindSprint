// audio-manager.jsx — Bloom Academy synthesized sound effects
// Uses Web Audio API only (no audio files needed) so the prototype is
// self-contained. Every sound is a small synthesis recipe.
//
// Usage (auto-initialized on load):
//   AudioMgr.tap()          // button press
//   AudioMgr.correct()      // rising chime — right answer
//   AudioMgr.retry()        // gentle descending tone — try again
//   AudioMgr.starPop()      // bright pop — star earned
//   AudioMgr.coin()         // light coin ding
//   AudioMgr.stageClear()   // 3-note fanfare — stage complete
//   AudioMgr.phonics('S')   // short buzz + letter hint (placeholder)
//   AudioMgr.setMute(bool)  // honour the Settings toggle
//
// Implementation note: AudioContext must be resumed after a user gesture
// (browser autoplay policy). All methods call _resume() automatically, so
// the first real interaction unblocks subsequent sounds.

const AudioMgr = (() => {
  let ctx = null;
  let muted = false;

  function _ctx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  async function _resume() {
    const c = _ctx();
    if (c.state === 'suspended') await c.resume();
  }

  // ── primitive helpers ──────────────────────────────────────────────────────

  /** Play a single tone: freq (Hz), type, duration (s), gain 0–1, start offset (s) */
  function _tone(freq, { type = 'sine', dur = 0.18, gain = 0.35, start = 0, ramp = true } = {}) {
    const c = _ctx();
    const t = c.currentTime + start;
    const osc = c.createOscillator();
    const env = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    env.gain.setValueAtTime(gain, t);
    if (ramp) env.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(env);
    env.connect(c.destination);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  }

  /** Short noise burst */
  function _noise(dur = 0.06, gain = 0.08) {
    const c = _ctx();
    const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const env = c.createGain();
    env.gain.setValueAtTime(gain, c.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    src.connect(env);
    env.connect(c.destination);
    src.start();
    src.stop(c.currentTime + dur + 0.01);
  }

  // ── public sounds ──────────────────────────────────────────────────────────

  async function tap() {
    if (muted) return;
    await _resume();
    _tone(480, { type: 'triangle', dur: 0.08, gain: 0.22 });
  }

  async function correct() {
    if (muted) return;
    await _resume();
    // Rising 3-note chime: C5 → E5 → G5
    _tone(523.25, { type: 'sine', dur: 0.22, gain: 0.32, start: 0 });
    _tone(659.25, { type: 'sine', dur: 0.22, gain: 0.32, start: 0.12 });
    _tone(783.99, { type: 'sine', dur: 0.35, gain: 0.36, start: 0.24 });
  }

  async function retry() {
    if (muted) return;
    await _resume();
    // Gentle descending 2-note: G4 → E4, soft triangle so it doesn't feel harsh
    _tone(392, { type: 'triangle', dur: 0.28, gain: 0.25, start: 0 });
    _tone(329.63, { type: 'triangle', dur: 0.32, gain: 0.20, start: 0.18 });
  }

  async function starPop() {
    if (muted) return;
    await _resume();
    // Bright pop + shimmer
    _tone(880, { type: 'sine', dur: 0.12, gain: 0.38, start: 0 });
    _tone(1174.66, { type: 'sine', dur: 0.18, gain: 0.28, start: 0.06 });
    _noise(0.04, 0.06);
  }

  async function coin() {
    if (muted) return;
    await _resume();
    // Classic coin: high sine with fast decay
    _tone(1046.5, { type: 'sine', dur: 0.14, gain: 0.30, start: 0 });
    _tone(1318.5, { type: 'sine', dur: 0.10, gain: 0.22, start: 0.05 });
  }

  async function stageClear() {
    if (muted) return;
    await _resume();
    // 4-note ascending fanfare: C5 E5 G5 C6
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      _tone(f, { type: 'triangle', dur: 0.28, gain: 0.34, start: i * 0.16 });
    });
  }

  async function phonics(letter = 'S') {
    if (muted) return;
    await _resume();
    // Short 'sss' buzz placeholder — real app replaces with recorded VO
    _noise(0.12, 0.12);
    _tone(200, { type: 'sawtooth', dur: 0.10, gain: 0.08, start: 0.04 });
  }

  function setMute(val) { muted = !!val; }
  function isMuted() { return muted; }

  return { tap, correct, retry, starPop, coin, stageClear, phonics, setMute, isMuted };
})();

// ── Wire tap sound to every Btn click (non-invasively) ────────────────────────
// We patch Btn to call AudioMgr.tap() automatically so no screen file needs
// to be changed. The original click handler (if any) still fires.
(function patchBtnAudio() {
  const _origBtn = window.Btn;
  if (!_origBtn) return; // safety if load order varies — screens re-check below

  window.Btn = function Btn({ children, color = 'coral', size = 'md', style, onClick, ...rest }) {
    const handleClick = (e) => {
      AudioMgr.tap();
      if (onClick) onClick(e);
    };
    const cls = `btn ${color !== 'coral' ? color : ''} ${size === 'big' ? 'big' : ''}`;
    return React.createElement(
      'button',
      { className: cls.trim(), style, onClick: handleClick, ...rest },
      children,
    );
  };
})();

// ── Expose on window ──────────────────────────────────────────────────────────
Object.assign(window, { AudioMgr });

// ── Connect Settings toggles live: Settings screen's "Sounds" toggle calls
//    AudioMgr.setMute(!value). Screens that render after this script load
//    can reference AudioMgr directly. ─────────────────────────────────────────
