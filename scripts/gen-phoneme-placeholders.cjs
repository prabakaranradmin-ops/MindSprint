/* Generates silent placeholder WAV files for every entry in the phoneme
   manifest (content.js → PHONEME_IDS). Real recordings replace these later
   under the same filenames — no code changes needed (REQUIREMENTS §15.3).
   Run: node scripts/gen-phoneme-placeholders.cjs */
const fs = require('fs');
const path = require('path');
const loadContent = require('../content.js.export.cjs');

const PHONEME_IDS = loadContent().phonemeIds;
const OUT_DIR = path.join(__dirname, '..', 'assets', 'phonemes');
fs.mkdirSync(OUT_DIR, { recursive: true });

/** Build a minimal valid silent PCM WAV (mono, 8kHz, ~0.2s). */
function silentWav(seconds = 0.2, sampleRate = 8000) {
  const numSamples = Math.round(seconds * sampleRate);
  const dataSize = numSamples * 2; // 16-bit mono
  const buf = Buffer.alloc(44 + dataSize);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);          // fmt chunk size
  buf.writeUInt16LE(1, 20);           // PCM
  buf.writeUInt16LE(1, 22);           // mono
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28); // byte rate
  buf.writeUInt16LE(2, 32);           // block align
  buf.writeUInt16LE(16, 34);          // bits per sample
  buf.write('data', 36);
  buf.writeUInt32LE(dataSize, 40);
  // samples already zeroed by Buffer.alloc → silence
  return buf;
}

const wav = silentWav();
let written = 0;
for (const id of PHONEME_IDS) {
  const file = path.join(OUT_DIR, `${id}.wav`);
  if (!fs.existsSync(file)) { fs.writeFileSync(file, wav); written++; }
}
console.log(`Wrote ${written} placeholder phoneme clip(s) to ${path.relative(process.cwd(), OUT_DIR)}/ (${PHONEME_IDS.length} total in manifest).`);
