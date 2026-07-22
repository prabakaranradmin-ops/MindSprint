# Bopplebee — Requirements Document

**Product:** Bopplebee (renamed from "Bloom Academy" → "Puddlejump" → "Bopplebee," all on 2026-07-22, see Naming note below and Appendix B, O4/D4) — educational game for children ages 5–12: Junior (5–7, original v1 scope), Middle (8–9), and Senior (10–12) tiers — see §26
**Doc version:** 4.16 · **Status date:** 2026-07-22 (see Changelog, §25)
**Sources:** `README.md` (design handoff), `index.html` + `screens-a…g.jsx` (27 design mocks), `screens-h.jsx` + `screens-i.jsx` (age-tier expansion mocks, §26 — shipped), `app.html` (playable prototype, now covering all 3 tiers), `styles.css` (design tokens, incl. `.senior` scope), `splash-video.html` (animated intro), two external product reviews + a 41-skill game-dev skills matrix (2026-07-19)

**Status tags** used throughout:

- **[Shipped]** — working in the current `app.html` prototype
- **[Planned·P1]** — feasible now in the web prototype; no backend needed
- **[Planned·P2]** — belongs to the production build (React Native/Flutter port)
- **[Future·P3]** — conditional on adding cloud accounts/sync; not needed while local-only

Delivery phases are summarized with feasibility notes in §21.

---

## 1. Product Overview

Bopplebee (called "Bloom Academy," then "Puddlejump," earlier the same day 2026-07-22 — see Naming note below) is an original education + infotainment game, originally for children ages 5–7 (Khan Academy Kids-style) and expanded 2026-07-22 (§26, decision O8) to serve ages 5–12 via three age tiers. The **Junior** tier (5–7, the original design) is a mascot-guided experience: **Pip** (a round sprout creature) guides the child through themed subject worlds with node-on-path progression, five distinct activity mechanics, star/coin rewards, an accessory shop, and a parent dashboard behind a math gate. The **Middle** (8–9) and **Senior** (10–12) tiers reuse the same subjects and question-generation engine behind a goal-dashboard (Middle) or XP/level "premium tween" (Senior) presentation — see §26 for the full tier breakdown.

**Subjects:**

| Subject | Theme color | Status |
|---|---|---|
| Numbers (math) | Coral | Playable |
| Words (reading/phonics) | Sky | Playable |
| Science | Leaf | Playable |
| Music | Berry | Locked (unlocks at 30 ⭐ per design) |
| Shapes | — | Design mocks only |

**Business model (decided 2026-07-19 — Appendix B):** freemium content. The first world of every subject is free; additional worlds are one-time, parent-gated purchases (§14.1). No ads, no coin sales, no subscriptions — ever.

**Naming note:** "Bloom Academy" was this product's original working title — a live US trademark conflict was found (Appendix B, D4). **The name changed twice on 2026-07-22**: first to "Puddlejump" (O4, `NAME_SHORTLIST.md` §5), then the same day to **"Bopplebee"** (`NAME_SHORTLIST.md` §7) when the product owner kept looking for a cleaner option after Puddlejump was already live. Each rename was applied everywhere the name is user-visible or a code-comment header — the app's title bar, boot splash, install manifest, parent-feedback prompt, and every code-comment header currently say "Bopplebee" throughout. **Neither rename is formal trademark clearance** — both happened ahead of, not after, the real USPTO TESS search, app-store search, domain purchase, and trademark attorney's opinion that O4 still requires (`NAME_SHORTLIST.md` §3); the product owner made an informed decision each time to accept that risk rather than wait, and `NAME_SHORTLIST.md` §7 flags directly that renaming twice in one day on search-based confidence alone is a pattern that should convert into the real §3 legal work before it happens a third time. `NAME_SHORTLIST.md` and `README.md` (the original 2026-07-19 design handoff) intentionally still say "Bloom Academy" in places, since both are historical records of what the product was called at each point in time, not descriptions of its current name.

---

## 2. Platform & Format

- **Target:** tablet-first, **1024×720 landscape**, landscape-locked.
- **Tap targets:** minimum 44px; most interactive elements 56–130px.
- **Current prototype:** single-file web app (`app.html`) — React 18 + in-browser Babel, no build step, no external assets (all art is CSS/SVG primitives + emoji placeholders).
- **Recommended production stack (per handoff):** React Native (Expo) + Reanimated + Skia; Flutter equally viable; Web/PWA fastest test path.
- The dark tablet bezel in mocks is presentation chrome only — not to be built.
- **Offline-first [Shipped]:** the core game loop must work fully offline. Network (if ever added) is only for updates and optional cloud backup; the app must never block play on connectivity. See the next bullet for the full mechanism and verification — this line previously duplicated it as a separate "Planned" item.
- **P1 beta distribution [Shipped 2026-07-21, decided in Appendix B]:** the prototype reaches test families as a **hosted PWA** at a private URL — React/Babel vendored locally (no CDN, §23), `manifest.webmanifest` (name, icons, `display:"standalone"`, `orientation:"landscape"`) + a cache-first `sw.js` service worker precaching every core file (app shell, `vendor/`, `content.js`, `audio-manager.jsx`, phoneme clips) for offline play and home-screen install. `sw.js` is generated by `scripts/gen-service-worker.cjs` from the real file set (§19.1 config-driven) rather than hand-maintained, so its precache list can't silently drift from what actually ships. Verified offline: reloading `app.html` with the browser context fully offline (`setOffline(true)`) still renders the app. Still collects zero data (§11.1).

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
- **[Shipped 2026-07-21] World 2 content authored — deliberately not wired to any UI yet.** `content.js` → `stageConfigsWorld2` has a full 5-stage lineup per subject (20 stages total), kept in a separate top-level key from `stageConfigs` so it carries zero risk to the shipped game. Not yet reachable: `STAGE_CONFIGS[subject][stageIndex]` is read as a flat single-world array in exactly 3 places in `app.html`, `CUR_WORLD` is hardcoded to `0` everywhere, and there is no world-switcher UI — all real P2 engineering work, not content. §14.1's purchase gate (the actual freemium boundary D2 ties World 2 to) also can't be built yet: it requires real platform IAP (StoreKit/Play Billing), which only exists in a native app, not this web prototype, and isn't safe to fake with a stub. **A real limitation found while authoring this:** question difficulty tier is driven entirely by the runtime adaptive system (age + rolling accuracy, §9.2), not by which stage or world a question belongs to — so a World 2 stage reusing a World 1 generator will only reach for harder bank content once the adaptive system independently decides the child is ready, regardless of which world it's in. Only two generators expose a genuine content-level difficulty knob today: `count` (`maxCount`, used for World 2's `math.count_to_9` stage — a documented harder counting variant that existed unused in `skillLabels` since before this session) and `rhythm` (`patternLen`, scaled to 5–7 vs. World 1's 3–5). Every other World 2 stage reuses its World 1 skill's generator as-is and is framed honestly as review/reinforcement against a much larger bank (all banks grown to 25+ items in the same session, §15.1) rather than a false claim of fixed harder difficulty. **Real fix, not yet built:** a stage-level `minTier` parameter, following the same pattern the `adapt` object already uses, would let a World 2 stage genuinely start harder independent of a child's current adaptive state — a small, contained generator change, tracked here for whoever picks up the P2 world-switcher work. Validated by 13 new unit tests (`stageConfigsWorld2` describe block) checking the same shape rules as World 1 plus a "same skill area as World 1" constraint. Also added while authoring this: 4 new tracing letters (L, I, E, K — `traceLetters` 9→13), each verified by rendering its stroke geometry to a screenshot before shipping.
- **[Shipped 2026-07-22] Stage-level `minTier` fix, closing the "real fix, not yet built" gap flagged above.** `generateQuestions()` now clamps its computed `adapt.tier` up to `cfg.minTier` when the stage config carries one (`if (cfg.minTier && adapt.tier < cfg.minTier) adapt = {...adapt, tier: cfg.minTier, near:true, twoOpts:false}`) — never down, so a child who has independently earned a higher tier via §9.2's step-up keeps it. All 9 non-count/rhythm/lifeorder `stageConfigsWorld2` stages (the ones whose generators actually read `adapt.tier`, either directly — addition/subtraction/compare/pattern — or via `pickBank`'s `difficulty>=2` widening — phonics/trace/pairs/wordbuild/habitat/sinkfloat/hotcold/livingmix) now carry `minTier:2`, giving World 2 a genuine content-level floor independent of the adaptive system, exactly as the 2026-07-21 entry above proposed. `count`, `rhythm`, and `lifeorder` deliberately have no `minTier`: the first two already scale by their own content knobs (`maxCount`/`patternLen`), and `lifeorder`'s generator ignores `adapt` entirely, so a `minTier` there would be a silent no-op. World 1 is unaffected (no `stageConfigs` entry sets `minTier`, so the clamp never fires for the live game). 3 new unit tests (fresh-tier-1 baseline, minTier:2 raising the floor, and a mastered-tier-3 child keeping their higher tier despite a lower stage `minTier`) plus a schema check that any `minTier` present is 2 or 3. All 86 acceptance tests and 83 unit tests pass.
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
| 6 | `phonics` | Words | "Which picture starts with letter X?" — 14-letter bank (S B C F M T R P D H N W O U), used in 4 stages |
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

- Profile + progress saved to `localStorage` (key `bloom-v3`, multi-profile shape — §12) on every state change after onboarding. The legacy single-profile `bloom-v2` key is only ever read once, to migrate into `profiles[0]` on first load with the new save format; it's kept untouched afterward as a backup, never written to again (§22.2). This section originally described the pre-§12 single-profile prototype and was stale — corrected 2026-07-21.
- Saved profile fields: name, age, avatarColor, avatarAccessory, coins, stars, streak — streak updates on stage completion per the §14 rules (rest-day grace, clock-backward safe), shipped 2026-07-19.
- Saved progress: per-subject **per-world** node statuses + per-stage star counts (§3.2, §7).
- Per-question auto-save and resume are shipped — see §22.1.

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

## 5. Core Loop Rules [Shipped — reconciled against `app.html` 2026-07-21, resolves O1]

This section originally listed the handoff's proposed rules pending product-owner confirmation. Every line has since been either built or superseded by a deliberately different (gentler) design, and the actual behavior is already cross-referenced elsewhere in this doc (§3.4, §3.5, §8.4, §17.1). Restating it here as fact, not proposal:

- **5 questions per stage; ~4 minute target.** (§3.4) `generateQuestions()` generators default to `n=5`.
- **Wrong answer: 1st mistake → gentle retry modal, same question re-presented. 2nd mistake → the retry modal additionally reveals the correct answer inline, then the question is re-queued once at the end of the set for another attempt** (§8.4, `NEXT_Q` reducer case) — a re-queued copy never re-queues again, capping a set at 10 questions. This replaces an earlier handoff idea of a separate "Show me" walkthrough screen; a single modal with an inline answer reveal is simpler and was judged sufficient.
- **Answer buttons are disabled while feedback is showing** (every answer-type component passes `disabled={!!feedback}`). On a correct answer the chosen card recolors green (`.ans-card.correct`) at the same moment the feedback modal appears — there is no separate "pulse, then modal" sequencing; a `pulse-correct` CSS animation exists from the original mockups but is not applied to any element in the shipped build, so the green recolor **is** the correct-answer signal (§3.5, §10.1 color-is-never-the-only-signal already covers the accessibility side of this via ✓ iconography).
- **Locked worlds unlock by total stars (Music = 30 ⭐).** (§14, §4 — Rhythm Tap shipped, Music is honestly star-gated with live progress.)
- **Feedback modals never require more than one tap to dismiss** — every feedback modal (`WrongModal`, correct modal) has exactly one action button, no multi-step gate.

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
| ink / ink-soft / ink-quiet | #3D2818 / #6B4F3A / #8B715E | text (warm, never pure black) — `ink-quiet` is the WCAG-AA-fixed value from the 2026-07-20 accessibility audit (§10.1); this table wasn't updated at the time |
| Music stage | #3E2A5C / #6B4794 | dark world background |
| Parent dashboard bg | #F7F3EE | adult surfaces |

**Signature rule:** every saturated color pairs with its `-dark` as a bottom shadow (`0 6px 0 <dark>`) — the "sticker" depth.

### 6.2 Typography

- **Fredoka** (500/600/700) — all kid-facing UI: display, buttons, headings.
- **Nunito** (600–900) — body, labels, parent dashboard.
- Scale at 1024×720: hero 64–84 · screen title 40–46 · card title 26–34 · button 22–32 · body 16–19 · chrome labels 12–14.
- **Kid-facing text never below 16px; critical instructions ≥ 18px.**
- Font-fallback stack must remain legible if fonts fail to load (system rounded sans first, then system-ui). [Shipped 2026-07-21] Fredoka (500/600/700) and Nunito (600/700/800/900) are now vendored locally — `assets/fonts/{fredoka,nunito}-variable.woff2`, loaded via local `@font-face` rules in `styles.css` instead of the Google Fonts `@import` (§2, §23). Closes the last remaining CDN dependency; the fallback stack above still applies if the local files ever fail to load for any reason.

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
- Pip's voice and writing style are governed by the **Pip Personality Bible** (§20) — [Shipped 2026-07-20, see `PIP_PERSONALITY_BIBLE.md`].

### 6.5 Fidelity Rules

- Colors, typography, spacing, radii, shadows are **final** — recreate pixel-close.
- Emoji used as art (🐶 🌼 🔬 …) are **placeholders** — replace with illustrated icons before ship, or standardize on a cross-platform emoji set (e.g., Twemoji) deliberately. Commissioned art must follow the representation rules in §10.4.

---

## 7. State Model [Audited 2026-07-21 — several fields marked Planned were already fully shipped]

- `profile`: name, age, avatarColor, avatarAccessory, coins, stars, streak, **xp** [Shipped 2026-07-22, §26] — Middle/Senior's XP total, additive alongside coins/stars, never replacing them; `level` is always derived (`levelFromXp()`), never stored separately.
- `progress`: per-subject → **per-world** → node states (done/current/locked) + per-stage stars — keyed `(subject, worldId)` even while only world 1 exists. [Shipped] Junior-only; Middle/Senior use `tierSession` below instead of the node-map model.
- `session`: subject, stageIndex, questions[], qIdx, mistakes, qMistakes, isReplay — Junior only.
- `tierSession` [Shipped 2026-07-22, §26]: subject, stageIndex, questions[], qIdx, correctCount, startTs, usedIds — Middle/Senior's parallel session shape, deliberately separate from `session` (no hearts, no node map, no remediation step-down; see §26.4).
- `settings` (design): music, sfx, readAloud, leftyMode, reducedMotion, dailyLimitMinutes (parent-set)
- `skills` [Shipped]: per-skill attempts/correct counters (see §9.1), updated via `bumpSkill()` on every answer and read by the adaptive-difficulty and parent-dashboard recommendation logic.
- `recentItems` [Shipped]: recently used bank-item IDs per profile, feeding the freshness rule (§15.1) in `pickBank()`.
- Persist locally; sync to account only if multi-device is required. Parent dashboard reads aggregates.
- **Forward-compatible IDs [Shipped]:** every profile gets a locally generated UUID at creation (`crypto.randomUUID()`, falling back gracefully if unavailable) so a future account model can map local data without migration pain (see §12).

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

