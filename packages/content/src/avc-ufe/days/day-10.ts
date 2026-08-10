import type { DayContent } from '../../schema';

export const day10: DayContent = {
  "eyebrow": "DAY 10 · MORNING CHECK-IN",
  "heroFull": "The medicine schedule is behind you — <em>lingering tiredness isn't. Both are normal at day ten.</em>",
  "heroShort": "The medicine schedule is behind you<em>…</em>",
  "chips": [
    "Nothing new",
    "Still exhausted",
    "Brown discharge",
    "Cramping twinges",
    "Something else…"
  ],
  "ack": {
    "better": "Noted — the curve is bending your way.",
    "same": "Noted — steady is normal here.",
    "worse": "Noted — a dip at day 10 happens."
  },
  "feel": [
    {
      "body": "<b>Energy comes back slower than pain leaves.</b> Most women are at work this week and tired by mid-afternoon. That's the typical shape, not a setback.",
      "note": "Carrie, PA-C — \"Day 10 tired with day 2 memories — that's the week 2 special.\""
    },
    {
      "body": "<b>Discharge can continue for weeks.</b> Brownish and watery is the fibroid breaking down. The line is still smell, not duration."
    }
  ],
  "turn": "going back to work",
  "back": "driving ✓ · showers ✓ · normal meals ✓ · lifting ✓ · exercise ✓",
  "notYet": "baths & pools <b>4d</b> · tampons <b>4d</b>",
  "meds": {
    "k": "TODAY",
    "line": "As needed only — ibuprofen if cramps flare",
    "sheet": "medrail"
  },
  "ahead": [
    {
      "k": "FEB 26",
      "v": "Telehealth with Carrie, PA-C — in 4 days",
      "details": true
    },
    {
      "k": "DAY 14",
      "v": "Baths, pools, and tampons all clear"
    }
  ],
  "next": {
    "label": "Baths & pools clear",
    "sub": "in 4 days · Feb 26",
    "tone": "pine",
    "sheet": "cancant"
  },
  "cancant": {
    "title": "What you can do — and not yet",
    "back": "driving ✓ · showers ✓ · normal meals ✓ · lifting ✓ · exercise ✓",
    "notYet": [
      [
        "Baths, pools & hot tubs",
        "4 days — Feb 26"
      ],
      [
        "Tampons (pads until then)",
        "4 days — Feb 26"
      ]
    ],
    "footnote": "Cleared dates come from your clinic's discharge instructions."
  },
  "medrail": {
    "title": "Your medicines · day 10",
    "groups": [
      {
        "label": "NOTHING SCHEDULED",
        "rows": [
          [
            "—",
            "The daily schedule ended on day 7",
            "done with it ✓"
          ]
        ],
        "done": true
      },
      {
        "label": "IF YOU NEED THEM",
        "rows": [
          [
            "PRN",
            "Ibuprofen 400–800|if cramps flare, with food",
            "available"
          ],
          [
            "PRN",
            "Tylenol 500–1000|if you'd rather not take ibuprofen",
            "available"
          ]
        ]
      }
    ],
    "meter": [
      0,
      4000,
      "TYLENOL TODAY"
    ],
    "quiet": "No schedule is watching you anymore. Take something only if you need it.",
    "paired": null
  },
  "interpreters": {
    "Still exhausted": {
      "tag": "EXPECTED AT DAY 10",
      "head": "Fatigue outlasts everything else.",
      "body": "One to two weeks of real tiredness is the documented norm, longer if you arrived anemic.",
      "threshold": "Worth raising at Thursday's telehealth. Call sooner if it's <b>getting worse, not better</b>."
    },
    "Brown discharge": {
      "tag": "EXPECTED FOR WEEKS",
      "head": "This is the fibroid breaking down, not a wound.",
      "body": "Watery, brownish discharge can continue for several weeks — some women see it for a couple of months.",
      "threshold": "Foul smell or a sudden increase with fever — <b>that's a call</b>. Color and duration alone are not."
    },
    "Cramping twinges": {
      "tag": "EXPECTED AT DAY 10",
      "head": "Echo cramps come and go for weeks.",
      "body": "Brief twinges, especially when tired, are part of the shrinking process.",
      "threshold": "Call if cramping returns at <b>full day-1 strength</b> or with fever."
    }
  }
};
