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