- **Age-seeded start [Shipped, corrected 2026-07-21]:** the onboarding age sets the initial baseline — `getAdaptive()` maps age 5 to tier 1, age 6+ to tier 1 as well (tier only reaches 2 at age 7+), matching this bullet's tier claim exactly. **Correction:** distractor proximity is a simple two-state boolean (`near = age >= 6`), not the three-level far/standard/near progression previously described here — age 6 and age 7+ get identical (near) distractor proximity, there is no separate "standard" state in the code. Adaptivity (rolling accuracy step-up/step-down, §9.2) adjusts both tier and proximity from there. (This makes the collected age actually *used*; collecting unused data would violate §11.1 data minimization.)
- **Step up [Shipped]:** rolling accuracy ≥ 90% over the last 15 questions of a skill (`rollingAcc(..., 15)`, gated on ≥15 attempts) → offer a "challenge" variant (harder tier, near distractors). Corrected 2026-07-21 — previously described as "last 3 stages," which doesn't match the shipped window (the unit test is literally named "15+ attempts at ≥90% rolling accuracy steps up").
- **Step down [Shipped]:** rolling accuracy ≤ 60% over the last 10 questions of a skill → easier tier, reduce to 2 answer options where the mechanic allows (`twoOpts`). **Correction:** "auto-play hint audio" was never built and isn't planned as a literal hint clip — §8.4 already describes the real behavior accurately ("choices reduced to 2 serves as the auto-hint; visual hint overlays remain P2"). This bullet's own wording just hadn't caught up.
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
- **Reduced motion [Shipped, corrected 2026-07-21]:** a settings toggle (`reducedMotion`) applies a `body.reduced-motion` class with a blanket `animation:none !important`, genuinely disabling confetti, shake, and idle bobbing — all three are animation-based and fully covered. **Correction:** "honoring the OS `prefers-reduced-motion` signal" is only true for the boot/splash screen (`styles.css`'s one `@media (prefers-reduced-motion: reduce)` block covers just `.boot-pip`/`.boot-fill`/`.intro-pop`) — the OS signal is never read in JS and never sets the in-app toggle's default, so a child with OS-level reduced-motion enabled still gets full confetti/shake/bobbing during actual gameplay unless a parent also flips the in-app toggle manually. Feedback remains via color/icon/sound regardless.
- **Calm mode** — [Shipped 2026-07-20, completing the earlier saturation-only pass]: the "Calm mode" toggle (Kid Settings) now does the full job, not just a `saturate()` filter. Hides non-essential chrome via a shared `.calm-hide` class plus `.cloud`/`.hill`/`.sun-decor` — the map's stars line, coin chip, and both screens' decorative sky/hills disappear; the activity screen's hearts row and stage badge disappear. Softens sounds: `AudioMgr.setCalm()` applies a uniform 0.55× gain multiplier inside `_tone`/`_noise` (not silenced, just quieter — verified by intercepting `AudioParam.setValueAtTime`). Never framed as remedial: no "struggling" or "behind" language anywhere in the toggle or its effects.

---

## 11. Privacy, Safety & Compliance

Expands the COPPA posture. Phase 1 (local-only) keeps the compliance surface minimal by design.

### 11.1 Data categories [Documented 2026-07-19; surfaced to parents via the dashboard privacy summary]

- **Collected, stored locally only:** child first name (display only), age band (5–7), avatar choices, gameplay progress/aggregates, settings.
- **Never collected:** exact birthdate, email/phone of the child, photos, location, contacts, free-text input beyond the name field, voice recordings.
- While local-only: no data leaves the device; no third-party SDKs; no ads; no chat. This must remain literally true of the build (verified per §17.1 test 7).

### 11.2 Parental rights [Audited 2026-07-21 — corrected against code, see §12 for the full rename/delete finding]

- **[Shipped 2026-07-21] Reset a child's progress, rename a profile, delete a profile and all its data:** all three reachable via the "👨‍👩‍👧 Manage Children" card in the parent dashboard (§12) — parent-gated, gentle two-step confirmation on both Reset and Remove. **Reset** (`RESET_PROGRESS` reducer action) clears stars, coins, streak, map progress, skills, and event history, but keeps the profile's identity — name, age, avatar color/accessory — distinct from delete, which removes the profile entirely. Deliberately does **not** clear `lastBonusDate`: an early version did, which meant landing back on the map after a reset silently handed out the +10 coin daily hello bonus as a side effect of a parent action — caught by the acceptance test, fixed by leaving that field alone (§14 anti-stress rules: rewards are earned by presence, not granted by an admin action).
- A **plain-language privacy summary** lives in the parent area ("What we store: … What we never collect: …") — [Shipped 2026-07-19 as the "Privacy at a glance" dashboard card]. A link-out to the full policy is still required for any build distributed publicly.
- **[Shipped 2026-07-19] Local backup & transfer:** parents can export the full save (all profiles) to a local file (⬇ Download Backup) and import it on another device (⬆ Restore Backup) from the parent dashboard's "Data & Backup" card — parent-gated, file-based, no cloud involved. This is the device-loss mitigation for the local-only posture. Previously tagged Planned·P1 despite already working; corrected here and cross-referenced from the §23/§25 changelog entry that shipped it.

### 11.3 Consent (activates only with cloud features) [Future·P3 — design spec drafted 2026-07-20, see `P3_CLOUD_DESIGN.md` §1]

- Adding accounts/sync/remote analytics requires **verifiable parental consent** per FTC COPPA rules (e.g., email-plus, card verification) before any data leaves the device — and per equivalent regimes wherever the game is distributed: EU **GDPR-K**, and India's **DPDP Act 2023** (which requires verifiable parental consent for *all* users under 18, a wider net than COPPA's under-13).
- School deployments need a separate consent path (school consents in loco parentis) and a data-processing agreement.
- Cloud data must support parent-initiated **export and deletion**, with defined retention limits (data kept only as long as needed for the educational purpose).

---

## 12. Multi-Child Profiles & Accounts [Shipped 2026-07-21]

**Audit note (2026-07-21):** this section previously read "Planned·P1" wholesale, which understated how much was actually built and overstated a couple of specifics. A full line-by-line check against `app.html` found the storage/state layer essentially complete, but the picker screen was dead code (built, never routed) and two claims below didn't match anything in the code. Corrected in place rather than left to rot like the §5/§8.4 mismatch was.

