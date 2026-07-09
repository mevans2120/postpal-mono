# Interpreter Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the interpreter sheet's "Call Carrie" flow with an information-first design: the closing question is the action ("Yes, that helps" resolves; "Not quite" reveals the line to watch plus self-care), with only a 911 line for true emergencies and no clinic-contact button.

**Architecture:** The interpreter is one kind in the daybook's single sheet overlay. It gets two views driven by a `payload.escalated` flag: the answer view (default) and the escalated view ("Not quite"). Both resolve by recording the note and landing on the page, exactly like the current dismiss. No new sheet kind, no state-machine changes outside the interpreter.

**Tech stack:** One self-contained file, `prototypes/daybook.html` — vanilla JS + CSS, no build, no test runner. Verification is behavioral in the browser, matching how this prototype was verified originally (webapp-testing / Playwright, plus the on-load console self-check).

**Design source of truth:** `docs/design/interpreter-components-070826/interpreter-redesign.html` (states A, B, C). Note one deliberate deviation, explained in Task 3: state B's standalone "resolved" confirmation sheet is not built — "Yes" lands on the page, whose "Noted: … ✓" receipt is the confirmation, saving a tap.

**Out of scope (deferred — tracked on task #1 "reduce call volume"):**
- The "better first step" for the after-hours / app-couldn't-answer case. State C currently ends in self-care + 911 with no route to a person, by design, pending that work.
- A copy pass on threshold strings that still say "call" (e.g., day 20 "Passed some tissue": "Call Carrie today"). These now name an action with no mechanism. Known inconsistency; left as-is for the demo. See optional Task 6.
- Any deflection analytics ("logged" in the mockup). No backend in this prototype.

---

## Current state (post earlier edit)

The standing "Call Carrie, PA-C" primary button is already removed. The interpreter currently renders tag → head → body → threshold and a single ghost "That helps" button (`#act-helps`), wired to a `dismiss` that records the note (chips origin) and closes.

Relevant locations in `prototypes/daybook.html`:
- `interpreterHTML(interp)` — around lines 713–724
- `sheetBodyHTML(day)` interpreter case — around line 744 (`return interpreterHTML(day.interpreters[payload.key]);`)
- `wireSheet(root, day)` interpreter branch — around lines 769–781
- Interpreter CSS (`.tag`, `.sheet h4`, `.sheet p`, `.threshold`, `.sheetacts`, `.btn`) — around lines 145–156
- Interpreter is opened from two places, both passing `{ key, origin }`:
  - Symptom chip (noted phase): `openSheet("interpreter", { key: chip, origin: "chips" }, …)` — line 935
  - "Feeling something?" → feel sheet chip: `openSheet("interpreter", { key: keys[…], origin: "feel" })` — line 792

---

### Task 1: Add CSS for the new interpreter states

**Files:**
- Modify: `prototypes/daybook.html` (style block, immediately after the interpreter rules near line 156, before the "Tap targets" section)

**Step 1: Add the rules**

Insert after the existing `.btn.ghost:active{background:var(--card)}` line:

```css
  /* interpreter — information-first redesign (source: docs/design/interpreter-components-070826) */
  .threshold .lab{display:block;font-size:10px;letter-spacing:.12em;font-weight:700;color:var(--mut);margin-bottom:3px}
  .threshold.gate{background:var(--clay-soft);border-color:#e7cdb6}
  .askrow{margin-top:18px}
  .asklab{display:block;font-size:10.5px;letter-spacing:.14em;font-weight:700;color:var(--mut);text-align:center;margin-bottom:10px}
  .gatelead{font-family:'Petrona',serif;font-size:18.5px;font-weight:500;line-height:1.32;margin-bottom:4px}
  .gatecalm{font-size:13px;color:var(--mut);line-height:1.55;margin-top:12px}
  .emerg{display:flex;gap:8px;align-items:flex-start;font-size:11.5px;color:var(--mut);margin-top:16px;padding-top:12px;border-top:1px solid var(--line)}
  .emerg b{color:var(--alert);font-weight:700}
```

**Step 2: Verify it parses**

Reload `prototypes/daybook.html` in the browser. Nothing visual changes yet (no markup uses these classes). Confirm the console still logs `DAYS self-check passed` with no CSS/JS errors.

---

### Task 2: Rewrite `interpreterHTML` into two views

**Files:**
- Modify: `prototypes/daybook.html` — `interpreterHTML` (~713) and `sheetBodyHTML` interpreter case (~744)

**Step 1: Add two module-level constants** (place just above `interpreterHTML`)

```js
/* The interpreter never routes to a phone call now. "Not quite" surfaces the
   line to watch plus self-care; only a 911 line remains for a true emergency.
   A per-interpreter `care` string (optional, see Task 6) overrides the default. */
const SELF_CARE_DEFAULT = "If that's not you yet, it usually just needs a little more time. Try what's on today's page, and check back in an hour.";
const EMERGENCY_LINE = "Sudden severe pain, heavy bleeding, or trouble breathing? <b>Call 911.</b>";
```

**Step 2: Replace `interpreterHTML` entirely**

```js
function interpreterHTML(interp, payload) {
  const alertIcon = '<svg width="14" height="14" viewBox="0 0 14 14" style="flex:none;margin-top:2px" aria-hidden="true"><circle cx="7" cy="7" r="6" fill="none" stroke="#9c3a2a" stroke-width="1.5"/><path d="M7 4v3.5M7 9.8v.4" stroke="#9c3a2a" stroke-width="1.5" stroke-linecap="round"/></svg>';

  /* escalated view — reached from "Not quite" */
  if (payload && payload.escalated) {
    const care = interp.care || SELF_CARE_DEFAULT;
    return `
    <div class="gatelead">Here's the line to watch — and what helps right now.</div>
    <div class="threshold gate">${alertIcon}<span><span class="lab">THE ONE THING TO WATCH FOR</span>${interp.threshold}</span></div>
    <p class="gatecalm">${care}</p>
    <div class="emerg">${alertIcon}<span>${EMERGENCY_LINE}</span></div>
    <div class="sheetacts">
      <button class="btn ghost" id="act-gotit">Back to today</button>
    </div>`;
  }

  /* answer view — default */
  return `
    <span class="tag">${interp.tag}</span>
    <h4>${interp.head}</h4>
    <p>${interp.body}</p>
    <div class="threshold">${alertIcon}<span><span class="lab">THE ONE LINE YOUR CLINIC WATCHES</span>${interp.threshold}</span></div>
    <div class="askrow">
      <span class="asklab">DID THIS ANSWER YOUR QUESTION?</span>
      <div class="sheetacts">
        <button class="btn primary" id="act-yes">Yes, that helps</button>
        <button class="btn ghost" id="act-notquite">Not quite</button>
      </div>
    </div>`;
}
```

**Step 3: Pass the payload through `sheetBodyHTML`**

Change the interpreter case from:

```js
    case "interpreter": return interpreterHTML(day.interpreters[payload.key]);
```

to:

```js
    case "interpreter": return interpreterHTML(day.interpreters[payload.key], payload);
```

**Step 4: Verify the answer view renders**

Reload. Day 1 → tap the "Cramping is intense" chip. Expected: the sheet shows tag, headline, body, a threshold box now led by "THE ONE LINE YOUR CLINIC WATCHES", then "DID THIS ANSWER YOUR QUESTION?" with two buttons: "Yes, that helps" (clay) and "Not quite" (outlined). No call button. The buttons do nothing yet (wired in Task 3).

---

### Task 3: Rewire the interpreter actions

**Files:**
- Modify: `prototypes/daybook.html` — `wireSheet` interpreter branch (~769)

**Step 1: Replace the interpreter branch**

Replace the whole `} else if (kind === "interpreter") { … }` block with:

```js
  } else if (kind === "interpreter") {
    /* the worry never blocks the page: from a check-in chip, resolving ("Yes")
       or acknowledging the escalation ("Back to today") records the note and
       lands on the page; from "Feeling something?" they just close. "Not quite"
       swaps to the escalated view in place, keeping the same opener. */
    const resolve = () => {
      if (payload.origin === "chips") {
        state.note = payload.key.toLowerCase();
        state.phase = "page";
      }
      closeSheet();
    };
    if (payload.escalated) {
      root.querySelector("#act-gotit").addEventListener("click", resolve);
    } else {
      root.querySelector("#act-yes").addEventListener("click", resolve);
      root.querySelector("#act-notquite").addEventListener("click",
        () => openSheet("interpreter", { ...payload, escalated: true }));
    }
  }
```

Notes for the implementer:
- `openSheet` is called without an opener selector here, so `sheetOpenerSel` keeps the original chip — focus returns correctly on the final close (and degrades gracefully when the chip is gone because we moved to the page).
- The scrim/grab handlers (bound at the top of `wireSheet` to `closeSheet`) are left as the escape hatch: closing via scrim/grab cancels back to the noted phase without recording a note, matching the pre-existing behavior. Landing on the page only happens via the explicit buttons.
- This is why state C needs the "Back to today" button: it is the only in-sheet control, and it is what records the note and advances to the page.

**Step 2: Verify both views and both origins**

Reload. Run these by hand (see Task 4 for the full matrix):
- Day 1 → "Cramping is intense" → "Yes, that helps" → sheet closes, page shows "Noted: cramping is intense ✓".
- Day 1 → "Cramping is intense" → "Not quite" → escalated view: "line to watch" gate box + self-care line + 911 line + "Back to today". No call button.
- "Back to today" → page with the same receipt.
- "Feeling something?" (day 5) → pick "Warm / feverish" → "Yes, that helps" → sheet just closes, no page jump, no note.

---

### Task 4: Verify end-to-end

**Files:** none (verification only). Prefer the webapp-testing skill (Playwright) against `prototypes/daybook.html`; manual browser is acceptable. The dev server is already running at http://localhost:3000/.

**Step 1: Console clean**

Load the page. DevTools console shows `DAYS self-check passed` and no errors while driving the flows below.

**Step 2: Coverage matrix**

For each of days 1, 3, 5, 10, 20, open one symptom chip in the noted phase and confirm:
- Answer view: no "Call Carrie" button anywhere; "Yes, that helps" + "Not quite" present; threshold shows its label.
- "Yes, that helps" → lands on the page with the correct "Noted: <symptom> ✓" receipt.
- "Not quite" → escalated view with the gate box (its text = that interpreter's `threshold`), a self-care line, and the 911 line; "Back to today" → page with the receipt.

Also confirm from "Feeling something?" on at least one day that "Yes" and "Back to today" simply close (no note recorded, no phase change).

**Step 3: Known-inconsistency spot check**

Day 20 → "Passed some tissue" → "Not quite". The gate text still reads "Call Carrie today …" (the raw threshold copy). Confirm this is the only oddity and note it — it is expected and deferred (see Task 6 / task #1). Do not fix copy in this task.

**Step 4: Accessibility sanity**

Tab through the answer view: "Yes, that helps" and "Not quite" are reachable and have visible focus. Escape closes the sheet (existing global handler). The escalated view's first control ("Back to today") is reachable. (Optional: add `#act-gotit`/`#act-yes` to the successor list in `renderSheet` if focus after the in-place swap feels off; not required for the demo.)

---

### Task 5: Commit

**Step 1: Confirm the working tree contains only the intended changes**

Run: `git status` and `git diff prototypes/daybook.html`
Expected: changes limited to the interpreter CSS, `interpreterHTML`, `sheetBodyHTML` (one line), and the `wireSheet` interpreter branch.

**Step 2: Commit**

```bash
git add prototypes/daybook.html
git commit -m "feat(prototype): interpreter answers first, drops the call button"
```

(Branch first if not already on a feature branch, per the repo's git workflow.)

---

### Task 6 (optional stretch — only if there's time before the demo): warm up state C

**Files:** `prototypes/daybook.html` — the `DAYS` interpreters and/or threshold strings

**Step 1:** Add an optional `care` string to the interpreters most likely to be shown in the demo (start with day 1's three). Example for day 1 "Cramping is intense":

```js
care: "If it's not that yet, the medicines need a little more time. Take the PRN dose, try the heating pad, and check back in an hour."
```

`interpreterHTML` already falls back to `SELF_CARE_DEFAULT` when `care` is absent, so this is purely additive and safe to do for a subset.

**Step 2 (optional):** Light copy pass on threshold strings that still say "call" so they read as "what to watch for" rather than naming a missing action. Keep it minimal; the real fix is the deferred "better first step."

**Step 3:** Re-run Task 4's matrix for any day you touched, then commit: `feat(prototype): symptom-specific self-care in the escalated interpreter`.

---

## Verification summary

Done when: no "Call Carrie" button appears in either interpreter view on any day; "Yes, that helps" resolves to the page with the right receipt; "Not quite" shows the watch-line + self-care + 911 and "Back to today" resolves to the page; the "Feeling something?" origin still just closes; console is clean. The day-20 threshold copy oddity is noted, not fixed.
