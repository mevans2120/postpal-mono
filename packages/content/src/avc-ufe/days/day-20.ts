import type { DayContent } from '../../schema';

export const day20: DayContent = {
  "eyebrow": "DAY 20 · CHECK-IN",
  "heroFull": "Every restriction has lifted — <em>your body is still finishing the quiet work. Your first period will tell you more than any day count.</em>",
  "heroShort": "Every restriction has lifted<em>…</em>",
  "chips": [
    "Nothing new",
    "First period — heavier",
    "Discharge still here",
    "Passed some tissue",
    "Something else…"
  ],
  "ack": {
    "better": "Noted — and recorded for your cycle page.",
    "same": "Noted — steady.",
    "worse": "Noted — let's look at it together below."
  },
  "feel": [
    {
      "body": "<b>Your first period may be loud.</b> Earlier, heavier, or crampier than your old normal is common for the first one or two cycles — it usually settles after that, and lighter is what we're watching for.",
      "note": "Carrie, PA-C — \"The first period scares more women than day one does. It's expected. The second one is the tell.\""
    },
    {
      "body": "<b>Around weeks 4–12, a small number of women pass fibroid tissue.</b> It looks alarming and usually isn't — but it's always worth a call the same day, just to check it's complete."
    }
  ],
  "turn": "your cycle page",
  "back": "everything ✓ — all restrictions cleared on day 14",
  "notYet": null,
  "meds": null,
  "ahead": [
    {
      "k": "CYCLE 1",
      "v": "One check-in when your period ends — your scoreboard starts"
    },
    {
      "k": "~MAY",
      "v": "3-month MRI — the picture that confirms the shrinking"
    }
  ],
  "next": {
    "label": "Cycle 1 check-in",
    "sub": "when your period ends",
    "tone": "pine",
    "sheet": "cycle"
  },
  "cycle": {
    "title": "Your first period since UFE — how did it compare?",
    "options": [
      "Lighter",
      "Same",
      "Heavier"
    ],
    "footnote": "Heavier for the first one or two cycles is common. This answer goes on your cycle page — the record Carrie reads before your follow-up."
  },
  "interpreters": {
    "First period — heavier": {
      "tag": "EXPECTED · CYCLES 1–2",
      "head": "A heavier first period doesn't mean it failed.",
      "body": "The uterus is still inflamed and healing. Most women see the turn by the second or third cycle — that's the number that matters.",
      "threshold": "Call if you're soaking <b>a pad an hour</b>, or pain returns at full strength."
    },
    "Discharge still here": {
      "tag": "EXPECTED FOR WEEKS",
      "head": "Weeks of discharge is still inside the window.",
      "body": "Some women see it for a couple of months as the fibroid breaks down.",
      "threshold": "Foul smell, fever, or a sudden surge — <b>call</b>. Otherwise it's healing, slowly."
    },
    "Passed some tissue": {
      "tag": "CALL TODAY — USUALLY FINE",
      "head": "Tissue passing is documented and usually completes on its own.",
      "body": "It happens to fewer than 1 in 10 women, mostly weeks 4–12. The reason to call isn't danger — it's making sure it passed completely.",
      "threshold": "<b>Call Carrie today</b> either way. Go urgently if there's fever, foul discharge, or severe pain with it."
    }
  }
};
