import { deriveDayView } from './derive';
import { avcUfe, getDay } from '@postpal/content';

describe('deriveDayView', () => {
  const day1 = () => getDay(avcUfe, 1);

  it('with 0 logged, returns content verbatim', () => {
    const v = deriveDayView(day1(), 0);
    expect(v.next).toEqual(day1().next);
    expect(v.medrail).toEqual(day1().medrail);
    expect(v.medsLine).toBe(day1().meds!.line);
  });

  it('logging the 1:00 dose promotes the 6:00 dose (prototype task-7 loop)', () => {
    const v = deriveDayView(day1(), 1);
    const done = v.medrail!.groups.find((g) => g.done)!;
    expect(done.label).toBe('EARLIER TODAY');
    expect(done.rows.some(([, name, status]) => name === 'Ibuprofen 800' && status === 'taken just now ✓')).toBe(true);
    const now = v.medrail!.groups.find((g) => g.now)!;
    expect(now.rows[0][0]).toBe('6:00');
    expect(v.next.label).toBe('Ibuprofen 800');
    expect(v.next.sub).toBe('6:00 · later today');
    expect(v.medsLine).toMatch(/^3 of 7 doses taken · next: ibuprofen 800 at 6:00/);
  });

  it('logging 2 doses promotes the 9:00 dose but is not yet terminal', () => {
    const v = deriveDayView(day1(), 2);
    const now = v.medrail!.groups.find((g) => g.now)!;
    expect(now.rows[0][0]).toBe('9:00');
    expect(v.next.label).toBe('Cyclobenzaprine 10 + stool softener');
    expect(v.next.tone).toBe('clay');
    expect(v.medsLine).toMatch(/^4 of 7 doses taken/);
  });

  it('logging past the schedule flips Next to the pine terminal state', () => {
    const v = deriveDayView(day1(), 3);        // 1:00, 6:00, 9:00 all logged
    expect(v.next).toMatchObject({ label: 'Medicines done', sub: 'nothing more until morning', tone: 'pine' });
    expect(v.medsLine).toBe('All scheduled doses taken today');
  });

  it('days without scheduled doses pass through (day 10 PRN-only, day 20 no meds)', () => {
    expect(deriveDayView(getDay(avcUfe, 10), 0).medsLine).toBe(getDay(avcUfe, 10).meds!.line);
    expect(deriveDayView(getDay(avcUfe, 20), 0).medrail).toBeUndefined();
  });
});
