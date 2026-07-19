# Handoff: Bloom Academy — Kids' Educational Game (ages 5–7)

## Overview
Bloom Academy is an original education + infotainment game for children ages 5–7 (Khan Academy Kids-style). Subjects: Numbers (math), Words (reading/phonics), Science, Music, Shapes. A mascot named **Pip** (a round sprout creature) guides the child through themed worlds with a node-on-path progression, five distinct activity mechanics, star/coin rewards, an accessory shop, and a parent dashboard behind a math gate.

This package covers **27 screens + 3 art-direction variations + a 7-second animated splash intro**.

## About the Design Files
The files in this bundle are **design references created in HTML/React** — prototypes showing intended look and behavior, **not production code to copy directly**. The task is to **recreate these designs in the target codebase's environment** (React Native, Flutter, Unity, web — see Tech Recommendations) using its established patterns. The React/JSX here uses in-browser Babel and window-scoped components; treat it as a highly precise spec, not an architecture.

## Fidelity
**High-fidelity.** Colors, typography, spacing, radii, and shadows are final and should be recreated pixel-close. Two exceptions:
1. **Pip the mascot** is built from CSS primitives (circles/ovals). Ship as vector art (SVG/Lottie) redrawn from the CSS version, or replace with commissioned illustration keeping the same silhouette, moods, and color slots.
2. **Emoji used as art** (🐶 🌼 👒 🔬 etc.) are placeholders. Replace with illustrated icons before ship, or standardize on a cross-platform emoji set (e.g. Twemoji) deliberately.

## Target platform & orientation
- Designed at **1024×720 landscape** (tablet-first — correct for this age group).
- Minimum tap target used: **44px**; most interactive elements are 56–130px.
- All screens assume landscape lock.

## Screens / Views

### Section 1 — Onboarding (screens-d.jsx)
1. **Welcome** — Pip waves (320px, bottom-left); white card (440px, rotated 3°, top-right) asks name (text input, Fredoka 32px) and age (5 round chips 44px, selected = coral with dark shadow). Step dots top-center (active = 36px pill). CTA "Hi, Pip! →" coral big button.
2. **Pick Buddy (avatar)** — Left: preview card 360×420 with live Pip (240px, "proud" mood) + editable name pill. Right: color row (5 swatches 78px, selected = 4px ink outline + ✓ badge) and accessory grid 4-col (None/Sun hat/Glasses/Bow unlocked; Crown/Cape/Wand/Pet locked at 50% opacity with 🔒). "Surprise me" ghost link + "Looks great! →" CTA.
3. **Learning Plan** — 3×2 grid of subject cards (icon tile 64px + title/sub). Checked = 4px colored ring + ✓ badge top-right. Footer: Pip + count confirmation + "Let's go! 🌱" leaf CTA. Rule shown in copy: pick ≥ 2.

### Section 2 — Home & Subjects (screens-a.jsx)
4. **Splash** — Logo "Bloom" (Fredoka 84px coral, 6px dark text-shadow) over "ACADEMY" (48px leaf-dark, 0.18em tracking); Pip 220px waving; "Tap to Play ▶" leaf big button; Sign In / Parents chips.
5. **World Map (Meadow)** — Sky-to-grass gradient; SVG winding path (cream 44px stroke + dashed amber center line); level nodes 88px circles: done = leaf + ✓, current = coral 100px with 8px halo ring + Pip standing on it, locked = cream + 🔒. Top bar: avatar+name+level (left), coins/hearts/settings (right). Bottom: world label sticker + "Continue →".
6. **Pick Subject** — 2×2 sticker cards (icon tile 96px, title Fredoka 34px, star progress bar). Locked subject at 55% opacity with 🔒 badge. Cards alternate ±3° tilt.
7. **Lesson Intro** — Pip 260px + speech bubble ("Let's count apples! 🍎" 32px + instruction 18px); objective card 280px top-right (lesson name, 3 earnable stars, time estimate); "Start ▶" coral big CTA bottom-right.

