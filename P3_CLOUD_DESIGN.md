# Puddlejump — P3 Cloud Layer Design

**Status:** Planning document, no code. Every item here is [Future·P3] in
`REQUIREMENTS.md` §11.3/§12/§13/§13.4 — conditional on adding cloud
accounts/sync, which does not exist in the current build.

**Why a separate doc:** the current app is genuinely local-only — no
accounts, no network calls, no server. Writing P3 as inline TODO comments
or stub functions in `app.html` would misrepresent the app as having
infrastructure it doesn't have, and a stub "email" button with no backend
is worse than no button (it implies a working feature that silently does
nothing). This doc is the spec a backend/infra team would build from —
API shapes, consent flows, retention rules — with explicit stop conditions
so it's obvious what triggers each piece of work.

**Do not build any of this until:** a backend exists, and legal counsel
has signed off on the consent flow for every jurisdiction the product
ships in. §1 below is the gating item — nothing else in this doc is safe
to build before it.

---

## 1. Verifiable Parental Consent (gates everything else)

Per REQUIREMENTS §11.3. Three regimes apply depending on distribution
region, and the strictest one governs:

| Regime | Trigger | Verification bar |
|---|---|---|
| COPPA (US) | any user reasonably believed to be under 13 | "verifiable parental consent" — email-plus, signed form, credit card with nominal charge, or knowledge-based auth |
| GDPR-K (EU) | any user under 16 (member states may lower to 13) | consent from holder of parental responsibility; must be able to verify, not just collect a checkbox |
| DPDP Act 2023 (India) | **any user under 18** — wider than COPPA/GDPR-K | verifiable consent from parent/guardian; "Data Fiduciary" (Bloom) bears the verification burden |

**Design implication:** since DPDP's under-18 bar is the widest, the
consent flow must treat every account as needing parental consent unless
the *parent themself* is the one creating the account (i.e., there is no
"teen self-registers" path in this product — the parent is always the
account holder, the child never has independent credentials). This
sidesteps the age-verification-of-the-child problem entirely: consent
is collected once, from the adult who is present at the parent gate.

### 1.1 Consent flow (proposed)

1. Parent reaches the gate (existing §3.7 math-question gate — unchanged,
   this is a *different* screen, one level deeper, reached only when a
   cloud feature is first invoked).
2. **Verification method: email-plus.** Parent enters an email address;
   Bloom sends a confirmation link. Consent is not considered granted
   until the link is clicked from that email address. (Card-based
   verification is available as a fallback for regions/parents without
   reliable email, but email-plus is the default — it's free, doesn't
   require Bloom to touch payment data, and is FTC-accepted for COPPA.)
3. The consent screen itself must, in plain language a non-lawyer parent
   can act on in under a minute:
   - Name exactly what will now leave the device (which of §13.1's
     locally-logged events, pseudonymized — see §2 below).
   - State the retention period.
   - Link the full privacy policy (not embed it — the screen must stay
     short).
   - Offer "Not now" as equally prominent as "Allow" — no dark patterns,
     no pre-checked boxes (this is a hard requirement under GDPR-K and
     good practice regardless).
4. Consent record stored server-side: `{ profileId, parentEmail (hashed),
   consentedAt, regime, ipCountry (for regime determination only, not
   retained beyond that), scopes: ['analytics'] }`. The **child's**
   profile data itself still never includes the parent's email — that
   lives in a separate `consents` table keyed by profile UUID, not
   joined into gameplay data.
5. **Withdrawal:** a "Turn off cloud features" toggle in the parent
   dashboard reverses this instantly — new events stop being sent, and
   a deletion request (§1.2) is offered but not forced (the parent may
   want the account to keep existing while just muting new collection).

### 1.2 Data deletion & export (cloud-side)

- **Export:** parent-initiated, returns all cloud-held data for a
  profile in a portable format (JSON) — this is the cloud equivalent of
  the existing local "Download Backup" (§11.2), not a replacement for it.
  Both should coexist; local backup remains the primary mechanism even
  after cloud sync exists, since it works offline and requires no trust
  in Bloom's servers.
