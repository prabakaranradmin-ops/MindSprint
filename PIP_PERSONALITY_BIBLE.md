# Pip Personality Bible

Companion doc to `REQUIREMENTS.md` §6.4 and §20. Governs Pip's voice for
writers, VO direction, and localization. Every line below is either
already shipped in `app.html` or written in that established voice —
this doc describes the character the code already built, it doesn't
invent a new one.

---

## Who Pip is

Pip is a small sprout creature — a blob body with a leaf-and-sprout
sprig on its head, big black eyes, rose cheeks, stub feet. Not an
animal, not a human child, not an adult authority figure. A **plant
that's learning to grow**, same as the child playing.

That's the core metaphor and it does real work: Pip never "teaches"
from above — Pip is *alongside* the child, curious about the same
things, cheering the same wins. Pip doesn't know the answer in advance
and reveal it; Pip discovers it together with the player. This is why
Pip's mood on a wrong answer is **curious**, not disappointed, stern,
or knowing — a sprout doesn't judge, it wonders.

**Age target:** Pip talks to 5–7 year olds. Not baby talk, not
saccharine — short, warm, concrete sentences. A five-year-old is
smart; Pip respects that.

## Voice pillars (the four things Pip always is)

1. **Warm, never saccharine.** Pip is genuinely glad to see the child,
   every time — not performing enthusiasm. Exclamation points are
   earned by real moments (a correct answer, a stage clear), not
   sprinkled on every sentence.
2. **Curious, never all-knowing.** Pip explores with the child. On a
   wrong answer, Pip's energy is "let's look again," not "you missed
   it." Pip is never the omniscient narrator explaining the child's
   mistake back to them.
3. **Encouraging, never hollow.** Praise is specific to the moment
   (the shop item, the stage, the count) wherever possible, not just a
   generic cheer stacked on top of everything.
4. **A peer, never an authority.** Pip doesn't lecture, doesn't say
   "you should," doesn't frame anything as a rule Pip is enforcing.
   When a boundary exists (parent gate, locked content), Pip is on the
   child's side of it, not the one holding it shut.

## Moods and when each one shows up

Shipped moods (see `styles.css` `.pip.<mood>`): **happy** (default),
**curious**, **proud**, **thinking**.

| Mood | Visual | Trigger | Voice register |
|---|---|---|---|
| happy | default smile, relaxed eyes | idle map bob, welcome/splash, general presence | warm, easy, unhurried |
| curious | narrowed eyes, small round mouth | wrong-answer retry modal, lesson intro ("what shall we learn?") | inviting, open-ended, zero judgment |
| proud | wider smile, sparkle above head | correct-answer modal, stage clear | genuinely delighted, specific to the win |
| thinking | one eye narrowed/flat | parent dashboard's "reset a child's progress" confirmation (§11.2/§12, shipped 2026-07-21) — an unhurried, considering beat for a real decision, not a loading state | unhurried, working-it-out — never confused or worried |

**Never used, deliberately:** a "sad" or "disappointed" mood does not
exist for Pip and should never be added. There is no visual or vocal
register for Pip being let down by the child — that would break the
no-fail-state, anti-shame posture that runs through the entire product
(REQUIREMENTS §3.5, §14, §17.1 test 1).

## Vocabulary rules

- **Short sentences.** One idea per line. Pip doesn't compound clauses.
- **Concrete over abstract.** "You have enough for the sun hat!" not
  "Your balance now permits this purchase."
- **Emoji as punctuation, not decoration.** One per line, placed for
  emphasis (🎉 ⭐ 🌟 🏆 ✨ 💫 🌈 💪 🌱 🎯), never a string of several.
  This matches the existing `speak()` implementation, which strips
  emoji before passing text to TTS — emoji are a visual/print signal
  layered onto the spoken line, not part of the sentence itself.
- **Numbers said, not written oddly.** "Ten coins," not "10 coins," in
  spoken lines — matches the existing daily-bonus line's phrasing.
- **Present tense, active voice.** "You got it!" not "It has been
  gotten correctly."
- **Address the child directly, "you," never third person or the
  child's name repeated at high frequency.** The name shows up in
  identity moments (welcome-back, splash) but Pip doesn't over-use it
  the way a nagging adult would.

## Phrases Pip would say

Pulled directly from the shipped `CORRECT_MSGS` / `RETRY_MSGS` pools
and situational lines in `app.html` — this is the actual voice already
in the product, not a proposal:

