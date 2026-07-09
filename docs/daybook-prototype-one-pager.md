# PostPal Daybook: Interactive Prototype

A single-screen recovery companion for uterine fibroid embolization (UFE) patients, walked through five days of a real recovery. It answers the question these patients actually ask, hour by hour: "is this normal, or did it fail?"

**Status:** Complete and deployed. Live on Vercel (project `postpal-daybook`), runnable locally, verified end to end with per-day screenshots.

## Why it exists

UFE has a recovery shape no general recovery app fits. Patients go home the same day, feel terrible for about three days, feel mostly fine within a week, then wait months to learn if it worked. Days 0 to 3 are the crucible: post-embolization syndrome brings cramping, fever, and nausea that are expected but feel alarming. That window drives most of the "is this normal?" panic and most of the calls to the clinic.

The clinic is the customer. Fewer 72-hour phone calls and better follow-up imaging adherence are the outcomes a pilot would measure. Our committed pilot partner is Advanced Vascular Centers (Dr. Mary Costantino).

## What the prototype shows

One flow, repeated across five post-procedure days (1, 3, 5, 10, 20), so you can feel the recovery arc change under a single interface. Each day moves through three states:

1. Morning check-in: a five-face scale answering "how are you today?" in one tap. Nothing else competes for attention.
2. Noted: the check-in becomes a receipt, then offers the day's symptom chips ("cramping is intense," "still feverish," "first period, heavier").
3. Today's page: four question-led chapters. How today might feel, what you can do and not yet, your medicines today, and what's ahead.

Tapping a worrying symptom opens the interpreter: a sheet that names the fear, says whether it's expected on this day, gives the clinic's own threshold ("call if it reaches 101 degrees"), and ends by offering to call a named human, Carrie, PA-C. The bottom nav carries one shifting "Next" slot that means different things as recovery moves on: the next dose on day 1, a lifting-restriction clearing on day 10, the first cycle check-in on day 20.

The five days trace the whole story:

- Day 1: the hardest day. Hourly med schedule, cramping framed as the procedure working.
- Day 3: post-embolization syndrome peaks. Most clinic calls land here.
- Day 5: the fog lifts, meds start stepping down.
- Day 10: the schedule is behind her, fatigue lingers, most restrictions clear.
- Day 20: every restriction lifted. The first period, not the day count, becomes the real test, and the cycle scoreboard begins.

## The design bets it makes

The prototype is a test of seven principles drawn from patient forum research and AVC's discharge packet:

- Answer "is this normal?" before "what's next?" The home screen is an interpreter, not a planner.
- The med schedule is the only checklist. Everything else is guidance, not a task to complete. Restrictions are countdowns, never checkboxes.
- Benchmark against the normal range, never grade against the day, so a slow recovery never reads as failure.
- Design for the foggy 72 hours first: one thing at a time, escalation reachable in a tap.
- Believe her. Copy states the honest range of pain instead of the brochure's "some cramping."
- The cycle is the scoreboard once the acute phase ends.
- The clinic's voice, made human: every clinical claim comes from the clinic's protocol, every word sounds like a person.

## How it's built

One self-contained HTML file (`prototypes/daybook.html`, about 1,050 lines): vanilla JavaScript and CSS, Petrona and Albert Sans from Google Fonts, no framework and no build step. All day-specific copy lives in one `DAYS` data object. The UI is a small state machine re-rendered per day, with one overlay component serving every sheet (med rail, can/can't, cycle check-in, interpreter). A fixed dev control switches days.

Deployment is static: Vercel serves the `prototypes` directory with clean URLs, rewrites `/` to `/daybook`, and adds a `noindex` header. Locally it runs the same way at `http://localhost:3000`.

## What it deliberately leaves out

No backend, persistence, notifications, or auth: state resets on reload. No night theming. No standalone symptom catalog beyond each day's chips. The call button is a dead end with a pressed state. This is a concept prototype built to test the flow, not production code.

## What we're testing

Carry these four questions into review sessions:

1. Do the unlabeled hero and receipt rows read as tappable without "edit" labels?
2. Does the Next slot's shifting meaning across days (dose to milestone to cycle) read as intentional?
3. Does the check-in feel like answering a person, with a good day done in two taps and no instructions?
4. Does day 20 still feel like the same product with no meds and no restrictions?