### Section 3 — Core Activities (screens-b.jsx, screens-c.jsx)
8. **Math · Counting** — Scene: CSS tree with 7 apples; question sticker top-center with mini-Pip; 3 answer buttons right column (320px wide, number tile 72px + word); progress bar + question count top-left; hearts + timer chips; hint button (💡 sun circle) bottom-left.
9. **Reading · Phonics** — Prompt sticker: play-audio button (56px sky circle) + "Which one starts with…" + letter tile S (84px). 3 picture cards 220×260 (illustration area 150px + word label). Pip bottom-left with phonics hint bubble ("Say the sound: sss…").
10. **Sort · Drag-drop** — Shapes row (circle/square/triangle, small vs large); one shape mid-drag (elevated shadow, rotated −6°, 👆 cursor hint, dashed origin outline); two dashed drop baskets (360×200) labeled Small/Large with already-sorted items inside.
11. **Tracing · Letter A** — Left canvas 560×540: dashed writing guide lines at 20/50/80%; SVG letter A with completed stroke (solid coral 36px), in-progress stroke (partial coral over dashed ghost), pending crossbar (dashed); trace-point circle + 👆 finger. Right column: word card (Apple + apple icon), Pip tip sticker, Skip ghost button. Per-stroke star row top-right.
12. **Matching Pairs** — 3×2 card grid: face-down = berry with "?" (60px), face-up = white with emoji 80px + word, matched = colored ring + ✓ badge. Tap counter chip + pairs-matched count.

