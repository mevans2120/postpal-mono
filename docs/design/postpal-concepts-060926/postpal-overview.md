# PostPal Design Concepts

**Date:** 2026-06-09 · **Revised:** 2026-06-10 (v2)
**Status:** Two simplified concepts after review. Inputs: `../postpal-research-060926/` (findings, personas, principles) and the strategy doc.
**Constraint honored:** neither surviving concept leads with a task list.

## Revision log (2026-06-10)

Michael's review: all three v1 concepts felt too busy; Concept 3 struck. Concepts 1 and 2 were regenerated against a calm budget (above the fold: one card max, two actions max, ~60 words max):

- **Concept 1 v2:** home is question-only (greeting + "Is something worrying you?" + 3 chips); the greeting takes the better/same/worse check-in inline then disappears; free-text field cut; answers open as sheets; the dark help bar replaced by a two-slot bottom bar (next dose · Worried?).
- **Concept 2 v2:** the band is now the input ("tap where today feels" replaces the separate pain scale); one entry + one PA margin note per page with the rest behind "turn the page"; masthead/section-label chrome and the tomorrow teaser deleted; restrictions reduced to one italic line; same two-slot footer as Concept 1.
- **Concept 3 (struck):** file kept for reference. Salvaged into both survivors' med sheet: the quiet-hours line, PRN guardrail math (Tylenol ceiling), and support-person pairing. Both concepts now share one acute-phase med engine behind the "next dose" slot.

## Design challenge

A clinic-prescribed recovery companion for UAE/UFE patients whose core unmet need is interpretation ("is this normal, or did it fail?"), not task management. The product must work for Maya (researched, benchmarking) and Renee (blindsided, in real pain, validation-seeking) simultaneously, while making Dana's call line quieter. Each concept is one answer to: what earns the home screen when the checklist doesn't?

## Design intent

- **Emotional targets:** reassured, believed, steady
- **Non-digital reference:** a good nurse's house call — asks first, answers the scary question plainly, leaves you calmer
- **Anti-references:** a hospital portal (MyChart), a cutesy period app, a productivity app
- **Design hero:** Tia/Maven — grown-up women's health; literary serif + working grotesque, earthy palette, winding-line motif (verified via Tia's actual identity system by Athletics)

## Key research insights driving the concepts

1. Patients compare, they don't complete: zero checklist demand in ~150 forum posts; the med grid is the one exception.
2. Every "is this normal?" carries "...or does it mean it failed?" underneath — answer the fear, then the threshold.
3. Benchmark against the range, never grade against the day: fixed-day milestones alarm slow recoverers.
4. The stakes peak at 2 AM on opioids, when the clinic line is closed.
5. The cycle is the scoreboard from week 2 to the MRI.
6. The support person administers the first 72 hours; care-tracker never designed for her.

A shared motif appears in all three: **the band and the curve** — a wide shaded "normal band" with the patient's own line inside it. It's the visual argument for never grading recovery.

## Concept 1: The Nurse Line — Conversational + Organic

**Type/color:** Petrona + Albert Sans; warm clay on cream, pine accents.
**Leads with:** the question. Home screen asks "Is something worrying you?" with day-ranked symptom chips; answers resolve the fear, state AVC's actual threshold, and offer a named human ("Call Carrie, PA-C").
**Strengths:** most direct expression of the #1 job; warmest register; symptom chips productize the forum's "is this normal?" catalog; easiest concept for the clinic to trust (every answer is their protocol).
**Tradeoffs:** meds demoted to one ribbon row may be too quiet for days 0–2 dose density; conversational UI risks feeling chatbot-ish if the writing slips; needs excellent content ops.

## Concept 2: The Recovery Journal — Editorial / Story-Driven

**Type/color:** Newsreader + Hanken Grotesk; ink on paper, oxblood accent.
**Leads with:** today's page. "Day 5 of about fourteen," a standfirst sentence, the normal band with her curve, what's-normal-today entries with PA margin notes, pre-emptive pages that publish answers the day before the predictable panic (expulsion, first period).
**Strengths:** clinic-authored version of the forums' most-thanked artifact (the day-by-day account); strongest expression of "believed" (margin notes, honest ranges); "place yourself" entries compile into the advocacy record and the PA's pre-visit report; most distinctive visual identity of the three.
**Tradeoffs:** weakest med support (a single doses line) — riskiest for the acute phase; reading-forward structure asks more of a foggy day-1 patient; daily editorial content per day number is a real authoring cost.

