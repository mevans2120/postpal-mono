import { ProcedureContentSchema } from '../schema';
import { day01 } from './days/day-01';
import { day03 } from './days/day-03';
import { day05 } from './days/day-05';
import { day10 } from './days/day-10';
import { day20 } from './days/day-20';

// Parsed at module load, not just under Jest: importing @postpal/content (which
// apps/app and the test suite both do) throws if the content violates the
// schema's cross-reference refinements. Incomplete content = hard import failure
// (the app bundle / CI test run fails on load), not a soft runtime check.
export const avcUfe = ProcedureContentSchema.parse({
  meta: {
    id: 'avc-ufe',
    clinic: 'Advanced Vascular Centers',
    procedure: 'Uterine fibroid embolization (UFE)',
    contactName: 'Carrie, PA-C',
    // moved from ui constants (prototype lines 726–727) — clinical copy is content
    selfCareDefault: "If that's not you yet, it usually just needs a little more time. Try what's on today's page, and check back in an hour.",
    emergencyLine: 'Sudden severe pain, heavy bleeding, or trouble breathing? <b>Call 911.</b>'
  },
  days: { 1: day01, 3: day03, 5: day05, 10: day10, 20: day20 }
});