- **Deletion:** irreversible, server-side, completes within 30 days of
  request (a defensible SLA under most regimes' "undue delay" language).
  Deletion must cascade: consent record, event history, and any
  server-cached profile data. The local device save is untouched by a
  cloud deletion request — they are independent stores by design.
- **School deployments** (mentioned in §11.3) need a *separate* consent
  path: the school's data-processing agreement substitutes for
  individual parent consent under "school official" exceptions in COPPA
  and equivalent provisions elsewhere. This is a distinct legal basis,
  not a variant of the parent flow — do not try to reuse the parent
  consent UI for it. Flag to legal counsel specifically; school consent
  law varies more by jurisdiction than parent consent does.

---

## 2. Remote Analytics (§13.2)

**Trigger:** only ships once §1's consent flow exists and a parent has
opted in for a given profile. No event described here is ever sent for
a profile without active consent.

### 2.1 What travels vs. what stays local

The local event log (§13.1, already shipped) is the source. Remote
analytics is a **filtered, aggregated subset** of it — not a mirror.

| Local event (§13.1) | Sent remotely? | Transform |
|---|---|---|
| `stage_complete` | Yes | subject, stageIndex, stars, durationSec — no profile name |
| `question_answered` | Yes, aggregated | rolled up to daily per-skill accuracy, not per-question |
| `stage_quit` | Yes | subject, stageIndex only |
| `settings_changed` | No | parent-device preference, no product-analytics value that justifies transmission |
| `coin_gift`, `shop_purchase` | No | economy data has no external analytics use and is more sensitive to leak (spending pattern) |
| `parent_feedback` | Yes, opt-in separately | this is direct qualitative input; treat as its own consent scope, not bundled with gameplay telemetry |
| `onboarding_step` | Yes | funnel data, no PII risk |

**Identifiers:** pseudonymous profile UUID only (already exists locally,
§7). Explicitly forbidden: device advertising IDs (IDFA/GAID), any
cross-app identifier, fingerprinting via canvas/font/etc. The UUID must
not be derivable from or joinable to the parent's email outside the
consent table described in §1.1 — event-analytics infrastructure and
the consent/PII store should be separate systems with separate access
control, so a breach of one doesn't expose the other.

### 2.2 Retention & aggregation

- Raw remote events: 90 days (matches the existing local retention rule
  in §13.1 — no reason for the cloud copy to outlive the device copy).
- Aggregates (daily rollups: sessions, per-skill accuracy trend,
  completion funnel): retained indefinitely *at the aggregate level only*
  — once individual events age out at 90 days, only the rolled-up
  numbers remain, and those numbers should not be reversible to
  per-child behavior (k-anonymity threshold: don't publish/query an
  aggregate bucket with fewer than some minimum N profiles, TBD by
  actual user volume once this ships).
- **Dashboard access:** internal product dashboards read only
  aggregates, same rule as the existing local parent dashboard (§13.1).
  No internal tool should offer a "look up single child's raw event
  stream" view — if a support case needs that, it should go through the
  same export mechanism (§1.2) a parent would use, audited and logged.

---

## 3. A/B Experimentation Guardrails (§13.3)

**Trigger:** only relevant once there's a server capable of assigning
experiment arms — i.e., after §2 ships, since experimentation without
remote analytics can't measure anything.

### 3.1 Hard rules (non-negotiable, cannot be experiment variables)

- No experiment may create a **difficulty spike** — an arm cannot use a
  harder question-generation config than another arm for the same
  claimed skill/tier. This directly protects the §9.2 adaptive-difficulty
  contract; experimentation must never be a backdoor around it.
- No experiment may **gate previously available content** — pacing/
  unlock experiments may only ever make something available *sooner*
  in one arm vs. another, never later or conditionally removed. This
  protects the §14 "no broken promises" rule at the experiment level.
- No experiment may alter the **no-fail-state rules** (§3.5, §17.1 test
  1: hearts can reach zero with no game-over). An arm that introduces
  any kind of lockout, timer-based cutoff, or punitive state is
  automatically out of scope regardless of what it's testing.
- Every arm must produce a **complete, coherent experience** — no arm
  may be a deliberately degraded control used only to make another arm
  look better by comparison (e.g., no "control group gets a worse UI on
  purpose"). If two arms differ, both must be genuinely reasonable
  designs a product owner would be comfortable shipping to 100% of
  users.

### 3.2 What's actually testable within those rules

Presentation and pacing only: copy variants for encouragement messages,
visual treatment of the reward modal, order of subjects on first
onboarding, timing of the daily-bonus prompt, shop item ordering. All of
these can vary without touching difficulty, content availability, or
fail-state.

### 3.3 Review process

Any new experiment proposal should be checked against §3.1 by someone
who did *not* design the experiment, before it ships to any real users
— a simple two-person sign-off, logged (who reviewed, when, what was
checked), not a full committee process. The goal is a second set of eyes
specifically looking for rule violations, not slowing product velocity.

---

## 4. Teacher / Classroom Mode (§13.4)

**Trigger:** distinct product surface, likely later than individual
parent-cloud features — has its own go/no-go decision, not automatically
next after §1–3.

### 4.1 Consent basis

Schools consent *in loco parentis* under COPPA's "school official"
exception (and equivalent provisions elsewhere — verify per-region, this
is one of the more jurisdiction-variable areas per §1.2's note). This
requires:

- A signed **data processing agreement (DPA)** between Bloom and the
  school/district — a legal artifact, not a UI flow. No classroom-mode
  feature should ship to a school without a DPA on file.
- The DPA must state Bloom acts as the school's service provider for
  this specific educational purpose — data collected under it cannot be
  repurposed for Bloom's general product analytics (§2) without
  separate consent.

### 4.2 What classroom mode actually shows

Aggregate-only, multi-child reports for a teacher's roster:

- Class-level stars/completion/streak distribution (no ranking or
  comparison framing between individual children — the same anti-stress
  posture as the rest of the product applies to how teachers see data
  too).
- Per-skill class accuracy, to help a teacher spot a concept the whole
  class is struggling with (this is the actual pedagogical value of the
  feature — individual per-child data isn't the point, class-level
  patterns are).
- **Export only, no live dashboard requirement for v1** — a
  teacher-facing web dashboard is a bigger, separate build; a scheduled
  or on-demand CSV/PDF export covers the core need with far less
  infrastructure.
- No child data leaves the device/cloud boundary without the DPA in
  place — same export mechanism and audit logging as §1.2's parent
  export, reused rather than building a second pipeline.

---

## 5. Weekly Summary Email (§14, listed under parent dashboard depth)

**Trigger:** requires a parent account (§1) and a transactional email
provider — smallest of the P3 items, but still fully gated on consent.

### 5.1 Scope

- Opt-in, separate toggle from the base consent grant in §1.1 (a parent
  might consent to analytics but not want email, or vice versa — don't
  bundle them).
- Content: a plain-language weekly recap using the *same* data already
  computed for the local print report (§17.4, shipped) — playtime,
  stars, per-skill accuracy trend, suggested focus. No new data model
  needed; this is a delivery-channel problem, not a data problem.
- **Never sent for a profile without active email-opt-in.** Turning off
  cloud features (§1.1 withdrawal) must immediately stop future emails,
  same day if feasible — email sends should check consent status at
  send time, not rely on a stale subscription list.
- No engagement/re-nudge framing ("come back!", streak-loss guilt) —
  this must follow the same anti-stress, no-shame rules as every other
  parent-facing surface in the product (§14's "no push notifications to
  the child" policy extends in spirit here: the *parent* summary is
  informational, not a growth-hacking lever).

---

## Build order (if/when this gets greenlit)

1. §1 consent flow + legal sign-off — nothing else can start before this.
2. §2 remote analytics (smallest surface once consent exists; validates
   the pseudonymization/retention pipeline that everything else reuses).
3. §5 weekly email (reuses §2's data, small incremental build).
4. §3 experimentation guardrails + tooling (only valuable once there's
   analytics volume to experiment against).
5. §4 teacher/classroom mode (distinct legal basis, distinct go/no-go,
   can proceed independently of 2–4 once its own DPA process is ready).
