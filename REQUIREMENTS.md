# Bloom Academy — Requirements Document

**Product:** Bloom Academy — educational game for children ages 5–7
**Doc version:** 2.5 · **Status date:** 2026-07-19 (see Changelog, §25)
**Sources:** `README.md` (design handoff), `index.html` + `screens-a…g.jsx` (27 design mocks), `app.html` (playable prototype), `styles.css` (design tokens), `splash-video.html` (animated intro), two external product reviews + a 41-skill game-dev skills matrix (2026-07-19)

**Status tags** used throughout:

- **[Shipped]** — working in the current `app.html` prototype
- **[Planned·P1]** — feasible now in the web prototype; no backend needed
- **[Planned·P2]** — belongs to the production build (React Native/Flutter port)
- **[Future·P3]** — conditional on adding cloud accounts/sync; not needed while local-only

Delivery phases are summarized with feasibility notes in §21.

---

## 1. Product Overview

Bloom Academy is an original education + infotainment game for children ages 5–7 (Khan Academy Kids-style). A mascot named **Pip** (a round sprout creature) guides the child through themed subject worlds with node-on-path progression, five distinct activity mechanics, star/coin rewards, an accessory shop, and a parent dashboard behind a math gate.

**Subjects:**

| Subject | Theme color | Status |
|---|---|---|
| Numbers (math) | Coral | Playable |
| Words (reading/phonics) | Sky | Playable |
| Science | Leaf | Playable |
| Music | Berry | Locked (unlocks at 30 ⭐ per design) |
| Shapes | — | Design mocks only |

**Business model (decided 2026-07-19 — Appendix B):** freemium content. The first world of every subject is free; additional worlds are one-time, parent-gated purchases (§14.1). No ads, no coin sales, no subscriptions — ever.

**Naming note:** "Bloom Academy" is a **working title** — a live US trademark conflict was found (Appendix B, D4); the shipping name must be chosen and cleared before any P2 brand investment.

---

## 2. Platform & Format

- **Target:** tablet-first, **1024×720 landscape**, landscape-locked.
- **Tap targets:** minimum 44px; most interactive elements 56–130px.
- **Current prototype:** single-file web app (`app.html`) — React 18 + in-browser Babel, no build step, no external assets (all art is CSS/SVG primitives + emoji placeholders).
- **Recommended production stack (per handoff):** React Native (Expo) + Reanimated + Skia; Flutter equally viable; Web/PWA fastest test path.
- The dark tablet bezel in mocks is presentation chrome only — not to be built.
- **Offline-first [Planned·P1]:** the core game loop must work fully offline. Network (if ever added) is only for updates and optional cloud backup; the app must never block play on connectivity.
- **P1 beta distribution [Planned·P1 — decided, Appendix B]:** the prototype reaches test families as a **hosted PWA** at a private URL — React/Babel vendored locally (no CDN), web manifest + service worker for offline play and home-screen install. Still collects zero data (§11.1).

---

## 3. Functional Requirements — Implemented in the Playable Build (`app.html`) [Shipped]

### 3.1 Onboarding (first run only)

1. **Splash** — logo, Pip waving, "Tap to Play", Parents entry.
2. **Welcome** — child enters name (text input) and picks age (chips 5–7).
3. **Avatar builder** — pick Pip's color (5 swatches: leaf, berry, sky, coral, sun) and accessory (some unlocked, others locked with 🔒).
4. **Learning Plan** — choose subjects to study; **minimum of 2 subjects enforced** (deselection below 2 is blocked).
5. Returning users (existing save) **skip onboarding** and land directly on the World Map.

*Planned improvements: onboarding is resumable step-by-step and shows parents an upfront time estimate — see §22.*

### 3.2 World Map & Progression

- Each subject world has **5 stage nodes** on a winding path.
- **World scope [decided, Appendix B]:** v1 ships one world per subject, with **world 2 authored before the P2 launch**. The progress schema keys nodes by `(subject, worldId)` from P1 onward, so additional worlds are content updates, never migrations (§7).
- Node states: **done** (shows stars earned), **current** (animated halo ring, Pip stands on it), **locked** (🔒).
- Completing the current stage marks it **done** and unlocks the next node.
- Completed stages are **replayable**; a replay updates the node's stars **only if the new score is higher**, and never changes node statuses.
- Subject switching is reachable from the map; Music appears locked.
- Top bar: avatar + name (left), coins / stars / parent access (right).

### 3.3 Lesson Intro

- Before each stage: Pip + speech bubble with the stage's instruction, stage objective, and a **Start** CTA.

### 3.4 Activity Loop

- **5 questions per stage** (~4 min target per design).
- Questions are **procedurally generated per run**: shuffled item banks, randomized numbers, distractor answers guaranteed ≠ correct answer.
- Top bar during play: back-to-map, progress bar + "Question X of Y", hearts row, stage chip.
- Instruction banner with mini-Pip; banner **shakes** on a wrong answer.
- Input is disabled while feedback is showing.

**Question types implemented (12):**

| # | Type | Subject | Mechanic |
|---|---|---|---|
| 1 | `count` (to 5) | Numbers | Count apples on a CSS tree, tap answer of 3 |
| 2 | `count` (to 9) | Numbers | Same, larger range |
| 3 | `addition` | Numbers | Two apple groups (1–4 + 1–4), tap the sum |
| 4 | `subtraction` | Numbers | Apples struck out ("fell down"), tap remainder |
| 5 | `compare` | Numbers | Two trees, tap the one with MORE apples |
| 6 | `phonics` | Words | "Which picture starts with letter X?" — 12-letter bank (S B C F M T R P D H N W), used in 4 stages |
| 7 | `wordpic` | Words | Match written word to picture — 8-word bank (CAT FISH STAR TREE CAKE BIRD FROG SHIP) |
| 8 | `living` | Science | Sort item: living vs non-living (12-item bank) |
| 9 | `sinkfloat` | Science | Sink or float in water (10-item bank) |
| 10 | `hotcold` | Science | Hot vs cold (10-item bank) |
| 11 | `habitat` | Science | Tap the animal's home — 6 habitats (ocean, forest, desert, arctic, sky, farm), 10 animals |
| 12 | `lifecycle` | Science | "What comes next?" — plant, chicken, butterfly sequences (10 entries) |

> A `size` (big/small) generator + bank also exists in code but is not assigned to any stage.
> Current bank sizes are prototype-scale — see §15.1 for production minimums and repetition guards.

**Stage lineups:**

- **Numbers:** Count to 5 → Count to 9 → Addition → Subtraction → Compare
- **Words:** Phonics → Phonics → Phonics → Word & Picture → Phonics
- **Science:** Living/Non-living → Sink/Float → Hot/Cold → Habitats → Lifecycle

### 3.5 Feedback Rules

- **Correct** → modal: Pip "proud" in a sparkle ring, random praise message, "+1 star / +5 coins" row, Next CTA.
- **Wrong** → deliberately gentle modal: Pip "curious", encouraging message ("So close!"), **no fail language**; Try Again CTA.
- After **2 mistakes on the same question**, the correct answer is revealed in the retry modal.
- **Hearts are cosmetic only** — they tick down visually with mistakes but are **never a fail state** (ages 5–7 rule).
- Design intent (mocks): correct answer pulses green before the modal; no red / no ✗ anywhere in kid-facing feedback.

### 3.6 Scoring & Rewards

- **Stars per stage:** 3 = zero mistakes · 2 = 1–2 mistakes · 1 = completed with 3+ mistakes.
- **Coins per stage:** `stars × 5 + 10`.
- Stars and coins accumulate on the child's profile.
- **Stage Clear screen:** warm gold radial background, confetti, staggered star reveal, Pip celebrating, "Next Stage →" and back-to-Map.

### 3.7 Parent Area

- **Parent gate:** a math question must be answered before any adult surface (dashboard; per design also required for external links, account, purchases).
- **Parent Dashboard:** denser adult UI on neutral background — child stats cards, playtime chart, per-skill progress bars, settings toggles (e.g., sound effects).
- Trust posture stated in-product: **no ads, no chat, COPPA-compliant**.
- *Planned dashboard depth (reports, subject pausing, coin gifts) is specified in §13.4.*

### 3.8 Persistence

- Profile + progress saved to `localStorage` (key `bloom-v2`) on every state change after onboarding.
- Saved profile fields: name, age, avatarColor, avatarAccessory, coins, stars, streak (streak not yet updated by any logic).
- Saved progress: per-subject node statuses + per-stage star counts.
- *Planned: per-question auto-save, resume flow, and corruption recovery — see §22.*

---

## 4. Functional Requirements — Designed but Not Yet Built [Planned·P1/P2]

From the 27-screen design package (`index.html`, `screens-a…g.jsx`, `screenshots/`):

