import { avcUfe, getDay, listDays } from '../index';
import { ProcedureContentSchema } from '../schema';

describe('AVC/UFE content instance', () => {
  it('parses against the schema — the CI-enforced selfCheckDays', () => {
    expect(() => ProcedureContentSchema.parse(avcUfe)).not.toThrow();
  });
  it('the exported instance is schema-valid (parsed at load, not just under Jest)', () => {
    // index.ts now runs ProcedureContentSchema.parse at module load, so a bad
    // instance would have thrown at import and failed this whole suite. The five
    // parsed day keys prove the parse ran and produced a typed result.
    expect(Object.keys(avcUfe.days)).toHaveLength(5);
  });
  it('the parse gate rejects incomplete content — a chip with no interpreter throws', () => {
    const good = getDay(avcUfe, 5);
    // A day whose chip list references a symptom that has no matching interpreter
    // is exactly what the load-time parse must reject.
    const broken = {
      meta: avcUfe.meta,
      days: { 5: { ...good, chips: [...good.chips, 'a symptom with no interpreter'] } }
    };
    expect(() => ProcedureContentSchema.parse(broken)).toThrow();
  });
  it('exposes exactly the five prototype days', () => {
    expect(listDays(avcUfe)).toEqual([1, 3, 5, 10, 20]);
  });
  it('keeps day-specific shape: day 1 no back, day 20 no meds or notYet', () => {
    expect(getDay(avcUfe, 1).back).toBeNull();
    expect(getDay(avcUfe, 20).meds).toBeNull();
    expect(getDay(avcUfe, 20).notYet).toBeNull();
    expect(getDay(avcUfe, 20).next.sheet).toBe('cycle');
  });
  it('decoded HTML entities into literal characters', () => {
    expect(getDay(avcUfe, 3).notYet).toContain('lifting >10 lb');
    expect(getDay(avcUfe, 10).cancant!.notYet[0][0]).toContain('&');  // "Baths, pools & hot tubs"
  });
});
