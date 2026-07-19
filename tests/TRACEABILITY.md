# Test ↔ Requirements Traceability Matrix

**Suite:** `tests/acceptance.spec.cjs` (Playwright) · **Spec:** `REQUIREMENTS.md` v2.5 · **Run date:** 2026-07-19
**Result: 14 / 14 passed** (21.6 s, Chromium headless).
**Report with screenshots:** `playwright-report/index.html` (open with `npm run report`). Every test attaches step screenshots plus a final screenshot; failures also attach an error-context snapshot.

> During stabilization the suite caught a real product bug: "Try Again" dispatched `NEXT_Q` and skipped the missed question, making the §3.5/§8.4 reveal-after-2-mistakes rule unreachable. Fixed in `app.html` (new `RETRY` action) — see REQUIREMENTS.md §23.

| # | Test | Requirements verified | Status |
|---|---|---|---|
| 1 | Onboarding completes; min-2 subjects enforced; name field sanitized | §3.1 onboarding flow · §17.1 test 4 (Learning Plan ≥ 2 subjects) · §18 name-field constraints (12 chars, letters/spaces, live sanitize) | ✅ PASS |
| 2 | Music world is hidden from the map | §14 no-broken-promises (star-goal unlocks only shown when content exists) | ✅ PASS |
| 3 | Daily hello bonus: +10 coins once per calendar date | §14 daily hello bonus (flat, once per date, not repeated on reload) | ✅ PASS |
| 4 | Correct answer flow: praise modal, +1 star/+5 coins, 🔊 replay button | §3.4 activity loop · §3.5 feedback (correct) · §3.6 rewards · §10.2 tap-to-replay audio button | ✅ PASS |
| 5 | Gentle retry: no fail language; answer revealed after 2 mistakes | §3.5 feedback (wrong = gentle, no fail language) · §8.4 mastery (reveal after 2nd mistake) | ✅ PASS |
| 6 | Hearts hit zero with no game-over; replay never lowers stars | §17.1 test 1 (hearts cosmetic, no lockout) · §17.1 test 3 / §3.2 (replay: stars only increase, node statuses unchanged) | ✅ PASS |
| 7 | Parent gate blocks dashboard until math question answered | §3.7 parent gate · §17.1 test 2 (wrong answer keeps it blocked) | ✅ PASS |
| 8 | Save/restore round-trip after reload | §3.8 persistence · §17.1 test 5 (identical profile after relaunch) | ✅ PASS |
| 9 | Completing stage 5 shows Stage Clear; no stuck node | §17.1 test 6 (final stage routing; all nodes done, none stuck 'current') | ✅ PASS |
| 10 | Interruption resume: "Keep going!" restores exact question + mistakes | §22.1 session resume · §17.1 test 10 | ✅ PASS |
| 11 | "Start over" discards interrupted stage, profile intact | §22.1 resume choice (start-over path) | ✅ PASS |
| 12 | Parent can download a backup file | §11.2 local backup & transfer · §17.1 test 12 (export) | ✅ PASS |
| 13 | Fully playable with audio unavailable | §10.2 audio never the sole carrier · §17.1 test 9 | ✅ PASS |
| 14 | Backward clock never revokes bonus or streak | §14 clock robustness · §17.1 test 13 (date anomalies resolve in child's favor) | ✅ PASS |

## Requirements not yet covered by automation

| Requirement | Why |
|---|---|
| §17.1 test 7 (full offline session) | The prototype still loads React/Babel from CDN (Known Issue #3); testable once libraries are vendored for the PWA beta |
| §17.1 test 8 (no PII in events) | Local event log not yet implemented (Track B, §13.1) |
| §17.1 test 12 import half (restore round-trip) | Export is covered; import uses a native file picker — covered manually, automatable with `setInputFiles` in a follow-up |
| §17.1 test 13 (DST/timezone variants) | Only the clock-backward case is automated; DST/timezone shifts need Playwright's clock API in a follow-up |
| §9 adaptive difficulty, §12 multi-profile, §13 analytics | Not yet built (Track B) |
| §17.2 seeded-generator unit tests | Separate unit-test layer, planned alongside the JSON bank extraction (§15.1) |

## How to run

```bash
npm install          # once
npx playwright install chromium   # once
npm test             # runs suite against a local static server (serve.cjs, port 4173)
npm run report       # opens the HTML report with embedded screenshots
```

Note: the app currently fetches React/Babel from unpkg.com, so the suite needs internet access until vendoring lands.
