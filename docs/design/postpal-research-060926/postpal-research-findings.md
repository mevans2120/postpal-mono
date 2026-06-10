# PostPal: Design Research Findings

**Date:** 2026-06-09
**Status:** Research synthesis. Input to design concepts (next-steps item 2 in the strategy doc).
**Method:** Five parallel research streams: (1) AVC discharge-instruction corpus in care-tracker, (2) care-tracker's prior design research, (3) patient-voice mining (~150 posts/comments from r/Fibroids, patient.info, Mumsnet via archive API), (4) competitive landscape, (5) clinical standard-of-care from SIR, RadiologyInfo, Stanford, Northwestern, and peer-reviewed sources. Citations live in the sections below; confidence levels are flagged throughout.

---

## The verdict on the task-timeline assumption

The strategy doc asked design research to answer: do recovering UAE patients actually want a task list?

**Mostly no, with one big exception.** In ~150 forum posts and comments reviewed, no patient asked for, described, or wished for a recovery to-do list. UFE recovery has few executive tasks. What patients do all day is interpretive: watch a symptom and decide whether it's normal. The dominant verb in patient communities is compare, not complete. Posts are structured "I'm at day X, here's what I feel, anyone else?"

The exception is medication. The AVC discharge packet contains a structured days 1-5 med grid (5-7 drugs, timed doses, scheduled plus PRN), Stanford literally hands patients a paper "score sheet" to log doses, and the one task-like behavior patients credit for smooth recoveries is keeping the med schedule ("I have kept up the pain med schedule that was given to me"). Clock-driven medication execution is a real, hard job in the foggy first days.

**Design implication:** the med schedule is the only checklist. Everything else care-tracker modeled as tasks (hydration, walking, monitoring) is ambient guidance, and restrictions are context with countdowns, not checkboxes. The center of the product is symptom interpretation ("is this normal?"), expectation benchmarking, and cycle-based outcome tracking. A generic task timeline would also actively harm: a checklist implying "off narcotics by day 7" alarms the large minority whose pain runs longer ("I'm post ufe 10 days and am still in extreme pain... getting concerned").

Caveat: forum posters self-select toward problems; quiet checklist-followers don't post. Treat this as a strong directional finding to pressure-test in the pilot, not proof.

---

## Top findings

**1. Pain expectation mismatch is the loudest theme in the patient voice.** Acute pain ranges from 3/10 ("I wouldn't hesitate to do it again") to "medieval" and ER-grade, and patients repeatedly say clinicians downplayed it: "They definitely don't tell you it could feel this bad." Fear of the procedure is fed by the same forums patients rely on. Honest, range-based expectation setting before the procedure is both the biggest trust opportunity and the thing clinics underdeliver today. (Well supported.)

**2. "Is this normal?" always carries a binary fear underneath.** The recurring questions (fever, cramping at week 3, urinary discomfort, brown discharge for months, tissue passage, leg pain, fatigue at day 26) are never purely informational. The subtext is "is this normal, **or does it mean it failed** / I need the ER / I'll end up with a hysterectomy?" One poster says it verbatim. Reassurance content must answer the fear, not just the symptom. (Well supported; full catalog with quotes in the patient-voice section below.)

**3. Patients trust peers above clinicians for recovery reality.** "I had a UFE procedure and I learned more from Reddit than my doctor." The most-thanked content type is day-by-day recovery accounts from people slightly ahead on the timeline. The product should deliver clinic-authored content with the shape and honesty of a peer account. (Well supported.)

**4. The cycle-as-outcome-clock concept is confirmed.** Because the confirming MRI is 3-6 months out, patients count periods ordinally: "first period post UFE," "I've had 3 periods and they're so easy and light!" The first period is also a known panic point: it can arrive early, run heavier, and reignite acute pain. Per-cycle check-ins aligned to UFS-QOL constructs (the validated fibroid quality-of-life instrument used in clinical trials) are a defensible mechanic no competitor has. (Well supported.)

