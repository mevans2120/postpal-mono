import type { DayContent } from '../../schema';

export const day05: DayContent = {
  "eyebrow": "DAY 5 · MORNING CHECK-IN",
  "heroFull": "The fog usually starts lifting around now — <em>though plenty of recoveries take until week two. Both are normal.</em>",
  "heroShort": "The fog usually starts lifting around now<em>…</em>",
  "chips": [
    "Nothing new",
    "Warm / feverish",
    "Cramping more",
    "Discharge changed",
    "Something else…"
  ],
  "ack": {
    "better": "Noted — a better day than yesterday.",
    "same": "Noted — about the same.",
    "worse": "Noted — a slower morning. Day 5 has them too."
  },
  "feel": [
    {
      "body": "<b>Still reaching for the strong medication?</b> Many women are stepping down to ibuprofen now; needing it into week two is also within the band. Rising pain — not lingering pain — is the thing to call about.",
      "note": "Carrie, PA-C — \"Day 5 tired is honest tired.\""
    },
    {
      "body": "<b>Discharge may be starting.</b> Watery, brownish, sometimes for weeks — it's the fibroid breaking down, not a wound. Foul smell is the line: that's a call."
    }
  ],
  "turn": "your appetite",
  "back": "driving ✓ · showers ✓ · normal meals ✓",
  "notYet": "lifting >10 lb <b>2d</b> · baths & pools <b>9d</b> · tampons <b>9d</b>",
  "meds": {
    "k": "SO FAR",
    "line": "3 of 6 doses taken · next: ibuprofen 800 at 1:00",
    "sheet": "medrail"
  },
  "ahead": [
    {
      "k": "TOMORROW",
      "v": "Stepping down the medications — day 6's page"
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
    "title": "Your medicines · day 5",
    "groups": [
      {
        "label": "THIS MORNING",
        "rows": [
          [
            "8:00",
            "Cyclobenzaprine 10",
            "taken 8:05 ✓"
          ],
          [
            "8:00",
            "Ibuprofen 800",
            "taken 8:05 ✓"
          ],
          [
            "8:00",
            "Metformin",
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
      2000,
      4000,
      "TYLENOL TODAY"
    ],
    "quiet": "After the 9:00 doses, nothing until morning. Rest.",
    "paired": "Tasha is paired and can log doses for you."
  },
  "interpreters": {
    "Warm / feverish": {
      "tag": "WORTH CHECKING AT DAY 5",
      "head": "The fever window usually closes around day 3.",
      "body": "A low fever is expected in the first three days — by day 5 it should be gone. Feeling warm now isn't an emergency, but it's outside the usual pattern, and that's exactly what Carrie wants to hear about.",
      "threshold": "Call if it reaches <b>101°F</b> — and at day 5, <b>any fever</b> is worth a call today."
    },
    "Cramping more": {
      "tag": "WORTH A CLOSER LOOK",
      "head": "Cramping should be fading by now — rising is the signal.",
      "body": "Lingering cramps are normal well past this point. Cramping that's climbing at day 5 is the pattern Carrie wants to hear about, even when it turns out to be nothing.",
      "threshold": "Rising pain — <b>not lingering pain</b> — is the thing to call about. Call today."
    },
    "Discharge changed": {
      "tag": "EXPECTED FOR WEEKS",
      "head": "Discharge starting now is the fibroid breaking down, not a wound.",
      "body": "Watery, brownish discharge often begins around now and can continue for several weeks — some women see it for a couple of months.",
      "threshold": "Foul smell is the line — <b>that's a call</b>. Color and duration alone are not."
    }
  }
};
