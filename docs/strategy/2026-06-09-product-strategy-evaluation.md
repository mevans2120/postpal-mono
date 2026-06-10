# PostPal: Product Strategy Evaluation

**Date:** 2026-06-09
**Status:** Starting point for design research and conceptual design
**Scope:** New product concept. UAE/UFE is the flagship procedure; short outpatient interventional radiology (IR) procedures are the addressable market. Distribution assumption: clinic-prescribed (B2B2C).
**Sources:** care-tracker-monorepo codebase and docs; Advanced Vascular Centers UAE/UFE procedure page.

---

## The thesis

PostPal is a recovery companion built for procedures where the recovery is short, sharp, and scary in a specific way. Uterine artery embolization patients go home the same day, feel terrible for three days, feel mostly fine in a week, and then wait months to learn whether it worked. No general-purpose recovery app fits that shape. Care-tracker comes close on plumbing but was designed around a generic "any post-op recovery" model, and its design language reflects that.

The strategic bet: a product designed around one well-understood recovery arc, prescribed by the clinic that performs the procedure, will beat a generic recovery tracker on the two things that matter to both sides. For patients, that's reassurance. For clinics, that's fewer phone calls and patients who show up to follow-up imaging.

## The patient and the procedure

UAE/UFE treats symptomatic uterine fibroids without surgery. The typical patient is a woman in her 30s to 50s who chose this procedure specifically to avoid a hysterectomy or myomectomy. She's an active decision-maker, often after months of research, and frequently wants to preserve her uterus or fertility. This is not a passive patient handed a pamphlet after an emergency.

The procedure itself is minimally invasive: catheter through the groin or wrist, embolic particles cut blood flow to the fibroids, local anesthesia with light sedation, discharge same day or next morning.

The recovery has a distinctive shape, and that shape is the whole product:

1. **Decision and prep (weeks before).** Imaging, consults, medication adjustments, logistics. Anticipation and anxiety.
2. **Days 0 to 3: the crucible.** Post-embolization syndrome hits most patients: significant cramping, pelvic pain, fatigue, nausea, sometimes low-grade fever. This is expected, but it feels alarming. Pain medication schedules matter hour by hour. This window generates most of the "is this normal?" panic and most of the calls to the clinic.
3. **Days 4 to 10: rapid taper.** Symptoms fade fast. Most women return to normal activity within a week. The app's job shifts from triage to restriction tracking and confidence-building.
4. **Months 1 to 6: the long wait.** Fibroids shrink slowly. Success is measured in lighter periods and reduced pressure, cycle by cycle, plus follow-up imaging. Engagement is sparse but high-stakes: a missed follow-up MRI is bad for the patient and lost revenue for the clinic.

One detail worth flagging for design research: the real outcome clock for this patient isn't post-op days, it's menstrual cycles. "Was this period lighter than the last one?" is the question she's actually asking. No daily-task model captures that.

## Why the generic model breaks

Care-tracker's architecture assumes a recovery that looks like an 8-week ortho rehab: steady daily task density, anchored to procedure date, with restrictions that lift on schedule. UAE breaks four of its baked-in assumptions.

**Intensity is front-loaded, not flat.** Day 1 needs near-hourly granularity (pain meds, hydration, symptom checks). Day 10 needs almost nothing. A uniform daily timeline either overwhelms the tail or under-serves the front.

**Reassurance is the core job, not task completion.** The acute window is dominated by symptom interpretation: is this fever normal? Is this much cramping expected? Care-tracker models symptom monitoring as just another task type. For UAE, "is this normal?" triage is arguably the primary feature, with task tracking in support.

**There's a pre-procedure phase.** Care-tracker's timeline starts at the procedure date. UAE patients are anxious and engaged for weeks before, and prep tasks (stop certain medications, arrange a ride, fast after midnight) are exactly when a clinic-prescribed app gets adopted. Onboarding should happen at the consult, not at discharge.

**Outcomes outlast the recovery.** The app that gets deleted on day 10 never captures the cycle-by-cycle improvement data or drives the 3-month MRI appointment. A long, sparse, low-effort tail (a check-in per cycle, imaging reminders) is where PostPal can show the clinic measurable value.

## What care-tracker contributes, and what to leave behind

This is a new product concept, free to break from care-tracker's IA and visual identity. The existing repo de-risks the engineering, not the product, and the evaluation should be honest about that distinction.

Worth carrying forward as working code, with a caveat: none of it is proven, because care-tracker has never had real users. The time-anchored task expansion model, the Now/Next/Later urgency grouping, restrictions modeled as DO_NOT tasks that lift automatically with notification, the milestone system, and the discharge-PDF extraction pipeline (which already targets IR procedures, with UFE seeded at a 14-day recovery) are all built and functional. That makes them hypotheses with a head start, not validated patterns. The DO/DO_NOT task timeline is the deepest assumption in the architecture, and design research should treat it as an open question: do recovering UAE patients actually want a task list, or something else entirely? The same caveat applies to the admin/template layer. It maps onto the B2B2C model on paper, but no clinic has touched it.