**5. We already hold the pilot clinic's protocol.** AVC's actual UAE discharge packet (UAE.pdf, 3 pages) sits in care-tracker at `docs/beta-test-dr-constantino/procedureinformationavc/`, alongside PAE and five other AVC procedure PDFs, with 29 structured tasks already extracted and a 110-point extraction-quality rubric scoring ~95. Key contents: 24-hour restrictions, days 1-5 med grid, two-week restrictions (tampons, pool/bath), two-tier emergency criteria (call-911 vs call-provider, fever >=101°F), 2-week telehealth follow-up. What it lacks maps exactly to what patients panic about: no expected-symptom guidance (PES, discharge, expulsion), no intercourse guidance, no first-period warning, no imaging timeline. That gap between the official packet and the lived experience is PostPal's content opportunity. (Verified directly.)

**6. The competitive white space is real and specific.** No vendor offers a UFE-specific, clinic-prescribed recovery companion. Enterprise platforms (SeamlessMD, Twistle, Memora, Philips/Medumo) have the pattern and the call-reduction evidence but sell six-figure health-system contracts and publish no IR pathway. Fibroid-specific resources (USA Fibroid Centers, Ask4UFE, UterineKind) stop at awareness or B2C symptom logging. Independent IR practices and office-based labs have no recovery product they can actually buy. The literature even notes no standardized UAE follow-up protocol exists, so PostPal can define one. (Well supported for "nothing public"; a health system could run an unannounced internal pathway.)