## Concept 3: The Night Stand — Swiss Functional, Night-First (the task-led one)

**Type/color:** Schibsted Grotesk + Spline Sans Mono; evergreen night surfaces, candle amber; light "day mode" variant.
**Leads with:** the next dose. A 2 AM-first instrument: countdown arc as hero, tonight's dose rail, PRN guardrails doing the Tylenol math, quiet-hours card ("nothing else is asked of you until 3:00"), paired support-person logging, check-vs-call escalation split. The instrument retires itself when the med grid ends and becomes the cycle scoreboard.
**Strengths:** nails the one true executive job at its hardest moment; support person as first-class operator; clearest safety story; self-retiring task UI dodges the productivity-app trap.
**Tradeoffs:** interpretation ("is this normal?") is one tap away instead of front-and-center — the core emotional job is secondary; dark instrument register is the furthest from Tia warmth; weakest fit for the months-long tail (mitigated by the day-mode handoff).

## Convergence (2026-06-10, v3): The Daybook

Michael's direction after v2 review: don't presume worry (reframe as assessment), keep Concept 2's wire with Concept 1's design pattern, and converge them. Result: `postpal-concept-converged-daybook.html` — three passes sharing the Journal's day-page wire (heading, standfirst, tappable band, one entry + margin note) rendered in the Nurse Line's skin (Petrona/Albert Sans, clay on cream, chips, sheets, pill footer). "Is something worrying you?" became "Anything to note today?" with "Nothing new" as a first-class positive answer; the footer slot became "Check a symptom."

- **Pass A · Page first** — Journal reading order; assessment sits mid-page. Calmest; check-in is skippable by scroll.
- **Pass B · Check-in first** — 15-second two-step morning ritual (band + note) gates the page once daily, then disappears. Best data completeness; "Skip for now" must stay honored.
- **Pass C · Curve first** — band as hero with day heading inside; "you are here, trending easier" reassurance in two seconds. Best for glances; weakest editorial voice.

Constant across passes: calm budget, two-slot footer, shared med sheet (quiet hours, PRN guardrails, support pairing), interpreter sheet on any symptom chip.

## Coalesced direction (2026-06-10, v4): The Daybook, final shape

Michael's screenshot markup on the three passes chose Pass A's wire and made four changes, captured in `postpal-concept-daybook-coalesced.html` (two states: before/after input):

1. "Day 5 of about fourteen" heading removed; the standfirst copy now wears Pass B's big Petrona headline treatment under a small DAY 5 eyebrow.
2. The tappable band is replaced by a five-face scale (smiley → frowny, "a good day / a hard day"); the band motif retires from the home screen (candidate for a trends/PA-report view).
3. "Anything to note today?" appears only after she taps a face (progressive disclosure; good day = two taps total).
4. The page below the check-in can run long — multiple entries scroll, calm budget holds above the fold.

