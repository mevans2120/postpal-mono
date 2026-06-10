# Daybook Interactive Prototype Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** A single-file interactive HTML prototype of the PostPal Daybook home flow — check-in → receipts → today's page — with the Next-slot bottom nav (Option 3 only, no tab bar), switchable across days 1, 3, 5, 10, and 20 of a UFE recovery.

**Architecture:** One self-contained HTML file (vanilla JS + CSS, Google Fonts CDN, no build step). All day-specific copy lives in a single `DAYS` data object; the UI is a small state machine (`checkin → noted → page`) re-rendered per day. Sheets (med rail, can/can't, cycle check-in, interpreter) are one overlay component fed different content. A fixed dev control switches days. Built to be registered in the prototype-viewer gallery afterward.

**Tech Stack:** HTML/CSS/vanilla JS in one file. Fonts: Petrona + Albert Sans (Google Fonts). Verification: browser + the webapp-testing skill (Playwright) for the final pass. No framework, no dependencies — this is a concept prototype, not production code.

**Visual source of truth (copy styles from these, do not invent new ones):**
- `docs/design/postpal-concepts-060926/postpal-concept-daybook-coalesced.html` — tokens, hero, faces, receipts, chips, chapters (v7)
- `docs/design/postpal-concepts-060926/postpal-bottom-nav-options.html` — Next-slot pair, expanded med-rail sheet, phase crops
- Design rules that must survive implementation: calm budget (one ask above the fold in check-in state), hero truncates never shrinks, receipts at hero scale with no edit links, restrictions are countdowns never checkboxes, "Nothing new" listed first, the interpreter always resolves fear → clinic threshold → named human.

---

## Content model (the domain knowledge — copy verbatim)

All copy is grounded in the design research (`docs/design/postpal-research-060926/`) and AVC's UAE discharge packet. Day numbers are post-procedure days; patient is "Maya · UFE Feb 12"; clinic contact is "Carrie, PA-C".

```js
const DAYS = {
  1: {
    eyebrow: "DAY 1 · MORNING CHECK-IN",
    heroFull: "Today is usually the hardest day — <em>intense cramping means it's working, and it eases from here.</em>",
    heroShort: "Today is usually the hardest day<em>…</em>",
    chips: ["Nothing new", "Cramping is intense", "Fever or chills", "Nausea", "Something else…"],
    ack: { better: "Noted — a steadier start than most.", same: "Noted — holding steady.", worse: "Noted — a hard morning. That's day 1." },
    feel: [
      { body: "<b>Cramping in waves, like a strong period or early labor.</b> This is the embolization working. Your medicines are scheduled to stay ahead of it — the heating pad helps more than you'd think.",
        note: "Carrie, PA-C — \"Day 1 is the day the schedule matters most. Let it carry you.\"" },
      { body: "<b>Keep checking the puncture site.</b> A small bruise is normal. Firm pressure for 15 minutes if it oozes, then call us." }
    ],
    back: null,
    notYet: "driving <b>24h</b> · alcohol <b>24h</b> · an adult stays with you <b>today</b>",
    meds: { line: "2 of 7 doses taken · next: ibuprofen 800 at 1:00", sheet: "medrail" },
    ahead: [
      { k: "TOMORROW", v: "Dressing comes off — and your first shower" },
      { k: "FEB 26", v: "Telehealth with Carrie, PA-C (day 14)" }
    ],
    next: { label: "Ibuprofen 800", sub: "1:00 · in 40 min", tone: "clay", sheet: "medrail" },
    medrail: {
      title: "Your medicines · day 1",
      groups: [
        { label: "THIS MORNING", rows: [["8:00","Cyclobenzaprine 10","taken 8:10 ✓"],["8:00","Ibuprofen 800","taken 8:10 ✓"]] , done: true },
        { label: "NEXT · IN 40 MIN", rows: [["1:00","Ibuprofen 800|take with food","LOG"]], now: true },
        { label: "LATER TODAY", rows: [["6:00","Ibuprofen 800",""],["9:00","Cyclobenzaprine 10 + stool softener",""]] },
        { label: "IF YOU NEED MORE", rows: [["PRN","Hydromorphone 1–2|for breakthrough pain","ok again now"],["PRN","Zofran|for nausea","available"]] }
      ],
      meter: [0, 4000, "TYLENOL TODAY"],
      quiet: "After the 9:00 doses, nothing until morning. Rest.",
      paired: "Tasha is paired and can log doses for you."
    },
    interpreters: {
      "Cramping is intense": { tag: "EXPECTED ON DAY 1", head: "Strong, wave-like cramping is the procedure working.",
        body: "Most women describe day 1 as the hardest — cramping like a very strong period, sometimes worse. It fades over the next two to three days.",
        threshold: "Your clinic's line: call if pain is <b>not controlled by your scheduled medicines</b> — that's what the PRN dose is for, and what Carrie wants to hear about." },
      "Fever or chills": { tag: "EXPECTED ON DAY 1", head: "A low fever tonight is your body responding.",
        body: "Up to about 101°F with flu-like aches is common in the first three days.",
        threshold: "Call if it reaches <b>101°F</b>, or comes with foul-smelling discharge." },
      "Nausea": { tag: "EXPECTED ON DAY 1", head: "Nausea is usually the medicines, not a problem.",
        body: "The pain medicines cause it. Zofran is on your PRN list for exactly this. Small bland meals help.",
        threshold: "Call if you <b>can't keep fluids down</b> — that one matters." }
    }
  },
  3: {
    eyebrow: "DAY 3 · MORNING CHECK-IN",
    heroFull: "The fever and flu-like feeling usually break around now — <em>cramping fades with them. If yours hasn't yet, you're not behind.</em>",
    heroShort: "The fever usually breaks around now<em>…</em>",
    chips: ["Nothing new", "Still feverish", "Cramping more", "Tired all day", "Something else…"],
    ack: { better: "Noted — a better day than yesterday.", same: "Noted — about the same.", worse: "Noted — a rough patch. Day 3 can be one." },
    feel: [
      { body: "<b>The flu-like feeling has a name.</b> Post-embolization syndrome: low fever, aches, fatigue. It peaks around now and then lets go.",
        note: "Carrie, PA-C — \"Day 3 is when most of my calls come. Almost all of them are this.\"" },
      { body: "<b>Hot and cold flashes at night</b> are part of the same response — not an infection by themselves." }
    ],
    back: "driving ✓ · showers ✓ · normal meals ✓",
    notYet: "lifting &gt;10 lb <b>4d</b> · baths &amp; pools <b>11d</b> · tampons <b>11d</b>",
    meds: { line: "3 of 6 doses taken · next: ibuprofen 800 at 1:00", sheet: "medrail" },
    ahead: [
      { k: "DAY 5", v: "The medicine schedule starts stepping down" },
      { k: "FEB 26", v: "Telehealth with Carrie, PA-C (day 14)" }
    ],
    next: { label: "Ibuprofen 800", sub: "1:00 · in 3 h", tone: "clay", sheet: "medrail" },
    medrail: { /* same shape as day 1; morning rows done; metformin resumes today — add row ["8:00","Metformin — back on schedule","taken ✓"] */ },
    interpreters: {
      "Still feverish": { tag: "EXPECTED THROUGH DAY 3", head: "A low fever today is still within the window.",
        body: "Day 3 is typically the last day of the fever. It should start fading from here.",
        threshold: "Call if it reaches <b>101°F</b>, or if any fever is <b>still here tomorrow</b> — that's the line your clinic watches." },
      "Cramping more": { tag: "WORTH A CLOSER LOOK", head: "Cramping should be fading by now — rising is the signal.",
        body: "Lingering cramps are normal. Cramping that's climbing after day 2–3 is the pattern Carrie wants to hear about, even when it turns out to be nothing.",
        threshold: "Rising pain — <b>not lingering pain</b> — is the thing to call about. Call today." },
      "Tired all day": { tag: "EXPECTED ON DAY 3", head: "Fatigue peaks this week.",
        body: "If you came into this anemic, it runs longer — that's the iron, not a setback.",
        threshold: "Mention it at your day-14 telehealth; call sooner if you're <b>too dizzy to stand</b>." }
    }
  },
  5: { /* exactly the v7 content from postpal-concept-daybook-coalesced.html: hero (fog lifting), chips (Nothing new / Warm feverish / Cramping more / Discharge changed / Something else), feel entries (strong medication + discharge starting + Carrie margin note), back (driving/showers/meals), notYet (lifting 2d, baths 9d, tampons 9d), meds 3-of-6, ahead (tomorrow: stepping down meds; Feb 26 telehealth), next: Ibuprofen 800 · 1:00 · clay · medrail. Interpreters: Warm/feverish (call ≥101 or low fever past day 3), Cramping more (rising vs lingering), Discharge changed (weeks of brown discharge normal; foul smell = call). */ },
  10: {
    eyebrow: "DAY 10 · MORNING CHECK-IN",
    heroFull: "The medicine schedule is behind you — <em>lingering tiredness isn't. Both are normal at day ten.</em>",
    heroShort: "The medicine schedule is behind you<em>…</em>",
    chips: ["Nothing new", "Still exhausted", "Brown discharge", "Cramping twinges", "Something else…"],
    ack: { better: "Noted — the curve is bending your way.", same: "Noted — steady is normal here.", worse: "Noted — a dip at day 10 happens." },
    feel: [
      { body: "<b>Energy comes back slower than pain leaves.</b> Most women are at work this week and tired by mid-afternoon. That's the typical shape, not a setback.",
        note: "Carrie, PA-C — \"Day 10 tired with day 2 memories — that's the week 2 special.\"" },
      { body: "<b>Discharge can continue for weeks.</b> Brownish and watery is the fibroid breaking down. The line is still smell, not duration." }
    ],
    back: "driving ✓ · showers ✓ · normal meals ✓ · lifting ✓ · exercise ✓",
    notYet: "baths &amp; pools <b>4d</b> · tampons <b>4d</b>",
    meds: { line: "As needed only — ibuprofen if cramps flare", sheet: "medrail" },
    ahead: [
      { k: "FEB 26", v: "Telehealth with Carrie, PA-C — in 4 days" },
      { k: "DAY 14", v: "Baths, pools, and tampons all clear" }
    ],
    next: { label: "Baths & pools clear", sub: "in 4 days · Feb 26", tone: "pine", sheet: "cancant" },
    cancant: { title: "What you can do — and not yet",
      back: "driving ✓ · showers ✓ · normal meals ✓ · lifting ✓ · exercise ✓",
      notYet: [["Baths, pools & hot tubs","4 days — Feb 26"],["Tampons (pads until then)","4 days — Feb 26"]],
      footnote: "Cleared dates come from your clinic's discharge instructions." },
    interpreters: {
      "Still exhausted": { tag: "EXPECTED AT DAY 10", head: "Fatigue outlasts everything else.",
        body: "One to two weeks of real tiredness is the documented norm, longer if you arrived anemic.",
        threshold: "Worth raising at Thursday's telehealth. Call sooner if it's <b>getting worse, not better</b>." },
      "Brown discharge": { tag: "EXPECTED FOR WEEKS", head: "This is the fibroid breaking down, not a wound.",
        body: "Watery, brownish discharge can continue for several weeks — some women see it for a couple of months.",
        threshold: "Foul smell or a sudden increase with fever — <b>that's a call</b>. Color and duration alone are not." },
      "Cramping twinges": { tag: "EXPECTED AT DAY 10", head: "Echo cramps come and go for weeks.",
        body: "Brief twinges, especially when tired, are part of the shrinking process.",
        threshold: "Call if cramping returns at <b>full day-1 strength</b> or with fever." }
    }
  },
  20: {
    eyebrow: "DAY 20 · CHECK-IN",
    heroFull: "Every restriction has lifted — <em>your body is still finishing the quiet work. Your first period will tell you more than any day count.</em>",
    heroShort: "Every restriction has lifted<em>…</em>",
    chips: ["Nothing new", "First period — heavier", "Discharge still here", "Passed some tissue", "Something else…"],
    ack: { better: "Noted — and recorded for your cycle page.", same: "Noted — steady.", worse: "Noted — let's look at it together below." },
    feel: [
      { body: "<b>Your first period may be loud.</b> Earlier, heavier, or crampier than your old normal is common for the first one or two cycles — it usually settles after that, and lighter is what we're watching for.",
        note: "Carrie, PA-C — \"The first period scares more women than day one does. It's expected. The second one is the tell.\"" },
      { body: "<b>Around weeks 4–12, a small number of women pass fibroid tissue.</b> It looks alarming and usually isn't — but it's always worth a call the same day, just to check it's complete." }
    ],
    back: "everything ✓ — all restrictions cleared on day 14",
    notYet: null,
    meds: null,
    ahead: [
      { k: "CYCLE 1", v: "One check-in when your period ends — your scoreboard starts" },
      { k: "~MAY", v: "3-month MRI — the picture that confirms the shrinking" }
    ],
    next: { label: "Cycle 1 check-in", sub: "when your period ends", tone: "pine", sheet: "cycle" },
    cycle: { title: "Your first period since UFE — how did it compare?",
      options: ["Lighter", "Same", "Heavier"],
      footnote: "Heavier for the first one or two cycles is common. This answer goes on your cycle page — the record Carrie reads before your follow-up." },
    interpreters: {
      "First period — heavier": { tag: "EXPECTED · CYCLES 1–2", head: "A heavier first period doesn't mean it failed.",
        body: "The uterus is still inflamed and healing. Most women see the turn by the second or third cycle — that's the number that matters.",
        threshold: "Call if you're soaking <b>a pad an hour</b>, or pain returns at full strength." },
      "Discharge still here": { tag: "EXPECTED FOR WEEKS", head: "Weeks of discharge is still inside the window.",
        body: "Some women see it for a couple of months as the fibroid breaks down.",
        threshold: "Foul smell, fever, or a sudden surge — <b>call</b>. Otherwise it's healing, slowly." },
      "Passed some tissue": { tag: "CALL TODAY — USUALLY FINE", head: "Tissue passing is documented and usually completes on its own.",
        body: "It happens to fewer than 1 in 10 women, mostly weeks 4–12. The reason to call isn't danger — it's making sure it passed completely.",
        threshold: "<b>Call Carrie today</b> either way. Go urgently if there's fever, foul discharge, or severe pain with it." }
    }
  }
};
```

Notes for the implementer:
- Day 5's full content is already written — lift it verbatim from the v7 concept file rather than re-authoring.
- Day 3's `medrail` reuses day 1's structure; change the counts and add the Metformin row (resumes after 48h per the AVC packet).
- `next.tone`: `clay` = urgent/med, `pine` = calm/milestone-cycle. (Ink/MRI tone exists in the concept files but day 20's Next is the cycle check-in, not the MRI.)
- Every interpreter ends with the same two actions: ghost button "That helps" and primary "Call Carrie, PA-C".

---

### Task 1: Scaffold the prototype shell

**Files:**
- Create: `prototypes/daybook.html`

**Step 1:** Create the file with: HTML5 shell, viewport meta, Google Fonts link (Petrona ital/wght + Albert Sans, same URL as the concept files), and the CSS custom properties block copied exactly from `postpal-concept-daybook-coalesced.html` (`--paper`, `--ink`, `--mut`, `--clay`, `--clay-deep`, `--clay-soft`, `--pine`, `--pine-soft`, `--line`, `--card`).

**Step 2:** Body = a single full-viewport mobile column (`max-width:430px; margin:0 auto; min-height:100dvh; background:var(--paper)`), with three landmark containers: `<main id="page">`, `<nav id="nextbar">`, `<div id="sheet-root">`. Add the fixed day-switcher dev control (top-right pill row: 1 · 3 · 5 · 10 · 20) styled as obviously-not-product (small, gray, `position:fixed`).

**Step 3:** Verify: `open prototypes/daybook.html` — cream page renders, fonts load (Petrona visible in a placeholder h1), switcher pills visible.

**Step 4:** Commit: `git add prototypes/daybook.html && git commit -m "feat(prototype): scaffold daybook shell with tokens and day switcher"`

### Task 2: Add the DAYS data object

**Files:**
- Modify: `prototypes/daybook.html` (add `<script>` block)

**Step 1:** Paste the full `DAYS` object from the content model above, completing day 5 from the v7 concept file and day 3's medrail per the notes. No rendering yet — data only, plus `let state = { day: 5, phase: "checkin", face: null, note: null }`.

**Step 2:** Verify in browser console: `Object.keys(DAYS)` → `["1","3","5","10","20"]`; `DAYS[20].next.sheet` → `"cycle"`; every day has `interpreters` for every non-"Nothing new"/"Something else…" chip (write a 5-line console assertion loop and run it once).

**Step 3:** Commit: `feat(prototype): add five-day content model`

### Task 3: Render the check-in state (phase 1 of the flow)

**Files:**
- Modify: `prototypes/daybook.html`

**Step 1:** Implement `render()` switching on `state.phase`. For `checkin`: eyebrow, full hero (24.5px Petrona, em = clay italic), the five-face scale (copy the face SVGs and `.face` styles from the v6/v7 concept file — five cells, 80%-width SVGs, captions "a good day / a hard day"), footer Next bar placeholder. Calm budget: nothing else renders in this phase.

**Step 2:** Wire the day switcher: clicking a pill sets `state = { day: n, phase: "checkin", ... }` and re-renders.

**Step 3:** Wire face taps: tapping face index i stores `state.face = i`, sets `phase = "noted"`, re-renders.

**Step 4:** Verify: all five days show their own eyebrow + hero in checkin phase; tapping a face advances (blank noted phase is fine for now).

**Step 5:** Commit: `feat(prototype): check-in state with face scale and day switching`

### Task 4: Render the noted state (receipts + chips)

**Files:**
- Modify: `prototypes/daybook.html`

**Step 1:** For `phase = "noted"`: truncated hero (`heroShort`, same 24.5px, `.herorow` hairline), face receipt row (30px face glyph + "Today feels: *{better|about the same|harder}*" mapped from face index: 0–1 better, 2 same, 3–4 harder), then "ANYTHING TO NOTE TODAY?" label + the day's chips. Copy `.receipt`, `.rtext`, `.chips`, `.chip` styles from the v7 file. No submit button exists.

**Step 2:** Hero tap toggles back to `heroFull` inline (and back). Face receipt tap returns to `phase = "checkin"` with the face preselected.

**Step 3:** Wire chips: "Nothing new" → `state.note`, `phase = "page"`. A symptom chip → open the interpreter sheet first (Task 7), and on dismiss → `phase = "page"` with the note recorded. "Something else…" → for the prototype, a simple inline text input that records free text then advances.

**Step 4:** Verify: day 1 and day 20 show different chips; tapping hero expands/collapses; tapping "Nothing new" advances to (currently empty) page phase.

**Step 5:** Commit: `feat(prototype): noted state with receipts, hero truncation, and chips`

### Task 5: Render today's page (the four chapters)

**Files:**
- Modify: `prototypes/daybook.html`

**Step 1:** For `phase = "page"`: truncated hero + two receipts (face + "Noted: *{note}* ✓"), then the v7 chapters from the day's data: *How today might feel* (entries + margin notes + "keep reading →" stub), *What you can do — and not yet* (BACK/NOT YET fact lines; omit a line when its value is `null` — day 1 has no BACK, day 20 has no NOT YET), *Your medicines today* (omit entirely when `meds` is null — day 20), *What's ahead*. Copy `.sect`, `.factline`, `.entry`, `.marginnote` styles from v7.

**Step 2:** Receipt taps reopen their step (face → checkin with preselect; note → noted with chips visible).

**Step 3:** Verify across all five days: day 1 has no BACK line; day 10's NOT YET shows only baths/tampons; day 20 has no medicines chapter and "everything ✓" in BACK. Chapter headers render in italic Petrona on hairlines.

**Step 4:** Commit: `feat(prototype): today's page with question-led chapters across five days`

### Task 6: The Next-slot bottom nav

**Files:**
- Modify: `prototypes/daybook.html`

**Step 1:** Render `#nextbar` (fixed bottom, paper background, hairline top): left = Next slot from `DAYS[day].next` — `NEXT` micro-label, label + sub, background `var(--clay)` for tone clay / `var(--pine)` for pine; right = outlined quiet "Feeling something?". Copy `.pair` styles from `postpal-bottom-nav-options.html`. The bar renders in every phase.

**Step 2:** Verify: days 1/3/5 show a clay dose slot with times; day 10 shows pine "Baths & pools clear · in 4 days"; day 20 shows pine "Cycle 1 check-in · when your period ends".

**Step 3:** Commit: `feat(prototype): phase-adaptive Next-slot bottom nav`

### Task 7: The sheet system (med rail, can/can't, cycle, interpreter)

**Files:**
- Modify: `prototypes/daybook.html`

**Step 1:** Build one sheet overlay in `#sheet-root`: dim scrim + bottom sheet (`border-radius 26px 26px 0 0`, grab handle, slide-up transition ~240ms ease-out; scrim tap or handle-drag area click closes). One `openSheet(kind, payload)` function.

**Step 2:** Med rail sheet (`kind: "medrail"`): render groups from the day's `medrail` data — done rows dimmed + struck, NOW row clay-tinted with a Log button (logging marks it done and updates the Next slot sub to the following dose), LATER and PRN groups, Tylenol meter, quiet line, paired line. Copy `.tl*`, `.meter`, `.quietline`, `.paired` styles from the nav-options file.

**Step 3:** Can/can't sheet (`kind: "cancant"`, day 10) and cycle sheet (`kind: "cycle"`, day 20: the one question + Lighter/Same/Heavier pills; choosing one shows the footnote as confirmation). Wire the Next slot to open its day's `next.sheet`.

**Step 4:** Interpreter sheet (`kind: "interpreter"`): tag (pine label), headline (Petrona 21px), body, threshold box (alert-red icon + clinic line), actions: ghost "That helps" + primary clay "Call Carrie, PA-C" (the call button can be a dead end with a pressed state — this is a prototype). Wire: symptom chips (Task 4) and "Feeling something?" (opens a chip list sheet of the day's symptoms, then the interpreter).

**Step 5:** Verify the full loops: day 1 → tap Next → log the 1:00 dose → Next slot now reads "6:00 · Ibuprofen 800". Day 5 → tap "Warm / feverish" chip → interpreter shows the 101°F threshold → "That helps" → lands on the page with "Noted: warm / feverish". Day 20 → Next → cycle sheet → "Heavier" → footnote confirms. Day 10 → Next → can/can't sheet.

**Step 6:** Commit: `feat(prototype): sheet system — med rail, can/cant, cycle check-in, interpreter`

### Task 8: Motion and polish pass

**Files:**
- Modify: `prototypes/daybook.html`

**Step 1:** Transitions: receipts settle in with a short fade/slide (~200ms, stagger 60ms); page chapters fade in below receipts; respect `prefers-reduced-motion` (wrap all transitions in `@media (prefers-reduced-motion: no-preference)`).

**Step 2:** QA sweep with the day switcher: every day × every phase × every sheet. Check tap targets ≥44px (faces, chips, Next slot, receipts), text contrast on clay/pine fills, no layout jumps when the hero truncates.

**Step 3:** Commit: `feat(prototype): motion polish and reduced-motion support`

### Task 9: Verify end-to-end with webapp-testing, then register in prototype-viewer

**Step 1:** Use the webapp-testing skill (Playwright) against `file://…/prototypes/daybook.html`: script the day-5 happy path (face → Nothing new → page renders 4 chapters → Next opens med rail → Log → slot updates) and the day-20 cycle path; screenshot each day's page state for the record.

**Step 2:** Register the prototype in the prototype-viewer gallery (`/Users/michaelevans/repos/prototype-viewer` — manifest-driven; copy the file in and add a manifest entry per that repo's existing pattern, title "PostPal Daybook — interactive concept").

**Step 3:** Final commit in postpal-monorepo and push: `git push` (remote `origin` = github.com/mevans2120/postpal-mono).

---

## Out of scope (deliberately)

- The tab bar (Option 4) — Next slot only, per decision 2026-06-10
- Real notifications, persistence, backend, auth — none; state resets on reload
- The "Check a symptom" standalone catalog beyond the day's chips — the "Feeling something?" sheet reuses the day's interpreter set
- Night mode — the 2 AM register lives in the concept files; this prototype tests flow, not theming

## What this prototype exists to test (carry into review sessions)

1. Do the unlabeled hero/receipt rows read as tappable without "edit" labels?
2. Does the Next slot's meaning-shift across days read as intentional (dose → milestone → cycle)?
3. Does the check-in feel like answering a person (target: good day completed in two taps without instructions)?
4. Does day 20 still feel like the same product with no meds and no restrictions?