- **Pip's Shop** — [Shipped 2026-07-19] buy accessories with coins; item states: owned/wearing, affordable, too expensive (55% opacity). Pip models the worn outfit; ownership is per-profile (`profile.owned`) and the worn item rides `profile.avatarAccessory`.
- **Kid Settings screen** — [Shipped 2026-07-19] music / sfx / read-aloud / lefty-mode toggles (giant 72×40 toggles) plus reduced-motion and calm mode (§10.4, applied as body classes driving CSS overrides). Reached via ⚙️ on the map; hosts the parent-gated grown-ups entry. Lefty-mode layout mirroring lands with the drag mechanics (P2).
- **Drag-based activity mechanics** — [Shipped 2026-07-20] every drag interaction also supports tap-to-pick-up → tap-to-place (§10.3 motor accessibility), and lefty mode mirrors tile trays and the map's primary action:
  - Sort · Drag-drop — the science sort item can be dragged onto a zone (tap zones still work)
  - Math · Addition Blocks (math stage 3) — drag number tiles into the equation slot; block groups visualize the addends
  - Words · Word Builder (words stage 4, replaces tap word-picture) — drag letter tiles into word slots with an image clue; wrong builds clear gently
  - Science · Lifecycle timeline (science stage 5, replaces tap what-comes-next) — drag stage cards into 4 ordered slots (First/Last markers); sequences for plant, chicken, butterfly, and tree [added 2026-07-20] live in `content.js`
- **Tracing** — [Shipped 2026-07-20] words stage 2 (replaces a phonics repeat, skill `words.letter_formation`): per-stroke SVG tracing canvas with dashed writing guides, dot-to-dot stroke progression (tap or drag through the dots), per-stroke stars, phonics word tie-in card, and a no-penalty Skip. Ships 5 straight-stroke letters (T, H, F, N, M) plus 4 curved letters (C, O, U, S — multi-point dot paths rendered as rounded polylines) in `content.js`.
- **Matching Pairs** — [Shipped 2026-07-19] 3×2 memory card grid with tap counter; words world stage 3. Mismatches flip back gently and never cost hearts (§3.5).
- **Music world** — [Shipped 2026-07-19] locked-state stage screen (spotlights, curtain, "Earn 30 ⭐ to unlock" with live star progress) and **Rhythm Tap** gameplay (4 instrument lanes with pitched notes, falling notes, tap pads, combo counter, Good!/Perfect! labels). The map now shows Music star-gated instead of hidden — honest progress replaces hiding, satisfying §14 no-broken-promises. Gameplay adaptation: watch-then-echo (notes fall in sequence, the child taps the beat back) rather than real-time timing windows — deterministic and gentler for ages 5–7; a timing-based mode could layer on later.
- **Shapes · Pattern Complete** — [Shipped 2026-07-19] sequence strip with "?" slot + 3 answer tiles (2 under adaptive step-down); math world stage 2, skill `math.patterns`.
- **Per-world art directions** — [Shipped 2026-07-20] the map screen now carries a distinct mood per subject instead of one palette swap: Numbers·Orchard (golden-hour gradient, apple trees), Words·Forest (cool blue-to-green gradient, tall conifers, floating letter signs B/Cc/L), Science·Discovery (airy sky-to-cream gradient, floating lab/nature props 🧪🔭🌱🌍), Music·Stage (dark purple theatre, floating notes — already shipped with the music world). The winding path recolors per world (amber/green/berry) to match. Ported from the `screens-e.jsx` design reference into the live `MapScreen`.
- **Animated splash intro** (`splash-video.html`) — [Partially shipped 2026-07-20] the splash screen now plays a staggered CSS entrance choreography (title → welcome/Pip → play button → chips), honoring reduced-motion. The full 7-second `splash-video.html` sequence recreated in a platform animation system (Lottie/Reanimated) remains for native builds. [Planned·P2 native]
- **Audio / read-aloud** — [Shipped 2026-07-19] every instruction has a read-aloud button and prompt audio auto-plays once per question (Web Speech API). `audio-manager.jsx` is wired into `app.html`: synthesized tap (all buttons), correct chime, gentle retry, star pop, coin (rewards, daily bonus, shop), and stage-clear fanfare — all failure-safe (§17.1-9) and honoring the Sounds toggle. Remaining P2: recorded VO, and pre-recorded isolated phoneme sounds (§15.3) which synthesis cannot substitute.
- **Streak tracking** — [Shipped 2026-07-19] streaks update on stage completion per the §14 rules; daily hello bonus included.
- **States not designed** — [Shipped 2026-07-20] loading (bobbing sprout + indeterminate bar rendered in static HTML while Babel compiles, replaced on mount), offline chip on the map ("all good, keep playing" — the app is local-only), empty shop ("You own everything! 🎉"), and the returning-user splash, reachable again via Settings → 🏠 Title screen (which also restores access to New Child / Switch Child). The audio-off variant ships via the Settings toggles (§4 audio). Error/interruption states are specified in §22.

---

## 5. Core Loop Rules (proposed in handoff — confirm with product owner)

- 5 questions per stage; ~4 minute target.
- Wrong answer: 1st → gentle retry modal; 2nd → auto "Show me" walkthrough, then the question repeats later in the set. *(Build currently: reveal answer after 2nd mistake, no repeat.)*
- Answer buttons disabled during feedback; correct answer pulses before the modal.
- Locked worlds unlock by total stars (Music = 30 ⭐).
- Feedback modals never block longer than one tap.

---

## 6. Design System Requirements

### 6.1 Colors (tokens in `styles.css`)

| Token | Hex | Use |
|---|---|---|
| cream-50 / 100 / 200 | #FFF7E8 / #FCEAC9 / #F5D9A8 | backgrounds, tiles, borders |
| coral / coral-dark | #FF8A4C / #E15F1F | primary action, Numbers |
| leaf / leaf-dark | #6FCB7F / #3D9E50 | success, Science, Pip body |
| sky / sky-dark | #5EB7E8 / #2E89BD | Words, secondary |
| berry / berry-dark | #B587E0 / #7E4DB5 | Music-adjacent, cards |
| sun / sun-dark | #FFCE52 / #E2A41B | stars, coins, prices |
| rose / rose-dark | #F58FA8 / #C7547A | hearts, cheeks |
| ink / ink-soft / ink-quiet | #3D2818 / #6B4F3A / #9A7E68 | text (warm, never pure black) |
| Music stage | #3E2A5C / #6B4794 | dark world background |
| Parent dashboard bg | #F7F3EE | adult surfaces |

**Signature rule:** every saturated color pairs with its `-dark` as a bottom shadow (`0 6px 0 <dark>`) — the "sticker" depth.

### 6.2 Typography

- **Fredoka** (500/600/700) — all kid-facing UI: display, buttons, headings.
- **Nunito** (600–900) — body, labels, parent dashboard.
- Scale at 1024×720: hero 64–84 · screen title 40–46 · card title 26–34 · button 22–32 · body 16–19 · chrome labels 12–14.
- **Kid-facing text never below 16px; critical instructions ≥ 18px.**
- Font-fallback stack must remain legible if Google Fonts fail to load (system rounded sans first, then system-ui). [Planned·P1]

### 6.3 Spacing, Radii, Motion

- Spacing steps: 4 / 8 / 12 / 16 / 24 / 32 / 40 / 60.
- Radii: pill 999 (buttons/chips) · 44/32 (cards) · 22 (tiles) · 14 (small).
- Playful tilt: cards alternate rotate(−3°) / rotate(3°).
- Button press: translateY(3px) + shadow shrink 6px→3px, 80ms.
- Draggables lift: scale 1.05–1.08, rotate ±4–6°, soft shadow; drop zones brighten dashed border on hover.
- Art direction: **Variation A "Cozy sticker"** is canon (B "Bold cartoon" and C "Modern flat" are reference only).
- All decorative motion must respect the reduced-motion setting (§10.4).

### 6.4 Pip (mascot) Spec

- Blob body (border-radius 50% 50% 46% 46% / 55% 55% 45% 45%), cream belly, black eyes with highlights, rose cheeks, smile arc, head sprout + leaf, stub feet.
- **Moods:** happy (default), curious, proud, thinking, wave.
- **Color slots:** leaf (default), berry, sky, coral, sun.
- Ship as vector art (SVG/Lottie — see `pip.svg`) keeping silhouette, moods, and color slots.
- Pip's voice and writing style are governed by the **Pip Personality Bible** (§20).

### 6.5 Fidelity Rules

- Colors, typography, spacing, radii, shadows are **final** — recreate pixel-close.
- Emoji used as art (🐶 🌼 🔬 …) are **placeholders** — replace with illustrated icons before ship, or standardize on a cross-platform emoji set (e.g., Twemoji) deliberately. Commissioned art must follow the representation rules in §10.4.

---

## 7. State Model

- `profile`: name, age, avatarColor, avatarAccessory, coins, stars, streak
- `progress`: per-subject → **per-world** → node states (done/current/locked) + per-stage stars — keyed `(subject, worldId)` even while only world 1 exists [Planned·P1]
- `session`: subject, stageIndex, questions[], qIdx, mistakes, qMistakes, isReplay
- `settings` (design): music, sfx, readAloud, leftyMode, reducedMotion, dailyLimitMinutes (parent-set)
- `skills` [Planned·P1]: per-skill attempts/correct counters (see §9.1)
- `recentItems` [Planned·P1]: recently used bank-item IDs per profile, for the freshness rule (§15.1)
- Persist locally; sync to account only if multi-device is required. Parent dashboard reads aggregates.
- **Forward-compatible IDs [Planned·P1]:** every profile gets a locally generated UUID at creation so a future account model can map local data without migration pain (see §12).

---

## 8. Learning Design & Pedagogy [Planned·P1 — doc + content work, no new tech]

### 8.1 Learning objectives per stage

Each stage has one measurable objective. Current stage → objective mapping:

