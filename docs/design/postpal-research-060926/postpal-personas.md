# PostPal Personas

**Date:** 2026-06-09
**Basis:** Forum evidence (~150 posts/comments from r/Fibroids, patient.info, Mumsnet), clinical literature, AVC discharge materials, and care-tracker's prior "Jamie" persona (which these supersede; Jamie was built from secondary sources only). Quotes are verbatim from public forums, cited in `postpal-research-findings.md`.

These are evidence-based composites, not interviewed individuals. Confidence notes at the end.

---

## Maya, 42 — The Researched Decision-Maker (primary patient persona)

> "I have a doctor lined up, but am nervous due to the lack of info I find online."

**Context:** Marketing operations manager, two kids, anemic from years of heavy bleeding. Chose UFE after months of research specifically to keep her uterus and avoid a hysterectomy her gynecologist kept steering her toward. Has read every r/Fibroids recovery thread; her fear is calibrated by the worst stories. Tracks her periods in Clue. Booked two weeks off work but privately hopes to be back in one.

**Tech comfort:** High. Phone-first, app-fluent, skeptical of anything that feels like a brochure.

**Primary jobs:**
1. Walk in prepared: supplies stocked, prescriptions filled, support person briefed, pain expectations honest.
2. Place herself on the recovery curve daily ("I'm day 5: is this fatigue normal?").
3. Execute the med grid precisely during the foggy days.
4. Find out if it worked, period by period, until the 3-month MRI.

**Pain points:**
- Official information is thin and sanitized; the real picture lives in forums mixed with horror stories.
- Can't tell procedure effects from anemia effects ("still very tired and pale... think it's the anemia").
- The discharge packet goes silent after week 2; her anxiety doesn't.

**Success looks like:** "I knew what each day would feel like before it happened, and when something weird showed up, I got an answer in 30 seconds instead of three hours on Reddit."

**Design implications:** Range-based expectations, never single-point promises. Clinic-authored content with peer-account honesty. Cycle check-ins that respect that she already uses a period tracker.

---

## Renee, 47 — The Blindsided Recoverer (stress-case patient persona)

> "I've had 3 children all natural births with no pain meds... For the first 6 hours I laid in the hospital bed and screamed and cried."

**Context:** School administrator. Did less pre-reading than Maya; trusted the "back to normal in a week" framing. Her post-embolization syndrome ran hot: severe cramping through day 5, nausea from the opioids, a fever spike that sent her to Google at 2 AM. Her sister stayed the first three nights. At day 10 she was still in real pain and started wondering if something had failed. As a Black woman she has had pain dismissed before and is alert to it happening again.

**Tech comfort:** Moderate. Uses what's needed; will not explore an app's features while in pain.

**Primary jobs:**
1. Get validation that this pain is real and within the (wide) normal band, or clear instruction to escalate.
2. Survive the med schedule while cognitively foggy; her sister needs to see it too.
3. Know exactly when to call, whom to call, and what to say.
4. Rebuild trust that the procedure worked despite the brutal start.

**Pain points:**
- "They definitely don't tell you it could feel this bad." Feels misled, which corrodes trust in everything else the clinic says.
- Generic timelines alarm her: anything implying she should be better by now reads as "something is wrong with me."
- 2 AM is when the fear peaks, and the clinic line is closed.

**Success looks like:** "The app told me day-3 fever was expected, showed me other recoveries that ran long like mine, and when my pain didn't taper, it told me to call and what to report."

**Design implications:** Trajectory framing (improving vs worsening) over fixed-day milestones. Two-tier escalation always one tap away, with after-hours clarity. A support-person view is not optional; Renee's sister administered her meds. Tone: believe her.

---

## Dana, PA-C — The Call-Line Owner (clinic persona, B2B2C user-buyer)

> Modeled on the physician-assistant role at an independent IR practice; AVC's discharge packet routes follow-up through its PA.

**Context:** Physician assistant at a 2-physician interventional radiology practice doing ~8-12 UFEs a month plus PAE, venous work, and ports. Owns the post-procedure phone line, the 24-48h check-in call, and the 2-week telehealth visits. The same dozen questions consume her week: fever, discharge, pain meds, "something came out." Office-based lab economics: no health-system IT department, no six-figure platform budget.

**Tech comfort:** High for clinical tools, allergic to anything requiring an integration project.

**Primary jobs:**
1. Deflect the predictable 80% of calls (expected-symptom reassurance) so the urgent 20% get through faster.
2. Get patients to actually show up for the 3-month imaging.
3. Keep discharge content current in one place instead of re-printing PDFs.
4. Show her physicians the practice looks as modern as its marketing.

**Pain points:**
- The packet answers Friday-afternoon questions; patients call Saturday at 9 PM.
- No visibility into who's struggling until they call or no-show.
- Every vendor pitch assumes Epic and an IT team.

**Success looks like:** "Patients arrive at the 2-week telehealth already knowing their trajectory, my call volume drops on the questions the app answers, and I can see which patients flagged worrying symptoms before they escalate."

**Design implications:** Zero-integration onboarding (works from the existing discharge PDF). A triage-visibility dashboard, not an EHR. Pricing an OBL can say yes to without procurement.

---

## Not a persona, but designed for: the support person

Days 0-3 require a responsible adult by protocol, and in practice that person administers meds, watches the puncture site, and makes the 2 AM call-or-don't-call decision. Care-tracker's research flagged a caregiver view as "implied but never designed." PostPal should design the shared/support view alongside the patient view from the first concept, scoped to the acute phase rather than as a permanent second account.

---

## Confidence notes

Maya and Renee triangulate well-supported forum themes (research and benchmarking behavior; pain-expectation mismatch and validation seeking; the equity thread is thinner but consistent). Dana is the weakest persona: built from the AVC packet's structure, clinic websites, and competitive research, with zero primary clinic input. The discussion guide exists largely to correct Dana: validate call composition, volumes, follow-up adherence, and willingness to pay with Dr. Costantino's practice before concept work hardens.
