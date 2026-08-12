import { ProcedureContentSchema } from '../schema';

/**
 * Demo receipt for PoC success criterion 1 — "a second procedure is a content
 * file, not a code change." This is a SECOND ProcedureContent instance (prostate
 * artery embolization, the male analog the strategy doc names) authored purely as
 * data. It renders under the exact same <Daybook> with ZERO changes to @postpal/ui
 * — see packages/ui/src/daybook/demo-pae.rn.test.tsx.
 *
 * Placeholder clinical copy — one day only, enough to exercise every chapter and
 * a sheet. Parsed at load (same gate as avc-ufe): incomplete content throws on
 * import, failing the test run / app bundle — not just a soft assertion.
 */
export const demoPae = ProcedureContentSchema.parse({
  meta: {
    id: 'demo-pae',
    clinic: 'Demo Interventional Radiology',
    procedure: 'Prostate artery embolization (PAE)',
    contactName: 'Sam, RN',
    selfCareDefault:
      "If that's not you yet, it usually just needs a little more time. Try what's on today's page, and check back in an hour.",
    emergencyLine: 'Sudden severe pain, heavy bleeding, or trouble breathing? <b>Call 911.</b>'
  },
  days: {
    1: {
      eyebrow: 'DAY 1 · MORNING CHECK-IN',
      heroFull:
        "Today is usually the tender day — <em>pelvic aching and a strong urge to pee mean it's working, and it settles from here.</em>",
      heroShort: 'Today is usually the tender day<em>…</em>',
      chips: ['Nothing new', 'Burning when you pee', 'Blood in the urine', 'Something else…'],
      ack: {
        better: 'Noted — a steadier start than most.',
        same: 'Noted — holding steady.',
        worse: 'Noted — a tender morning. That day 1 can be.'
      },
      feel: [
        {
          body: "<b>Pelvic pressure and frequent urges are the embolization working.</b> The prostate is swelling before it shrinks — that's expected in the first days.",
          note: 'Sam, RN — "Day 1 pressure scares more men than it should. It eases."'
        },
        {
          body: '<b>A little blood in the urine is common early on.</b> Pink or tea-colored, coming and going, is part of healing.'
        }
      ],
      turn: 'your catheter, if you went home with one',
      back: 'light walking ✓ · normal fluids ✓',
      notYet: 'heavy lifting <b>1 week</b> · long drives <b>48h</b>',
      meds: null,
      ahead: [
        { k: 'TOMORROW', v: 'The pressure usually starts easing' },
        { k: 'DAY 14', v: 'Follow-up call with Sam, RN', details: true }
      ],
      next: {
        label: 'Lifting clears',
        sub: 'in 1 week',
        tone: 'pine',
        sheet: 'cancant'
      },
      cancant: {
        title: 'What you can do — and not yet',
        back: 'light walking ✓ · normal fluids ✓',
        notYet: [
          ['Heavy lifting (>10 lb)', '1 week'],
          ['Long drives', '48 hours']
        ],
        footnote: "Cleared dates come from your clinic's discharge instructions."
      },
      interpreters: {
        'Burning when you pee': {
          tag: 'EXPECTED ON DAY 1',
          head: 'A burning sting is the catheter and swelling, not usually infection.',
          body: 'It is common in the first few days as the prostate settles. Fluids help flush it.',
          threshold:
            "Call if you can't pass urine at all, or there's <b>fever with the burning</b> — that one matters."
        },
        'Blood in the urine': {
          tag: 'EXPECTED FOR DAYS',
          head: 'Pink or tea-colored urine is part of early healing.',
          body: 'It comes and goes for several days as the prostate breaks down.',
          threshold:
            'Call for <b>bright red urine with clots</b>, or if you cannot pass urine.'
        }
      }
    }
  }
});
