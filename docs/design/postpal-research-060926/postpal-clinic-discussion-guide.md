# PostPal: Discussion Guide for Dr. Costantino / Advanced Vascular Centers

**Date:** 2026-06-09
**Purpose:** Questions for our committed pilot partner. Per Michael's direction, nothing blocks on these answers: each question lists the working assumption we're designing with until corrected. Sources for assumptions: AVC's own UAE discharge packet (already in hand: `care-tracker-monorepo/docs/beta-test-dr-constantino/procedureinformationavc/UAE.pdf`), AVC's public site, and the cross-clinic clinical research in `postpal-research-findings.md`.

Format note: this works as an interview guide or as an async email. Sections are ordered by how much the answer changes the design.

---

## A. The call line (highest design impact)

1. **What do post-UFE patients actually call about in the first two weeks?** Rough top-5 and volume per patient. Who fields them, and what does after-hours coverage look like?
   *Working assumption:* ~80% of calls are expected-symptom reassurance (fever, pain level, discharge, med questions, "something came out"), concentrated days 0-5 and at the first period, with a painful after-hours gap. Based on forum question frequency, not AVC data.

2. **Can we baseline call logs before the pilot?** Even a two-week tally sheet of call reasons would let the pilot measure an objective call-volume delta (no competitor publishes one for IR).
   *Working assumption:* No structured log exists today; we'll propose a lightweight tally.

3. **What does the 24-48h check-in call cover, and who makes it?**
   *Working assumption:* PA-led, covers pain control, fever, access site, fluids; per the cross-clinic norm (VCU and outpatient-UAE literature).

## B. Clinical protocol specifics (the packet leaves these open)

4. **Access site: femoral, radial, or case-by-case?** The packet mentions wrist or groin; the public site describes groin only. This branches bed-rest, lifting, and site-care content.
   *Working assumption:* Both occur; femoral is the default content path.

5. **Fever rule, exactly.** The packet says call at >=101°F. Is there a duration nuance (e.g., Northwestern's "low-grade beyond day 3, or >=101.5 for 24h")?
   *Working assumption:* Flat >=101°F call-provider threshold, per the packet.

6. **Expected-symptom counseling: what do you tell patients about post-embolization syndrome, discharge duration, and fibroid expulsion?** The packet contains none of this, and it's the top panic material in patient communities.
   *Working assumption:* Counseling happens verbally at consult/discharge and is what we'd encode: low-grade fever 2-3 days, flu-like days 2-7, brown discharge up to ~8 weeks, expulsion possible weeks 4-12 in <10% (mainly submucosal), see-doctor-promptly if tissue passes.

7. **Intercourse/pelvic-rest guidance and tampon embargo length.** Packet: no tampons 2 weeks. Cross-clinic range runs to "pads only ~1 month" and intercourse guidance is unstandardized.
   *Working assumption:* Tampons 2 weeks per packet; intercourse ~2 weeks unless told otherwise; flagged as unverified in content.

8. **First-period counseling.** Do you warn that the first 1-2 periods may be early, heavier, or crampier, and that pain can flare?
   *Working assumption:* Yes verbally, nowhere in writing; PostPal adds a first-period heads-up ~3 weeks post-procedure.

9. **Med regimen currency.** Is the packet's days 1-5 grid (cyclobenzaprine, ibuprofen 800, hydromorphone PRN, ondansetron PRN, Tylenol, stool softener, Metformin hold 48h) current, and does it vary per patient? Any nerve block or extended ketorolac protocol?
   *Working assumption:* Grid is current and standard for nearly all UFE patients.

## C. Follow-up and outcomes

10. **Follow-up cadence after the 2-week telehealth.** When is imaging (3 months, 6 months, both?), MRI or ultrasound, and who orders it? What share of patients complete it?
    *Working assumption:* 3-month contrast MRI + symptom review, with meaningful drop-off (literature: ~18% lost over time); imaging adherence is a pilot metric.

11. **Would per-cycle symptom check-ins (UFS-QOL-style: bleeding heaviness, clots, pain) be clinically useful to you at the follow-up visits?**
    *Working assumption:* Yes; structured cycle data arriving before the 3-month visit is new, useful signal.

## D. Pilot mechanics and the business case

12. **What would make this pilot a clear win for the practice?** Our proposed endpoints: patient-initiated calls per UFE patient days 0-7 vs baseline; 3-month imaging completion rate; daily check-in completion days 1-7; per-cycle check-in completion through cycle 3.
    *Working assumption:* Call deflection and imaging adherence are the two she'd pay for; patient-experience differentiation is the tiebreaker.

13. **Who at AVC owns discharge content, and how often does it change?** (This sizes the admin/authoring need.)
    *Working assumption:* The PA maintains the PDFs; changes are infrequent (annual-ish).

14. **What tools does the practice pay for today** (reminders, texting, scheduling), and what did the last software purchase decision look like?
    *Working assumption:* Lightweight scheduling/reminder tooling only; purchase decisions are made by Dr. Costantino + practice manager without procurement.

15. **Consent and liability posture:** is she comfortable with the app presenting her packet's thresholds verbatim with her clinic's branding, and what review process does she want over added expectation-setting content (PES, expulsion, first period)?
    *Working assumption:* Verbatim packet content is fine; added content needs her sign-off per release. This is also the input to next-steps item 4 (clinical/legal review).

16. **Beyond UFE:** would she pilot PAE with the same model once UFE works? (Her PAE packet is also in our corpus.)
    *Working assumption:* Yes; UFE first, PAE second, same pipeline.

---

## Closing question

17. "What do patients ask you that you wish a product answered before they had to call?"

(Asked last on purpose: it's the question most likely to produce the feature we haven't thought of.)