**7. Recovery confounders matter to the experience.** Anemia (patients arrive iron-depleted and can't tell if slow recovery is the procedure or the anemia), opioid constipation, return-to-work pressure ("back at work 3.5 weeks post procedure... because I felt like I had to"), and late-onset mood symptoms around month 3 all appear in the patient voice. Black patients report dismissed pain and inadequate pain management. These shape tone and content, not just features. (Anemia and work pressure moderately supported; mood and equity threads thinner but vivid.)

---

## Jobs to be done (revised from care-tracker's research, now evidence-backed)

Care-tracker's Feb 2026 research defined six jobs for its "Jamie" persona from secondary sources. The forum evidence confirms some and reorders them. PostPal's ranking:

1. **"Tell me whether what I'm feeling is normal or a sign of something wrong."** Emotional + functional, constant from day 0 through month 6. The core job. (New #1; care-tracker had it second as "feel confident I'm recovering normally.")
2. **"Get me through the med schedule when I'm foggy."** Functional, multiple times daily, days 0-7. The one executive job. Countdown to next dose beats clock times.
3. **"Show me what recovery looks like for people like me, so I can place myself on the curve."** Emotional + social, daily. Benchmarking against day-by-day accounts with wide normal ranges. (New; the forums do this job today.)
4. **"Validate that my pain is real and tell me what to do about it."** Emotional, acute phase. Includes when-to-escalate clarity. (New; driven by the downplayed-pain theme.)
5. **"Tell me if it's working."** Functional + emotional, months 1-6, measured cycle by cycle until the MRI. (Confirmed and sharpened.)
6. **"Let my person help me."** Social, days 0-3 especially: a designated support person is mandatory for 24h and patients lean on them hard. Care-tracker noted a caregiver view was implied but never designed. (Confirmed.)

Dropped from care-tracker's list: "know what I can and can't do today" stays real but is ambient (restriction countdowns), and "feel like recovery is progressing" folds into jobs 3 and 5.

---

## Phase-by-phase experience map

**Phase 0: Decision and prep (weeks before).** Patient state: researched, anxious, stockpiling supplies (pads, heating pad, fiber, prescriptions filled in advance), arranging a support person, mentally rehearsing pain from forum horror stories. Asks strangers to talk on the phone about their experience. Opportunities: honest expectation-setting with ranges, a real prep checklist (the one moment a checklist is wanted), supply list, "what the first 72 hours feel like" content. This is also when the clinic hands her the app: adoption moment.

**Phase 1: Days 0-3, the crucible.** Post-embolization syndrome peaks at 24-48h: cramping ("like early labor"), low-grade fever to ~101°F, nausea, fatigue. Cognitively foggy from sedation and opioids. Med schedule is dense (6-8 dose events/day). Puncture-site paranoia. Heating pad is the universal comfort. Support person active. Opportunities: next-dose countdowns, one-thing-at-a-time density, "this fever is expected today" reassurance tied to her day number, two-tier escalation always one tap away, quiet-hours messaging ("nothing until 4 PM, rest").

**Phase 2: Days 4-14, the taper.** Meds step down, narcotics stop ~day 4-5, constipation management, fatigue lingers, new weird symptoms surface (swollen abdomen, leg pain, urinary discomfort). Restrictions lift on schedule (driving 24h; lifting 7d; pool/bath and tampons 14d per AVC). The 2-week telehealth follow-up. Opportunities: restriction countdowns ("4 more days of no lifting"), symptom-trajectory framing (improving vs worsening after day 3 is the clinical differentiator), prep for the follow-up call.

**Phase 3: Weeks 2 through month 6, the long wait.** Sparse, high-stakes. Brown discharge for weeks-to-months, possible fibroid expulsion weeks 4-12 (<10% of patients, but terrifying unprepped: "Then today this comes out what is it???"), first periods may be skipped/heavier/crampier, MRI at 3-6 months, ~18% loss to imaging follow-up in one cohort. Mood dip reported around month 3. Opportunities: per-cycle check-ins (UFS-QOL-aligned), expulsion pre-education, first-period warning, imaging-appointment nudges, "shrinkage happens slowly, ~50% volume at 3 months" expectation content.

---

## What this means against competitors (condensed)

- **Closest pattern matches:** SeamlessMD (71.5% of ortho patients said the app prevented at least one call; gyn-onc readmission cuts), Twistle (64.1% said it reduced the need to phone), Philips/Medumo (radiology logistics, pre-procedure). All vendor-published numbers; treat as ceilings, not promises.
- **Pilot metric benchmarks:** patient-initiated calls per UFE patient days 0-7 vs baseline (target 40-50% reduction); 3-month imaging completion (baseline likely 70-85%, target >90%); daily check-in completion days 1-7 (Force Therapeutics' 83% PROM compliance is the bar); per-cycle check-in completion through cycle 3. Measuring actual call logs instead of patient-reported "prevented calls" would itself be a publishable differentiator: no vendor reports objectively counted call volume for an IR procedure.
- **Dark horse:** USA Fibroid Centers (40+ vertically integrated clinics) is the most likely to build in-house, and the best flagship customer if they don't. Merit Medical's Ask4UFE (embolic manufacturer, 1M+ visitors/year) is the natural channel partner, mirroring how DePuy distributes CareSense for joints.

Full competitive detail with sources is in the research stream output; ask before regenerating it as a standalone artifact.

---

## Confidence and gaps

**Well supported:** pain variance and expectation mismatch; the "is this normal?" catalog; peers-over-clinicians trust; cycle-as-outcome-clock; months 1-6 ambiguity; the AVC packet contents (verified directly); the competitive vacuum.

**Moderate:** symptom-tracking as advocacy evidence ("I'm not being hysterical, and here's the data to prove it!"); anemia confounding; late mood symptoms; equity disparities in pain management.

**Thin / open:** the no-checklist finding rests on absence of evidence in a self-selected population; Inspire, HealthUnlocked, and YouTube comments were not reached (follow-up pass possible); AVC's current protocol details beyond the PDF (fever rule nuance, access site femoral vs radial, intercourse guidance, imaging cadence) need Dr. Costantino's answers; everything about clinic call-log composition is assumed until we see real data.

**Where the answers live next:** the clinic discussion guide (`postpal-clinic-discussion-guide.md`) carries the open questions with our working assumptions, so concept work proceeds without blocking.