Second pass on the coalesced screen (same day, from Michael's second screenshot review): state 1 reduced to check-in only (hero + faces + footer; journal entries now reveal after the face tap along with the note chips), faces enlarged with generous padding around both the scale and the hero text, and the fifth face softened from angry to frowning. Bottom nav flagged by Michael as needing change later — deliberately untouched, parked for the prototype pass.

Third pass (v3, same day): the check-in became an explicit stepped flow shown as four states — (1) check-in with bigger faces and tightened hero-to-faces spacing, (2) new in-between state: face tapped, note chips revealed, "Open today's page" submit visible but dormant, (3) any chip selection activates submit (good day = three taps), (4) today's page as its own destination screen with the check-in echoed at the top ("a better day · nothing new ✓"). Replaces the inline-reveal model. Symptom chips route through the interpreter sheet before the page.

Fourth pass (v4, same day): completed steps now collapse to receipt lines (Michael chose Option A over accordion steps and morph-and-vanish) — the answered face row becomes one journal-voice line ("Today feels: *a little better* · edit") with the chosen face at small size, keeping answers visible and revisable while the active step takes the stage. The receipts resolve into state 4's echo line as the final receipt.

Fifth pass (v5, same day): the receipts made the gate redundant, so the flow is one continuous page again — three states: check-in → face answered (hero truncates to its first clause at full 24.5px, never shrinks; face receipt + chips, no submit) → the whole page (chip tap completes the check-in; two stacked receipts, then today's entries flow in below; the separate destination screen and "Open today's page" button removed). Good day = two taps. Symptom chips still open the interpreter sheet before the page content.

Sixth pass (v6, same day): receipts promoted to hero scale — the truncated hero and both receipts are now one unified pattern (24.5px Petrona rows on hairline rules; face glyph 30px). Edit links removed: at this scale every row reads as tappable (tap hero to re-expand, tap a receipt to change the answer). Flagged for prototype testing: confirm tappability reads without the label.

Bottom nav exploration (2026-06-10): `postpal-bottom-nav-options.html` compares two executions of the agreed jobs (what's next + what to look for). Option 3: a generalized "Next" slot that survives all phases (dose → milestone → cycle check-in → MRI, with color shifting clay→pine→ink by register) beside a quiet outlined "Feeling something?". Option 4: a conventional four-tab bar (Today / Medicines / Check / More) with dose badges — discoverable but static; the Medicines tab goes dead after week 2 (shown). Decision deferred to prototype testing; a hybrid (pair during acute, status line after week 2) is noted. The file also mocks the expanded Next state: a day rail (this-morning / next / later-today / PRN groups; done doses dim like receipts; one Log button; Tylenol meter, quiet line, support pairing) rather than an hourly grid — and crops showing that Next opens a different sheet per phase (can/can't at day 9, cycle check-in at week 7, MRI page at month 3).

Seventh pass (v7, same day): today's page organized into question-led chapters (Michael chose Option A over time-horizon bands and a reading+glance split): *How today might feel* (entries + margin notes), *What you can do — and not yet* (cleared items lead, then countdowns — restrictions read as a shrinking list; absorbs the old "still resting" footer line), *Your medicines today* (one fact line, opens med sheet), *What's ahead* (tomorrow's page teaser + day-14 telehealth). Practical chapters hold to 1–2 small-caps fact lines and link into sheets.

## Recommendation (v2 — superseded by convergence above)

The two survivors now differ on exactly one question: should the home screen lead with *her worry* (Nurse Line: "Is something worrying you?") or with *her place on the curve* (Journal: the day-page and tappable band)? Everything else — the med sheet with the salvaged Night Stand engine, the two-slot footer, the escalation flow — is shared. That makes the next decision cheap to test: show both home screens to Dr. Costantino, Carrie, and 2–3 patients and watch which one a day-3 patient reaches for. My lean is the Journal for daily-driver structure with the Nurse Line's chip-to-sheet interpreter as its "Worried?" flow — but that's exactly the synthesis the test should confirm or kill.

## Next steps

- [ ] Review the v2 concepts with Michael; confirm or adjust the lean
- [ ] Walk Dr. Costantino / Carrie through the threshold sheets and margin notes (pairs naturally with the clinic discussion guide)
- [ ] On direction approval: interactive prototype of the chosen home screen + symptom-check flow + med sheet (design-concepts refinement mode, 1 concept)
- [ ] Then tech planning (strategy doc step 3) inherits the chosen concept's component demands

## Files

- `postpal-mood-board.html` — intent, palettes, type, imagery direction, references, rationale
- `postpal-concept-1-nurse-line.html` — Day 3 screen + cycle check-in + annotations
- `postpal-concept-2-recovery-journal.html` — Day 5 page + cycle pages + annotations
- `postpal-concept-3-night-stand.html` — 2:14 AM Day 1 screen + day-mode/cycle mini + annotations

Imagery note: no free stock photography suits "recovering woman, dignified, non-stock," so all concepts use illustration and typography only; commission photography later if marketing needs it.
