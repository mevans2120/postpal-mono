import { CopyString, MetaSchema } from './schema';

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