| Stage | Objective — "the child can…" |
|---|---|
| Numbers 1 | count 1–5 objects reliably without skipping or double-counting |
| Numbers 2 | continue a repeating AB/ABC pattern by identifying what comes next |
| Numbers 3 | add two groups with sums ≤ 8 |
| Numbers 4 | subtract within 8 by counting what remains |
| Numbers 5 | compare two quantities and identify "more" |
| Words 1, 5 | isolate the initial phoneme of a spoken/pictured word and match it to its letter |
| Words 2 | form a letter by tracing its strokes in order |
| Words 3 | match written words to their pictures from memory (paired recall) |
| Words 4 | build a simple word from letter tiles using its picture as the clue |
| Science 1 | classify things as living vs non-living |
| Science 2 | predict whether common objects sink or float |
| Science 3 | classify things as hot vs cold |
| Science 4 | match animals to their habitats |
| Science 5 | order stages of a lifecycle (plant, chicken, butterfly) |

New content must ship with an objective before entering a stage lineup.

### 8.2 Curriculum alignment (optional, for school/teacher buy-in)

- Numbers maps to Common Core **K.CC** (counting & cardinality) and **K.OA** (add/subtract within 10).
- Words maps to **RF.K.2–RF.K.3** (phonological awareness, letter-sound correspondence).
- Science maps to **NGSS K-LS1 / 2-LS4** territory (living things, habitats, lifecycles).
- Requirement: content bank items carry curriculum tags (see §15.1) so alignment reports can be generated later. — [Shipped 2026-07-20]: every stage config in `content.js` now carries a `curriculum` tag (e.g. `'CCSS K.CC.B.4'`, `'NGSS K-LS1-1'`, `'NCAS MU:Pr (informal)'` for the music world, which has no direct K-standard mapping).

### 8.3 Difficulty progression rules

- Within a subject, stages must increase difficulty on at least one axis: number range, bank difficulty tier, distractor proximity, or concept abstraction.
- **Distractor proximity rule:** early stages use far distractors (±2–3 from the correct count); later stages use near distractors (±1). Phonics confusable pairs (B/D, M/N, similar sounds) are reserved for later stages.
- Question banks carry a `difficulty` tag (1–3) so generators can filter by stage tier (see §15.1).

### 8.4 Mastery & remediation

- **Question level [Shipped]:** 1st mistake → gentle retry; 2nd mistake → answer revealed. [Shipped 2026-07-19: missed questions are re-queued once at the end of the set, per §5 — requeued copies never requeue again, so a set caps at 10.]
- **Stage level [Shipped 2026-07-19]:** if a child finishes the same stage with 1 star twice in a row (tracked per node via `oneStar`, reset by any better run), the next attempt silently uses the easier question tier — tier 1, far distractors, choices reduced to 2 (the §9.2 step-down serves as the auto-hint; visual hint overlays remain P2). No "you failed" messaging — the game silently gets gentler.
- **No regression:** remediation never re-locks nodes or removes stars.

---

## 9. Adaptivity & Personalization [Planned·P1 basic rules / P2 tuning]

### 9.1 Skill model

- A **skill** is a stable string ID: `math.count_to_5`, `math.count_to_9`, `math.addition_within_8`, `math.subtraction_within_8`, `math.compare`, `words.initial_sound`, `words.word_picture`, `science.living_nonliving`, `science.sink_float`, `science.hot_cold`, `science.habitats`, `science.lifecycle`.
- Every generated question is tagged with exactly one skill ID.
- Store per skill: `attempts`, `correct`, `lastPlayed`, rolling accuracy over the last 20 attempts. Persisted with the profile; feeds the parent-dashboard skill bars (replacing today's static mock data).
- **Recency decay** — [Shipped 2026-07-20]: `decayAccuracy()` pulls a skill's rolling accuracy toward 0.5 (chance level) once its `lastPlayed` date is 30+ days stale, scaling linearly to full decay at 60 days. A flawless-but-forgotten skill can no longer trigger the step-up (needs ≥0.9), and a skill that wasn't comfortably above the step-down threshold becomes eligible for it — the literal "drifts toward needing a refresh, becomes eligible for suggestion again" behavior. Applied inside `rollingAcc()`, so both the step-up/step-down check in `getAdaptive` (§9.2) benefit automatically.

### 9.2 Adaptive rules (deterministic, rules-based — no ML required)

- **Age-seeded start [Planned·P1]:** the onboarding age sets the initial baseline — age 5 starts at difficulty tier 1 with far distractors, age 6 at tier 1 with standard distractors, age 7 at tier 2 number ranges. Adaptivity adjusts from there. (This makes the collected age actually *used*; collecting unused data would violate §11.1 data minimization.)
- **Step up:** rolling accuracy ≥ 90% over the last 3 stages of a skill → offer a "challenge" variant (harder tier, near distractors).
- **Step down:** rolling accuracy ≤ 60% over the last 10 questions of a skill → easier tier, auto-play hint audio, reduce to 2 answer options where the mechanic allows.
- Difficulty changes are silent and gradual — never a visible "level down," never a mid-stage spike.

### 9.3 Recommendations

- Map surface — [Shipped 2026-07-20]: a gentle "💡 Pip suggests" marker floats above the subject tab whose skills are weakest (≥5 attempts, <70% accuracy) or, absent a weak skill, least recently played. Never marks the currently-selected subject or a locked one (`suggestSubject` in app.html).
- Parent dashboard — [Shipped 2026-07-20] the Skills card sorts by accuracy and surfaces a "Practice next" recommendation for the weakest skill (≥5 attempts, <70%); strong-across-the-board and no-data states have friendly variants.

### 9.4 Cross-subject reinforcement — [Shipped 2026-07-20, first instance]

- Skills may be practiced outside their home subject — e.g., counting embedded in a science sort ("How many living things did we find?"), phonics letters appearing in the Words world map art. Such moments are tagged with the same skill IDs (§9.1) so practice counts wherever it happens. — **Shipped:** the science "Sort it Out!" stage (livingmix, science stage 1) ends with a genuine bonus recap — "How many living things did we find?" — computed from the actual living/non-living questions the child just answered, tagged with `math.count_to_5` (the same skill counting questions use) via a new `BUMP_SKILL_ONLY` action that updates skill accuracy without touching progress/stars/coins. One-shot per stage clear. The phonics-in-map-art instance remains open — it needs the per-world art direction pass to grow letter-sign decorations first.

---

## 10. Accessibility & Inclusive Design [Planned·P1 core / P2 audit — §10.1 and §10.4 audited 2026-07-20, see `ACCESSIBILITY_AUDIT.md`]

### 10.1 Visual

- Text/background contrast meets **WCAG AA**: ≥ 4.5:1 for body text, ≥ 3:1 for large display text — [Audited 2026-07-20] found two failures (`--ink-quiet` at 3.6–3.8:1; white button labels at 2.0–2.8:1), both fixed — see `ACCESSIBILITY_AUDIT.md` for the full ratio table and remediation detail.
- **Color is never the only signal.** Every color-coded state pairs with a shape/icon: locked = 🔒 (not just dimming), correct = ✓ + green, subjects have distinct icons, hearts lose fill *and* fade. — [Audited 2026-07-20]: the science sort/habitat views relied on color alone for correct/wrong; both now overlay ✓/✗. Full details in `ACCESSIBILITY_AUDIT.md`.
- Kid-facing text ≥ 16px; critical instructions ≥ 18px (restated from §6.2).

### 10.2 Audio & captioning

- All instructional audio is **paired with on-screen text** — audio is never the sole carrier of an instruction.
- Every prompt has a consistent **tap-to-replay** audio button (same icon and position everywhere).
- Sound-only feedback is banned: every audio cue (correct chime, retry, coin) has a visual counterpart, and the game is fully playable with sound off.
- **Non-reader rule** — [Audited 2026-07-20, one real gap found and fixed]: walked every kid-facing screen. Gameplay screens (activity prompts, lesson intro, parent gate, resume modal) are voiced; pure-selection screens (avatar color/accessory picker, subject picker, kid settings toggles) are navigable by icon/color recognition alone without audio, which satisfies the rule without needing narration on every screen. **Found:** Stage Clear — the single most-visited screen every session — had text and an SFX chime but no narration; fixed, now voices "Stage clear! You earned N stars!" (§10.2 test asserts the utterance). **Accepted exception:** the onboarding name field requires typing, which is an unavoidable constraint of a named-child product, not a fixable icon/audio gap — a pre-reader still needs adult help to type a name, same as any product asking for one.

### 10.3 Motor & interaction

- **No multi-finger gestures** required anywhere; no long-press requirements.
- Drag interactions: generous snap radius (drop accepted within ≥ 40px of target center), no maximum drag speed, item returns home gently on a miss (never disappears).
- Timed interactions (Rhythm Tap) must be forgiving: wide hit windows (a late/early "Good!" rather than a miss), and **no activity may hard-fail on speed** for ages 5–7.
- Lefty mode (settings) mirrors answer columns/tray layouts.
- **Haptics** — [Shipped 2026-07-20]: `navigator.vibrate` ticks on correct answers (paired with the correct-answer chime), coin awards (daily bonus, shop purchase), and drag-snap (the shared `useDragTile` helper, covering Addition Blocks, Word Builder, Lifecycle timeline, and the science-sort drag path in one place). Own "Vibration" toggle in Kid Settings, defaults on; devices without vibration support (desktop, iOS Safari) silently no-op via a try/catch, matching the SFX/speech failure-safe pattern.

### 10.4 Diversity, Representation & Neurodiversity [Planned·P1 policy / P2 content audit]

- **Visual representation:** when commissioned art replaces emoji placeholders (§6.5), any human characters and families depicted are diverse in skin tone, culture, and family structure. This is a requirement on the art brief, audited at asset delivery.
- **Cultural neutrality:** content banks prefer culturally neutral items where an equivalent exists; unavoidable culture-specific items are tagged for per-locale substitution (§15.2). — [Audited 2026-07-20]: all 20 phonics/word-picture bank words reviewed — universal objects/animals, no gendered nouns or culture-specific items found; no changes required. See `ACCESSIBILITY_AUDIT.md`.
- **Language:** all kid-facing and parent-facing copy uses gender-neutral phrasing; praise and example characters are balanced.
- **Reduced motion [Planned·P1]:** a settings toggle (and honoring the OS `prefers-reduced-motion` signal) disables confetti, shake, idle bobbing, and falling decorations; feedback remains via color/icon/sound.
- **Calm mode** — [Shipped 2026-07-20, completing the earlier saturation-only pass]: the "Calm mode" toggle (Kid Settings) now does the full job, not just a `saturate()` filter. Hides non-essential chrome via a shared `.calm-hide` class plus `.cloud`/`.hill`/`.sun-decor` — the map's stars line, coin chip, and both screens' decorative sky/hills disappear; the activity screen's hearts row and stage badge disappear. Softens sounds: `AudioMgr.setCalm()` applies a uniform 0.55× gain multiplier inside `_tone`/`_noise` (not silenced, just quieter — verified by intercepting `AudioParam.setValueAtTime`). Never framed as remedial: no "struggling" or "behind" language anywhere in the toggle or its effects.

---

## 11. Privacy, Safety & Compliance

Expands the COPPA posture. Phase 1 (local-only) keeps the compliance surface minimal by design.

### 11.1 Data categories [Documented 2026-07-19; surfaced to parents via the dashboard privacy summary]

- **Collected, stored locally only:** child first name (display only), age band (5–7), avatar choices, gameplay progress/aggregates, settings.
- **Never collected:** exact birthdate, email/phone of the child, photos, location, contacts, free-text input beyond the name field, voice recordings.
- While local-only: no data leaves the device; no third-party SDKs; no ads; no chat. This must remain literally true of the build (verified per §17.1 test 7).

### 11.2 Parental rights [Planned·P1]

- Parents can (behind the gate): reset a child's progress, rename a profile, **delete a profile and all its data** irreversibly.
- A **plain-language privacy summary** lives in the parent area ("What we store: … What we never collect: …") — [Shipped 2026-07-19 as the "Privacy at a glance" dashboard card]. A link-out to the full policy is still required for any build distributed publicly.
- **Local backup & transfer [Planned·P1]:** parents can export the full save (all profiles) to a local file and import it on another device — parent-gated, file-based (download/upload in the web prototype; share-sheet in P2), no cloud involved. This is the device-loss mitigation for the local-only posture.

### 11.3 Consent (activates only with cloud features) [Future·P3 — design spec drafted 2026-07-20, see `P3_CLOUD_DESIGN.md` §1]

- Adding accounts/sync/remote analytics requires **verifiable parental consent** per FTC COPPA rules (e.g., email-plus, card verification) before any data leaves the device — and per equivalent regimes wherever the game is distributed: EU **GDPR-K**, and India's **DPDP Act 2023** (which requires verifiable parental consent for *all* users under 18, a wider net than COPPA's under-13).
- School deployments need a separate consent path (school consents in loco parentis) and a data-processing agreement.
- Cloud data must support parent-initiated **export and deletion**, with defined retention limits (data kept only as long as needed for the educational purpose).