**Correct answer** (`CORRECT_MSGS`, one picked at random per correct
answer so it doesn't feel scripted):
> Amazing! 🎉 · Awesome! ⭐ · Great job! 🌟 · You got it! 🏆 · Perfect! ✨ · Brilliant! 💫 · Fantastic! 🌈

**Gentle retry** (`RETRY_MSGS`, mood: curious):
> So close! 🌟 · Almost there! 💪 · Try again! · Keep going! 🌱 · Nearly! 🎯

**Welcome / returning-user:**
> "Welcome back! Want to keep going?"
> "Who is playing today?" *(profile picker)*
> "Good to see you, {name}! Here are ten coins!" *(daily bonus)*

**Shop / affordability:**
> "Welcome to Pip's Shop! Spend your coins on something fun."
> "You have enough for the {item}!" *(one-time affordability celebration — never repeated, never a nag)*
> "The {item} looks great on you!"
> "Looking good!" / "Pick something fun!" *(shop preview card, depending on whether something is worn)*

**Stage clear:**
> "Stage clear! You earned {N} star{s}!"

**Break / goodbye:**
> "Time for a break! Great playing today. See you soon!"

**Cross-subject bonus** (science stage → counting recap, §9.4):
> "Yes! Great counting!" *(correct)*
> "It was {N}. Nice try!" *(incorrect — states the fact plainly, no "wrong")*

## Phrases Pip would never say

Every one of these violates an established product rule, not just a
style preference:

- **"Wrong," "incorrect," "no," "failed," "you missed it."** Violates
  the no-fail-language rule (REQUIREMENTS §3.5). The gentle-retry copy
  above is the entire vocabulary for a miss — nothing stronger exists.
- **"You're behind," "you need to catch up," "other kids your age..."**
  No comparison to peers, ever — REQUIREMENTS explicitly excludes
  leaderboards and ranking children against each other (Appendix A) on
  the same ethical grounds.
- **"You lost your streak," "your streak is broken."** Streaks reset
  silently with zero messaging (§14) — Pip never announces a loss of
  any kind, because the product design ensures there's nothing to
  announce.
- **"Hurry up," "you're almost out of time," "the offer ends soon."**
  No urgency language anywhere in the kid experience (§14) — this
  applies to shop items exactly as much as to gameplay.
- **"Ask your parents to buy this" as a nag, repeated.** Pip may
  gesture at a locked/premium world once, gently ("Ask a grown-up"
  sticker, §14.1) — never repeatedly, never with urgency framing.
  This is a *sticker*, not a spoken line Pip repeats.
- **Anything that frames calm mode, remediation, or the easier
  question tier as lesser.** REQUIREMENTS is explicit that stage-level
  remediation (§8.4) and calm mode (§10.4) are "never framed as
  remedial" — Pip's copy in those states should read as identical in
  warmth to any other state, because from the child's side, nothing
  different is happening.
- **Brand voice / marketing language.** "Unlock premium content now,"
  "limited time," "don't miss out" — none of this is Pip's register
  even in parent-facing surfaces; the parent dashboard has its own
  plainer, adult register (see below) precisely so Pip never has to
  talk like a marketer.

## Pip vs. the parent-facing voice

Pip only speaks on **kid-facing** screens. The parent dashboard,
Settings' "For grown-ups" card, the parent gate, and privacy copy use
a different, plainer adult register — direct, informational, zero
character voice ("Progress, time limits and backups live in the parent
area," "What we store: … What we never collect: …"). Do not write Pip
dialogue for anything behind the parent gate. This split is already
consistent in the shipped copy and should stay that way — mixing the
two registers is the fastest way to make either one feel fake.

## Localization notes

- Every line in this doc is short and idiom-light by design, which
  should translate cleanly — avoid adding wordplay, rhyme, or cultural
  references to Pip's vocabulary in future lines, since that's the
  first thing localization has to work around.
- The random-pick pattern (`CORRECT_MSGS`, `RETRY_MSGS`) should be
  preserved per locale — a translator should produce an equivalent
  *pool* of 5–7 short variants, not a single fixed translation, so the
  "not scripted" quality survives translation.
- Numbers-as-words in spoken lines ("ten coins") need locale-specific
  handling for languages where that reads oddly at scale — flag for
  review if translating to a language where spelled-out numbers above
  ~20 are unusual in casual speech.
