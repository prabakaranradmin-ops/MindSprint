# Phoneme Recording Brief

**For:** Puddlejump — §15.3 phoneme audio sprites
**Audience:** children ages 5–9 (Junior 5–7, and Middle 8–9's "Sound Check" phonics stage reuses the same bank)
**Status:** all 33 clips are currently silent placeholders; this brief specifies what needs to be recorded to replace them.

---

## 1. Why these clips matter

Phonics stages teach letter-**sound** recognition ("what sound does this letter make?"), not letter-**name** recognition. Text-to-speech cannot be used for this — TTS reads a letter as its *name* ("ess") or mangles isolated phonemes, and wrong phonics audio actively mis-teaches a 5-year-old. Every clip in this brief must be a real human voice recording of the isolated **sound**, not the letter name.

This is a hard product requirement (REQUIREMENTS.md §15.3), not a style preference.

## 2. Voice direction

- **One consistent voice** across all 33 clips — a child hearing different voices for different letters is confusing and breaks the "Pip is teaching me" illusion.
- **Warm, clear, unhurried, slightly playful** — matches Pip's personality (see `PIP_PERSONALITY_BIBLE.md` if you want the fuller tone reference). Not a stiff "textbook narrator" read.
- **Region-neutral pronunciation** preferred (General American or neutral International English) — avoid strong regional accent markers where a sound has multiple standard pronunciations.
- **Gender/age of voice:** no requirement — pick whichever reads warmest and clearest. A single adult voice is standard for this kind of app; it does not need to sound like a child.

## 3. Technical spec

| Property | Spec |
|---|---|
| Format | `.wav` (preferred) or `.mp3` — the player tries `.wav` first, falls back to `.mp3` |
| Sample rate | 44.1kHz or 48kHz |
| Channels | Mono is fine (smaller files, no stereo benefit for a single voice) |
| Length | Each clip should be **short — under 1 second** of actual sound. A little natural room tone before/after is fine; avoid long silence padding. |
| Loudness | Normalize consistently across all 33 clips so no letter sounds louder/quieter than another (target roughly -16 to -18 LUFS, or just ear-match them against each other) |
| Noise floor | Clean recording, no background hiss/hum — these play on tablet speakers, often in noisy rooms |
| Filenames | **Exact lowercase filename per the table below** — the game looks up clips by these exact names. Getting a filename wrong means that letter silently falls back to no sound (fails safe, but the letter just won't be voiced). |

## 4. What to actually say for each clip

This is the part that needs care: say the **isolated phoneme**, not the letter name, and not a word.

| ID | Filename | Say the sound like… | Do NOT say |
|---|---|---|---|
| a | `a.wav` | short "a" as in **c*a*t** | "ay" (long A / letter name) |
| b | `b.wav` | "buh" — quick, no trailing vowel hum | "bee" (letter name) |
| c | `c.wav` | hard "kuh" as in **c*a*ke** | "see" (letter name) |
| d | `d.wav` | "duh" as in **d*u*ck** | "dee" (letter name) |
| e | `e.wav` | short "e" as in b**e**d | "ee" (long E / letter name) |
| f | `f.wav` | "ffff" — can sustain slightly, it's a fricative | "eff" (letter name) |
| g | `g.wav` | hard "guh" as in **g**o | "jee" (letter name / soft G) |
| h | `h.wav` | soft breathy "huh" | "aitch" (letter name) |
| i | `i.wav` | short "i" as in s**i**t | "eye" (long I / letter name) |
| j | `j.wav` | "juh" as in **j**ump | "jay" (letter name) |
| k | `k.wav` | "kuh" (same sound family as hard C) | "kay" (letter name) |
| l | `l.wav` | "lll" — can sustain slightly | "el" (letter name) |
| m | `m.wav` | "mmm" — can sustain slightly | "em" (letter name) |
| n | `n.wav` | "nnn" — can sustain slightly | "en" (letter name) |
| o | `o.wav` | short "o" as in h**o**t | "oh" (long O / letter name) |
| p | `p.wav` | "puh" — crisp, no trailing vowel hum | "pee" (letter name) |
| q | `q.wav` | "kwuh" (Q is almost always paired with U) | "kyoo" (letter name) |
| r | `r.wav` | "rrr" as in **r**ed | "ar" (letter name) |
| s | `s.wav` | "sss" — can sustain slightly, like a snake | "ess" (letter name) |
| t | `t.wav` | "tuh" — crisp | "tee" (letter name) |
| u | `u.wav` | short "u" as in c**u**p | "yoo" (long U / letter name) |
| v | `v.wav` | "vvv" — can sustain slightly | "vee" (letter name) |
| w | `w.wav` | "wuh" as in **w**in | "double-u" (letter name) |
| x | `x.wav` | "ks" as in bo**x** (X rarely starts a word, so use the sound X makes at the end) | "ex" (letter name) |
| y | `y.wav` | "yuh" as in **y**es | "why" (letter name) |
| z | `z.wav` | "zzz" — can sustain slightly | "zee"/"zed" (letter name) |
| sh | `sh.wav` | "shhh" as in **sh**ip | spelling it out "ess-aitch" |
| ch | `ch.wav` | "ch" as in **ch**air | spelling it out |
| th | `th.wav` | soft "th" as in **th**umb (unvoiced) | the voiced "th" as in "the" — pick one consistently, unvoiced is more common in early-phonics teaching |
| wh | `wh.wav` | "wh" as in **wh**ale (most US speakers just say "w") | — |
| ng | `ng.wav` | "ng" as in ri**ng** (end sound, hard to isolate — a short "ng" hum is fine) | — |
| ee | `ee.wav` | long "ee" as in tr**ee** | short "e" |
| oo | `oo.wav` | long "oo" as in m**oo**n | short "u" |

## 5. Which letters are actually load-bearing today

The game only actively uses **14 of the 33** clips right now (the rest are ready for future content growth per §15.1's target of 40 phonics sets). If you want to prioritize a first recording pass, these are the ones a child will actually hear during play today, shown with the picture-word they're taught alongside (for pronunciation context only — you're still recording the isolated sound, not the word):

| Letter | Taught with the word… |
|---|---|
| S | Sun |
| B | Bear |
| C | Cake |
| F | Fox |
| M | Moon |
| T | Tiger |
| R | Rock |
| P | Pizza |
| D | Duck |
| H | Horse |
| N | Nest |
| W | Whale |
| O | Owl |
| U | Umbrella |

The remaining 19 clips (a, e, g, i, j, k, l, q, v, x, y, z, sh, ch, th, wh, ng, ee, oo) can be recorded whenever convenient — they're manifest-ready but not yet wired into any live stage.

## 6. Where the files go

Drop the finished files into `assets/phonemes/`, using the exact lowercase filenames from the table in §4 (e.g., `assets/phonemes/s.wav`). This **replaces** the existing silent placeholder file of the same name — no code changes are needed. The game will automatically start playing the real recordings the next time it loads.

If you record as `.mp3` instead of `.wav`, that's also fine — just use `assets/phonemes/s.mp3` etc.; the player checks for `.wav` first, then `.mp3`.

## 7. Quick self-check before delivering

- [ ] Every filename matches the table in §4 exactly (lowercase, no spaces)
- [ ] Each clip is the isolated sound, not the letter name
- [ ] Consistent voice and volume across every clip
- [ ] No background noise
- [ ] Clips are short (under ~1 second of actual sound)
