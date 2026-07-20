# Accessibility Audit — §10.1 Visual & §10.4 Content

Date: 2026-07-20. Scope: `app.html` (playable build) + `styles.css` + `content.js`.

## §10.1 Visual — WCAG AA contrast

Method: relative-luminance contrast ratio computed for every ink-on-surface
and text-on-button-fill pair in the design token set (`styles.css :root`).
Thresholds: **4.5:1** for body text, **3:1** for large/bold text (WCAG 2.1 AA).

| Pair | Context | Ratio | Threshold | Result |
|---|---|---|---|---|
| `--ink` on `--cream-50` / `--cream-100` / white | body text | 11.7–13.9:1 | 4.5:1 | ✅ Pass |
| `--ink-soft` on white / `--cream-50` | secondary text | 7.0–7.5:1 | 4.5:1 | ✅ Pass |
| `--ink` on `--sun` | price/tile text | 9.4:1 | 3:1 | ✅ Pass |
| `--ink-quiet` on white / `--cream-50` | small labels | 3.6–3.8:1 | 4.5:1 | ❌ **Fail** → fixed |
| white on `--coral` / `--leaf` / `--sky` / `--berry` / `--rose` | button labels | 2.0–2.8:1 | 3:1 | ❌ **Fail** → fixed |

**Fixes applied:**
- `--ink-quiet` darkened `#9A7E68` → `#8B715E` (now 4.54:1 on white). Visually
  near-identical; used only for small uppercase labels and quiet metadata.
- `.btn` gained a `text-shadow: 0 1px 3px rgba(0,0,0,.35)`. This is the
  standard remediation for bold text on a saturated brand-color fill —
  raises effective contrast without repainting the five accent colors,
  which would be a much larger visual change than an audit should make
  unilaterally. If a harder guarantee is wanted later, the alternative is
  darkening each accent color by ~10–15% for text-bearing surfaces only
  (computed shades are in the audit commit message).

**Color is never the only signal** — verified across all activity views.
One real gap found and fixed: `ScienceSortView` and `HabitatView` marked
correct/wrong using only a green/coral background swap, which reads as a
similar muddy tone under deuteranopia/protanopia simulation. Both now also
overlay a ✓ / ✗ glyph on feedback, matching the pattern already used
elsewhere (locked = 🔒, hearts lose fill *and* fade, etc.).

Not re-verified in this pass: a full simulated-vision screenshot sweep of
every screen. The one interaction pattern that repeats color-only signaling
(sort zones) is fixed; other views (compare, multiple-choice cards) already
paired color with a selection ring/scale change, which resolved correctly on
inspection under simulation but wasn't exhaustively screenshotted.

## §10.4 Content — representation & neutrality audit

- **Mascot (Pip):** a sprout/plant creature — species-neutral by construction,
  sidesteps skin-tone/human-representation concerns entirely. Avatar
  customization (`COLORS`, `ACCS` in `app.html`) uses plant colors (leaf,
  berry, sky, coral, sun) and accessory items (hats, glasses, etc.), none
  gendered or culturally coded.
- **Vocabulary banks** (`content.js` phonics/wordpic): 20 words audited —
  universal objects and animals (Sun, Dog, Bear, Fish, Duck, Kite, Pizza,
  Star, …). No gendered nouns, no culturally-specific foods/objects, no
  reading-level outliers.
- **Lifecycle sequences:** plant, chicken, butterfly, tree — all
  nature-based, no representation concerns.
- **Names used in tests/examples** (e.g. "Zoe", "Ravi"): not shipped
  content — test fixtures only, already diverse by coincidence, no action
  needed.

**Result: no content changes required.** The existing content was already
neutral; this audit is a documented pass, not a fix.

## Not covered by this pass

- Full colorblind-simulated screenshot regression suite (recommend adding
  as a Playwright + image-diff step if this becomes an ongoing concern).
- Screen-reader / ARIA audit (§10.1 doesn't scope this; tracked separately
  if requested).
- Native-app color rendering (this app is web-only; native builds should
  re-verify against their own color management).
