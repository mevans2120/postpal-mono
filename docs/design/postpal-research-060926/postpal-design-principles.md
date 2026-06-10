# PostPal Design Principles

**Date:** 2026-06-09
**Basis:** Each principle ties to a specific research insight in `postpal-research-findings.md`. These are decision-making tools for the concept phase: when two design options conflict, the principle picks.

---

### 1. Answer "Is this normal?" before "What's next?"

*The core screen is an interpreter, not a planner.*

**Insight:** Every recurring patient question carries a binary fear underneath: "is this normal, or does it mean it failed?" (verbatim from a day-21 poster). In ~150 forum posts, interpretation requests vastly outnumber any task-management behavior.

**In practice:** Symptom lookup tied to her day number is the primary interaction. Reassurance content answers the fear ("this does not mean it failed") and not just the symptom. If a home-screen slot can hold a task list or an "is this normal?" entry point, the entry point wins.

---

### 2. The med schedule is the only checklist

*Execute the days 1-5 grid precisely; make nothing else completable.*

**Insight:** Patients showed zero demand for recovery to-do lists, but the AVC med grid (5-7 drugs, timed and PRN doses) is a genuinely hard executive job done while cognitively foggy, and patients credit schedule adherence for smooth recoveries. Stanford hands out a paper dose "score sheet" today.

**In practice:** Next-dose countdowns ("in 45 minutes"), not clock times. Dose logging, PRN guardrails (max daily Tylenol), taper guidance. Hydration, walking, and monitoring guidance are ambient content, not checkable tasks. Restrictions are countdowns ("4 more days of no lifting"), never checkboxes.

---

### 3. Benchmark against the range, never grade against the day

*Wide normal bands; no fixed-day expectations that can read as failure.*

**Insight:** Acute pain runs from 3/10 to "medieval" across patients. Day-10-still-in-pain posters spiral precisely because generic timelines imply they should be better. The most-valued forum content is day-by-day accounts patients use to place themselves on a curve.

**In practice:** Every expectation ships as a range with explicit variance ("many women are off narcotics by day 4-5; recoveries running into week 2 are also common"). Trajectory (improving vs worsening since day 3) is the signal the product reads back, because it's also the clinical differentiator between normal and concerning.

---

### 4. Design for the foggy 72 hours first

*If it doesn't work on opioids at 2 AM, it doesn't work.*

**Insight:** Post-embolization syndrome peaks at 24-48h while the patient is sedation- and opioid-impaired. Task density is front-loaded exactly when capacity is lowest. The 2 AM fever-Google moment is when the clinic line is closed and the stakes are highest.

**In practice:** Acute-phase UI shows one thing at a time, with quiet-hours reassurance ("nothing until 4 PM, rest"). Two-tier escalation (call 911 vs call provider, with AVC's actual thresholds and numbers) is reachable in one tap from every screen, day or night. The support person can see the same med schedule and escalation criteria; she is often the one acting.

---

### 5. Believe her

*Validate pain; never sanitize; set expectations the clinic's brochure won't.*

**Insight:** The loudest theme in the patient voice is downplayed pain: "They definitely don't tell you it could feel this bad." Patients trust peers over clinicians for recovery reality ("I learned more from Reddit than my doctor"). Black patients additionally report dismissed pain.

**In practice:** Pre-procedure content states the honest range, including the hard recoveries. Copy never minimizes ("some cramping" is banned where "intense, labor-like cramping is common in the first 24 hours" is true). Symptom logging doubles as advocacy evidence the patient can show a dismissive provider ("here's the data to prove it").

---

### 6. The cycle is the scoreboard

*Success is measured period by period until the MRI says so.*

**Insight:** Confirmed across sources: patients count outcomes ordinally ("first period post UFE," "I've had 3 periods and they're so easy and light!") because the confirming MRI is months away. The first period is a known panic point. ~18% of patients are lost to imaging follow-up.

**In practice:** Months 1-6 engagement is per-cycle check-ins (lighter/heavier, clots, pain: UFS-QOL-aligned so the data is clinically legible), a first-period heads-up, and imaging-appointment nudges. No daily engagement mechanics in this phase; sparse and high-stakes by design.

---

### 7. The clinic's voice, made human

*Every clinical claim is the clinic's protocol; every word sounds like a person.*

**Insight:** Triage thresholds vary by clinic (fever rules alone differ across Stanford, Northwestern, and MedlinePlus), and the liability line requires content sourced from the prescribing clinic's own packet. But the packet's register is why patients turn to Reddit: it answers Friday-afternoon questions in compliance language.

**In practice:** Thresholds, med regimens, and restriction durations come from the clinic's discharge protocol (the extraction pipeline already does this from AVC's PDF). PostPal's layer is translation: peer-account warmth, day-anchored relevance, and the gaps the packet skips (expulsion pre-education, first-period warning, intercourse guidance) filled only with clinic-approved content.
