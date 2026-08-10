import {
  CopyString, MetaSchema,
  InterpreterSchema, MedRailSchema, CanCantSchema, CycleSchema, NextSchema,
  DayContentSchema
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

// Typed as `any` deliberately: tests mutate the fixture into invalid shapes
// (delete required keys, assign wrong sheet kinds) to exercise the cross-checks,
// which a DayContent type would reject at compile time.
function validDay(): any {
  return {
    eyebrow: 'DAY 1 · MORNING CHECK-IN',
    heroFull: 'Cramping in waves is expected today.',
    heroShort: 'Cramping is expected.',
    chips: ['Nothing new', 'Fever or chills', 'Something else…'],
    ack: { better: 'Good.', same: 'Steady.', worse: 'Noted.' },
    feel: [{ body: 'Most women feel wiped out today.' }],
    turn: 'eating & energy',
    back: null,
    notYet: 'driving <b>24h</b>',
    meds: null,
    ahead: [{ k: 'TONIGHT', v: 'cramping eases' }],
    next: { label: 'Next dose', sub: 'in 40 min', tone: 'clay', sheet: 'medrail' },
    medrail: {
      title: 'Your medicines · day 1',
      groups: [
        { label: 'NEXT · IN 40 MIN', rows: [['1:00', 'Ibuprofen 800', 'LOG']], now: true }
      ],
      meter: [0, 4000, 'TYLENOL TODAY'],
      quiet: 'After the 9:00 doses, nothing until morning.',
      paired: null
    },
    interpreters: {
      'Fever or chills': {
        tag: 'CHECK TODAY',
        head: 'A low fever can be part of recovery.',
        body: 'Post-embolization syndrome often brings one.',
        threshold: 'call if it reaches <b>101°F</b>'
      }
    }
  };
}

describe('DayContentSchema cross-checks', () => {
  it('accepts a complete day', () => {
    expect(() => DayContentSchema.parse(validDay())).not.toThrow();
  });
  it('rejects a symptom chip with no interpreter', () => {
    const day = validDay();
    day.chips.push('Nausea');                          // no matching interpreter
    expect(() => DayContentSchema.parse(day)).toThrow(/interpreter/);
  });
  it('rejects next.sheet pointing at a missing sheet object', () => {
    const day = validDay();
    delete day.medrail;                                // next.sheet === 'medrail'
    expect(() => DayContentSchema.parse(day)).toThrow(/next\.sheet/);
  });
  it('rejects meds.sheet pointing at a missing sheet object', () => {
    const day = validDay();
    day.meds = { k: 'SO FAR', line: 'x', sheet: 'cycle' };  // no cycle object
    expect(() => DayContentSchema.parse(day)).toThrow(/meds\.sheet/);
  });
  it('rejects back and notYet both null', () => {
    const day = validDay();
    day.back = null; day.notYet = null;
    expect(() => DayContentSchema.parse(day)).toThrow(/back.*notYet|notYet.*back/);
  });
});
