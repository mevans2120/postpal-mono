export * from './schema';
export { avcUfe } from './avc-ufe';
export { demoPae } from './demo-pae';
import type { ProcedureContent, DayContent } from './schema';

export function listDays(content: ProcedureContent): number[] {
  return Object.keys(content.days).map(Number).sort((a, b) => a - b);
}
export function getDay(content: ProcedureContent, day: number): DayContent {
  const d = content.days[day];
  if (!d) throw new Error(`no content for day ${day}`);
  return d;
}
