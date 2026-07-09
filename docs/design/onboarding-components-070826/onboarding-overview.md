# PostPal Daybook Onboarding — Design Concepts

Three composition variations for the Daybook's onboarding flow. All three use the same design system, the same copy intent, and the same job list. They differ in how the content is paced and arranged, not in how it looks.

## Component purpose

The first-run experience, shown pre-procedure. Maya is prescribed PostPal at her consult and opens it a few days before her uterine fibroid embolization. Onboarding orients her; it does not add anything to do. Its jobs, before the hard days arrive:

1. Establish trust: this is from her clinic, made for her and this procedure.
2. Confirm the clinic-loaded essentials: procedure, date, clinic.
3. Prime honest expectations for days 1 to 3.
4. Teach the one interaction that matters: the daily check-in and "is this normal?".

Then it hands off to the Daybook, which she'll open the morning after her procedure (day 1).

Deliberately out of scope (these are product, not setup): no support-person pairing, no "who's staying with you / driving you home" step, and no "Call Carrie" button or escalation teaching. Carrie appears only as the voice — she set it up, she signs the note, she writes the margin lines — never as an action to trigger during onboarding.

## Design system context

- Project: PostPal Daybook prototype (`prototypes/daybook.html`)
- Token source: the `:root` block and component styles in `daybook.html`, lifted verbatim
- Key tokens: `--paper`, `--card`, `--ink`, `--mut`, `--clay` / `--clay-deep` / `--clay-fill` / `--clay-soft`, `--pine` / `--pine-soft`, `--line`, `--alert`
- Type: Petrona (serif) for statements, body, and Carrie's voice; Albert Sans for eyebrows, labels, buttons
- Patterns referenced: the check-in "calm budget," `.eyebrow`, `.bigtext` hero, `.factline`, `.marginnote`, the `.btn` set, the "What's ahead" chapter, and the 1·3·5·10·20 day spine
- Contrast rules honored: white text only on `--clay-fill` (4.75:1) or `--pine` (7.6:1); small clay text uses `--clay-deep` (6.5:1)

## Concept 1: One question at a time — Sequential + Space-Forward

Composition: five full-screen steps, one idea and one primary action each, progress dots at the foot.

Approach: the check-in's calm budget applied to setup. Welcome, confirm, honest expectations, how it works, hand-off. Each screen is a single Petrona statement with room around it.

Strengths: lowest cognitive load; drops straight into the existing state machine as one more phase; reuses every primitive unchanged. The safest, most on-brand read.

Tradeoffs: five taps to finish, and the honest-expectations beat gets one screen rather than space to breathe.

Tokens highlighted: `--clay` hero italics and active progress dot, `--clay-fill` primary button, `--pine` hand-off, `--card` confirm card.

## Concept 2: A note from Carrie — Editorial + Typography-Forward

Composition: one continuous, scrollable letter from her PA. The single setup step (confirm) happens inside the reading — she never leaves the page.

Approach: takes the margin-note voice that already runs through the Daybook and makes it the whole first contact. Salutation, "here's what I've got for you" (confirm), "the part the brochure skips" (honest expectations), "how this works," "what you don't have to do," sign-off.

Strengths: the strongest trust and warmth; setup never feels like a form; unmistakably not a generic health-app signup.

Tradeoffs: more reading up front than the calm budget usually allows (defensible pre-procedure, when she has capacity the day-1 fog would steal); the inline confirm control is a new interaction. Wants a "skim" affordance for returning or lower-literacy users.

Tokens highlighted: Petrona type scale (31px salutation down to italic section leads), `--pine` section headings and the seal, `--clay` for the beats that land hardest, `--line` hairlines as page turns.

## Concept 3: See the shape of it — Featured + Progressive

Composition: three screens built on a spine — a preview of the five-day recovery arc — then confirm and hand-off.

Approach: set expectations by showing the journey. The arc marks day 1 as the hard peak and day 20 as the first cycle, doing the "believe her" and "benchmark against the range" work visually. The final screen collapses the arc into the real day-1 check-in.

Strengths: best expectation-setting; orients her to the whole shape; fewest screens.

Tradeoffs: denser than the calm budget prefers, and showing an anxious patient the scary peak before she's ready is a real risk the copy has to manage. Introduces two new primitives (the featured card and the arc rail).

Tokens highlighted: `--clay-soft` / `--clay-deep` for the hard peak, `--pine-soft` / `--pine` for the cycle marker, `--line` spine, the exact face SVGs reused in the day-1 preview.

## Recommendation

Ship Concept 1 as the spine, and graft in the best of the other two.

Concept 1 is the right default. It matches the product's central rule — one ask per screen — so onboarding feels like the same app she's about to live in, and it slots into the state machine as a single `onboard` phase with almost no new CSS. That keeps the build cheap and the experience coherent.

Two grafts make it stronger:

- Take Concept 2's letter voice for the honest-expectations screen. That beat carries the most emotional weight, and Carrie's first-person voice is where "believe her" lands hardest.
- Offer Concept 3's arc preview as an optional "see what's coming" screen, reachable from the welcome, not forced. It's the best expectation-setter for the patients who want the whole map, without imposing the scary peak on those who don't.

Concept 2 as a whole is the most distinctive and the most on-message, and it's worth prototyping in full if we later decide onboarding should lead with tone over speed. Concept 3's arc is a strong asset regardless of which shell wins.

## Next steps

- [ ] Gather feedback on the three directions
- [ ] Confirm the recommended path (Concept 1 + letter-voice honest screen + optional arc)
- [ ] Refine the chosen concept: real reduced-motion `settle` transitions between steps, the "Something's off" edge state, and the returning-user case
- [ ] Build an in-situ preview showing onboarding → day-1 hand-off
- [ ] Wire into `prototypes/daybook.html` as an `onboard` phase preceding `checkin`
