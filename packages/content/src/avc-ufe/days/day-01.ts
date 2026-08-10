import type { DayContent } from '../../schema';

export const day01: DayContent = {
  "eyebrow": "DAY 1 · MORNING CHECK-IN",
  "heroFull": "Today is usually the hardest day — <em>intense cramping means it's working, and it eases from here.</em>",
  "heroShort": "Today is usually the hardest day<em>…</em>",
  "chips": [
    "Nothing new",
    "Cramping is intense",
    "Fever or chills",
    "Nausea",
    "Something else…"
  ],
  "ack": {
    "better": "Noted — a steadier start than most.",
    "same": "Noted — holding steady.",
    "worse": "Noted — a hard morning. That's day 1."
  },
  "feel": [
    {
      "body": "<b>Cramping in waves, like a strong period or early labor.</b> This is the embolization working. Your medicines are scheduled to stay ahead of it — the heating pad helps more than you'd think.",
      "note": "Carrie, PA-C — \"Day 1 is the day the schedule matters most. Let it carry you.\""
    },
    {
      "body": "<b>Keep checking the puncture site.</b> A small bruise is normal. Firm pressure for 15 minutes if it oozes, then call us."
    }
  ],
  "turn": "your first night",
  "back": null,
  "notYet": "driving <b>24h</b> · alcohol <b>24h</b> · an adult stays with you <b>today</b>",
  "meds": {
    "k": "SO FAR",
    "line": "2 of 7 doses taken · next: ibuprofen 800 at 1:00",
    "sheet": "medrail"
  },
  "ahead": [
    {
      "k": "TOMORROW",
      "v": "Dressing comes off — and your first shower"
    },
    {
      "k": "FEB 26",
      "v": "Telehealth with Carrie, PA-C (day 14)",
      "details": true
    }
  ],
  "next": {
    "label": "Ibuprofen 800",
    "sub": "in 40 min",
    "tone": "clay",
    "sheet": "medrail"
  },
  "medrail": {
    "title": "Your medicines · day 1",
    "groups": [
      {
        "label": "THIS MORNING",
        "rows": [
          [
            "8:00",
            "Cyclobenzaprine 10",
            "taken 8:10 ✓"
          ],
          [
            "8:00",
            "Ibuprofen 800",
            "taken 8:10 ✓"
          ]
        ],
        "done": true
      },
      {
        "label": "NEXT · IN 40 MIN",
        "rows": [
          [
            "1:00",
            "Ibuprofen 800|take with food",
            "LOG"
          ]
        ],
        "now": true
      },
      {
        "label": "LATER TODAY",
        "rows": [
          [
            "6:00",
            "Ibuprofen 800",
            ""
          ],
          [
            "9:00",
            "Cyclobenzaprine 10 + stool softener",
            ""
          ]
        ]
      },
      {
        "label": "IF YOU NEED MORE",
        "rows": [
          [
            "PRN",
            "Hydromorphone 1–2|for breakthrough pain",
            "ok again now"
          ],
          [
            "PRN",
            "Zofran|for nausea",
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
    "quiet": "After the 9:00 doses, nothing until morning. Rest.",
    "paired": "Tasha is paired and can log doses for you."
  },
  "interpreters": {
    "Cramping is intense": {
      "tag": "EXPECTED ON DAY 1",
      "head": "Strong, wave-like cramping is the procedure working.",
      "body": "Most women describe day 1 as the hardest — cramping like a very strong period, sometimes worse. It fades over the next two to three days.",
      "threshold": "Your clinic's line: call if pain is <b>not controlled by your scheduled medicines</b> — that's what the PRN dose is for, and what Carrie wants to hear about."
    },
    "Fever or chills": {
      "tag": "EXPECTED ON DAY 1",
      "head": "A low fever tonight is your body responding.",
      "body": "Up to about 101°F with flu-like aches is common in the first three days.",
      "threshold": "Call if it reaches <b>101°F</b>, or comes with foul-smelling discharge."
    },
    "Nausea": {
      "tag": "EXPECTED ON DAY 1",
      "head": "Nausea is usually the medicines, not a problem.",
      "body": "The pain medicines cause it. Zofran is on your PRN list for exactly this. Small bland meals help.",
      "threshold": "Call if you <b>can't keep fluids down</b> — that one matters."
    }
  }
};