- **[Shipped] Storage & migration:** up to 4 local profiles, hard-capped in the `NEW_PROFILE` reducer case (no bypass except a hand-edited/restored backup file, which isn't validated for count — an acceptable edge case, not a UI path). Real shape is `{ version:3, activeProfileId, settings, profiles:[{id, profile, progress, skills, events, recentItems, session}] }` — richer than a single `progress`/`skills` pair, since it also carries the per-profile event log and session-resume state. The single `bloom-v2` save migrates automatically to `profiles[0]` on first load, old key kept as a backup.
- **[Shipped, bug fixed 2026-07-21] Profile picker at launch when >1 profile exists:** Pip avatars + names + star counts, big tap targets, a "+ New Child" tile (hidden once 4 profiles exist). The picker screen (`ProfilePickerScreen`) and its reducer actions (`SWITCH_PROFILE`, `NEW_PROFILE`) were already correct, but the screen was **unreachable** — the render switch had no `case 'picker'` (fell through to the splash screen instead), and `SplashScreen` was never passed a `kidCount` prop, so its "👥 Switch Child" / "🌱 New Child" chips silently never appeared even with multiple profiles on the device. Both fixed: the router now has a `picker` case, and `kidCount={state.roster.length}` is passed at both `SplashScreen` call sites. Verified end-to-end: with >1 profile the app now boots straight to the picker, and Settings → "🏠 Title screen" → splash → "👥 Switch Child" → picker also works. Creating a new profile correctly runs the normal onboarding flow (`NEW_PROFILE` routes to `welcome` same as first-run).
- **Correction:** the earlier "additional profiles may prefill the Learning Plan default to shorten it" claim does not describe anything in the code — `NEW_PROFILE` resets onboarding to the exact same default subject selection every time, with no shortening logic for 2nd+ profiles. Removed as a false claim; could be a real future enhancement but isn't built or currently planned.
- **[Shipped 2026-07-21] Profile rename/delete, parent-gated:** a "👨‍👩‍👧 Manage Children" card in the parent dashboard lists every profile on the device (via `composeProfiles`, so it reflects live state, not a stale snapshot) with inline **Rename** (12-char cap, same `sanitizeNameInput`/`finalizeName` rules as onboarding) and **Remove**. Both dispatch the pre-existing `RENAME_PROFILE`/`DELETE_PROFILE` reducer actions, which needed no changes — only the UI was missing. Works correctly for a non-active child too (renaming/removing someone other than the currently-logged-in profile).
- **[Shipped 2026-07-21] Gentle deletion:** clicking Remove doesn't delete immediately — it swaps that row into a confirmation state ("Say goodbye to {name}? This removes their progress from this device for good. It can't be undone.") with Pip waving, and two buttons: "Keep them" (backs out, changes nothing) or "Yes, say goodbye" (confirms). No sad imagery, no crying Pip, no guilt language — matches the tone rule this bullet originally specified, now actually built to it.
- **Correction (kept from the 2026-07-21 audit):** the earlier "parent dashboard gets a child-switcher (already designed in mock #27)" claim didn't correspond to any file in this repo — no "mock #27" exists among the design mocks. The Manage Children card above supersedes the need for a separate switcher UI; renaming/removing from the dashboard was the actual gap, not switching (switching already works via the picker, §12 above).
- **P3:** profiles map to a parent account via their UUIDs; local-first with sync, never sync-required. The parent-account model assumed here is the same one `P3_CLOUD_DESIGN.md` §1 specs out — no independent child credentials, ever; the parent is always the account holder.

---

## 13. Analytics & Telemetry [Planned·P1 local / Future·P3 remote]

### 13.1 Event model (P1: logged to local storage only, feeding the parent dashboard) — [Shipped 2026-07-20: the dashboard's Today stat and weekly play-time chart now derive from stage_complete durations in the event log, and the Skills card reads §9.1 skill accuracy — no more simulated data]

`session_start/end` (added 2026-07-21 — see below), `onboarding_step {step}` (funnel/drop-off), `stage_start`, `stage_complete {subject, stageIndex, stars, mistakes, durationSec}`, `stage_quit {subject, stageIndex, qIdx}` (mid-stage abandonment), `question_answered {skill, correct, attemptNo}`, `answer_revealed`, `shop_buy {id, price}`, `settings_changed`. Retain raw events locally for 90 days; keep aggregates indefinitely. **Corrections (2026-07-21 audit):** `session_start`/`session_end` were listed here but not actually logged anywhere — fixed: `App()` now logs `session_start` once per mount and `session_end` on `visibilitychange`→hidden (the standard reliable signal; `beforeunload` isn't consistent on mobile). `shop_purchase` never matched the real event name, which is `shop_buy` (`SHOP_BUY` reducer case) — corrected here to match code rather than renaming the shipped event. `hint_used` is removed from this list: there's no hint-audio/hint mechanic anywhere in the app to generate it (see the §9.2 correction on the same date) — nothing to log, so nothing was actually missing here, the doc just implied a feature that doesn't exist.

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
- **[Shipped 2026-07-21] Teacher/classroom mode — local-only slice:** a "🏫 Classroom Report" card appears in the parent dashboard whenever 2+ profiles exist on the device (a teacher-owned tablet with several student profiles, not a single-child household) and prints an aggregate report — class-average subject completion, total stars, average streak, and class-wide per-skill accuracy computed across every profile's `skills`. Per `P3_CLOUD_DESIGN.md` §4.2's anti-ranking rule: the report contains **no per-child rows and never names an individual child** — verified by an acceptance test that scans the printed HTML for either seeded child's name and asserts neither appears. Entirely on-device; nothing is transmitted anywhere, so §4.1's data-processing-agreement requirement (a legal artifact between the business and a school, not something buildable in code) doesn't apply to this slice — it only gates a future cloud/multi-device version. Design spec: `P3_CLOUD_DESIGN.md` §4.
- **[Future·P3] Weekly summary email:** requires a parent account and verified consent (§11.3); local-only builds never send email. Design spec drafted 2026-07-20, see `P3_CLOUD_DESIGN.md` §5.
- **[Shipped 2026-07-21] Milestone postcards:** a "🎉 Milestone Postcards" card in the parent dashboard lists every subject world the child has fully completed (all 5 stages `done`) and prints a celebratory postcard for it — *"Leo finished Numbers World!"* with Pip (in the child's current color/accessory) and the completion date. Reuses the exact `window.print()` + dedicated print-only-block mechanism already shipped for the progress report; the two print blocks are mutually exclusive (`!postcardWorld && <div className="print-report">…`) so printing a postcard never also prints the data report. The card itself only renders when at least one world is at 100% — never shown with zero completions, never a nag (§14 no-broken-promises).
- **[Shipped 2026-07-21] Real-world activity suggestions:** the existing "Practice next" skill recommendation (§9.3, driven by `weakSkill` — the lowest-accuracy skill with ≥5 attempts and <70% accuracy) now shows a second line translating the skill into a concrete real-world activity, e.g. *math.count_to_5* → "Next time you're at the grocery store, ask them to help count 5 apples into a bag." Backed by `content.js` → `realWorldTips`, a hand-authored bank with one entry per skill ID (§9.1's full list, not just a sample) — same content-as-data approach as the question banks (§15.1). Appears both on the live dashboard card and in the print report's "Suggested focus" section. Purely additive; the plain percentage view is unchanged for parents who just want the numbers.

---

## 14. Game Economy & Progression Tuning [Planned·P1 — constants + doc]

- **Earn rates (current):** 15–25 coins/stage; a typical 20-min session ≈ 4–5 stages ≈ 75–125 coins.
- **Pricing rule:** small shop items 60–100 coins, premium items 150–250 — a child playing ~20 min/day can afford **about one small item per day**. Shop prices live in config (§19.1), not code.
- **No hoarding pressure:** no daily coin caps needed at these rates, but stage-replay farming is limited — replaying an already-3-starred stage awards **5 flat coins** instead of the full amount. — [Shipped 2026-07-20]: the cap applies only when the node's star count *before* the replay started was already 3 (a fresh or improving stage still pays the full `stars*5+10`); tracked via `session.preStars`, captured at `START`.
- **Daily hello bonus [Shipped]:** on the first launch of each day, Pip greets the child and gives **10 coins** ("Good to see you!"). The bonus is flat — never multiplied by consecutive days, so missing days costs nothing. (`DAILY_BONUS` reducer case; see §4's 2026-07-19 Fixed entry for the original ship date — this bullet was a stale duplicate.)
- **Affordability celebration** — [Shipped 2026-07-20]: the shop screen watches the coin balance and, the first time it crosses an unowned item's price, shows a one-time Pip banner ("You have enough for the Sun hat! 👒") with a chime and voice line. Tracked per item in `profile.affordNoticed` so it truly never repeats — a celebration, never a nag or a purchase push.
- **Streak rules [Shipped]:** a streak-day = at least one completed stage on a local calendar day. One missed day is silently bridged as a "rest day" (streak survives); two or more missed days reset the streak quietly. No streak-loss messaging, ever (anti-stress rule below). (`updateStreak()`; stale duplicate of the 2026-07-19 §4 Fixed entry — corrected here.)
- **Anti-stress rules (hard requirements):**
  - Streaks reward presence, never punish absence — a broken streak resets quietly with no guilt messaging, no lost items, no "😢".
  - No countdown timers on purchases, no limited-time offers, no "dark pattern" urgency anywhere in the kid experience.
  - **No push notifications to the child [Confirmed, verified 2026-07-21]:** the app never sends push notifications or engagement nudges to children — no "Pip misses you!" re-engagement messaging. This is a negative constraint, not a build target: confirmed by absence — no `Notification`/`pushManager`/`showNotification` code exists anywhere in `app.html` or `sw.js`. The only outbound communication of any kind is the parent-facing summary email (Future·P3, consent-gated, §13.4). Re-check this whenever `sw.js` gains push-related code, since a service worker is the one place this constraint could be silently violated.
  - **Shop rotation caveat [Planned·P2]:** a "featured item" spotlight may rotate, but items never disappear from the shop and nothing is time-limited — rotation is presentation, not scarcity.
  - Optional parent-set **daily play limit** — [Shipped 2026-07-20]: a dashboard toggle (off by default) sums today's `stage_complete` durations from the local event log; at 30 minutes, Pip gets sleepy and a full-screen break message replaces the app (progress already saved — no content lost). Parents can always re-enter through the gate and turn the limit off. Hard cutoff / configurable duration remain P3.
- **Music unlock pacing:** 30 ⭐ ≈ 10–15 completed stages ≈ 2–4 typical sessions. Tuning must keep the unlock inside a child's first week of regular play.
- **No broken promises** — [Shipped]: a star-goal unlock may only be shown if its content exists in the build. Rhythm Tap shipped (§4 P2), so the Music world is now honestly star-gated with live progress toward "Earn 30 ⭐!" rather than hidden — see §4 for the locked-state screen.
- **Clock robustness [Shipped, DST coverage added 2026-07-22]:** streaks and the daily hello bonus key off the local calendar date, and date anomalies always resolve in the child's favor — a clock moved backward never revokes an earned streak or bonus, at most one hello bonus is granted per calendar date, and DST or timezone travel never breaks a streak. (`todayStr`/`dayDiff` compare local `YYYY-MM-DD` date strings.) **Correction:** this line previously claimed "§17.1 test 13 covers this [DST]" — only the clock-backward case was actually automated; the DST/timezone-shift variants `tests/TRACEABILITY.md` had flagged as a follow-up were never written until now. Two new acceptance tests (`tests/acceptance.spec.cjs`, an `America/New_York`-scoped `describe` block) drive a real browser clock across the actual 2026 US spring-forward and fall-back transitions and confirm the streak advances by exactly one day either way. While writing them, also checked the `dayDiff` code comment's claim that noon-anchoring specifically "avoids DST edge cases": reproducing the exact computation against both the 2026 US transitions and a historical midnight-transition timezone (Brazil pre-2019) found no case where a midnight anchor actually diverges from a noon anchor for this function's real usage — `Math.round()` absorbs the ±1 hour shift for any whole-calendar-day comparison, which is all `dayDiff` is ever called with. The genuine hazard noon-anchoring guards against (a local time-of-day string landing inside a skipped/repeated DST hour) is real in general but isn't reachable through `dayDiff`'s current call sites — noted here as a documentation correction, not a functional bug; the two new tests are kept regardless since they now give real, previously-missing regression coverage for the full real-world DST path.

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
- **[Shipped 2026-07-21] Minimum bank sizes (repetition guard) — production targets met:** phonics 41/40 (all 26 letters covered, most with 2 option sets), word-pic 30/25, living 26/25, size 25/25, sinkfloat 25/25, hotcold 25/25, habitat 26/25, lifecycle 18/15, lifecycleSeqs 16/15. Grown from the original 8–14-item prototype banks in a single content-authoring pass — pure data added to `content.js`, no engineering changes. Every new item follows the existing distractor-proximity convention (§8.3: difficulty 1 = far/unrelated distractors, difficulty 3 = near/confusable) and passes the full content-schema test suite (23 tests) unchanged. Diversity/neutrality: new items are universal objects/animals, no gendered nouns or culture-specific items, consistent with the 2026-07-20 accessibility audit's finding on the original bank (§10.4).
- **Freshness rule [Shipped, corrected 2026-07-21]:** never repeat a bank item within a stage — `pickBank()` excludes any id in `recentItems` from the current pick whenever the filtered pool is still large enough, falling back gracefully when a bank is too small to satisfy it. **Correction:** the "avoid repeating an item from the last 2 sessions" claim overstated what's built — `recentItems` (§7) is an undifferentiated recency list per profile with no session-boundary or expiry concept; there's no code that tracks or windows by "the last 2 sessions" specifically. What's real: recently-used ids are avoided; how far back "recently" reaches is a function of list size, not a session count.
- **Scene variety for generated math** — [Shipped 2026-07-20, fixed 2026-07-20]: a `SCENES` palette (apple 🍎 / berry 🫐 / flower 🌸 — 3 skins) is picked once per question and threaded through `AppleTree` (counting/subtraction), `MiniTree` (compare), plus the scene noun in "N apples fell"/"N apples" text — pluralized correctly (`berries`, not `berrys`). **Addition is intentionally excluded**: it renders as `AdditionBlocksView`, abstract colored counting blocks (§4 P2 drag mechanic), never fruit — its instruction reads "How many blocks altogether?" and does not vary by scene.
  - **Bug found via user report, fixed same day:** the original scene-variety pass edited `AdditionView`, a fruit-grid component that turned out to be **dead code never rendered** — the live addition mechanic is the drag-blocks view, which still showed the stale "How many apples altogether?" text (from `content.js`) while displaying plain colored squares, and Compare's instruction always said "apples" regardless of which scene was actually drawn since the static stage-config text was never overridden per-question. Fixed by: computing a scene-aware `instruction` on the `count`/`compare` question objects (overriding the static stage text, same pattern §9.4's `living` questions already used), correcting the addition stage's static instruction to describe blocks, and deleting the dead `AdditionView` component so this can't recur. Regression tests added for both stages.

### 15.2 Localization readiness (P2)

- All UI strings come from a string table from the production port onward; no hardcoded kid-facing text.
- **String key convention (adopt at first extraction):** `area.screen.element`, e.g. `stage.numbers.1.instruction`, `modal.retry.title`, `shop.item.sunhat.name`.
- Layouts must tolerate +40% string length (German/Spanish); RTL mirroring is a P3 concern but no layout may *preclude* it (avoid baked-in directional art where possible).
- Phonics content is **language-specific, not translatable** — each locale needs its own letter/word banks authored by a native speaker. Flag this in the content model (`locale` field).
- Culture-specific bank items carry a substitution tag for per-locale swaps (§10.4).

### 15.3 Audio & voice assets

- **P1 interim TTS — with limits:** browser Speech Synthesis API behind the read-aloud setting for instructions and praise. Known limitations are accepted for prototyping only: robotic tone, uneven pronunciation, patchy language support. On-screen text remains the primary carrier (§10.2).
- **Phoneme exception [Shipped 2026-07-21 (sprite system + code); audio content still open]:** isolated letter sounds ("sss", "buh", "mmm") **must be pre-recorded audio sprites even in P1**. TTS cannot render isolated phonemes reliably, and wrong phonics audio actively mis-teaches. The full manifest (`content.js` → `phonemeIds`: 26 letters + 7 common digraphs — sh/ch/th/wh/ng/ee/oo) and player are shipped: `AudioMgr.phonics(letter)` in `audio-manager.jsx` plays `assets/phonemes/{id}.wav` (or `.mp3` if present), auto-playing once per question in both Phonics and Tracing, plus a tap-to-replay button on the letter tile itself. Missing/failed clips are silent no-ops — never a fallback to synthesis or TTS, per the rule above. **What's shipped today is a placeholder set**: every id has a silent WAV (`scripts/gen-phoneme-placeholders.cjs`), so the code path is fully real and tested, but no actual sound plays yet. Swapping in real recordings is a pure asset drop — same filenames under `assets/phonemes/`, zero code changes. A unit test (`tests/unit/content-schema.test.cjs`) enforces that every letter used by the `phonics`/`traceLetters` banks resolves to a manifest entry, so bank growth can't silently outrun the sprite set. **Recording brief:** `PHONEME_RECORDING_BRIEF.md` (added 2026-07-21) specifies exactly what to record — voice direction, technical spec, and a letter-by-letter "say this, not that" pronunciation table for all 33 clips, prioritized by which 14 are actually load-bearing today.
- **P2 recorded VO:** one line per instruction template + per letter sound + per praise/retry variant, per language; warm, region-neutral voice.
- **Per-world audio identity [Planned·P2]:** each world gets a consistent ambient/music palette matching its art direction (orchard birdsong, forest wind, lab blips, stage crowd) so worlds are recognizable with eyes closed.

---

## 16. Performance & Device Support [Planned·P2 — applies to the production build]

- **Cold start ≤ 3 s** to interactive splash on a mid-range Android tablet (2 GB RAM class).
- **Animation budget:** 60 fps target; no visible hitches during screen transitions, modals, or Rhythm Tap note-fall (Rhythm Tap is the perf stress case — it gates on this).
- **Bundle size:** initial download ≤ 50 MB; VO packs and world art beyond the first world are lazy-loaded/optional downloads.
- **Support matrix [Ratified 2026-07-21, D6]:** Android 11+ tablets, iPadOS 16+; phones unsupported at v1 (landscape tablet layout only).
- **[Shipped 2026-07-20]** React/ReactDOM/Babel-standalone and Fredoka/Nunito are all vendored locally (`vendor/`, `assets/fonts/`) rather than loaded from a CDN, honoring the offline rule (§2, §23). This note previously described the pre-fix state.
- **[Shipped 2026-07-21] Design-mock files:** `index.html`, `index.src.html`, and `splash-video.html` (§24 File Map) also now vendor React/ReactDOM/Babel-standalone locally, under `vendor-mocks/` — a separate directory from `vendor/` since these files pin different exact versions (React/ReactDOM 18.3.1 matches, but Babel-standalone 7.29.0 vs. `app.html`'s 8.0.4). `index.html`'s Twemoji library is also vendored (`vendor-mocks/twemoji.min.js`); `splash-video.html`'s fixed Fredoka/Nunito references now reuse the same `assets/fonts/` files as `app.html`. Two things were deliberately left on CDN, both by design rather than oversight: `index.html`'s *dynamic* font-picker (constructs a Google Fonts URL at runtime for whatever family a designer is trying — vendoring would mean bundling every possible font, defeating the tool's purpose), and Twemoji's per-emoji SVG artwork fetches (inherent to how `twemoji.parse()` renders — vendoring would mean bundling its full ~3600-glyph set for a design-reference file, not the shipped app). `index.src.html` was found to reference two `.jsx` files (`design-canvas.jsx`, `tweaks-panel.jsx`) that don't exist anywhere in the repo, confirmed present since the initial commit — a pre-existing broken reference unrelated to this fix, left as-is at the time. **Resolved 2026-07-21 (§26, §24):** both files were recovered from an updated design-canvas export and added to the repo, along with `animations.jsx` from the same export; `index.src.html` now resolves.

---

## 17. QA, Testing & Acceptance Criteria [Planned·P1 checklist / P2 protocol]

### 17.1 Functional acceptance tests (all 13 automated as of 2026-07-21)

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
- **Bank schema validation** runs on every content change: required fields (§15.1), unique IDs (including cross-bank global uniqueness), correct-answer presence, no duplicate options, curriculum tags (§8.2), and referential checks (e.g., every `habitat` bank entry's home/wrong-answer habitats exist in `habitats`). 36 tests in `tests/unit/content-schema.test.cjs` as of 2026-07-21 (grew from the original 21 — phonemeIds manifest checks, then the `stageConfigsWorld2` describe block); this pass caught two real content gaps early on (trace letters O and U had no phonics tie-in), fixed in the same sweep.
- **Live-site testing [Shipped 2026-07-21]:** the same 62-test Playwright acceptance suite (with `screenshot: 'on'`, captured in the HTML report per test) can run against a deployed URL instead of the local dev server — set `LIVE_URL` before invoking `npm test`/`playwright test` (e.g. `LIVE_URL=https://prabakaranradmin-ops.github.io/MindSprint/ npm test` in bash, or `$env:LIVE_URL='...'; npm test` in PowerShell). `playwright.config.cjs` uses it as `baseURL` and skips starting a local `webServer` in that mode. Every `page.goto`/`page.request.get` call in the suite uses relative paths (no leading slash) specifically so this resolves correctly against a subpath-hosted site like GitHub Pages — a leading slash would silently resolve to the domain root and drop the `/MindSprint` subpath, 404ing everything. First real run against the live URL immediately caught a genuine problem: the deploy hadn't picked up several recent commits (stale `unpkg` CDN references, missing `manifest.webmanifest`/`sw.js`/`vendor/`) — a real finding from actually pointing tests at production, not a hypothetical.
- **Visual regression** on design tokens and core screens (P2, once the production component library exists).

### 17.3 Child usability testing (P2, pre-launch gate)

- Observed sessions with **≥ 5 children ages 5–7**: each completes onboarding + first stage **without adult help**; note every moment an adult had to intervene and treat it as a defect.
- Watch for: tap-target misses, instruction comprehension without reading, emotional response to the retry modal (target: no distress).

### 17.4 Success metrics & KPIs [Instrumentation Shipped; targets Ratified 2026-07-21, D7]

Measured from local analytics (§13.1) during beta; targets are confirmed as the working beta baseline — revisit only once real beta data lands (§17.5):

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
- **Name-field constraints [Shipped 2026-07-19]:** the child's name is capped at 12 characters, restricted to letters and spaces (per-locale alphabet via `sanitizeNameInput`), and passed through a small disallow-list at entry (`NAME_BLOCKLIST`); rejected input falls back to a friendly default ("Friend") rather than an error. Already correctly listed under §23's "Fixed (2026-07-19)" — this tag just hadn't been updated to match.
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
- **Pip Personality Bible** — [Shipped 2026-07-20]: `PIP_PERSONALITY_BIBLE.md` covers Pip's voice pillars, mood-to-trigger table (happy/curious/proud shipped, thinking reserved/unused), the actual shipped vocabulary (`CORRECT_MSGS`/`RETRY_MSGS` and every situational line in `app.html`), phrases Pip would never say (each tied to a specific product rule — no-fail-language, no peer comparison, no urgency), the Pip-vs-parent-dashboard register split, and localization notes for the random-pick praise pools.
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

## 22. Session Management & Error Resilience [Shipped]

Children this age are frequently interrupted mid-play; the game must never lose their work or show them a broken state.

### 22.1 Auto-save & resume

- **Auto-save after every answered question**, not just at stage end (extends §3.8).
- Relaunching mid-stage offers a kid-friendly choice: **"Keep going!"** (default — same question, mistake counts intact) or **"Start over"** (restart the stage fresh). Both phrased positively.
- App backgrounded / device sleep / low-battery shutdown: nothing is lost — every state change already triggers a save (not a dedicated visibility-change listener, but the practical guarantee holds: the last interaction is always already persisted before backgrounding can happen).
- **[Shipped 2026-07-21] Onboarding is resumable:** was a genuine gap until this date — `doSave()` previously excluded the `welcome`/`avatar`/`plan` screens entirely, so a parent closing the tab mid-onboarding lost the child's name/avatar/age and restarted from scratch. Fixed: `SET_NAME` already assigned a profile UUID as the very first onboarding action; the save effect now persists through onboarding too (only `splash`/`picker` stay excluded), each snapshot carries `onboardScreen` (which of welcome/avatar/plan to resume at) and `onboard` (step counter, selected subjects), and a new `profile.onboarded` flag (set by `FINISH_ONBOARDING` on reaching the map) distinguishes "onboarding interrupted, resume it" from "no profile yet" or "fully set up." A v2→v3 legacy migration is always treated as already-onboarded (it necessarily completed onboarding under the old system). The upfront time estimate ("Just a few quick steps — about 3 minutes") now shows on the splash screen's "Start Learning!" button for a genuinely new profile. Verified end-to-end: interrupting after the name step and reloading lands back on the avatar screen with the name intact (screenshot-verified), not a restart.

### 22.2 Error states

- **[Shipped 2026-07-21] Corrupted/unreadable save — full mechanism:** `doSave()` now keeps a one-deep rolling backup at `bloom-v3-backup` — before every write, whatever was previously in `bloom-v3` is rolled into the backup slot (only if it's valid JSON, so corruption never propagates into the backup). `loadStore()` tries `bloom-v3` → `bloom-v3-backup` → the legacy `bloom-v2` migration path → fresh start, in that order, and repairs the live `bloom-v3` key from whichever source recovered it. If `bloom-v3` itself is unreadable, the raw corrupt blob is preserved verbatim under `bloom-v3-corrupt` (`stashCorruptSave()`) rather than silently discarded. The parent dashboard shows a calm, dismissible "we found and recovered from a save file problem" notice when that diagnostics key is present — informational only, never blocks anything, never shown to the child. Never crashes, no white screen, matches this bullet's original description in full (previously only the "fall back to v2 or start fresh" half was built — see the 2026-07-21 audit note that flagged the gap).
- **Storage full / quota errors:** play continues in-memory; a warning appears in the parent area only — the child never sees a storage error.
- **Asset failures:** missing fonts fall back per §6.2; the production build vendors all assets locally (§16), so no screen may depend on a network fetch to render.
- Any unexpected runtime error surfaces to the child, at worst, as Pip "thinking" plus a "Let's try that again!" reload of the current screen — never a stack trace, blank screen, or dead end.

---

## 23. Known Issues in the Current Build (`app.html`)

No open code-level known issues at present. The remaining gap is content, not engineering: the phoneme sprite manifest (§15.3) is shipped and wired end-to-end, but every clip is a silent placeholder — real recordings are needed before phonics/tracing actually sound out letters. Tracked in §15.3, not here, since it's an asset-authoring task rather than a bug.

**Fixed (2026-07-21):**

- ~~Letter sounds are not voiced~~ — `AudioMgr.phonics(letter)` (`audio-manager.jsx`) now plays a recorded-sprite clip per letter/digraph instead of a synthesized buzz, auto-playing once per question in Phonics and Tracing plus a tap-to-replay affordance on the letter tile (§15.3). Manifest (`content.js` → `phonemeIds`) covers all 26 letters + 7 common digraphs; a schema test enforces every phonics/traceLetters letter resolves to a manifest entry. **Audio content is still a placeholder** (silent WAVs) pending real recordings — see §15.3 for what's actually left.
- ~~Google Fonts loaded remotely~~ — Fredoka and Nunito are now vendored locally as two variable `.woff2` files (`assets/fonts/`), replacing the `styles.css` `@import` with local `@font-face` rules at the exact weights the design system uses (§6.2). This was called out as still-open when the CDN vendoring fix shipped 2026-07-20; closing it removes the last remote asset dependency in `app.html`.

**Fixed (2026-07-20):**

- ~~React/Babel still load from CDN~~ — `app.html` now loads React 18.3.1, ReactDOM 18.3.1, and `@babel/standalone` 8.0.4 from a local `vendor/` directory instead of unpkg (§2, D3). Sources are pinned as devDependencies (`package.json`) for reproducible re-vendoring; the copied files are committed since the static server (`serve.cjs`) has no build step. Scoped to the playable prototype only — `index.html`/`index.src.html`/`splash-video.html` (design mocks, §24) still reference unpkg and are out of scope, since they aren't the offline-required build. All 36 unit tests + 42 Playwright acceptance tests pass unchanged.

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
| `index.html` | All 34 design mocks (27 Junior + 7 Senior/Middle) + 3 art variations on one canvas — **[Synced 2026-07-22]** hand-spliced with the same screens-h.jsx/screens-i.jsx script blocks and gallery `DCSection`s as `index.src.html`, since no build step produces it automatically; verified to load and render error-free in a real browser (Playwright smoke check) |
| `index.src.html` | Module-loading source (palette presets, font options) — updated 2026-07-21 with the §26 age-tier gallery sections |
| `screens-a…g.jsx` | Screen mock implementations by section (27 Junior-tier screens) |
| `screens-h.jsx`, `screens-i.jsx` | **[Added 2026-07-21]** Age-tier expansion mocks (§26) — Senior dashboard/quiz/results/achievements, Middle home, age→tier onboarding, streak reset, typed answer, reading comprehension. Design reference only, not wired into `app.html`. |
| `design-canvas.jsx`, `tweaks-panel.jsx` | **[Restored 2026-07-21]** Gallery/tweak-panel scaffolding that `index.src.html` references — previously missing from the repo since the initial commit (a gap §16 had flagged and left unresolved); now present. |
| `animations.jsx` | **[Added 2026-07-21]** Animation reference helpers from the same design-canvas export. |
| `ui-kit.jsx` | Shared components (TabletFrame, Pip, Btn, Chip, Stars, Bubble, ProgressBar, TopBar) |
| `styles.css` | Design system CSS (tokens live here) |
| `variations.jsx` | Art-direction options (A is canon) |
| `splash-video.html` | 7s animated intro with scrubber |
| `audio-manager.jsx` | Audio manager — synthesized SFX + phoneme sprite player (§15.3) |
| `pip.svg` | Vector Pip mascot — full mood/color reference sheet |
| `screenshots/` | PNG captures of every mock, numbered in flow order |
| `README.md` | Original design handoff document |
| `REQUIREMENTS.md` | This document — canonical spec |
| `vendor/` | Locally vendored React/ReactDOM/Babel-standalone for `app.html` (§2, §23) — sourced from the pinned npm devDependencies |
| `vendor-mocks/` | Locally vendored React/ReactDOM/Babel-standalone/Twemoji for the design-mock files (§16) — separate from `vendor/` since these pin different exact versions |
| `manifest.webmanifest` | PWA manifest — name, icons, standalone/landscape display (§2, D3) |
| `sw.js` | Service worker, cache-first offline precache — generated, not hand-edited (§2) |
| `assets/icon.svg`, `assets/icon-192.png`, `assets/icon-512.png` | App icon — Pip, happy/leaf, extracted from `pip.svg`'s reference sheet |
| `assets/phonemes/*.wav` | Phoneme sprite clips (§15.3) — currently silent placeholders, real recordings drop in under the same filenames |
| `PHONEME_RECORDING_BRIEF.md` | What to record for §15.3 — voice direction, tech spec, letter-by-letter pronunciation table |
| `assets/fonts/fredoka-variable.woff2`, `assets/fonts/nunito-variable.woff2` | Vendored Google Fonts, self-hosted (§6.2, §23) |
| `scripts/gen-phoneme-placeholders.cjs` | Regenerates placeholder phoneme WAVs from `content.js` → `phonemeIds` (uses the existing `content.js.export.cjs` Node loader) |
| `scripts/gen-service-worker.cjs` | Regenerates `sw.js`'s precache list from the real file set |

---

## 25. Changelog

| Date | Version | Change |
|---|---|---|
| 2026-07-22 | 4.16 | **Stage-level `minTier` implemented (§3.2), closing the flagged World-2 content-floor gap.** `generateQuestions()` now clamps its adaptive tier up to a stage's own `cfg.minTier` when set, never down — so a World 2 stage can genuinely start harder independent of a child's own adaptive state, rather than depending entirely on that child's rolling accuracy having already stepped up (§9.2). All 9 `stageConfigsWorld2` stages whose generators actually read `adapt.tier` now carry `minTier:2`; `count`/`rhythm`/`lifeorder` deliberately don't (their generators don't use `adapt.tier`, or ignore `adapt` entirely). World 1 is unaffected — no live stage config sets `minTier`. 3 new unit tests plus a schema check. All 86 acceptance tests and 83 unit tests pass. |
| 2026-07-22 | 4.15 | **O11 resolved: real Middle/Senior science content authored (§26.13, D14).** Replaced the 3 mismatched-difficulty stages per tier (of Science's 5) with a new `scienceQuiz` bank — 36 curriculum-tagged multiple-choice items across 7 skills (NGSS grade-3 topics for Middle: forces & motion, weather & climate, states of matter; NGSS grade-5 topics for Senior: energy transfer, ecosystems & food webs, matter & its properties), plus a new `genScienceQuizQs` generator and `ScienceQuizView` component. The 2 stages per tier that were already genuine, accurately-labeled content (`habitat`, `lifeorder`) were kept as-is. Senior's stage labels/curriculum tags, previously mismatched to their underlying Junior-level mechanic, are now correct. 2 new acceptance tests (Middle and Senior science-quiz stages, verifying real content renders and feedback/XP flow correctly) plus a new `scienceQuiz` bank schema test and an extended minTier/maxTier range check. All 86 acceptance tests and 76 unit tests pass. |
| 2026-07-22 | 4.14 | **Keypad fix + Science/Music content-overlap finding (§26.12).** Now that Middle/Senior are actually reachable and verifiable (§26.11), two more real issues surfaced. (1) Fixed: `WordProblemView`'s keypad had no "/" or ":" key, so fraction answers (`wp-frac-2`/`wp-frac-3` both list a fraction form in `acceptEquivalents`) and time-format answers (`wp-time-1`, "4:00") couldn't be typed naturally — widened to a 4×4 grid, original numpad shape unchanged, verified typing "3/4" produces exactly that string. (2) Found, not fixed: Science's 5 mechanics all reuse Junior's exact same fixed banks and skill ids at every tier — a 12-year-old sees the identical living-vs-nonliving sorting a 6-year-old sees, just relabeled. Unlike Math (already tier-scaled) and Words (real tiered content), Science never got any. This is content-authoring work, not a code fix — tracked as O11 in Appendix B, not implemented in this pass. 1 new acceptance test. All 83 acceptance tests and 74 unit tests pass. |
| 2026-07-22 | 4.13 | **Parent-facing age/tier change (§26.11, D13).** Found there was no way to change a child's age after onboarding at all — meaning no way to move an existing Junior profile into Middle/Senior short of deleting and re-onboarding, blocking the product owner from verifying Middle/Senior from an already-set-up profile. Added a "Change age" control to the Manage Children card (`SET_PROFILE_AGE`), with a live tier preview before saving. Changing the ACTIVE profile's age across a tier boundary auto-routes to the new tier's home screen; editing any OTHER child's age only updates the roster, leaving the active child's session untouched — same safety guarantee `RENAME_PROFILE`/`RESET_PROGRESS` already provide. 3 new acceptance tests (active Junior→Senior, active Junior→Middle + Cancel-is-a-no-op, and a non-active edit that doesn't disturb the active session), plus a test-only `data-profile-row` attribute for unambiguous per-child targeting. All 83 acceptance tests and 74 unit tests pass. |
| 2026-07-22 | 4.12 | **Implemented all three design items from the §26.9 playtest (§26.10, D10/D11/D12).** (A) O10 resolved: Middle/Senior now earn stars via a `pctCorrect`-based formula in `TIER_NEXT_Q` (mirrors Junior's own mistake-count formula), unblocking Music's star gate — additive to XP, never a penalty. (B) The four reused generators (`genAdditionQs`/`genSubtractionQs`/`genCompareQs`/`genPatternQs`) now genuinely scale by tier instead of collapsing Middle/Senior onto one branch; numbers were sized against real rendering ceilings found mid-implementation (addition's equation row, `APPLE_POOL`'s 16-position cap for subtraction/compare's tree art, `PATTERN_SHAPES`'s 5-shape limit) rather than the originally-proposed larger ranges. Senior's speed-bonus window tightened to `total*15`s (Middle stays `total*20`s). **Found and deliberately kept**: these generators are shared with Junior's own `generateQuestions()`, and Junior's adaptive step-up (§9.2) can independently reach `tier:3` for a mastered 7-year-old — reviewed with the product owner and confirmed as consistent with §9.2's existing design, not an unwanted side effect. (C) `TierSubjectStagesScreen`'s Middle branch gained a subject icon, stage-number chip, real per-stage mastery bar, and an "Up next" highlight — all reusing existing components, `onClick` navigation untouched. 5 new acceptance tests (including a new `data-ok` test-only attribute on comprehension options for deterministic star-formula testing). All 80 acceptance tests and 74 unit tests pass. |
| 2026-07-22 | 4.11 | **First-person Middle/Senior playtest (§26.9)**, substituting for §17.3's real-child protocol (not runnable — requires actual children, not something to simulate). Adult first-person walkthrough of the live app in a real browser, looking specifically for what DOM-assertion tests can't catch: legibility, polish, difficulty-feel. **Found and fixed a real bug**: every Senior-tier headline lacking its own inline color (`.s-display` on the home screen's "Welcome back," subject-card labels, the Achievements screen's headers, the streak-reset screen's title) rendered as unreadable dark ink-brown on the navy background — `app.html`'s `.screen{color:var(--ink)}` and `.senior{color:var(--s-text)}` are equal-specificity single-class rules, and source order let Junior's ink win the tie. Fixed at the source (`.senior .s-display` now sets its own explicit color in `styles.css`), confirmed the fix visually and by writing a regression test that asserts computed color and was verified to fail against the pre-fix CSS. Also surfaced and documented (not fixed — product/design calls): Middle/Senior can never earn stars and therefore can never unlock Music (new open item, O10, Appendix B); Middle's stage-picker screen is visually thin; reused Junior mechanics (addition/subtraction/compare/pattern) never scale in difficulty by tier, only the two new mechanics do; the word-problem hint is always fully worked rather than a partial nudge. All 75 acceptance tests (74 + 1 new) and 74 unit tests pass. |
| 2026-07-22 | 4.10 | **Second in-app rename in one day: "Puddlejump" → "Bopplebee".** The product owner asked to keep searching for a name even after Puddlejump was already live (4.9). Two more candidate batches were checked: four whimsy-compound names (Wobblewood, Tumblebrook, Chirpwood, Fernhollow) all turned out to collide with real, currently-operating nature-schools/daycares/companies once checked for spelling variants — the same pattern that caught Acorn Trail in round 2 (4.8). A second batch of invented words with no dictionary meaning (Kindlewisp, Bopplebee, Fizzlewink) came back clean of any kids-edtech collision; Kindlewisp was rejected anyway for containing "Kindle" (Amazon's e-reader/app trademark) — a different, higher-stakes kind of adjacency risk than a small competitor. **Bopplebee selected** (`NAME_SHORTLIST.md` §7) and renamed everywhere "Puddlejump" had just been applied: `app.html`, `manifest.webmanifest`, `package.json` (kept the full "formerly Bloom Academy and Puddlejump" history in its description), all file-header comments, the design-mock files, both SVG assets, the current planning docs, and this document's own living prose (title, Product line, §1, §26, Appendix A, and O4 in Appendix B — all updated the same way the Bloom Academy → Puddlejump transition was handled; historical changelog rows describing past events, including the row directly above this one, were left saying "Puddlejump" since they're dated records of what was true then). `NAME_SHORTLIST.md` §7 flags directly that renaming twice in one day on search-based confidence alone is a pattern that needs to convert into real §3 legal clearance work rather than continue. All 74 acceptance tests (5 assertions updated to match the new strings) and 74 unit tests pass. |
| 2026-07-22 | 4.9 | **In-app rename: "Bloom Academy" → "Puddlejump" throughout, ahead of formal trademark clearance.** After selecting Puddlejump (4.8, D8-adjacent O4 progress), the product owner asked to rename the live build immediately rather than wait for clearance — an explicit, informed acceptance of the risk that formal clearance (still pending — USPTO/app-store/domain/attorney) could later require reverting this. Renamed everywhere the name is user-visible or a code-comment header: `app.html` (title, boot splash, parent-feedback prompt), `manifest.webmanifest` (`name`/`short_name`, plus its stale "ages 5-7" description corrected to 5-12), `package.json` (`name` field, kept a "formerly Bloom Academy" breadcrumb in its description), file-header comments in `content.js`/`styles.css`/`audio-manager.jsx`/`ui-kit.jsx`, the design-mock files (`variations.jsx`, `splash-video.html`, `index.src.html`, `index.html`), `assets/icon.svg`/`pip.svg`, and the current planning docs `P3_CLOUD_DESIGN.md`/`PHONEME_RECORDING_BRIEF.md` (the latter's stale "ages 5-7" audience note also corrected — Middle tier's phonics stage reuses the same audio bank). Deliberately **not** renamed: `README.md` (the original 2026-07-19 design handoff) and `NAME_SHORTLIST.md` — both are historical records of what the product was called at the time, not descriptions of its current name. This document's own changelog entries describing past events (this 4.8 row above, D4) also keep saying "Bloom Academy," since they're dated records of what was true then. All 74 acceptance tests (updated to match the new strings) and 74 unit tests pass. |
| 2026-07-22 | 4.8 | **O4 progress: "Puddlejump" selected as the working replacement name for "Bloom Academy"**, after a second, more thorough web-search collision pass than the original 2026-07-21 `NAME_SHORTLIST.md` had run. The product owner first picked "Acorn Trail" from that list's recommendation; re-checking it before committing found a real, live "Acorn Trails" (plural) children's nature school using a near-identical name — which prompted checking all 6 original candidates properly. Result: 4 of 6 had real, previously-missed collisions (Acorn Trail, Marigold Kids — an exact-phrase match — Cricket Lane, and Dandelion Days all turned up currently-operating children's-education businesses using the same or a near-identical name). Puddlejump was the only candidate with no adjacent competitor found in either pass and is now the selected name — but **not yet formally cleared**: USPTO TESS search, app-store search, domain purchase, and a trademark attorney's opinion still need to happen (`NAME_SHORTLIST.md` §3). O4 (Appendix B) updated to reflect this — a decision made and real diligence done, but the hard gate before P2 brand investment stays in place until the real clearance steps are complete. |
| 2026-07-22 | 4.7 | **Subject-set naming for Middle/Senior (§26.6b), the last of the originally-flagged §26 gaps.** Middle/Senior previously showed Junior's exact subject labels verbatim ("Numbers"/"Words") on the home dashboard and subject→stage picker. New `TIER_SUBJECT_LABELS` map (app.html) relabels the same 4 real subjects per tier, naming only — no new subjects or content, consistent with §26.1's original call not to invent banks for the design mock's illustrative extras (Geography/Logic/History): Junior unchanged, Middle "Math"/"Reading", Senior "Mathematics"/"Language" (matching each tier's own design mock). Applied in `MiddleHomeScreen`, `SeniorHomeScreen`, `TierSubjectStagesScreen`. 1 new acceptance test covers all three tiers plus confirms Junior's map is untouched; 5 pre-existing tests updated to click the new tier-appropriate labels. All 74 acceptance tests (73 + 1 new) and 74 unit tests pass. |
| 2026-07-22 | 4.6 | **§14 clock robustness DST test coverage** (`tests/TRACEABILITY.md`'s longstanding "not yet covered" gap for §17.1 test 13's DST/timezone variants — only the clock-backward case had ever been automated). Two new Playwright acceptance tests drive a real browser clock across the actual 2026 US spring-forward (Mar 8→9) and fall-back (Nov 1→2) transitions in an explicit `America/New_York` context, confirming the streak advances by exactly one day either way — not stuck, not double-counted. While building these, investigated and **corrected an overstated claim**: §14's clock-robustness line said "§17.1 test 13 covers this [DST]" (it didn't, until now) and `dayDiff`'s code comment claims noon-anchoring specifically "avoids DST edge cases" — reproducing the exact computation against the 2026 US transitions and a historical midnight-transition timezone (Brazil pre-2019) found `Math.round()` absorbs the ±1 hour shift for any whole-calendar-day comparison regardless of noon vs. midnight anchor, so the specific hazard noon-anchoring guards against isn't reachable through `dayDiff`'s actual call sites in this codebase — a documentation correction, not a functional bug. The two new tests are kept as real, previously-missing regression coverage for the full DST path. All 73 acceptance tests (71 + 2 new) and 74 unit tests pass. |
| 2026-07-22 | 4.5 | **Middle tier's own activity-loop visual identity (§26.6b), the last of the three follow-up items from the O8 build.** Found while implementing that `TierActivityScreen`/`TierResultsScreen` branched only on a `senior` boolean, so a Middle-tier child's activity loop and results screen fell through to plain Junior styling — no Middle identity at all past the home dashboard, not "a lighter Senior" as the gap was first described in 4.3/4.4. Fixed with a real three-way branch (`senior`/`middle`/else): Middle keeps `MiddleHomeScreen`'s cream/lavender gradient and `.sticker` cards, gets a berry-accented feedback modal and results screen (`Pip color="berry"`, `Btn color="berry"`), a mid-size proud Pip (between Junior's full-size and Senior's small `SPip` coach), and a Middle-only per-question "+XP" chip in the activity top bar that neither Junior (no XP concept) nor Senior (XP only totaled at results) shows. 1 new acceptance test. All 71 acceptance tests (70 + 1 new) and 74 unit tests pass. |
| 2026-07-22 | 4.4 | **O9 resolved (D9) + follow-up work closed out same day as the O8 build (4.3):** (1) `SeniorAchievementsScreen` shipped — 8 badges + level bar, reachable via a new 🏆 icon on `SeniorHomeScreen`. Every badge reads real, persistent, monotonic profile fields (`tierQuestionsAnswered`, `tierPerfectSets`, `tierHadFastSet`, `tierSubjectsPlayed` — all new in `blankProfile()`, only ever incremented by `TIER_ANSWER`/`TIER_NEXT_Q`) rather than the capped event log, so a badge can never silently un-earn itself as old events age out (§14 progress-is-additive) — see §26.6. (2) Content banks grown §15.1-style: `wordProblems` 8→20 items (8/8/4 across difficulty 1/2/3), `comprehensionPassages` 3→8 passages (24 questions total, 3/3/2 across difficulty 1/2/3) — same universal-setting, no-gendered-noun convention as the original 8/3 and as Junior's banks. (3) `index.html` (the compiled single-file design gallery, previously flagged stale) hand-synced: `screens-h.jsx`/`screens-i.jsx` spliced in as new script blocks in the same position `index.src.html`'s `<script src>` order implies, plus the same age-spectrum/Senior `DCSection`s added to its gallery script — verified with a real-browser Playwright smoke check (page loads, both new sections render, no new console errors beyond a pre-existing unrelated 404 for the design-canvas tool's own `.design-canvas.state.json`). 2 new acceptance tests for achievements (badge state reflects seeded profile correctly; counters are monotonic across a completed stage). All 70 acceptance tests (68 + 2 new) and all 74 pre-existing unit tests pass — content bank growth added data, not new schema categories, so the unit-test count is unchanged from 4.3. |
| 2026-07-22 | 4.3 | **O8 ratified and built (D8, §26 rewritten from proposal to shipped):** the ages 5–12 expansion is now live in `app.html`. New `tierOf(age)` derives Junior/Middle/Senior from `profile.age`; Middle/Senior get their own home dashboards (`MiddleHomeScreen`, `SeniorHomeScreen`), a parallel `TIER_START`/`TIER_ANSWER`/`TIER_NEXT_Q` reducer path (kept separate from Junior's `START`/`ANSWER`/`NEXT_Q` — same rationale as `stageConfigsWorld2` staying a separate content key: no shared behavior to unify, Junior's hearts/stars/node-map logic has no Middle/Senior equivalent), and two new question mechanics: typed-answer word problems with an on-screen keypad (`WordProblemView`, checked against `acceptEquivalents` so "2.25"/"2 1/4"/"9/4" all count) and reading comprehension (`ComprehensionView`, whole-passage-graded). XP/level (`profile.xp`, `levelFromXp()`) is an additive currency alongside stars/coins, never replacing or converting them. §14's anti-stress rules were extended to Senior in the actual code (no hard-fail timers — speed bonus only; guilt-free streak reset via `TIER_CHECK_STREAK` + `StreakResetScreen`; hints explicitly "no XP penalty"; no red anywhere in the per-question feedback modal). Onboarding's age chips extended 5–7 → 5–12 with a live tier-auto-select notice; `FINISH_ONBOARDING`/`activateProfile` route Middle/Senior to `tierHome` instead of the Junior map, per-profile. Content: `content.js` gained `stageConfigsMiddle`/`stageConfigsSenior` (reusing Junior's 4 subjects, not the design mock's placeholder subjects), an 8-item `wordProblems` bank, a 3-passage `comprehensionPassages` bank, and the `xpPerLevel`/`quizBaseXp`/`quizSpeedBonusXp` economy constants (§19.1 config-driven). Not built: a Senior achievements/badge screen (tracked as O9, non-blocking). 6 new Playwright acceptance tests + 17 new unit tests, all green; all 62 pre-existing Junior acceptance tests and 74 pre-existing unit tests pass unmodified, confirming the expansion is purely additive. |
| 2026-07-21 | 4.2 | **New design files reviewed and reconciled** from an updated design-canvas export (`screens-h.jsx`, `screens-i.jsx`, refreshed `design-canvas.jsx`/`tweaks-panel.jsx`/`animations.jsx`, and a `.senior` CSS scope added to `styles.css`): a full **age-tier expansion** — Junior (5–7, existing v1), Middle (8–9), and Senior (10–12) — with 7 new Senior-tier screens (dashboard, timed quiz, graded results, achievements, guilt-free streak reset, typed-answer with keypad, reading comprehension) and one Middle-tier home screen. Documented as new §26, tagged **[Planned·P2 — pending product decision]**, not built. Recorded as open decision **O8** in Appendix B: this is a scope/business call (target age range, effectively age 5–7 → 5–12), not an engineering one, and needs explicit product-owner ratification before any P2 work starts — same treatment as O1–O7. `design-canvas.jsx`/`tweaks-panel.jsx`/`animations.jsx` also close the broken-reference gap `index.src.html` has had since the initial commit (§16 note, now resolved — those two files exist in the repo again). §24 File Map updated. Also merged, not overwritten: `styles.css` gained the `.senior` scope while keeping every P1/P2 CSS fix already shipped (vendored fonts, WCAG-corrected `--ink-quiet`, calm/lefty/reduced-motion modes, print report styles) — the incoming design file predated that work and would have regressed it if copied over naively. `index.html` (the compiled single-file gallery) was deliberately **not** regenerated — no build step produces it from `index.src.html`, and hand-patching a 283 KB bundle file risked introducing drift; it is now stale relative to `index.src.html`/`screens-h/i.jsx` for this addition, flagged in §26 rather than silently left inconsistent. |
| 2026-07-21 | 4.1 | Audited every remaining `[Planned·P1]` tag (§2, §9.2, §10.4, §14, §15.1, §22) against code — 6 items checked, 2 already shipped (stale duplicate tags fixed: offline-first, the daily-bonus/streak/clock-robustness trio), 3 overstated claims corrected (age-seeded distractors is a 2-state not 3-state system; reduced-motion's OS-signal claim only covered the boot splash, not gameplay; the freshness rule's "last 2 sessions" tracking doesn't exist, it's undifferentiated recency), and 1 genuine gap closed: **onboarding resume** (§22.1) — `doSave()` previously excluded welcome/avatar/plan entirely, so interrupting onboarding lost the child's name/avatar and forced a restart from scratch. Fixed with a new `FINISH_ONBOARDING` action, a `profile.onboarded` flag, and `onboardScreen`/`onboard` persisted in the save snapshot; verified end-to-end (screenshot-confirmed) that interrupting after the name step and reloading resumes exactly on the avatar screen. A v2→v3 migration is now explicitly forced `onboarded:true` to avoid re-onboarding returning players — caught before shipping by checking the spread-default interaction, not by a failing test. Also fixed for real, not just documented: reduced-motion now seeds its default from `window.matchMedia('(prefers-reduced-motion: reduce)')` on a fresh install, never overriding an existing saved parent choice. 6 new acceptance tests. All 62 acceptance + 51 unit tests pass. |
| 2026-07-21 | 4.0 | World 2 content authored (D2) — 20 new stage configs across all 4 subjects in `content.js` → `stageConfigsWorld2`, kept entirely separate from the live `stageConfigs` so it carries zero risk to the shipped game. Deliberately NOT wired to any UI: no world-switcher exists, `CUR_WORLD` is hardcoded everywhere, and §14.1's purchase gate needs real platform IAP that only exists in a native P2 build. Found and documented a real architectural limitation while authoring: difficulty tier comes from the runtime adaptive system (age + accuracy), not from which world a stage belongs to, so most World 2 stages are honestly framed as reinforcement rather than a false claim of fixed harder difficulty — only `count` (`maxCount`) and `rhythm` (`patternLen`) genuinely scale up via content alone. A stage-level `minTier` parameter is flagged as the real fix, not built here (out of the agreed content-only scope). Also added 4 new tracing letters (L, I, E, K), each verified by rendering to a screenshot before shipping. 13 new unit tests validate `stageConfigsWorld2`'s shape and its "harder tier of the same skill area" constraint. All 58 acceptance + 51 unit tests pass. |
| 2026-07-21 | 3.9 | Four green-lit build items shipped in one pass. (1) §22.2 rolling save backup: `doSave()` keeps a one-deep `bloom-v3-backup`, `loadStore()` tries it before falling to the legacy `bloom-v2` path, and an unreadable blob is preserved under `bloom-v3-corrupt` for a dismissible parent-dashboard diagnostics notice — the full mechanism §22.2 always described, not just the fallback half. (2) CDN vendoring finished for the design-mock files: `index.html`/`index.src.html`/`splash-video.html` now load React/ReactDOM/Babel-standalone from `vendor-mocks/` (their own pinned versions, separate from `app.html`'s `vendor/`); `index.html`'s Twemoji library is vendored too. Left on CDN by design: `index.html`'s dynamic Google-Fonts picker (a live design-exploration feature, not a fixed asset) and Twemoji's per-glyph SVG fetches (would mean bundling ~3600 files for a reference gallery). `index.src.html` was found to reference two `.jsx` files that don't exist anywhere in the repo, confirmed since the initial commit — pre-existing, unrelated, left alone. (3) Content banks grown to meet every §15.1 production target: phonics 14→41 (all 26 letters), word-pic 8→30, living 12→26, size 10→25, sinkfloat 10→25, hotcold 10→25, habitat 10→26, lifecycle 10→18, lifecycleSeqs 4→16 — pure data, passes the full 23-test schema suite unchanged. (4) Classroom mode's local-only slice shipped: a "🏫 Classroom Report" dashboard card (2+ profiles required) prints an aggregate, no-per-child-ranking report per `P3_CLOUD_DESIGN.md` §4.2 — verified by a test that scans the printed output for either seeded child's name and asserts neither appears. The cloud/DPA-gated version described in §4.1 remains out of reach (a legal artifact, not code) and is explicitly not what shipped. Also delivered: `NAME_SHORTLIST.md`, 6 trademark-plausible candidate names for O4 with a verification checklist (web-search-only vetting, not a real trademark clearance — flagged as such). 12 new acceptance tests. All 58 acceptance + 38 unit tests pass. |
| 2026-07-21 | 3.8 | O2 and O3 ratified by the product owner (D6, D7 in Appendix B): the §16 platform support matrix (Android 11+ / iPadOS 16+) and the §17.4 beta KPI targets are both confirmed as-is, no changes. Both sections' "proposed"/"hypotheses" framing removed. O4 (product name) remains open — product owner asked for a candidate shortlist rather than deciding directly; see `NAME_SHORTLIST.md`. |
| 2026-07-21 | 3.7 | §17.1 test 11 (corrupted-save recovery) automated, closing the last unautomated item on the acceptance checklist — 2 new tests: a corrupted `bloom-v3` with no legacy save falls through to a fresh start (no crash, no white screen), and a corrupted `bloom-v3` with a valid legacy `bloom-v2` present recovers the child's actual data via the existing migration path. While writing these, found (and documented, not fixed) a real distinction: §22.2 describes a fuller "rolling backup + retain corrupt blob for diagnostics" mechanism that isn't what's actually built — `loadStore()` only has the v2-fallback-or-fresh-start behavior above, which satisfies test 11's literal wording but not §22.2's fuller description. Flagged as genuinely open work in §22.2 rather than left ambiguous. All 54 acceptance + 38 unit tests pass. |
| 2026-07-21 | 3.6 | Systematic audit of every remaining REQUIREMENTS.md section (§3/§4, §6–§10, §13–§22) against the shipped code — 14 genuine discrepancies found and fixed. 10 were pure doc drift (phonics letter count 12→14, `ink-quiet` hex value, storage-key direction in §3.8, §9.2's step-up window "3 stages"→"15 questions" plus its false hint-audio claim, a stale CDN note in §16, content-schema test count 21→23, bank-size range, a stale "thinking mood unused" note in the Pip Personality Bible, and two Planned tags on already-shipped features — §7's `skills`/`recentItems`, §18's name-field constraints). 4 were real code gaps, now closed: shop prices and the Music unlock threshold moved from hardcoded `app.html` consts into `content.js` (`shopItems`, `musicUnlockStars`), matching §14/§19.1's "lives in config" claim; `session_start`/`session_end` events are now actually logged (were named in §13.1's event model but never fired — added a mount effect + `visibilitychange` listener); `shop_purchase` corrected to `shop_buy` (the event was always logged, just under a different name than the doc used); and the two long-missing acceptance tests for §17.1 checklist items 7 (full offline session) and 8 (PII schema scan) were written — §13.1's claim that a PII-scan test existed had been false since it was written. All 52 acceptance + 38 unit tests pass. |
| 2026-07-21 | 3.5 | Reset-a-child's-progress shipped, closing §11.2's last remaining gap from the 3.4 pass: a "Reset progress" button in the Manage Children card, same gentle two-step confirmation pattern as delete ("Start {name} fresh?" / "Never mind" / "Yes, start fresh"). New `RESET_PROGRESS` reducer action clears stars/coins/streak/map/skills/events but keeps name/age/avatar. Caught and fixed a real side-effect bug via the acceptance test before it shipped: an early version cleared `lastBonusDate` along with everything else, which meant every reset silently handed the child a free +10 coin daily bonus on next map load — fixed by leaving `lastBonusDate` untouched. All 50 acceptance + 38 unit tests pass. |
| 2026-07-21 | 3.4 | Profile rename/delete UI shipped, closing the real gap the 3.3 audit found: a "👨‍👩‍👧 Manage Children" card in the parent dashboard wraps the pre-existing `RENAME_PROFILE`/`DELETE_PROFILE` reducer actions (which needed no changes) with inline rename and a two-step gentle-deletion confirmation (Pip waves, "Keep them" / "Yes, say goodbye", no sad imagery). §11.2's "reset a child's progress" gap remains open — the one piece of that bullet still not built. 2 new acceptance tests (rename a non-active child, delete-with-confirm never touches the active child's own data). All 49 acceptance + 38 unit tests pass. |
| 2026-07-21 | 3.3 | §12/§11.2 audited against code line-by-line (same method as the earlier §5 reconciliation) and found a real bug, not just stale tags: the multi-child profile picker (`ProfilePickerScreen`) and its splash-screen entry chips were fully built but unreachable — the render switch had no `case 'picker'` and `SplashScreen` never received its `kidCount` prop, so nothing multi-profile ever actually displayed regardless of how many profiles existed on the device. Fixed both — verified end-to-end with 2 new acceptance tests (boot-to-picker with >1 profile, and Settings→Title→Switch Child→picker). Also found and corrected: two false claims in §12 ("prefill Learning Plan for additional profiles," "child-switcher already designed in mock #27" — neither exists anywhere in the repo), and confirmed profile rename/delete have correct reducer logic but **zero UI anywhere**, which §11.2 previously stated as if it worked. §11.2's backup/export (genuinely shipped 2026-07-19) had its stale Planned·P1 tag corrected in the same pass. |
| 2026-07-21 | 3.2 | Both §13.4 P2 items from 3.1 shipped: milestone postcards (parent dashboard card + print-only postcard block, mutually exclusive with the existing progress-report print) and real-world activity suggestions (`content.js` → `realWorldTips`, one entry per skill id, shown on-dashboard and in the print report). 3 new Playwright acceptance tests. All 45 acceptance + 38 unit tests pass. |
| 2026-07-21 | 3.1 | §13.4 gains two Planned·P2 items from external design feedback review: milestone postcards (reuses the existing print-report mechanism) and real-world activity suggestions layered on the existing skill recommendation. Other feedback from the same review (collectible sticker album/Pip's Treehouse, interactive voice acting, adaptive music stems, device-tilt parallax) was evaluated and deliberately not added — the collection/customization mechanic needs an explicit §14 anti-stress-rules review before it's a "yes," and the audio suggestions already have a considered phased plan in §15.3 that a jump to full VO/adaptive stems would skip past. |
| 2026-07-21 | 3.0 | §5 Core Loop Rules reconciled against the shipped build and retagged Shipped, resolving O1 (recorded as D5 in Appendix B — this was documentation drift, not an open product decision: the retry/requeue rule was already built and correctly documented in §8.4, and the "correct answer pulses before modal" line described unshipped mockup intent). O1 removed from the B.2 open-decisions table. |
| 2026-07-21 | 2.9 | Added `PHONEME_RECORDING_BRIEF.md` (§15.3): a standalone brief specifying voice direction, technical spec, and a letter-by-letter "say this sound, not this letter name" table for all 33 phoneme clips, so real recordings can replace the placeholder WAVs without needing code context. No code changes — content/asset-authoring deliverable only. |
| 2026-07-21 | 2.8 | Font vendoring: Fredoka/Nunito self-hosted as two variable `.woff2` files (`assets/fonts/`) instead of the Google Fonts `@import` (§6.2, §23), closing the last remaining CDN/remote-asset dependency in `app.html`. `sw.js` regenerated (cache bumped to v2) to precache the fonts for offline play; verified offline reload still renders with fonts included. |
| 2026-07-21 | 2.7 | Phoneme audio sprite system shipped (§15.3): full 26-letter + 7-digraph manifest, `AudioMgr.phonics()` sprite player with silent-placeholder-today/drop-in-real-audio-later design, wired into Phonics and Tracing with auto-play + tap-to-replay, schema test guarding bank/manifest drift. Hosted-PWA beta infrastructure shipped (§2, D3): `manifest.webmanifest`, generated cache-first `sw.js` precaching the full offline file set, app icon extracted from `pip.svg`. Verified: reload with the browser context fully offline still renders the app. Known Issues (§23) now empty at the code level — remaining gap is recording real phoneme audio, tracked as content work in §15.3. |
| 2026-07-20 | 2.6 | CDN vendoring fix (§23 Known Issue #2): React/ReactDOM/Babel-standalone now load from a local `vendor/` directory in `app.html` instead of unpkg, closing the offline-play gap ahead of the hosted-PWA beta (§2, D3). Design-mock files and Google Fonts remain out of scope for this pass. |
| 2026-07-19 | 2.5 | Track A prototype sprint shipped: Music world hidden (no-broken-promises), streaks + daily hello bonus with clock-safety, read-aloud via Speech Synthesis (auto-play + 🔊 replay + parent toggle), per-question auto-save with Keep-going/Start-over resume, save export/import in parent dashboard, name-field constraints + age chips 5–7, size bank wired into a mixed science stage 1 with per-question instructions. Known Issues rewritten: 8 items fixed, 3 open (phoneme sprites, SFX, CDN vendoring). |
| 2026-07-19 | 2.4 | Four product decisions made and recorded in new Appendix B: freemium world unlocks (new §14.1), world 2 authored before P2 (multi-world schema, §3.2/§7), hosted-PWA beta (§2), name-conflict findings → rename gate (§1 naming note). New requirements from gap review: age-seeded difficulty start (§9.2), non-reader rule (§10.2), local backup/export (§11.2), Music hidden until its content exists + clock robustness (§14), name-field constraints (§18), acceptance tests 12–13 (§17.1), Known Issues 4–5 (§23). Appendix A monetization reclassified to "applies, constrained." |
| 2026-07-19 | 2.3 | Assessed remaining skills matrix entries (#23–41): Appendix A expanded with 10 more applicable skills (QA workflows, automated testing, performance benchmarking, store review, build pipeline, crash reporting, patching, localization, analytics, privacy engineering), a new A.2 "conditional on P3" tier, and 7 more non-applicable skills. Three spec gaps promoted into requirements: store kids-program compliance gate (§18), no-push-notifications-to-children rule (§14), GDPR-K + India DPDP consent scope (§11.3). |
| 2026-07-19 | 2.2 | Added Appendix A — Engineering Capability Map: external game-dev skills matrix assessed for project relevance; applicable skills mapped to phases and spec sections; non-applicable skills recorded with rationale to prevent scope creep. |
| 2026-07-19 | 2.1 | Second external review incorporated: content volume minimums + freshness rule + math scene variety (§15.1); new §22 Session Management & Error Resilience; §10.4 Diversity, Representation & Neurodiversity (incl. reduced motion, calm mode); §13.4 Parent Dashboard Depth (subject pausing, coin gifts, PDF reports, teacher mode); §17.2 automated tests + §17.4 success KPIs; §14 streak definition, daily hello bonus, affordability celebration, shop-rotation caveat; §15.3 TTS limits + mandatory pre-recorded phoneme sprites + world audio identity; §9 recency decay + cross-subject reinforcement; §10.3 haptics; §20 Pip Personality Bible; new analytics events (`onboarding_step`, `stage_quit`); string key convention (§15.2); gentle profile deletion (§12). Former §§22–24 renumbered to §§23–25. |
| 2026-07-19 | 2.0 | Incorporated first external product review: added §8 Pedagogy, §9 Adaptivity, §10 Accessibility, §11 Privacy/Compliance (expanded), §12 Multi-profile, §13 Analytics, §14 Economy, §15 Content/Localization, §16 Performance, §17 QA, §18 Security, §19 Architecture, §20 Doc management, §21 Phased roadmap; introduced status tags. |
| 2026-07-19 | 1.1 | Fixed two prototype bugs (Stage Clear routing, `session.subject`); Known Issues updated. |
| 2026-07-19 | 1.0 | Initial requirements document consolidated from README handoff + `app.html` prototype. |

---

## 26. Age-Tier Expansion [Shipped 2026-07-22 — decision O8 ratified by the product owner]

**Shipped in `app.html`.** O8 (Appendix B) was ratified: Bopplebee (then still "Bloom Academy" — renamed 2026-07-22, see Naming note) now serves ages 5–12 via three tiers, auto-selected from `profile.age` (§26.1), reusing the existing 4 subjects and question-generation engine rather than the design mock's illustrative placeholder subjects. Source: an updated design-canvas export (2026-07-21) — `screens-h.jsx`, `screens-i.jsx`, a `.senior` scope added to `styles.css` — reconciled into the live build the following day.

### 26.1 What shipped

A **three-tier system**, auto-selected from the age the child enters at onboarding (`tierOf(age)` in `app.html`), extending the existing 5–7 experience with two additive tiers:

| Tier | Ages | Design language | Status |
|---|---|---|---|
| **Junior** | 5–7 | Existing Bopplebee system (§6): cream/coral/leaf palette, Fredoka, sticker cards, Pip as a full-size companion, map/node progression. | **Shipped**, unchanged — every §26 addition is additive and the full Junior acceptance suite (62 tests) passes unmodified. |
| **Middle** | 8–9 | Bridges Junior and Senior: reuses the existing color tokens and sticker-card components (`.sticker`, `Chip`, `ProgressBar`, `Btn` from `ui-kit.jsx`), swaps the world-map metaphor for a goal-dashboard home (`MiddleHomeScreen`) with per-subject % mastery cards and an XP/level progress strip. | **Shipped**: home dashboard + subject→stage picker + full activity loop. |
| **Senior** | 10–12 | A distinct dark "premium tween" system via the `.senior` CSS scope: near-navy background, Space Grotesk display over Nunito body, teal/indigo/lime/violet accents, flat sharp cards, XP + level + streak framing, Pip as a small "coach" avatar (`SPip`). | **Shipped**: home dashboard (`SeniorHomeScreen`), timed-quiz-style activity loop, results/review (`TierResultsScreen`), guilt-free streak reset (`StreakResetScreen`), achievements/badge screen (`SeniorAchievementsScreen`, §26.6). All 7 of the design mocks' Senior screens are now built. |

Both new tiers reuse the same 4 subjects as Junior (Numbers/Words/Science/Music) rather than the design mock's illustrative subjects (Fractions/Geography/Logic/History, which have no content banks and were never meant literally) — this was open question #1 below, resolved in favor of reuse rather than inventing new subject content from scratch.

### 26.2 Onboarding change

`WelcomeScreen`'s age chips are extended from 5–7 to 5–12 (§3.1 step 2 superseded for this range); picking 8+ shows a live tier-auto-select notice ("You'll get the Middle experience…" / "…Senior experience…"), matching `screens-i.jsx`'s `AgeTierSelectScreen` intent without a separate onboarding step — avatar and learning-plan steps are unchanged and shared by all three tiers. `FINISH_ONBOARDING` and `activateProfile` (profile switch) route a Middle/Senior child to `tierHome` instead of the Junior map; each profile's tier is independent (§26.7 test coverage).

### 26.3 §14 anti-stress guardrails, extended to Senior — all shipped as built, not just mocked

- **No hard-fail timers**: the Senior/Middle activity screen shows "⚡ Take your time — no time limit" on every question. `TIER_NEXT_Q`'s speed bonus (`quizSpeedBonusXp` in content.js) is additive XP only — elapsed time is never checked against a limit, no question is ever truncated or auto-failed.
- **Guilt-free streak resets**: `TIER_CHECK_STREAK` (reducer) detects a silent reset (via the same `updateStreak()` Junior already uses) and shows `StreakResetScreen` exactly once — "Fresh start today — breaks are healthy," with XP/coins/level explicitly re-displayed as kept. No red, no alarm iconography anywhere in this screen.
- **Hints never penalize**: `WordProblemView`'s hint is always visible with an explicit "(no XP penalty)" label; there is no hint-cost code path anywhere in `TIER_ANSWER`/`TIER_NEXT_Q`.
- **Wrong answers are neutral in the moment**: the per-question feedback modal in `TierActivityScreen` uses teal/neutral tones, never red, matching Junior's zero-red rule — resolving open question #4 below in favor of consistency with Junior rather than the design mock's coral ✕ (which only appears in the post-quiz *results* review, a place Junior has no equivalent screen for, so no existing rule was being violated there either).
- **Progress is additive**: `xp`/`coins`/`level` are never decremented by any §26 code path; only `streak` (a momentum indicator, same as Junior) resets.

§14 itself was not textually amended to say "applies across all tiers" — the implementation already treats it that way, and every §26 code path was written against that constraint from the start rather than needing a retrofit.

### 26.4 Economy, mechanics, and content — as built

- **XP/level** (`profile.xp`, derived `level = floor(xp / xpPerLevel) + 1`) is a currency **separate from** Junior's stars/coins, not a replacement — both fields persist on every profile regardless of tier, so nothing is lost if age (and therefore tier) changes (§14 progress-is-additive, resolving open question #3: they simply coexist, untouched by each other). `xpPerLevel`, `quizBaseXp`, `quizSpeedBonusXp` live in `content.js` (§19.1 config-driven).
- **Typed-answer word problems** (`WordProblemView`, content.js `wordProblems` bank, **20 items** [grown 2026-07-22 from an initial 8, §15.1-style bank growth: 8 difficulty-1, 8 difficulty-2, 4 difficulty-3] across difficulty 1–3): free-text entry via an on-screen keypad, checked against `acceptEquivalents` (e.g. "2.25", "2 1/4", "9/4" all accepted for the same value) rather than exact-string match.
- **Reading comprehension** (`ComprehensionView`, content.js `comprehensionPassages` bank, **8 passages × 3 questions = 24 questions** [grown 2026-07-22 from an initial 3 passages: 3 difficulty-1, 3 difficulty-2, 2 difficulty-3]): a full passage with paired multiple-choice questions, graded as one activity-loop "question" (whole-passage pass/fail feeds `TIER_ANSWER`), matching the design mock's per-passage Q-of-3 progress track. Universal settings/characters (a lighthouse, a desert, a garden, a bakery, a tide pool, a workshop, a marathon, an orchestra), no gendered-noun or culture-specific assumptions, same convention as Junior's banks (§10.4, §15.1).
- **Stage lineups**: `content.js` → `stageConfigsMiddle`/`stageConfigsSenior`, same 5-stages-per-subject shape as Junior's `stageConfigs`, kept in their own top-level keys — same "content-only, zero risk to Junior" convention `stageConfigsWorld2` already established (§3.2).
- **Question generation**: `generateTierQuestions()` (app.html) reuses the exact same generator functions Junior uses (`genAdditionQs`, `genCompareQs`, etc.) at a fixed tier-2/tier-3 adaptive baseline — no second generation engine, no duplicated content.
- ~~Not built: an achievements/badge system~~ **Built 2026-07-22** — see §26.6, `SeniorAchievementsScreen`.

### 26.5 Test coverage

6 new Playwright acceptance tests (`tests/acceptance.spec.cjs`, §26 block) cover: extended age-chip onboarding landing a Senior profile on tier home; the typed-answer word-problem flow end-to-end; the reading-comprehension flow; the guilt-free streak-reset screen (verifying XP/streak values exactly); the Middle-tier home rendering the light theme (not `.senior`); and per-profile tier switching (a Junior and a Senior profile on the same device each land correctly). Plus 17 new unit tests (`tests/unit/content-schema.test.cjs`) validating the new content banks and stage configs. All 62 pre-existing Junior acceptance tests and 74 pre-existing unit tests pass unmodified — confirms §26 is additive, not a regression risk to the shipped Junior product.

### 26.6 Achievements / badges (O9) [Shipped 2026-07-22]

`SeniorAchievementsScreen`, reachable from the 🏆 icon on `SeniorHomeScreen`, shows a level bar plus an 8-badge grid — the one design-mock screen not carried into the original §26 implementation pass, now built.

**Every badge is computed from real, persistent profile state — never mock data, and deliberately never derived from the event log.** `logEv` caps at 2000 events / 90 days, so a badge whose criterion lived only in event history could silently un-earn itself as old events aged out, violating §14's progress-is-additive rule. Instead, `blankProfile()` carries four new monotonic fields (`tierQuestionsAnswered`, `tierPerfectSets`, `tierHadFastSet`, `tierSubjectsPlayed`) that `TIER_ANSWER`/`TIER_NEXT_Q` only ever increase or add to, never decrease — a badge earned once stays earned for the life of the profile, matching the same guarantee `streak`/`xp` already have.

| Badge | Criterion | Data source |
|---|---|---|
| On Fire 🔥 | Streak ≥ 10 days | `profile.streak` (existing field) |
| Speedster ⚡ | Completed any tier set at a brisk pace (< ~12s/question average) | `profile.tierHadFastSet` |
| Sharpshooter 🎯 | 1+ perfect (100%) tier set | `profile.tierPerfectSets` |
| Math Master 📐 | ≥80% rolling accuracy in Numbers | `subjectPct(skills, 'math')` — reuses the existing §9.1 skill tracking |
| Deep Thinker 🧠 | 500 tier questions answered (right or wrong — an engagement badge, not accuracy) | `profile.tierQuestionsAnswered` |
| Explorer 🌍 | Completed a tier stage in all 4 subjects | `profile.tierSubjectsPlayed` |
| Champion 🏆 | Reach Level 10 | `levelFromXp(profile.xp)` — scaled down from the design mock's Level 20 to fit the flatter 400-XP/level curve (§26.4) |
| Perfectionist 💎 | 5+ perfect tier sets | `profile.tierPerfectSets` |

Unearned badges show a live progress bar (`pct`, 0–1) toward their threshold rather than a bare lock, matching the design mock. 2 new acceptance tests verify: badges reflect seeded profile state correctly (a mix of earned/unearned), and completing a tier stage only ever increments the counters, never resets them.

### 26.6b Other known gaps / follow-ups [All resolved 2026-07-22]

All three gaps originally listed here (Middle activity-loop identity, `index.html` staleness, subject-set naming) are now closed — kept below as a record of what was found and fixed, not as an open list.

- ~~No Middle-tier activity-loop art distinction from Senior's mechanics.~~ **Resolved 2026-07-22**: `TierActivityScreen` and `TierResultsScreen` previously branched only on `senior` (true/false), so a Middle-tier child fell through to the same markup Junior would have used — no Middle identity at all below the home screen, not even "a lighter Senior" as first described. Both screens now have a genuine third branch: Middle keeps the cream/lavender gradient and `.sticker` card language from `MiddleHomeScreen`, a berry-accented feedback modal and results screen (`Pip` in `berry`, `Btn color="berry"`, matching the home dashboard's accent), a mid-size proud Pip distinct from both Junior's full-size leaf Pip and Senior's small `SPip` coach, and a Middle-only per-question "+XP" chip in the activity top bar (neither Junior, which has no XP concept, nor Senior, which only totals XP on the results screen, show this). 1 new acceptance test verifies the XP chip, the berry results screen, and the continued absence of the `.senior` CSS scope anywhere in Middle's flow.
- ~~`index.html` stale relative to `index.src.html`/`screens-h/i.jsx`~~ **Resolved 2026-07-22**: hand-synced (screens-h.jsx/screens-i.jsx spliced in as new script blocks, same gallery `DCSection`s added as `index.src.html`), verified to load and render both new sections error-free in a real browser.
- ~~Subject-set naming~~ **Resolved 2026-07-22**: Middle/Senior previously showed Junior's exact labels ("Numbers"/"Words") verbatim on their home dashboards and the subject→stage picker. A new `TIER_SUBJECT_LABELS` map (app.html) now relabels the same 4 real subjects per tier — naming only, no new subjects or content, per §26.1's original resolution not to invent banks for the mock's illustrative extras (Geography/Logic/History): Junior keeps "Numbers"/"Words" unchanged, Middle shows "Math"/"Reading" (matching `MiddleHomeScreen`'s mock), Senior shows "Mathematics"/"Language" (matching `SeniorHomeScreen`'s mock). Science and Music are unchanged at every tier — there's no more "grown-up" way to say either that isn't just a longer word for the same thing, and the mocks don't relabel them either. Applied in `MiddleHomeScreen`, `SeniorHomeScreen`, and `TierSubjectStagesScreen`. 1 new acceptance test verifies all three tiers independently and confirms Junior's map tabs are untouched.

### 26.7 Resolution of the original open questions (O8, now decided)

1. ~~Does the product want ages 8–12?~~ **Yes — ratified.**
2. ~~Does Middle ship, or straight Junior→Senior?~~ **Middle ships**, as a distinct home screen and lighter difficulty band, sharing Senior's mechanics.
3. ~~How do stars/coins and XP/levels reconcile across a tier change?~~ **They don't need to** — both persist independently on the profile; nothing is converted or lost.
4. ~~Does the Senior review screen's coral ✕ need a no-red pass?~~ **Resolved conservatively**: the shipped per-question feedback avoids red entirely, matching Junior; only the results-review list (a screen Junior has no equivalent of) may reasonably differ, and even there the shipped build did not introduce a red ✕.
5. ~~Content authoring cost for comprehension/word-problems?~~ **Grown 2026-07-22** to 20 word problems and 8 comprehension passages (24 questions) — a second content-authoring pass following the same convention Junior's banks used (§15.1). Still below Junior's per-bank targets (~25 items) since full passages are the most expensive content type in this project; further growth is a routine content-authoring task, not an open product decision.

### 26.9 First-person playtest pass (2026-07-22)

§17.3's child-usability protocol requires observed sessions with real children ages 5–7 without adult help — a human-subjects test that can't be substituted for. What was actually done here instead: a rigorous first-person adult walkthrough of the live Middle and Senior tiers in a real browser (screenshots visually inspected, DOM/computed-style checks where a screenshot alone wasn't conclusive), specifically looking for the class of problem automated `toBeVisible()`-style assertions structurally cannot catch — legibility, visual polish, and difficulty-feel, not just "does the element exist."

**Bug found and fixed:** every Senior-tier headline using `.s-display` without its own inline `color` (the home screen's "Welcome back, {name}", the three subject-card labels, the Achievements screen's "Achievements" and "Level {N}" headers, and the streak-reset screen's "Fresh start today") rendered as **dark ink-brown text on the near-navy background — effectively unreadable**, not the intended near-white `--s-text`. Root cause: `app.html`'s inline `<style>` sets `.screen{color:var(--ink)}` after `styles.css` loads; `.senior{color:var(--s-text)}` and `.screen{color:var(--ink)}` are both single-class selectors of equal specificity, so on any element carrying both classes the later-declared rule (Junior's ink-brown) won the cascade tie. Confirmed via direct `getComputedStyle` inspection (`rgb(61, 40, 24)` = `--ink`, present all the way up the ancestor chain to `.screen.senior` itself), then fixed by giving `.senior .s-display` its own explicit `color: var(--s-text)` in `styles.css` — the fix no longer depends on cascade order. Verified the fix visually (before/after screenshots) and mechanically (a new acceptance test asserts the actual computed color; confirmed it fails against the pre-fix CSS and passes against the fix). This is exactly the kind of defect §17.3 exists to catch and no prior automated test could have — the element was always present and "visible" to Playwright's own definition, just unreadable to an eye.

**Observations reported, not changed (product/design calls, not bugs):**
- ~~Middle/Senior can never earn stars~~ **Resolved 2026-07-22, see §26.10 (O10/D10).**
- ~~The Middle-tier stage-picker screen is visually thin~~ **Resolved 2026-07-22, see §26.10 (D12).**
- ~~Reused Junior mechanics never actually get harder content at Middle/Senior tiers~~ **Resolved 2026-07-22, see §26.10 (D11).**
- The word-problem "Coach tip" hint is always fully worked (e.g. states the exact operation and numbers to multiply), not a partial nudge — arguably undercuts the stage's own "read carefully" framing since a child could solve from the hint without reading the problem. Worth a design look if hint strength becomes a concern; not changed here since §14 already mandates hints never penalize and this doesn't violate that, it's a strength calibration question. Still open — not addressed in the §26.10 implementation pass.

Screens confirmed working well as designed: Senior's reading-comprehension screen (clean two-column layout, good contrast throughout — it happened to already set colors explicitly where needed), the word-problem typed-answer flow end to end (question → keypad → gentle non-red feedback → correct answer shown), and the achievements screen's earned/locked/in-progress badge states.

### 26.10 Design pass on the three §26.9 findings (2026-07-22) — O10, difficulty matrix, Middle UI polish

All three items surfaced by the playtest (§26.9) were specced and implemented the same day.

**Item A — star progression (O10, D10).** Formula, in `TIER_NEXT_Q`:

```
stars_earned = pctCorrect === 1   ? 3
             : pctCorrect >= 0.8  ? 2
             : pctCorrect >= 0.5  ? 1
             : 0
```

This mirrors Junior's own `earned = mistakes===0?3:mistakes<=2?2:1` formula, translated from a per-question mistake count (which Middle/Senior's session shape doesn't track) to the %-correct Middle/Senior already tracks. Stars are additive to XP, never a gate: even 0% still earns full XP (§26.3's no-fail design is untouched). Reachability: at a typical ~2-star-per-stage average, 30 stars (`MUSIC_UNLOCK_STARS`, unchanged) takes ~15 stages — comparable to how long a Junior child takes to clear their first World. `TierResultsScreen` now shows a Stars stat alongside XP/speed-bonus/time, using `—` (not `0`) when none were earned, matching the existing "Speed bonus: —" convention rather than inventing a new empty-state style.

**Item B — difficulty matrix, tier-aware for the 4 reused mechanics (D11).** `genAdditionQs`/`genSubtractionQs`/`genCompareQs`/`genPatternQs` now branch on `adapt.tier` 3 ways instead of collapsing 2-and-3 into one. Numbers were chosen against real rendering ceilings found while implementing, not the originally-proposed larger ranges:

| Mechanic | Junior (tier 1) | Middle (tier 2) | Senior (tier 3) | Ceiling that constrained the number |
|---|---|---|---|---|
| Addition | sums ≤9 | sums ≤11 | sums ≤15 | `AdditionBlocksView`'s equation row (flat blocks, no wrap) fits ~7-8/side on the 1024px frame before overflowing |
| Subtraction | minuend ≤9 | minuend ≤12 | minuend ≤16 | `AppleTree`'s rendered apples come from `APPLE_POOL`, exactly 16 positions — Senior's `hi=8` maxes minuend at `2×8=16`, right at the ceiling |
| Compare | range 1–8 | range 1–16 | range 1–16 | `MiniTree`, same 16-position `APPLE_POOL` ceiling, independently per side |
| Pattern | AB/ABC unit, 5-length sequence | AB/ABC unit (unchanged — was already tier-aware via `twoOpts`) | ABC/ABCD unit, 6–7-length sequence | `PATTERN_SHAPES` has only 5 distinct shapes; the strip is a fixed `min(760px,94%)` width |

Also tightened per the spec: Senior's XP speed-bonus window went from `total*20`s to `total*15`s (Middle unchanged at `total*20`s) — a faster pace is expected to earn the bonus at Senior, but slow play is never penalized at either tier, only forgoes the bonus.

**Important consequence found and kept, not silently shipped:** these four generators are the exact same functions Junior's `generateQuestions()` calls — `generateTierQuestions()` (Middle/Senior) and `generateQuestions()` (Junior) share them, they were never tier-siloed. Junior's own adaptive system (`getAdaptive`, §9.2) can independently push a mastered 7-year-old (15+ attempts at ≥90% rolling accuracy) to `tier:3` — so a highly-mastered Junior child now also receives the new Senior-level number ranges. This was reviewed and kept deliberately: it's consistent with §9.2's stated design ("rolling accuracy steps up... silent and gradual"), and the *old* behavior — tier 2 and 3 collapsing onto identical content — was the actual bug, not a deliberate Junior ceiling. If this combination is ever unwanted, the fix would be an explicit tier clamp in `generateQuestions()`'s call to these four functions; not implemented, since the product owner confirmed the current shared behavior is correct.

**Item C — Middle stage-picker polish (D12).** `TierSubjectStagesScreen` (Middle branch only — Senior's card grid was already adequately detailed) gained, all reusing existing components with the `onClick={()=>dispatch({type:'TIER_START',...})}` navigation completely untouched:
1. A per-stage subject icon (same icon/color as the subject card on `MiddleHomeScreen`).
2. A stage-number chip ("1 of 5" … "5 of 5").
3. A real per-stage mastery bar (`ProgressBar`, reading `skills[cfg.skill]` — the single stage's own skill, not `subjectPct`'s whole-subject aggregate).
4. An "Up next" highlight (colored border + raised shadow) on the first stage with zero recorded attempts for its skill.

**Testing:** 5 new acceptance tests cover all three items — a guaranteed 100%→3-star and guaranteed 0%→0-star completion (using a new `data-ok="true"/"false"` attribute added to `ComprehensionView`'s option buttons purely for deterministic test targeting, no visual/behavioral change for real users), Middle addition's tightened block count, Senior compare's wider range being reachable, and all four Item-C visual additions rendering plus navigation still working. All 80 acceptance tests and 74 unit tests pass.

### 26.11 Parent-facing age/tier change (2026-07-22)

**Gap found:** there was no way for a parent to change a child's age after onboarding, and therefore no way to move an existing profile between tiers at all — `SET_AGE` was dispatched exactly once, from `WelcomeScreen` during onboarding, and never again. This meant a parent (or anyone verifying the build) who already had a Junior profile set up could only reach Middle/Senior content by deleting that profile and re-onboarding a brand-new one at a different age — real friction with no in-app remedy, surfaced when the product owner tried to verify Middle/Senior from an existing Junior profile and couldn't.

**Fix:** a "Change age" control added to the Manage Children card (`ParentDashboard`, alongside the existing Rename/Reset progress/Remove actions, same inline-edit interaction pattern as Rename), backed by a new `SET_PROFILE_AGE` reducer action:
- Age chips 5–12 (same range as onboarding's `WelcomeScreen`), with a live "→ Junior/Middle/Senior tier" preview before saving — a parent sees exactly what tier a given age maps to before committing.
- Since `tierOf(age)` is the only input a tier is ever derived from, changing age *is* changing tier — no separate tier picker, consistent with §26.1's original "no separate tier picker" design.
- **If the edited profile is the currently active one and the change crosses a tier boundary**, the dashboard closes automatically and the app routes straight to the new tier's home screen (`tierHome` for Middle/Senior, `map` for Junior) — the same routing `activateProfile()` already does when switching between children of different tiers, so the parent immediately sees the tier they just moved the child into, rather than being left on a now-mismatched screen (e.g. the Junior map with a Senior-aged profile).
- **If the edited profile is NOT the active one** (a parent editing a different child's row while a third child's session is live), only the roster entry updates — the active child's live `profile`/`screen`/`session` are completely untouched, matching the exact safety pattern `RENAME_PROFILE`/`RESET_PROGRESS` already established for editing a non-active roster member.
- Reset the child's `session`/`tierSession` on an actual tier change (both would reference stage indices/configs from the old tier's `STAGE_CONFIGS`/`TIER_STAGE_CONFIGS`, which don't line up across tiers) — no change if the age edit doesn't cross a tier boundary.

3 new acceptance tests: active-profile Junior→Senior (routes to Senior home, not the Junior map), active-profile Junior→Middle plus a Cancel-is-a-true-no-op check, and a non-active-profile edit that leaves the currently-active child's session completely undisturbed. A `data-profile-row` attribute (test-only, inert for real users) was added to each Manage Children row to make the non-active-profile test's targeting unambiguous — the row div's own text ("Ben · Age 6 · Junior · ⭐ 0") is also present in shared ancestor containers, so plain text-based selectors risked clicking the wrong child's controls. All 83 acceptance tests and 74 unit tests pass.

### 26.12 Keypad fix + Science/Music content-overlap finding (2026-07-22)

Verifying Middle/Senior directly (now reachable via §26.11's age-change control) surfaced two more real issues.

**Fixed — word-problem keypad couldn't type "/" or ":".** `WordProblemView`'s 12-key numpad (`7 8 9 / 4 5 6 / 1 2 3 / . 0 ⌫`) had no way to enter a fraction or a time. Checked against the actual bank content, not assumed: `wp-frac-2` ("5/8") and `wp-frac-3` ("3/4") both list a fraction as a valid `acceptEquivalents` form (alongside a decimal), and `wp-time-1` needs "4:00"-style input — none of the three were typeable. No item is fraction/time-*only* (each also accepts a decimal), so this wasn't a hard blocker, but it's a real gap for a child who reasonably tries the natural form of their answer. Fixed by widening the keypad to a 4×4 grid — `7 8 9 / / 4 5 6 : / 1 2 3 ⌫ / . 0` (2 empty spacer cells) — keeping the original 7-8-9/4-5-6/1-2-3/.-0 numpad shape completely unchanged, so this is additive, not a rework. Verified end-to-end: typing `3`, `/`, `4` via the keypad produces "3/4" in the answer field; backspace still works correctly. 1 new acceptance test.

**Found, not fixed — Science (and Music) have zero tier-appropriate content, unlike Math/Words.** Checked all four subjects' Middle/Senior stage lineups against Junior's directly:
- **Math**: already tier-scaled (§26.10's difficulty matrix; word problems/comprehension already have `minTier`/`maxTier`-gated content).
- **Words**: already has real tier-appropriate content (comprehension passages, word problems) alongside the reused Junior mechanics.
- **Science**: `genHabitatQs`/`genLifeOrderQs`/`genSinkFloatQs`/`genHotColdQs`/`genLivingSizeMixQs` all draw from the exact same fixed banks (`HABITAT_BANK`, `LIFECYCLE_SEQS`, `SINK_FLOAT_BANK`, `HOT_COLD_BANK`, `LIVING_BANK`/`SIZE_BANK`) regardless of tier, and use Junior's own skill ids verbatim (`science.habitats`, `science.lifecycle`, etc.) — **a 12-year-old in Senior science sees the identical "is this living or non-living" content a 6-year-old sees**, just behind relabeled stage titles ("Classification" instead of "Sort it Out!"). None of these banks were ever authored with a Middle/Senior-appropriate difficulty tier to draw from.
- **Music**: every tier is pure rhythm-tap (`genRhythmQs`), differing only in `patternLen` (a real, existing scaling knob — Senior's patterns are already longer than Junior's) — this one is closer to fine, since the *mechanic* itself has genuine tier variation built in, unlike Science's flat reuse.

**Scope decision (2026-07-22):** authoring genuinely new Middle/Senior-appropriate science content (real biology/chemistry concepts, not just relabeled sorting games) is content-writing work, not a code fix, and was deliberately scoped as a separate follow-up rather than rushed alongside the keypad fix. Tracked as O11 in Appendix B.

1 new acceptance test (keypad). All 83 acceptance tests and 74 unit tests pass — the same count as before this pass, since the Science/Music finding wasn't implemented, only diagnosed and documented.

### 26.13 O11 resolved — real Middle/Senior science content authored (2026-07-22)

§26.12 found that Science was the one subject with zero tier-appropriate content: all 5 stages per tier reused Junior's exact fixed banks (`HABITAT_BANK`, `LIFECYCLE_SEQS`, `SINK_FLOAT_BANK`, `HOT_COLD_BANK`, `LIVING_BANK`/`SIZE_BANK`) and Junior's own skill ids, with Senior's stage labels/curriculum tags actively mismatched to the underlying (Junior-level) mechanic they were relabeling — a "Forces & Energy" / NGSS 5-LS2 label sat on top of the `habitat` animal-homes sorting game, not a physics mechanic. Unlike Math (§26.10's difficulty matrix) and Words (real comprehension/word-problem banks), Science had no age-differentiated content to draw from at all.

**What was kept.** 2 of the 5 stages per tier were already genuine, age-appropriate content that just needed correct labels — `habitat` (adaptation/habitats) and `lifeorder` (life-cycle sequencing) are real concepts at any age; only Senior's labels were wrong (now "Adaptation & Habitats" / "Life Cycles", matching what the stage actually teaches).

**What was authored.** A new `scienceQuiz` content bank (36 items, `content.js`) of curriculum-tagged multiple-choice questions, replacing the 3 mismatched stages per tier with genuinely different-difficulty mechanics and content — not just harder wording of the same Junior concept:
- **Middle (NGSS grade 3, difficulty 1):** forces & motion, weather & climate, states of matter.
- **Senior (NGSS grade 5, difficulty 2–3):** energy transfer, ecosystems & food webs, matter & its properties.
- 2 additional skills (`life_cycles_traits`, `earth_systems`) were authored into the bank for future stage assignment but aren't wired to a stage config yet.

Each item carries `{ id, skill, curriculum, difficulty, prompt, opts:[{t,ok}], hint }`, matching `comprehensionPassages`' inner-question shape so the existing schema-test helpers apply unchanged. 7 new `skillLabels` and `realWorldTips` entries were added for the new skill ids.

**New generator and view.** `genScienceQuizQs(cfg, n=5)` filters the flat 7-skill bank by `cfg.skill` first, then by `cfg.minTier`/`cfg.maxTier` — skill must be the primary filter here (unlike single-skill banks like `wordProblems`) since one flat array holds 7 unrelated topics. A new `ScienceQuizView` component renders a single-column multiple-choice layout, reusing `ComprehensionView`'s option styling and `data-ok` test convention. `TIER_ANSWER`'s correctness check gained a `scienceQuiz` branch (`a.chosen.ok`, since there is no single top-level `q.correct` value for this question type — correctness lives inside the chosen option itself).

**Content depth.** Every stage's actual difficulty-filtered pool was checked, not assumed — the first draft left several stages with only 1–2 usable items per session, well short of the ~5-question sets every other mechanic serves. Additional items were authored per skill until every stage's pool reached 4–5 items.

2 new acceptance tests (`§26.13 O11 fix`, one per tier) confirm a real scienceQuiz question renders, answering produces correct/incorrect feedback, and a full Senior set awards XP. A new `scienceQuiz` bank schema test (unique ids, difficulty tags, exactly one correct option, skill referenced in `skillLabels`) and an extension of the existing minTier/maxTier coverage check (now also validates `scienceQuiz` stages have matching bank content per skill) were added to `content-schema.test.cjs`. All 86 acceptance tests and 76 unit tests pass.

---

## Appendix A — Engineering Capability Map

An external game-development skills matrix (AAA/live-service oriented, 41 skills, assessed in two batches) was reviewed against this project. Bopplebee is a **local-only, single-player, tap-first, 2D educational tablet game** — many of those competencies do not apply, and recording *why* prevents future scope creep. This appendix is capability planning, not product requirements. Three genuine spec gaps surfaced by the matrix were promoted into the spec proper: store kids-program review gates (§18), the no-push-to-children rule (§14), and regional privacy regimes beyond COPPA (§11.3).

### A.1 Skills that apply — adapted to this project

| Skill (from matrix) | How it applies to Bopplebee | Phase | Spec refs |
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
| D5 | 2026-07-21 | **O1 resolved by inspection: §5 core-loop rules rewritten to match the shipped build, not the other way around.** Comparing §5's "proposed" text line-by-line against `app.html`: 3 of 5 lines were already accurate; the retry/requeue line was stale (the requeue behavior was in fact built and already documented correctly in §8.4); the "correct answer pulses before the modal" line described mockup intent that was never wired into any component (the CSS class exists, is applied nowhere). | No product-owner tradeoff was actually pending here — this was a documentation drift bug (§5 contradicting §8.4/§17.1 within the same doc), not an open design question. §5 now states the real behavior and is tagged Shipped. |
| D6 | 2026-07-21 | **O2 ratified: platform support matrix confirmed as-is.** Android 11+ tablets and iPadOS 16+, tablet-first, landscape-locked; phones unsupported at v1. | §16's "proposed" tag removed — this is now the confirmed P2 device-testing floor. |
| D7 | 2026-07-21 | **O3 ratified: §17.4 beta KPI targets confirmed as-is.** Onboarding completion ≥90%, first-3-stages-in-week-1 ≥70%, retry-modal→quit rate <10%, session length 15–25 min, sessions/week ≥3, ≥30% of active families open the parent dashboard weekly. | Ship beta with these as the working targets; §17.4's "hypotheses" framing removed — revisit only once real beta data lands (§17.5). |
| D8 | 2026-07-22 | **O8 ratified: ages 5–12 expansion approved and built.** Junior (5–7, unchanged) plus new Middle (8–9) and Senior (10–12) tiers, auto-selected from `profile.age`, reusing the existing 4 subjects and generator engine rather than the design mock's illustrative subjects. | §26 fully rewritten from "design proposal" to "shipped": tier home/activity/results screens, XP/level economy (additive to stars/coins, never replacing them), typed-answer and reading-comprehension mechanics, guilt-free streak reset extended to Senior. 6 new acceptance tests + 17 new unit tests, all passing; all 62 pre-existing Junior acceptance tests pass unmodified. Not built at the time: a Senior achievements/badge screen — see D9. |
| D9 | 2026-07-22 | **O9 resolved: Senior achievements/badge screen built the same day it was opened.** `SeniorAchievementsScreen` (8 badges + level bar), reachable from a new 🏆 icon on `SeniorHomeScreen`. | Every badge is computed from real, persistent, monotonic profile fields (`tierQuestionsAnswered`, `tierPerfectSets`, `tierHadFastSet`, `tierSubjectsPlayed` — all new) rather than the capped event log, so a badge can never un-earn itself as old events age out (§14 progress-is-additive). §26.6 rewritten from "known gap" to "shipped." 2 new acceptance tests. |
| D10 | 2026-07-22 | **O10 resolved: Middle/Senior now earn stars, unblocking Music.** A star-progression formula was specified and implemented in `TIER_NEXT_Q`: `pctCorrect===1 → 3 stars, >=0.8 → 2, >=0.5 → 1, else 0` — translating Junior's own mistake-count-based formula (0 mistakes→3, ≤2→2, else 1) into Middle/Senior's %-correct tracking. Stars are a second reward layered on top of XP, never a gate or penalty — even a rough set (<50%) still earns full XP, just 0 stars that round. | §26.10 written up in full (formula, worked reachability check against the existing 30-star `MUSIC_UNLOCK_STARS` gate, code diff). `TierResultsScreen` now shows a Stars stat alongside XP/speed-bonus/time. 2 new acceptance tests (guaranteed 100%→3-star and guaranteed 0%→0-star completions, using a new `data-ok` attribute on comprehension options for deterministic answer selection in tests). |
| D11 | 2026-07-22 | **Difficulty matrix (Item B) implemented for the four reused mechanics.** `genAdditionQs`/`genSubtractionQs`/`genCompareQs`/`genPatternQs` previously collapsed Middle (tier 2) and Senior (tier 3) onto the identical branch — now genuinely 3-way, with number ranges chosen to respect real rendering ceilings discovered while implementing (addition's equation row fits ~7-8 blocks/side before overflowing the 1024px frame; subtraction/compare's tree-based rendering is hard-capped at `APPLE_POOL`'s 16 positions). Senior's speed-bonus window also tightened from `total*20`s to `total*15`s, matching the difficulty-matrix spec. | **Real consequence surfaced and deliberately kept**: these four generators are the SAME functions Junior's own `generateQuestions()` calls, and Junior's adaptive system (`getAdaptive`) can independently push a mastered 7-year-old (15+ attempts, ≥90% accuracy) to `tier:3` — so a highly-mastered Junior child now also reaches the new, harder tier-3 numbers. Product owner reviewed and confirmed this is consistent with §9.2's existing design intent (gradual step-up for mastery) rather than an unwanted side effect — the old behavior (tier 2 and 3 producing identical content) was the actual oversight, not a deliberately-capped ceiling. §26.10 documents the full before/after matrix. 2 new acceptance tests. |
| D12 | 2026-07-22 | **Middle stage-picker UI polish (Item C) implemented**, `onClick` navigation untouched. `TierSubjectStagesScreen` gained: a per-stage subject icon, a stage-number chip ("N of 5"), a real per-stage mastery `ProgressBar` (reading `skills[cfg.skill]`, not the whole-subject `subjectPct` aggregate), and an "Up next" highlight on the first stage with zero recorded attempts. | All four reuse existing components (`ProgressBar`, subject icons/colors, sticker-card shadow language) — no new dependencies. Senior's card grid was left unchanged (it already had icon+% and an `s-track` bar). 1 new acceptance test, verified with a before/after screenshot during the playtest-style implementation pass. |
| D13 | 2026-07-22 | **Parent-facing age/tier change added.** There was previously no way to change a child's age after onboarding at all, so no way to move an existing Junior profile into Middle/Senior short of deleting it and re-onboarding fresh — found when the product owner tried to verify Middle/Senior from an existing profile and couldn't. A new "Change age" control in the Manage Children card (`SET_PROFILE_AGE` reducer action) lets a parent pick a new age 5–12, with a live tier preview before saving. | §26.11 written up in full. Changing the active profile's age across a tier boundary auto-routes to the new tier's home screen (mirrors `activateProfile()`'s existing cross-tier routing); editing a non-active child's age only touches the roster, leaving the active child's live session completely untouched (same safety pattern as `RENAME_PROFILE`/`RESET_PROGRESS`). 3 new acceptance tests, plus a test-only `data-profile-row` attribute added to make per-child row targeting in tests unambiguous. All 83 acceptance tests and 74 unit tests pass. |
| D14 | 2026-07-22 | **O11 resolved: real Middle/Senior science content authored.** A new `scienceQuiz` bank (36 curriculum-tagged multiple-choice items across 7 NGSS-aligned skills) replaces the 3 mismatched-difficulty stages per tier; the 2 stages that were already genuine content (`habitat`, `lifeorder`) were kept, with Senior's previously-wrong labels corrected. | §26.13 written up in full (what was kept vs. authored, the new `genScienceQuizQs` generator's skill-then-difficulty filtering design, `ScienceQuizView`, the `TIER_ANSWER` reducer branch for option-object correctness). 2 new acceptance tests plus a new bank schema test and an extended minTier/maxTier coverage check. All 86 acceptance tests and 76 unit tests pass. |

### B.2 Still open

| # | Owner | Decision needed | Deadline / gate |
|---|---|---|---|
| O4 | Product owner | **Run formal trademark clearance for "Bopplebee"** (current name as of 2026-07-22, superseding "Puddlejump" the same day — see `NAME_SHORTLIST.md` §7). The name has changed twice in one day on web-search confidence alone (Bloom Academy → Puddlejump → Bopplebee), each time renamed in-app before any real clearance step ran. Bopplebee had no adjacent competitor found across two search passes (a whimsy-compound batch that all collided on closer checking, then an invented-word batch Bopplebee came from) — the strongest candidate so far, not yet cleared. Still needs: USPTO TESS search, app-store search, domain purchase, and a trademark attorney's opinion (`NAME_SHORTLIST.md` §3) — none of those have been done; this is a web-search sanity check, not a clearance. `NAME_SHORTLIST.md` §7 explicitly recommends converting to the real legal work now rather than continuing to rename on search confidence alone. | Hard gate: before any P2 brand investment |
| O5 | Product owner | World-2 pricing: per-world vs. all-subjects bundle, and price point | Before P2 store setup |
