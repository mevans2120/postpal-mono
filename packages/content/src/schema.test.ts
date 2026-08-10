import {
  CopyString, MetaSchema,
  InterpreterSchema, MedRailSchema, CanCantSchema, CycleSchema, NextSchema
} from './schema';

describe('CopyString', () => {
  it('accepts plain text and em/b markup', () => {
    expect(CopyString.parse('Cramping in waves')).toBe('Cramping in waves');
    expect(CopyString.parse('call if it reaches <b>101°F</b>')).toContain('<b>');
    expect(CopyString.parse('eases <em>from here</em>')).toContain('<em>');
  });
  it('rejects any other tag', () => {
    expect(() => CopyString.parse('<script>alert(1)</script>')).toThrow();
    expect(() => CopyString.parse('a <span>styled</span> word')).toThrow();
    expect(() => CopyString.parse('line<br>break')).toThrow();
  });
});

describe('MetaSchema', () => {
  it('requires clinic identity and the shared clinical lines', () => {
    expect(() => MetaSchema.parse({ id: 'avc-ufe', clinic: 'AVC' })).toThrow();
    expect(MetaSchema.parse({
      id: 'avc-ufe',
      clinic: 'Advanced Vascular Centers',
      procedure: 'Uterine fibroid embolization (UFE)',
      contactName: 'Carrie, PA-C',
      selfCareDefault: 'Try what is on today’s page.',
      emergencyLine: 'Sudden severe pain? <b>Call 911.</b>'
    }).contactName).toBe('Carrie, PA-C');
  });
});

describe('leaf schemas', () => {
  it('parses a prototype-shaped interpreter, care optional', () => {
    const parsed = InterpreterSchema.parse({
      tag: 'EXPECTED ON DAY 1',
      head: 'Strong, wave-like cramping is the procedure working.',
      body: 'Most women describe day 1 as the hardest.',
      threshold: 'call if pain is <b>not controlled by your scheduled medicines</b>'
    });
    expect(parsed.care).toBeUndefined();
  });

  it('parses a med rail with 3-tuple rows and meter', () => {
    const rail = MedRailSchema.parse({
      title: 'Your medicines · day 1',
      groups: [
        { label: 'THIS MORNING', rows: [['8:00', 'Ibuprofen 800', 'taken 8:10 ✓']], done: true },
        { label: 'NEXT · IN 40 MIN', rows: [['1:00', 'Ibuprofen 800|take with food', 'LOG']], now: true }
      ],
      meter: [0, 4000, 'TYLENOL TODAY'],
      quiet: 'After the 9:00 doses, nothing until morning. Rest.',
      paired: 'Tasha is paired and can log doses for you.'
    });
    expect(rail.groups[1].now).toBe(true);
  });

  it('constrains next.tone and next.sheet to enums', () => {
    expect(() => NextSchema.parse({ label: 'x', sub: 'y', tone: 'mauve', sheet: 'medrail' })).toThrow();
    expect(() => NextSchema.parse({ label: 'x', sub: 'y', tone: 'pine', sheet: 'popover' })).toThrow();
    expect(NextSchema.parse({ label: 'Cycle 1 check-in', sub: 'when your period ends', tone: 'pine', sheet: 'cycle' }).sheet).toBe('cycle');
  });

  it('parses cancant and cycle sheets', () => {
    expect(CanCantSchema.parse({
      title: 'What you can do — and not yet',
      back: 'driving ✓',
      notYet: [['Baths, pools & hot tubs', '4 days — Feb 26']],
      footnote: 'Cleared dates come from your clinic’s discharge instructions.'
    }).notYet).toHaveLength(1);
    expect(CycleSchema.parse({
      title: 'Your first period since UFE — how did it compare?',
      options: ['Lighter', 'Same', 'Heavier'],
      footnote: 'Heavier for the first one or two cycles is common.'
    }).options).toHaveLength(3);
  });
});
