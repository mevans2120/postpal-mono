import type { DayContent } from '../../schema';

export const day03: DayContent = {
  "eyebrow": "DAY 3 · MORNING CHECK-IN",
  "heroFull": "The fever and flu-like feeling usually break around now — <em>cramping fades with them. If yours hasn't yet, you're not behind.</em>",
  "heroShort": "The fever usually breaks around now<em>…</em>",
  "chips": [
    "Nothing new",
    "Still feverish",
    "Cramping more",
    "Tired all day",
    "Something else…"
  ],
  "ack": {
    "better": "Noted — a better day than yesterday.",
    "same": "Noted — about the same.",
    "worse": "Noted — a rough patch. Day 3 can be one."
  },
  "feel": [
    {
      "body": "<b>The flu-like feeling has a name.</b> Post-embolization syndrome: low fever, aches, fatigue. It peaks around now and then lets go.",
      "note": "Carrie, PA-C — \"Day 3 is when most of my calls come. Almost all of them are this.\""
    },
    {
      "body": "<b>Hot and cold flashes at night</b> are part of the same response — not an infection by themselves."
    }
  ],
  "turn": "eating & energy",
  "back": "driving ✓ · showers ✓ · normal meals ✓",
  "notYet": "lifting >10 lb <b>4d</b> · baths & pools <b>11d</b> · tampons <b>11d</b>",
  "meds": {
    "k": "SO FAR",
    "line": "3 of 6 doses taken · next: ibuprofen 800 at 1:00",
    "sheet": "medrail"
  },
  "ahead": [
    {
      "k": "DAY 5",
      "v": "The medicine schedule starts stepping down"
    },
    {
      "k": "FEB 26",
      "v": "Telehealth with Carrie, PA-C (day 14)",
      "details": true
    }
  ],
  "next": {
    "label": "Ibuprofen 800",
    "sub": "in 3 h",
    "tone": "clay",
    "sheet": "medrail"
  },
  "medrail": {
    "title": "Your medicines · day 3",
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
          ],
          [
            "8:00",
            "Metformin — back on schedule",
            "taken ✓"
          ]
        ],
        "done": true
      },
      {
        "label": "NEXT · IN 3 H",
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
    "Still feverish": {
      "tag": "EXPECTED THROUGH DAY 3",
      "head": "A low fever today is still within the window.",
      "body": "Day 3 is typically the last day of the fever. It should start fading from here.",
      "threshold": "Call if it reaches <b>101°F</b>, or if any fever is <b>still here tomorrow</b> — that's the line your clinic watches."
    },
    "Cramping more": {
      "tag": "WORTH A CLOSER LOOK",
      "head": "Cramping should be fading by now — rising is the signal.",
      "body": "Lingering cramps are normal. Cramping that's climbing after day 2–3 is the pattern Carrie wants to hear about, even when it turns out to be nothing.",
      "threshold": "Rising pain — <b>not lingering pain</b> — is the thing to call about. Call today."
    },
    "Tired all day": {
      "tag": "EXPECTED ON DAY 3",
      "head": "Fatigue peaks this week.",
      "body": "If you came into this anemic, it runs longer — that's the iron, not a setback.",
      "threshold": "Mention it at your day-14 telehealth; call sooner if you're <b>too dizzy to stand</b>."
    }
  }
};