Worth leaving behind: the generic procedure-agnostic framing, the post-op-only timeline, the flat daily view as the home experience, and a clinical, neutral design language. A UAE patient is a specific person at a specific moment. The product should feel like it was made for her, which is exactly the user's anti-generic design principle applied at product level rather than component level.

## Positioning and business model

PostPal is clinic-prescribed. The IR clinic is the customer; the patient is the user. This shapes everything.

The clinic's buying logic is concrete. UAE practices compete against gynecologists steering patients to surgery, so patient experience is a marketing asset. Post-procedure phone call volume in the first 72 hours is a real staffing cost. Follow-up imaging adherence is both clinically important and a revenue line. And happy patients in a procedure people research heavily online translate to reviews and referrals. A focused recovery app plausibly moves all four, and those are the metrics a pilot should measure.

The patient pays nothing and gets the app at the consult, branded or co-branded with her clinic, with her procedure date and her doctor's actual instructions pre-loaded. That removes the cold-start problem that kills D2C health apps.

The market logic for "UAE flagship, IR class as market": IR procedures share the same shape (same-day discharge, short intense recovery, imaging follow-up). Advanced Vascular Centers alone performs eight embolization variants already represented in care-tracker's seed data. Win the UAE experience deeply, then the prostate artery embolization version is a content change, not a redesign.

## Risks and honest unknowns

**Clinical content liability.** Symptom triage guidance ("call your doctor if fever exceeds X") is the highest-value feature and the highest-risk one. It must come from the clinic's own discharge protocol, not from us. The PDF-extraction approach helps here, but the line between "displaying your doctor's instructions" and "giving medical advice" needs deliberate design and probably legal review.

**The buyer isn't the user.** B2B2C means selling to clinic administrators and physicians whose incentives (call deflection, imaging adherence) only partially overlap with patient needs (reassurance). Design research needs both sides in the room.

**Engagement window is inherently short.** A 10-day intensive use period is a weakness for retention-based models and a strength for prescribed tools. The business model must not depend on daily active use beyond week two.

**Validation gap.** Everything above about the UAE patient's emotional arc is inferred from clinical descriptions and one clinic's marketing page. Nobody has talked to a UAE patient yet. That's the next step, not a footnote.

## What design research should do next

This document hands off four questions:

1. **Patient interviews or proxy research:** what do UAE/UFE patients actually worry about, hour by hour, in days 0 to 3? Patient forums (fibroid communities are large and active online) are a fast first source.
2. **Clinic discovery:** what do IR practices' post-procedure call logs actually contain? Dr. Mary Costantino's practice, Advanced Vascular Centers (our committed pilot partner), is the natural starting point for these conversations.
3. **The cycle-as-outcome-clock concept:** test whether cycle-based check-ins resonate or feel intrusive.
4. **Visual and brand direction:** what does "made for her, prescribed by her doctor" look like, distinct from both clinical portals and consumer period-tracker aesthetics?

The conceptual design phase should then explore an experience architecture organized around the four recovery phases above, rather than care-tracker's single timeline.

## Next steps

1. **Design research.** Run the four questions above: patient and forum research, clinic discovery, the cycle-as-outcome-clock test, and brand territory. Output: personas, design principles, and a verdict on the task-timeline assumption. Everything downstream depends on this.
2. **Design concepts.** Mood boards and 2 to 3 distinct experience concepts built around the four-phase recovery arc, including at least one that doesn't lead with a task list. Visual identity should feel made for this patient, not adapted from care-tracker.
3. **Tech planning.** An architecture doc, not code: what to reuse from care-tracker (shared-logic, PDF pipeline, data model) versus rebuild, monorepo structure, and how clinic-specific content gets authored and versioned.
4. **Clinical content and legal review.** Define how triage guidance is sourced from each clinic's own protocol, what the app can and can't say, and whether the concept stays on the wellness side of the medical-device line.
5. **Pilot plan and clinic outreach.** We already have a committed pilot partner: Dr. Mary Costantino (Advanced Vascular Centers) has agreed to run a pilot when we're ready. Define pilot metrics with her practice (72-hour call volume, imaging follow-up adherence, patient-reported reassurance), and use her clinic discovery conversations to feed design research. A second candidate practice is worth lining up for contrast, but not a blocker.
6. **Name and brand check.** Confirm PostPal is clear to use (trademark, domain, app stores) before the concept work bakes it in.

Steps 1 and 5 can start in parallel: clinic conversations are themselves research. Steps 2 through 4 wait on research output.
