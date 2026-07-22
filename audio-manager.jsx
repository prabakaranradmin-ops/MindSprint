// audio-manager.jsx — Bopplebee synthesized sound effects
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
//   AudioMgr.phonics('S')   // recorded phoneme sprite (assets/phonemes/) — §15.3
//   AudioMgr.setMute(bool)  // honour the Settings toggle
//
// Implementation note: AudioContext must be resumed after a user gesture
// (browser autoplay policy). All methods call _resume() automatically, so
// the first real interaction unblocks subsequent sounds.

const AudioMgr = (() => {
  let ctx = null;
  let muted = false;
  let calm = false;                 // §10.4 calm mode: softens every sound uniformly

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
    env.gain.setValueAtTime(calm ? gain * 0.55 : gain, t);
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
    env.gain.setValueAtTime(calm ? gain * 0.55 : gain, c.currentTime);
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

  /** Pitched pad note for Rhythm Tap — lanes map to a friendly C-major arpeggio */
  async function note(lane = 0) {
    if (muted) return;
    await _resume();
    const freqs = [523.25, 587.33, 659.25, 783.99]; // C5 D5 E5 G5
    _tone(freqs[lane % 4], { type: 'triangle', dur: 0.25, gain: 0.32 });
  }

  // ── phoneme sprites (§15.3) ─────────────────────────────────────────────────
  // Isolated letter/digraph sounds ("sss", "buh", "mmm") must be pre-recorded —
  // TTS cannot render phonemes reliably and wrong phonics audio actively
  // mis-teaches. Clips live at assets/phonemes/{id}.wav (placeholder set
  // shipped today) or {id}.mp3 (recorded VO can drop in under either
  // extension). .wav is tried first since that's what exists today, avoiding
  // needless 404s once real recordings ship as .wav too; .mp3 is the fallback
  // for VO delivered that way. Resolved extension is cached per id after the
  // first successful load. Missing/failed clips are silent no-ops, never a
  // fallback to synthesis or TTS (§17.1-9 failure-safety).
  const _phonemeExt = {}; // id -> 'wav' | 'mp3', once resolved

  function _tryPlay(id, ext) {
    return new Promise((resolve) => {
      const el = new Audio(`assets/phonemes/${id}.${ext}`);
      el.volume = calm ? 0.55 : 1;
      let settled = false;
      const done = (ok) => { if (!settled) { settled = true; resolve(ok); } };
      el.addEventListener('error', () => done(false), { once: true });
      el.play().then(() => done(true)).catch(() => done(false));
      setTimeout(() => done(false), 800); // safety timeout if neither event fires
    });
  }

  async function phonics(letter = 'S') {
    if (muted) return;
    const id = String(letter).toLowerCase();
    try {
      const known = _phonemeExt[id];
      if (known) { await _tryPlay(id, known); return; }
      if (await _tryPlay(id, 'wav')) { _phonemeExt[id] = 'wav'; return; }
      if (await _tryPlay(id, 'mp3')) { _phonemeExt[id] = 'mp3'; return; }
      // neither extension exists for this id — silent no-op
    } catch {}
  }

  function setMute(val) { muted = !!val; }
  function isMuted() { return muted; }
  function setCalm(val) { calm = !!val; }

  return { tap, correct, retry, starPop, coin, stageClear, phonics, note, setMute, isMuted, setCalm };
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