### Section 4 — Subject Worlds (screens-e.jsx)
Each world = same node/path metaphor, different art direction.
13. **Numbers · Orchard** — golden-hour gradient (#FFE08A→#FF9A4A), CSS apple trees, gift-box 🎁 end reward (100px sun circle), level-preview sticker + Play CTA.
14. **Words · Forest** — blue-green gradient, triangle conifers, floating letter signs (white tiles, rotated), sky-colored nodes.
15. **Science · Discovery** — cool-to-warm gradient, floating props (🧪🔭🌱🌍), leaf nodes, "Plant a seed" preview.
16. **Music · Stage (locked state)** — dark purple radial (#6B4794→#3E2A5C), two spotlight beams (SVG gradients), theatre curtain bottom (#8C2C3C with pleat shadows), floating gold notes. Center: 160px lock circle, "Coming soon!", "Earn 30 ⭐ to unlock" pill, progress bar 15/30. Header uses glass pills (rgba white 12% + blur) on dark.

### Section 5 — Subject-specific Activities (screens-f.jsx)
17. **Math · Addition Blocks** — equation row: white tray (3 coral blocks 50px) + "+" + tray (2 sky blocks) + "=" + dashed answer slot (sun blocks dropped + 2 ghost slots). Number tray bottom (tiles 64px, one lifted with 👆). "Check ✓" muted button (disabled-style until slot full).
18. **Words · Word Builder** — image clue card 280×240 (CSS cat, rotated −3°); slot row: filled letter tiles (110×130 sky) + dashed empty slot with "DROP HERE"; letter tray bottom (5 white tiles 72×80, correct one lifted + outlined). "Hear word" audio pill in top bar.
19. **Science · Plant Lifecycle** — horizontal timeline with 4 slots (130×160): Seed 🌰 and Sprout 🌱 placed, 2 dashed empties; First/Last pills; arrows between; card tray bottom (Flower/Plant, one lifted).
20. **Music · Rhythm Tap** — dark stage; 4 color lanes; falling note circles (76px, ♪); tap pads bottom (110px tall, active pad full-opacity + white ring + "TAP!", inactive 45% opacity); combo chip (×12), "Good!/Perfect!" hit labels; song title + difficulty stars.
21. **Shapes · Pattern Complete** — sequence strip (white 28px-radius bar): circle/square/triangle pattern + dashed "?" slot; 3 answer tiles 140px below (correct = leaf ring highlight in the mock — in the real app no pre-highlight).

### Section 6 — Feedback States (screens-g.jsx)
22. **Correct!** — Activity dimmed behind rgba(61,40,24,0.25); modal 560px (radius 40, big drop shadow): Pip "proud" in sparkle ring, "That's it! 🎉" (Fredoka 46 leaf-dark), reinforcement copy, +1 star & +5 coins row, "Next question →" CTA. **Never blocks longer than one tap.**
23. **Try Again** — Deliberately gentle: **no red, no ✗, hearts unchanged**. Pip "curious" mood, "So close!" (sky-dark), scaffolded copy ("Let's count together this time"), 5 hearts shown intact, "💡 Show me" ghost + "Try again" sky CTA.

### Section 7 — Reward, Shop, Settings (screens-b.jsx, screens-g.jsx)
24. **Stage Cleared** — Full celebration: warm radial gold bg, confetti rects (8, rotated), "Great job!" 64px coral, 3 stars 80px, Pip waving 200px, +25 coins & badge stickers, "↻ Play Again" ghost + "Next Stage →" leaf big.
25. **Pip's Shop** — Left: Pip modeling outfit in 280×320 card (worn accessory emoji layered on head) + "earn coins" tip pill. Right: 4×2 item grid; states: owned (leaf ring + ✓ + "Wearing" pill), affordable (sun price button with coin icon), too expensive (55% opacity, muted price). Coin balance chip top-right.
26. **Settings** — Left (kid): 4 rows with 52px icon tile + label (Fredoka 22) + giant toggle (72×40, leaf = on). Right (grown-ups): dark ink card with **parent gate** — "What is 7 × 4?" with 3 answer chips (24/28/32); below, trust note (no ads, no chat, COPPA). Gate must be required for: parent dashboard, external links, account, purchases.
27. **Parent Dashboard** — Light neutral bg (#F7F3EE), denser adult UI: child switcher pills; 4 stat cards (time, stages, stars, streak); bar chart daily playtime (7 bars, today = coral); skills list with % progress bars; daily-limit row with toggle. Nunito-forward, smaller type OK here (adults).

### Art-direction Variations (variations.jsx) — for reference only
A **Cozy sticker** (chosen direction, matches all screens) · B **Bold cartoon** (black outlines, comic burst) · C **Modern flat** (editorial, geometric). Implement direction A.

### Animated Splash (splash-video.html)
7s intro: bg warms up (0–1s) → clouds drift in + sun scales/spins in with back-ease (0.3s) → Pip jumps in with easeOutBack squash-and-stretch, then idle bob (0.8s) → "Bloom" letters drop one-by-one, 80ms stagger, with sparkle burst (1.6s) → "ACADEMY" slides up (2.9s) → Pip starts waving (3.5s) → Play button pops in with pulse loop (4.3s). Recreate with the target platform's animation system (Lottie/Reanimated/Unity timeline); exact easings in the file.

## Interactions & Behavior

### Navigation flow
Splash → (first run: Welcome → Avatar → Plan) → World Map → tap current node → Lesson Intro → Activity loop (question → feedback → next ×N) → Stage Cleared → back to Map (next node unlocked, path animates). Subject picker reachable from map header. Shop/Settings from map. Parent dashboard only via gate.

### Core loop rules (proposed — confirm with product owner)
- 5 questions per stage; ~4 min target.
- Stars: 3 = no mistakes, 2 = 1–2 mistakes, 1 = completed. Coins: +5/question, +25/stage.
- Wrong answer: 1st → gentle retry modal; 2nd → auto "Show me" walkthrough, then the question is repeated later in the set. **Hearts are cosmetic in ages-5–7 mode — never a fail state.**
- Answer buttons: disabled during feedback; correct answer pulses green before modal.
- Locked worlds unlock by total stars (Music = 30⭐ in mock).
- Every instruction has a read-aloud audio button; auto-play prompt audio once on question load.

### Touch feedback (all buttons)
Sticker buttons press down: translateY(3px) + shadow shrinks 6px→3px, 80ms ease. Draggables lift: scale 1.05–1.08, rotate ±4–6°, big soft shadow. Drop zones: dashed border brightens on hover-over.

### States not designed (build with same system)
Loading (Pip idle bob + progress bar), offline, empty shop, audio-off variant, returning-user splash (skips onboarding).

## State Management (suggested)
- `profile`: name, age, avatarColor, accessoryOwned[], accessoryWorn, coins, stars, streak
- `progress`: per-subject → per-world → node states (done/current/locked), per-stage star counts
- `settings`: music, sfx, readAloud, leftyMode, dailyLimitMinutes (parent-set)
- `session`: current stage, question index, mistakes, elapsed
- Persist locally; sync to account if multi-device is required. Parent dashboard reads aggregates.

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| cream-50 | #FFF7E8 | default screen bg |
| cream-100 | #FCEAC9 | tiles, muted fills |
| cream-200 | #F5D9A8 | borders, empty bars, disabled |
| coral / coral-dark | #FF8A4C / #E15F1F | primary action, Numbers |
| leaf / leaf-dark | #6FCB7F / #3D9E50 | success, Science, Pip body |
| sky / sky-dark | #5EB7E8 / #2E89BD | Words, secondary |
| berry / berry-dark | #B587E0 / #7E4DB5 | Music-adjacent, cards |
| sun / sun-dark | #FFCE52 / #E2A41B | stars, coins, prices |
| rose / rose-dark | #F58FA8 / #C7547A | hearts, cheeks |
| ink / ink-soft / ink-quiet | #3D2818 / #6B4F3A / #9A7E68 | text hierarchy (warm, never pure black) |
| Dark stage bg | #3E2A5C / #6B4794 | Music world |
| Parent dashboard bg | #F7F3EE | adult surfaces |

Rule: every saturated color pairs with its `-dark` as a **bottom shadow** (`0 6px 0 <dark>`), the signature "sticker" depth. Alternate palettes (Berry orchard, Ocean garden, Forest friends, Cotton candy) are in index.src.html PALETTES; `-dark` = base darkened 25%.

### Typography
- **Fredoka** (Google Fonts; 500/600/700) — display, buttons, headings, all kid-facing UI text.
- **Nunito** (600–900) — body, labels, parent dashboard.
- Scale (at 1024×720): hero 64–84 · screen title 40–46 · card title 26–34 · button 22–32 · body 16–19 · label 12–14 (chrome only). Kid-facing text never below 16px.

### Spacing & radii
- Spacing: 4/8/12/16/24/32/40/60.
- Radii: pill 999 (buttons/chips) · 44/32 (cards) · 22 (tiles) · 14 (small).
- Shadows: sticker `0 6px 0 <dark>` + optional `0 14px 22px -8px rgba(61,40,24,.25)`; neutral card `0 8px 0 rgba(61,40,24,.07), 0 22px 36px -12px rgba(61,40,24,.16)`.
- Playful tilt: cards alternate rotate(−3°)/rotate(3°).

### Tablet frame
The dark bezel (#2A1E14, radius 38, padding 14, camera dot) in mocks is **presentation chrome only** — do not build it.

## Pip (mascot) spec
Body: circle-ish blob (border-radius 50% 50% 46% 46% / 55% 55% 45% 45%) in a palette color; cream belly oval; 2 black eyes with white highlights; rose cheeks; smile arc; sprout + leaf on head; stub feet. Moods: `happy` (default smile), `curious` (round mouth, wide eyes), `proud` (big grin + ✨), `thinking` (one squint eye), `wave` (raised arm). Color slots: leaf (default), berry, sky, coral, sun. See `.pip` rules in styles.css for exact proportions (all % of body size — scales cleanly to SVG).

## Assets
- Fonts: Fredoka, Nunito (Google Fonts, free).
- No raster images. All art is CSS/SVG primitives + emoji placeholders (replace before ship, see Fidelity).
- Sounds not designed: need tap, correct (rising chime), gentle retry, star pop, coin, stage-clear fanfare, per-letter phonics VO, instruction VO.

## Tech Recommendations (decide before starting)
- **React Native (Expo) + Reanimated + Skia** — best fit: designs are already React, cross-platform tablet support. Recommended default.
- Flutter — equally viable; recreate tokens as ThemeData.
- Unity — only if gameplay gets significantly more physics/animation heavy.
- Web (PWA) — fastest path to a testable build; the mocks are literally web already.
- Audio/VO strategy and COPPA-compliant analytics (no PII, no ads SDKs) must be chosen at project start.

## Files in this bundle
- `index.html` — all 27 screens + variations on one canvas (open in browser)
- `screenshots/` — PNG capture of every screen at 1024×720, numbered in flow order (01-welcome … 27-parent-dashboard, plus 28–30 art-direction variations)
- `splash-video.html` — animated intro with scrubber
- `styles.css` — the design system CSS (tokens live here)
- `ui-kit.jsx` — shared components: TabletFrame, Pip, Btn, Chip, Stars, Bubble, ProgressBar, TopBar, etc.
- `screens-a…g.jsx` — screen implementations by section
- `variations.jsx` — art-direction options (A is canon)
- `index.src.html` — module-loading source (palette presets, font options)