---

## 12. Multi-Child Profiles & Accounts [Planned·P1 local / Future·P3 cloud]

- **P1:** support up to 4 local child profiles per device. Storage becomes `{ profiles: [{ id: uuid, profile, progress, skills }], activeProfileId }`; the existing single `bloom-v2` save migrates automatically to `profiles[0]`.
- Kid-friendly **profile picker** at launch when >1 profile exists (Pip avatars + names, big tap targets). Creating a profile runs the normal onboarding; additional profiles may prefill the Learning Plan default to shorten it.
- Profile rename/delete lives **behind the parent gate** only.
- **Gentle deletion:** confirmation and the act itself happen entirely in the parent area; if the child's Pip appears at all, it waves goodbye warmly — no sad imagery, no guilt.
- Parent dashboard gets a child-switcher (already designed in mock #27).
- **P3:** profiles map to a parent account via their UUIDs; local-first with sync, never sync-required. The parent-account model assumed here is the same one `P3_CLOUD_DESIGN.md` §1 specs out — no independent child credentials, ever; the parent is always the account holder.

---

## 13. Analytics & Telemetry [Planned·P1 local / Future·P3 remote]

### 13.1 Event model (P1: logged to local storage only, feeding the parent dashboard) — [Shipped 2026-07-20: the dashboard's Today stat and weekly play-time chart now derive from stage_complete durations in the event log, and the Skills card reads §9.1 skill accuracy — no more simulated data]

`session_start/end`, `onboarding_step {step}` (funnel/drop-off), `stage_start`, `stage_complete {subject, stageIndex, stars, mistakes, durationSec}`, `stage_quit {subject, stageIndex, qIdx}` (mid-stage abandonment), `question_answered {skill, correct, attemptNo}`, `hint_used`, `answer_revealed`, `shop_purchase`, `settings_changed`. Retain raw events locally for 90 days; keep aggregates indefinitely.

- **No PII in events** — events reference the profile UUID, never the child's name. Enforced by code review + a test that scans the event schema (§17.1 test 8).
- Parent dashboard reads only aggregates (time played per day, stars, per-skill accuracy, streak).

### 13.2 Remote analytics (only if ever added) [Future·P3 — design spec drafted 2026-07-20, see `P3_CLOUD_DESIGN.md` §2]

- Pseudonymous profile UUIDs only; no device advertising IDs, no cross-app identifiers, no fingerprinting.
- Aggregation/anonymization before any dashboarding; retention limits per COPPA guidance; covered by the §11.3 consent flow.

### 13.3 Experimentation guardrails [Future·P3 — design spec drafted 2026-07-20, see `P3_CLOUD_DESIGN.md` §3]

- A/B tests may tune presentation and pacing but never: create difficulty spikes, gate previously available content, or alter the no-fail-state rules. Kids in any experiment arm must get a complete, coherent experience.

### 13.4 Parent dashboard depth

Parents are the buyers and approvers; the dashboard must be genuinely useful, not decorative.

- **[Shipped 2026-07-20] Pause a subject:** a "Manage Subjects" card in the parent dashboard lets parents hide/restore any unlocked subject (`profile.pausedSubjects`) — it simply isn't shown on the map's tab bar, no lock icon, no shame framing. At least one subject always stays visible (`PAUSE_SUBJECT` refuses to hide the last remaining one), and pausing the active subject switches the child to another visible one automatically. Paused subjects are also excluded from the §9.3 "Pip suggests" marker.
- **[Shipped 2026-07-20] Coin gifts:** a "Gift Coins" card in the parent dashboard grants +10/+25/+50 with one tap (`GIFT_COINS`, logged to the local event log). **Stars remain non-editable** — no UI anywhere exposes a stars control; only stage completion (`NEXT_Q`) can change them.
- **[Shipped 2026-07-20] Progress report export:** a "🖨️ Print Report" button in the parent dashboard triggers `window.print()`; a dedicated `.print-report` block (display:none on screen, shown only via `@media print`) reuses the dashboard's already-computed data — 7-day playtime, stars/streak/per-subject progress, per-skill accuracy table, and the same §9.3 "suggested focus" recommendation.
- **[Shipped 2026-07-20] Parent feedback prompt:** a one-tap 😕/🙂/😄 card in the parent dashboard, shown until answered once (`settings.feedbackGiven`, device-level — not per-child), then gone permanently. Parent-area only; never rendered on any kid-facing screen.
- **[Planned·P2/P3] Teacher/classroom mode:** multi-child aggregate reports for classroom use; export only, no child data leaves the device without §11.3 consent. Design spec drafted 2026-07-20, see `P3_CLOUD_DESIGN.md` §4.
- **[Future·P3] Weekly summary email:** requires a parent account and verified consent (§11.3); local-only builds never send email. Design spec drafted 2026-07-20, see `P3_CLOUD_DESIGN.md` §5.

---

## 14. Game Economy & Progression Tuning [Planned·P1 — constants + doc]

- **Earn rates (current):** 15–25 coins/stage; a typical 20-min session ≈ 4–5 stages ≈ 75–125 coins.
- **Pricing rule:** small shop items 60–100 coins, premium items 150–250 — a child playing ~20 min/day can afford **about one small item per day**. Shop prices live in config (§19.1), not code.
- **No hoarding pressure:** no daily coin caps needed at these rates, but stage-replay farming is limited — replaying an already-3-starred stage awards **5 flat coins** instead of the full amount. — [Shipped 2026-07-20]: the cap applies only when the node's star count *before* the replay started was already 3 (a fresh or improving stage still pays the full `stars*5+10`); tracked via `session.preStars`, captured at `START`.
- **Daily hello bonus [Planned·P1]:** on the first launch of each day, Pip greets the child and gives **10 coins** ("Good to see you!"). The bonus is flat — never multiplied by consecutive days, so missing days costs nothing.
- **Affordability celebration** — [Shipped 2026-07-20]: the shop screen watches the coin balance and, the first time it crosses an unowned item's price, shows a one-time Pip banner ("You have enough for the Sun hat! 👒") with a chime and voice line. Tracked per item in `profile.affordNoticed` so it truly never repeats — a celebration, never a nag or a purchase push.
- **Streak rules [Planned·P1]:** a streak-day = at least one completed stage on a local calendar day. One missed day is silently bridged as a "rest day" (streak survives); two or more missed days reset the streak quietly. No streak-loss messaging, ever (anti-stress rule below).
- **Anti-stress rules (hard requirements):**
  - Streaks reward presence, never punish absence — a broken streak resets quietly with no guilt messaging, no lost items, no "😢".
  - No countdown timers on purchases, no limited-time offers, no "dark pattern" urgency anywhere in the kid experience.
  - **No push notifications to the child [Planned·P1 policy]:** the app never sends push notifications or engagement nudges to children — no "Pip misses you!" re-engagement messaging. The only outbound communication of any kind is the parent-facing summary email (Future·P3, consent-gated, §13.4).
  - **Shop rotation caveat [Planned·P2]:** a "featured item" spotlight may rotate, but items never disappear from the shop and nothing is time-limited — rotation is presentation, not scarcity.
  - Optional parent-set **daily play limit** — [Shipped 2026-07-20]: a dashboard toggle (off by default) sums today's `stage_complete` durations from the local event log; at 30 minutes, Pip gets sleepy and a full-screen break message replaces the app (progress already saved — no content lost). Parents can always re-enter through the gate and turn the limit off. Hard cutoff / configurable duration remain P3.
- **Music unlock pacing:** 30 ⭐ ≈ 10–15 completed stages ≈ 2–4 typical sessions. Tuning must keep the unlock inside a child's first week of regular play.
- **No broken promises** — [Shipped]: a star-goal unlock may only be shown if its content exists in the build. Rhythm Tap shipped (§4 P2), so the Music world is now honestly star-gated with live progress toward "Earn 30 ⭐!" rather than hidden — see §4 for the locked-state screen.
- **Clock robustness [Planned·P1]:** streaks and the daily hello bonus key off the local calendar date, and date anomalies always resolve in the child's favor — a clock moved backward never revokes an earned streak or bonus, at most one hello bonus is granted per calendar date, and DST or timezone travel never breaks a streak.

### 14.1 Premium content unlocks [Planned·P2 — decided, Appendix B]

- **Model:** the first world of every subject is free. Additional worlds (starting with world 2, §3.2) are **one-time, non-consumable purchases** made by a parent.
- **Hard rules unchanged and permanent:** no ads, no coin/currency purchases, no consumables, no subscriptions, no loot mechanics.
- **Purchase flow:** entirely behind the parent gate (§3.7). The child-facing map shows unpurchased worlds as a gentle "Ask a grown-up" sticker with no price, urgency, or nagging — the anti-stress rules apply fully to premium content.
- **Entitlements:** platform IAP (StoreKit / Play Billing) non-consumables with a mandatory **Restore Purchases** flow — reinstalls and new devices recover unlocks through the store, so no parent account is needed and P3 stays optional.
- **Compliance:** purchase UX must pass Apple Kids Category / Google Play Families review (§18); receipt validation uses platform APIs (server-side validation only if a P3 backend ever exists).

---

## 15. Content Authoring & Localization [Planned·P1 structure / P2 full l10n]

### 15.1 Content model (P1)

- All question banks (phonics, word-pic, science banks, lifecycle sequences) move to **external JSON** with a stable schema; stage lineups (`STAGE_CONFIGS`) become data, not code.
- Every bank item carries: `id`, `skill` (§9.1), `difficulty` (1–3), optional `curriculumTags` (§8.2).
- Adding/tuning content must require **no code changes** — a non-developer edits JSON (or a future authoring sheet that exports it).
- **Minimum bank sizes (repetition guard) [Planned·P1 content work]:** current banks (8–12 items) are prototype-scale. Production targets: phonics ≥ 40 letter-option sets (covering all 26 letters, 2–3 option sets each), word-pic ≥ 25 words, each science bank ≥ 25 items, lifecycle ≥ 15 sequences. Growing banks is content authoring, not engineering.
- **Freshness rule [Planned·P1]:** never repeat a bank item within a stage; avoid repeating an item the child saw in the last 2 sessions (track recently-used item IDs per profile — `recentItems`, §7). Generators fall back gracefully when a bank is too small to satisfy this.
- **Scene variety for generated math** — [Shipped 2026-07-20]: a `SCENES` palette (apple 🍎 / berry 🫐 / flower 🌸 — 3 skins) is picked once per question and threaded through `AppleTree`, `MiniTree`, and the addition-view fruit grid, plus the scene noun in "N apples fell"/"N apples" text. Same tree/canopy geometry, different fruit color + stem + noun — counting/addition/subtraction/compare no longer always look identical.

### 15.2 Localization readiness (P2)

- All UI strings come from a string table from the production port onward; no hardcoded kid-facing text.
- **String key convention (adopt at first extraction):** `area.screen.element`, e.g. `stage.numbers.1.instruction`, `modal.retry.title`, `shop.item.sunhat.name`.
- Layouts must tolerate +40% string length (German/Spanish); RTL mirroring is a P3 concern but no layout may *preclude* it (avoid baked-in directional art where possible).
- Phonics content is **language-specific, not translatable** — each locale needs its own letter/word banks authored by a native speaker. Flag this in the content model (`locale` field).
- Culture-specific bank items carry a substitution tag for per-locale swaps (§10.4).

### 15.3 Audio & voice assets

- **P1 interim TTS — with limits:** browser Speech Synthesis API behind the read-aloud setting for instructions and praise. Known limitations are accepted for prototyping only: robotic tone, uneven pronunciation, patchy language support. On-screen text remains the primary carrier (§10.2).
- **Phoneme exception [Planned·P1 — hard requirement]:** isolated letter sounds ("sss", "buh", "mmm") **must be pre-recorded audio sprites even in P1**. TTS cannot render isolated phonemes reliably, and wrong phonics audio actively mis-teaches. A ~40-clip sprite set (26 letters + common digraphs) is small, cheap, and reusable forever.
- **P2 recorded VO:** one line per instruction template + per letter sound + per praise/retry variant, per language; warm, region-neutral voice.
- **Per-world audio identity [Planned·P2]:** each world gets a consistent ambient/music palette matching its art direction (orchard birdsong, forest wind, lab blips, stage crowd) so worlds are recognizable with eyes closed.

---

## 16. Performance & Device Support [Planned·P2 — applies to the production build]

- **Cold start ≤ 3 s** to interactive splash on a mid-range Android tablet (2 GB RAM class).
- **Animation budget:** 60 fps target; no visible hitches during screen transitions, modals, or Rhythm Tap note-fall (Rhythm Tap is the perf stress case — it gates on this).
- **Bundle size:** initial download ≤ 50 MB; VO packs and world art beyond the first world are lazy-loaded/optional downloads.
- **Support matrix (proposed):** Android 11+ tablets, iPadOS 16+; phones unsupported at v1 (landscape tablet layout only).
- Prototype note: `app.html` currently loads React + Babel from CDN — fine for dev, but any distributed prototype must vendor these locally to honor the offline rule (§2).

---

## 17. QA, Testing & Acceptance Criteria [Planned·P1 checklist / P2 protocol]

### 17.1 Functional acceptance tests (P1 — executable as a manual checklist now, automated later)

1. Hearts can reach zero with **no game-over, lockout, or content loss** — child can always finish the stage.
2. Parent gate blocks the dashboard (and any future external link/purchase) until answered correctly; wrong answers don't hint.
3. Stage replay: stars only ever increase; node statuses never change; coins follow the replay rule (§14).
4. Learning Plan cannot go below 2 selected subjects.
5. Save/restore round-trip: kill the app mid-map → relaunch lands on map with identical profile, progress, and skills.
6. Completing stage 5 of a subject shows Stage Clear and leaves no "current" node stuck.
7. Full offline session: everything in §3 works with networking disabled; no network calls appear in the build.
8. No PII in any logged event (schema scan per §13.1).
9. Every instruction is readable *and* playable with audio off (§10.2).
10. Interruption resume (§22): kill the app mid-question → relaunch offers Continue at the same question with mistake counts intact.
11. Corrupted save (§22): app restores the backup or starts fresh **without crashing**; no white screen.
12. Save export → wipe → import restores identical profiles, progress, and skills (§11.2).
13. Clock manipulation (backward jump, DST, timezone change) never revokes a streak, never grants a second same-day hello bonus, and never locks content (§14).

### 17.2 Automated testing — [Shipped 2026-07-20: generators + schema, `tests/unit/`, run via `npm run test:unit` or `test:all`]

- **Question generators** are unit-tested with a **seeded RNG** so failures reproduce deterministically (e.g., "seed 1234 must yield answers containing exactly one correct value"). `tests/helpers/loadGameLogic.cjs` extracts the real generator/adaptivity code straight out of `app.html` into a Node `vm` sandbox — zero duplicated logic to drift out of sync with the shipped app. `tests/helpers/seededRandom.cjs` provides the seeded PRNG; because the extracted code runs in its own vm realm, tests must seed the sandbox's own `Math` object (`G.Math`), not the host's — patching the host's `Math.random` has no effect inside a `vm.createContext` sandbox. 15 tests cover generator correctness (arithmetic, exactly-one-correct-answer, no-tie compares) and the adaptive/recency-decay rules (§9.2).
- **Bank schema validation** runs on every content change: required fields (§15.1), unique IDs (including cross-bank global uniqueness), correct-answer presence, no duplicate options, curriculum tags (§8.2), and referential checks (e.g., every `habitat` bank entry's home/wrong-answer habitats exist in `habitats`). 21 tests in `tests/unit/content-schema.test.cjs`; this pass caught two real content gaps (trace letters O and U had no phonics tie-in), fixed in the same sweep.
- **Visual regression** on design tokens and core screens (P2, once the production component library exists).

### 17.3 Child usability testing (P2, pre-launch gate)

- Observed sessions with **≥ 5 children ages 5–7**: each completes onboarding + first stage **without adult help**; note every moment an adult had to intervene and treat it as a defect.
- Watch for: tap-target misses, instruction comprehension without reading, emotional response to the retry modal (target: no distress).

### 17.4 Success metrics & KPIs [Planned·P1 instrumentation / P2 targets]

Measured from local analytics (§13.1) during beta; targets are initial hypotheses to tune:

- **Onboarding completion ≥ 90%**; completion of the first 3 stages within week 1 ≥ 70% (funnel via `onboarding_step` / `stage_complete`).
- **Engagement:** average session 15–25 minutes; sessions/week ≥ 3 for retained users.
- **Learning:** per-skill rolling accuracy trends upward over any 2-week active window.
- **Frustration signal:** retry-modal → `stage_quit` rate < 10%.
- **Parent buy-in:** ≥ 30% of active families open the parent dashboard in a given week.

### 17.5 Beta sanity metrics (P2)

- Music unlock timing, stage completion rates, and per-skill accuracy distributions match §14/§8 expectations; retry-modal → quit-rate monitored against the §17.4 threshold.

---

## 18. Security & Content Governance

- **No user-generated content:** children cannot input free text (beyond the name field, which is display-only and never transmitted), upload images, or communicate with anyone. This is a standing requirement, not a current-state observation.
- **Name-field constraints [Planned·P1]:** the child's name is capped at 12 characters, restricted to letters and spaces (per-locale alphabet), and passed through a small disallow-list at entry; rejected input falls back to a friendly default ("Friend") rather than an error.
- **Third-party SDK policy [Planned·P2]:** default is zero SDKs. Any exception (crash reporting) must run in a kids/child-directed mode, with no behavioral tracking and no persistent cross-app identifiers, and is re-reviewed at every major release.
- **Dependency review cadence [Planned·P2]:** third-party licenses + privacy behavior re-checked each release; privacy policy updated in lockstep.
- **Store kids-program compliance [Planned·P2]:** the production build must pass Apple **Kids Category** and **Google Play Families** policy review (no advertising SDKs, restricted data practices, parental gates on external links and any purchase flows). Treat these reviews as certification gates: run an internal checklist pass against the current policy text before every store submission, and re-check when either program's policy changes.

---

## 19. Technical Architecture Constraints [Planned·P1/P2]

### 19.1 Config-driven design (P1)

- Stage lineups, question-type parameters (number ranges, distractor rules), shop prices, unlock thresholds (Music = 30 ⭐), and economy constants all live in **data/config files**, tunable without code changes.

### 19.2 Portability abstractions (P2 — for the RN/Flutter port)

- Game logic (reducer, generators, skill model) is **pure and platform-free**; rendering, animation, and audio hang off it via a thin event interface, so the port swaps the shell, not the game.
- Audio and animation triggers go through a common event bus (`play('correct')`, `celebrate('stage-clear')`) rather than being called inline from components.

### 19.3 Feature flags (P2)

Flag-guarded for safe rollout: Rhythm Tap, drag-based mechanics, streak logic, adaptive difficulty (§9.2), shop, analytics, daily-limit enforcement, calm mode (§10.4).

---

## 20. Documentation & Change Management

- This document is the **canonical spec**; `README.md` remains the historical design handoff.
- Every requirement in §§8–19 and §22 carries a status tag; §3 is Shipped, §4 items are tagged individually. Statuses move Planned → In dev → Shipped (or Deprecated) as work lands.
- **Pip Personality Bible [Planned·P2]:** a short companion doc defining Pip's voice — vocabulary list, phrases Pip would/would never say, mood triggers (§6.4), and example lines per situation (correct, retry, celebration, goodbye) — so writers, VO direction, and localization stay consistent.
- Doc changes append to the **Changelog (§25)** with date + summary; bump the doc version on structural changes.

---

## 21. Delivery Phases & Feasibility Assessment

All reviewed items are technically feasible; none require unproven technology. Phasing reflects dependency order and cost, not possibility. Conditional items activate only if cloud features are ever added.

| Phase | Scope | Items | Feasibility notes |
|---|---|---|---|
| **P1 — prototype hardening** (current web build) | No backend, no port | Learning objectives & difficulty tags (§8) · skill tracking + basic adaptive rules (§9) · accessibility core + reduced motion (§10) · privacy summary + parental delete/reset (§11.1–11.2) · multi-profile local (§12) · local event log → real parent dashboard data, subject pausing, coin gifts (§13) · economy: streaks, daily bonus, anti-stress rules (§14) · JSON content banks + bank growth + freshness rule + phoneme audio sprites (§15) · acceptance checklist + generator tests + KPI instrumentation (§17) · config-driven stages (§19.1) · session resume & error resilience (§22) · shop, kid settings, matching pairs, patterns, read-aloud via Speech API (§4) | Low risk. Mostly data modeling + modest refactors; question banks are already data-shaped. Biggest jobs: multi-profile storage migration, session-resume plumbing, and content authoring for bank growth. |
| **P2 — production build** (RN/Flutter port) | Real product release | Drag mechanics, tracing, Rhythm Tap, world art, animated splash, recorded VO + world audio identity (§4, §15.3) · accessibility audit incl. color-blind pass + calm mode + haptics (§10) · diversity content audit (§10.4) · localization layer (§15.2) · performance budgets + support matrix (§16) · child usability testing + visual regression (§17) · PDF progress reports, parent feedback prompt (§13.4) · SDK policy & review cadence (§18) · portability event bus + feature flags (§19.2–19.3) · Pip Personality Bible (§20) | Standard production engineering. Rhythm Tap is the performance risk item — prototype it early on the weakest target device. |
| **P3 — cloud era** (only if accounts/sync are wanted) | Backend + legal | Verifiable parental consent + school consent (§11.3) · account-mapped profiles & sync (§12) · remote analytics with anonymization/retention (§13.2) · A/B guardrails (§13.3) · weekly summary email (§13.4) · RTL locales (§15.2) | Feasible, but the cost is mostly **legal/compliance, not code**. Do not enter P3 casually — local-only is itself the strongest COPPA position. |

---

## 22. Session Management & Error Resilience [Planned·P1]

Children this age are frequently interrupted mid-play; the game must never lose their work or show them a broken state.

### 22.1 Auto-save & resume

- **Auto-save after every answered question**, not just at stage end (extends §3.8).
- Relaunching mid-stage offers a kid-friendly choice: **"Keep going!"** (default — same question, mistake counts intact) or **"Start over"** (restart the stage fresh). Both phrased positively.
- App backgrounded / device sleep / low-battery shutdown: state is saved instantly on the visibility change; nothing is lost, no penalty applies, and any timed element pauses.
- **Onboarding is resumable:** each completed step persists immediately; relaunch resumes at the next step. The Parents entry shows an upfront estimate ("about 3 minutes") before onboarding starts.

### 22.2 Error states

- **Corrupted/unreadable save:** keep a rolling backup of the last known-good save; on corruption, restore the backup silently. If both are unreadable, start fresh **without crashing** and retain the corrupt blob for parent-area diagnostics.
- **Storage full / quota errors:** play continues in-memory; a warning appears in the parent area only — the child never sees a storage error.
- **Asset failures:** missing fonts fall back per §6.2; the production build vendors all assets locally (§16), so no screen may depend on a network fetch to render.
- Any unexpected runtime error surfaces to the child, at worst, as Pip "thinking" plus a "Let's try that again!" reload of the current screen — never a stack trace, blank screen, or dead end.

---

## 23. Known Issues in the Current Build (`app.html`)

1. **Letter sounds are not voiced** — phonics stages show the letter but never speak its sound; isolated phonemes must be pre-recorded sprites, never TTS (§15.3). Open until the sprite set is produced.
2. React/Babel still load from CDN — must be vendored for the hosted-PWA beta (§2, D3).

**Fixed (2026-07-20):**

- ~~`audio-manager.jsx` remains unwired~~ — synthesized SFX (tap, correct chime, retry, star pop, coin, stage-clear fanfare, rhythm notes) now play at every reward moment, honoring the Sounds toggle and failure-safe if Web Audio is unavailable (§4).
- ~~Music world shown locked with unreachable goal~~ — superseded: Rhythm Tap shipped, so the Music tab is star-gated with live progress toward the 30⭐ unlock, not hidden (§4, §14 no-broken-promises).
- ~~traceLetters "O" and "U" had no matching phonics bank entry~~ — caught by the new §17.2 content-schema unit test; tracing those letters fell back to a generic pencil emoji instead of a real word tie-in card. Both letters now have phonics entries (Owl, Umbrella).
- ~~Question generators had no unit tests~~ — §17.2's seeded-RNG requirement was undocumented-but-unmet; `shuffle()` (`sort(() => Math.random()-0.5)`) also turned out to call its comparator a non-deterministic number of times per run, which is why seeding it didn't reproduce output. Replaced with Fisher-Yates (also fixes a latent shuffle-bias issue); `tests/unit/` now runs 36 unit tests (generators + content schema validation) via `npm run test:unit` / `test:all`.

**Fixed (2026-07-19, caught by the Playwright acceptance suite):**

- ~~"Try Again" advanced to the next question~~ — the retry button dispatched `NEXT_Q`, so a wrong answer skipped the question and the §3.5/§8.4 "reveal answer after 2 mistakes on the same question" rule was unreachable. Retry now re-presents the same question with the per-question mistake count intact.

**Fixed in the Track A sprint (2026-07-19):**

- ~~`size` bank unused~~ — science stage 1 is now "Sort it Out!": a mixed living/non-living + big/small stage with per-question instructions.
- ~~`profile.streak` never incremented~~ — streaks now update on stage completion with the §14 rules (rest-day grace, clock-backward safe), shown live in the parent dashboard. Daily hello bonus (+10 coins, once per calendar date) added.
- ~~Prototype requires reading~~ — instructions auto-play via Speech Synthesis on every question, with a 🔊 replay button on the prompt banner; praise/retry modals and lesson intros speak too. Parent-gated Read Aloud toggle persists.
- ~~Music shown locked with unreachable goal~~ — Music world is hidden from the map until its content ships (§14 no-broken-promises).
- Per-question auto-save + resume: killing the app mid-stage now offers "Keep going!" (same question, mistakes intact) or "Start over" on relaunch (§22.1).
- Save export/import: parent dashboard "Data & Backup" card downloads/restores the full save as a JSON file (§11.2).
- Name field: 12-char cap, letters/spaces only, disallow-list with "Friend" fallback (§18); age chips now 5–7.
- Parent dashboard cleanup: duplicate style attribute removed; trust note wording corrected ("all data stays on this device").

**Fixed earlier (2026-07-19):**

- ~~Stage Clear screen unreachable~~ — reducer set `screen:'stage-clear'` while the router matched `case 'cleared'`; finishing a stage fell through to Splash. Reducer now navigates to `'cleared'`.
- ~~`session.subject` undefined~~ — `START` never copied the active subject into the session, so the activity screen showed the math stage-1 instruction and wrong progress-bar color/stage icon. The session now carries `subject`.

---

## 24. File Map

| File | Role |
|---|---|
| `app.html` | Playable prototype (current build) |
| `index.html` | All 27 design mocks + 3 art variations on one canvas |
| `index.src.html` | Module-loading source (palette presets, font options) |
| `screens-a…g.jsx` | Screen mock implementations by section |
| `ui-kit.jsx` | Shared components (TabletFrame, Pip, Btn, Chip, Stars, Bubble, ProgressBar, TopBar) |
| `styles.css` | Design system CSS (tokens live here) |
| `variations.jsx` | Art-direction options (A is canon) |
| `splash-video.html` | 7s animated intro with scrubber |
| `audio-manager.jsx` | Audio manager (not yet wired in) |
| `pip.svg` | Vector Pip mascot |
| `screenshots/` | PNG captures of every mock, numbered in flow order |
| `README.md` | Original design handoff document |
| `REQUIREMENTS.md` | This document — canonical spec |

---

## 25. Changelog

| Date | Version | Change |
|---|---|---|
| 2026-07-19 | 2.5 | Track A prototype sprint shipped: Music world hidden (no-broken-promises), streaks + daily hello bonus with clock-safety, read-aloud via Speech Synthesis (auto-play + 🔊 replay + parent toggle), per-question auto-save with Keep-going/Start-over resume, save export/import in parent dashboard, name-field constraints + age chips 5–7, size bank wired into a mixed science stage 1 with per-question instructions. Known Issues rewritten: 8 items fixed, 3 open (phoneme sprites, SFX, CDN vendoring). |
| 2026-07-19 | 2.4 | Four product decisions made and recorded in new Appendix B: freemium world unlocks (new §14.1), world 2 authored before P2 (multi-world schema, §3.2/§7), hosted-PWA beta (§2), name-conflict findings → rename gate (§1 naming note). New requirements from gap review: age-seeded difficulty start (§9.2), non-reader rule (§10.2), local backup/export (§11.2), Music hidden until its content exists + clock robustness (§14), name-field constraints (§18), acceptance tests 12–13 (§17.1), Known Issues 4–5 (§23). Appendix A monetization reclassified to "applies, constrained." |
| 2026-07-19 | 2.3 | Assessed remaining skills matrix entries (#23–41): Appendix A expanded with 10 more applicable skills (QA workflows, automated testing, performance benchmarking, store review, build pipeline, crash reporting, patching, localization, analytics, privacy engineering), a new A.2 "conditional on P3" tier, and 7 more non-applicable skills. Three spec gaps promoted into requirements: store kids-program compliance gate (§18), no-push-notifications-to-children rule (§14), GDPR-K + India DPDP consent scope (§11.3). |
| 2026-07-19 | 2.2 | Added Appendix A — Engineering Capability Map: external game-dev skills matrix assessed for project relevance; applicable skills mapped to phases and spec sections; non-applicable skills recorded with rationale to prevent scope creep. |
| 2026-07-19 | 2.1 | Second external review incorporated: content volume minimums + freshness rule + math scene variety (§15.1); new §22 Session Management & Error Resilience; §10.4 Diversity, Representation & Neurodiversity (incl. reduced motion, calm mode); §13.4 Parent Dashboard Depth (subject pausing, coin gifts, PDF reports, teacher mode); §17.2 automated tests + §17.4 success KPIs; §14 streak definition, daily hello bonus, affordability celebration, shop-rotation caveat; §15.3 TTS limits + mandatory pre-recorded phoneme sprites + world audio identity; §9 recency decay + cross-subject reinforcement; §10.3 haptics; §20 Pip Personality Bible; new analytics events (`onboarding_step`, `stage_quit`); string key convention (§15.2); gentle profile deletion (§12). Former §§22–24 renumbered to §§23–25. |
| 2026-07-19 | 2.0 | Incorporated first external product review: added §8 Pedagogy, §9 Adaptivity, §10 Accessibility, §11 Privacy/Compliance (expanded), §12 Multi-profile, §13 Analytics, §14 Economy, §15 Content/Localization, §16 Performance, §17 QA, §18 Security, §19 Architecture, §20 Doc management, §21 Phased roadmap; introduced status tags. |
| 2026-07-19 | 1.1 | Fixed two prototype bugs (Stage Clear routing, `session.subject`); Known Issues updated. |
| 2026-07-19 | 1.0 | Initial requirements document consolidated from README handoff + `app.html` prototype. |

---

## Appendix A — Engineering Capability Map

An external game-development skills matrix (AAA/live-service oriented, 41 skills, assessed in two batches) was reviewed against this project. Bloom Academy is a **local-only, single-player, tap-first, 2D educational tablet game** — many of those competencies do not apply, and recording *why* prevents future scope creep. This appendix is capability planning, not product requirements. Three genuine spec gaps surfaced by the matrix were promoted into the spec proper: store kids-program review gates (§18), the no-push-to-children rule (§14), and regional privacy regimes beyond COPPA (§11.3).

### A.1 Skills that apply — adapted to this project

| Skill (from matrix) | How it applies to Bloom Academy | Phase | Spec refs |
|---|---|---|---|
| Game Architecture & Engine Integration | Pure, platform-free game core (reducer, generators, skill model) behind a thin shell; the RN/Flutter port swaps the shell, not the game | P2 | §19.2 |
| Gameplay Systems Design (data-driven) | Stage lineups, question banks, economy, and unlock thresholds all live in config; content is tuned without code changes | P1 | §15.1, §19.1 |
| Scripting & Event Systems | Audio/animation triggers via a common event bus; no direct cross-system references | P2 | §19.2 |
| Save/Load & Game Persistence | Versioned saves with migration (`bloom-v2` → multi-profile), rolling backup, corruption recovery, per-question auto-save | P1 | §3.8, §12, §22 |
| Procedural Generation | Seeded question generators with deterministic tests, distractor rules, freshness constraints, guaranteed-solvable output | P1 | §8.3, §15.1, §17.2 |
| Game UI/UX | Component library, localization-ready strings, accessibility options (reduced motion, calm mode, lefty mirroring) | P1/P2 | §6, §10, §15.2 |
| Input Handling | Touch-first semantic actions; no multi-finger or long-press; generous drag/drop tolerances | P1/P2 | §10.3 |
| Animation Systems (lightweight) | Pip mood/Lottie animations, screen transitions, celebration choreography — vector timelines, not skeletal rigs | P2 | §4, §6.3–6.4 |
| Audio Integration | Event-driven audio manager, phoneme audio sprites, per-world audio identity, per-platform mixing | P1/P2 | §15.3, §19.2 |
| VFX (lightweight) | Confetti/sparkle celebrations with reduced-motion tiers and cheap rendering | P1/P2 | §6.3, §10.4 |
| Asset Pipeline & Content Management | Import presets and compression per platform, VO pack packaging, bank schema validation in CI | P2 | §15.1, §16, §17.2 |
| CPU Performance Profiling | Frame budgets and cold-start budget, profiled on the lowest-spec target tablet | P2 | §16 |
| Memory Management & Streaming | ≤ 50 MB initial bundle, lazy-loaded VO/world packs, leak-free multi-hour sessions | P2 | §16 |
| Mobile & Platform-Specific Optimization | Thermal/battery sanity on tablets, suspend/resume lifecycle (feeds session resume), store requirements | P2 | §16, §22 |
| Level/Content Design Tools | Content authoring pipeline: JSON bank editing → future authoring sheet, with validation so bad content cannot ship | P1/P2 | §15.1, §17.2 |
| Gameplay QA & Manual Testing Workflows | Test plans, severity definitions, bug templates, critical-path smoke checklist per build; the child-usability protocol is this project's special case | P1/P2 | §17.1, §17.3 |
| Automated Testing for Games | Seeded-RNG generator unit tests (deterministic repro), bank schema validation in CI, visual regression later | P1/P2 | §17.2 |
| Performance & Frame Rate Testing | Repeatable benchmark scene on the lowest-spec target tablet, percentile (not average) frame times, cold-start budget as a release gate | P2 | §16 |
| Platform Certification (as store review) | No console TRC/TCR, but **Apple Kids Category + Google Play Families reviews are certification-grade gates** for a COPPA title — internal checklist pass before every submission | P2 | §11, §18 |
| Build Pipeline & Distribution | CI-built, signed, versioned store submissions (App Store / Play); no manual one-machine builds; store upload automated (fastlane-class tooling) | P2 | §16 |
| Crash Reporting & Error Tracking | Kids-safe crash reporting only: symbolicated crashes, **no PII or device identifiers** per the SDK policy; crash-rate gate before store promotion | P2 | §18, §22 |
| Patch & Hotfix Strategy | Severity tiers + expedited store-review path for severity-1 bugs; hotfixes still pass the relevant subset of the §17.1 checklist | P2 | §17.1, §20 |
| Game Localization & Regional Publishing | Matches the existing plan: string tables with key convention, +40% expansion headroom, per-locale phonics banks (authored, not translated), pseudo-localization QA | P2/P3 | §15.2 |
| Game Analytics & Telemetry | Local-first and consent-free **by design** (no data leaves the device); event taxonomy + schema validation already specified; the remote, consent-gated variant is P3-only | P1/P3 | §13 |
| Privacy & Consent Engineering (GDPR/COPPA/DPDP) | The strongest match in the whole matrix — compliance as code: local-only posture, parent gate, data inventory, profile deletion; verifiable-consent flows activate only at P3 | P1/P3 | §11, §12 |
| Monetization (constrained form) | Reclassified after the freemium decision (Appendix B, D1): platform IAP for one-time, non-consumable world unlocks with Restore Purchases and a parent-gated, Kids-Category-compliant flow. Never ads, currency sales, consumables, or subscriptions | P2 | §14.1, §18 |

### A.2 Skills that are conditional — activate only with a P3 (cloud) decision

| Skill | Condition and constraint |
|---|---|
| Feature Flags & Remote Config | Build-time/local config flags are P2 (§19.3). *Server-driven* remote config is P3-only and must keep a cached offline fallback — a synchronous config fetch at launch would violate offline-first (§2) |
| Product Experimentation & A/B Testing | P3-only, and always under the §13.3 guardrails: no difficulty spikes, no content gating, no-fail-state rules are untouchable |
| Live Operations & Content Delivery | Content updates ship as ordinary store releases in P1/P2. An optional P3 form exists: OTA question-bank downloads (download-only, no data collection) — never live events or seasonal pressure mechanics, which conflict with §14 |
| Player Backend Services (accounts, profiles) | Accounts/sync *are* the P3 decision itself (§11.3, §12). Leaderboards are permanently excluded — see A.3 |

### A.3 Skills that do NOT apply — and why

| Skill | Why not applicable |
|---|---|
| Multiplayer Networking, Matchmaking & Lobby Systems | Single-player by design; no chat/social contact is a standing COPPA safety requirement (§11, §18) — this must not be added, not merely deferred |
| Game Server Infrastructure & Hosting | No servers of any kind while local-only; even P3 sync would use a managed backend service, never game-server fleets |
| Anti-Cheat & Competitive Integrity | Nothing to cheat: single-player, no leaderboards, no PvP, no competitive outcomes |
| Leaderboards & competitive social (part of Player Backend Services) | Permanently excluded by design ethos: ranking children against each other conflicts with the anti-stress rules (§14). (Monetization moved to A.1 in constrained form after the freemium decision — coin/currency sales remain permanently excluded, §14.1) |
| Game Economy & Inventory (server-side) | The economy is local and simple (§14); server-side ledgers and atomic transactions have no role without purchases or multiplayer |
| Real-Time Event & Notification Systems | The app **never push-notifies the child** (§14); the only outbound channel is the P3 consent-gated parent email (§13.4) |
| Physics & Collision Systems | No physics simulation anywhere; drag-drop uses simple snap tolerance (§10.3) |
| Shader & Rendering Pipeline / advanced GPU optimization | 2D sticker-style vector art; standard UI rendering suffices — GPU concern is limited to keeping celebration effects cheap on low-end tablets |
| Camera Systems & Cinematics | Fixed full-screen 2D screens; the 7 s splash is a timeline animation, not a camera system |
| AI & NPC Behavior (FSM, behavior trees, pathfinding) | No autonomous NPCs; the nearest analog is the adaptive-difficulty rules engine (§9), which is deliberately simple and deterministic |

### A.4 Practical team implication

- **P1** needs one generalist web/game developer plus content-authoring time (bank growth, §15.1) — no specialists.
- **P2** adds: an RN/Flutter engineer, a motion designer (Lottie/vector animation), audio/VO production, QA with child-testing experience (§17.3), and **standard mobile release engineering** (CI/store pipeline, crash triage, kids-program review readiness) — realistically absorbed by the P2 engineer plus part-time QA/release support, not separate hires.
- Privacy engineering stays trivially in-house while the game is local-only; it becomes a real workstream (consent flows, DSAR handling) only at P3.
- Nothing in the roadmap requires AAA/live-service specialties (netcode, shader authoring, console certification, server fleets, live-ops). Hiring or building for them would be scope creep — revisit only if the product direction itself changes.

---

## Appendix B — Decisions Register

Product decisions that shape requirements, with date and rationale. New entries append; reversals get a new row, never an edit of an old one.

### B.1 Decided

| # | Date | Decision | Rationale & consequences |
|---|---|---|---|
| D1 | 2026-07-19 | **Business model: freemium content.** First world of each subject free; additional worlds are one-time, parent-gated, non-consumable purchases. | Sustains development without ads, subscriptions, or currency sales. Consequences: §14.1 purchase requirements; §18 store review must cover purchase flows; store-managed entitlements (Restore Purchases) keep parent accounts unnecessary, so P3 stays optional; Appendix A monetization reclassified from "not applicable" to "applies, constrained." |
| D2 | 2026-07-19 | **Content endgame: world 2 per subject, authored before the P2 launch.** | 15 stages ≈ 1–2 weeks of play — too short a tail for a paid product. World 2 = harder tier of the same skills (§8.3) and the natural freemium boundary with D1. Progress schema is multi-world from P1 (§3.2, §7). Roughly doubles P2 content-authoring scope. |
| D3 | 2026-07-19 | **P1 beta distribution: hosted PWA** at a private URL — vendored libraries, offline-capable, home-screen installable. | Reaches real families earliest while still collecting zero data. Adds P1 tasks: vendor React/Babel, web manifest + service worker (§2). |
| D4 | 2026-07-19 | **Name: preliminary check run — conflicts found; treat "Bloom Academy" as a working title and rename before P2.** A live US trademark "BLOOM ACADEMY" (Bloom Academy Corporate, LLC, registered 2025) covers pre-school/kindergarten/elementary education services, and multiple store apps already use the same or near-identical names ("Bloom Academy" ×2 on Google Play, "Bloomin' Academy" on the App Store, "PlayBloom Academy"). | Shipping a US children's-education app under this name risks trademark opposition and store-listing confusion. Consequence: no P2 brand investment (store listing, logo art, VO that speaks the name) until a new name is chosen and formally cleared. Tracked as O4. |

### B.2 Still open

| # | Owner | Decision needed | Deadline / gate |
|---|---|---|---|
| O1 | Product owner | Confirm the §5 core-loop rules currently marked "proposed" (question re-queue after "Show me", modal behavior) | Before P1 hardening ends |
| O2 | Product owner | Final platform support matrix — §16 lists Android 11+ / iPadOS 16+ as *proposed* | Before the P2 port begins |
| O3 | Product owner | Ratify or revise the §17.4 KPI targets (currently hypotheses) | Before beta |
| O4 | Product owner | **Choose the replacement product name** and run formal trademark clearance (consequence of D4) | Hard gate: before any P2 brand investment |
| O5 | Product owner | World-2 pricing: per-world vs. all-subjects bundle, and price point | Before P2 store setup |
