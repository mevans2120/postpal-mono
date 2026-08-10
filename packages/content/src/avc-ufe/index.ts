import type { ProcedureContent } from '../schema';
import { day01 } from './days/day-01';
import { day03 } from './days/day-03';
import { day05 } from './days/day-05';
import { day10 } from './days/day-10';
import { day20 } from './days/day-20';

export const avcUfe: ProcedureContent = {
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
};
