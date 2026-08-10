import { createDaybookStore } from './store';

const CHIPS_D1 = ['Nothing new', 'Cramping is intense', 'Fever or chills', 'Nausea', 'Something else…'];

describe('daybook store', () => {
  it('starts a fresh check-in on day 5', () => {
    const s = createDaybookStore(5).getState();
    expect(s).toMatchObject({ day: 5, phase: 'checkin', face: null, note: null, sheet: null });
  });
  it('selectFace advances checkin → noted', () => {
    const store = createDaybookStore(1);
    store.getState().selectFace(2);
    expect(store.getState()).toMatchObject({ face: 2, phase: 'noted' });
  });
  it('"Nothing new" records the note and lands on the page', () => {
    const store = createDaybookStore(1);
    store.getState().selectFace(0);
    store.getState().chooseChip('Nothing new');
    expect(store.getState()).toMatchObject({ note: 'nothing new', phase: 'page', sheet: null });
  });
  it('a symptom chip opens the interpreter BEFORE recording anything', () => {
    const store = createDaybookStore(1);
    store.getState().selectFace(3);
    store.getState().chooseChip('Fever or chills');
    expect(store.getState().phase).toBe('noted');           // not advanced yet
    expect(store.getState().note).toBeNull();
    expect(store.getState().sheet).toEqual({ kind: 'interpreter', payload: { key: 'Fever or chills', origin: 'chips' } });
  });
  it('resolving a chip-opened interpreter records the note lowercased and advances', () => {
    const store = createDaybookStore(1);
    store.getState().selectFace(3);
    store.getState().chooseChip('Fever or chills');
    store.getState().resolveInterpreter();
    expect(store.getState()).toMatchObject({ note: 'fever or chills', phase: 'page', sheet: null });
  });
  it('a feel-opened interpreter resolves without recording', () => {
    const store = createDaybookStore(1);
    store.getState().openSheet('interpreter', { key: 'Nausea', origin: 'feel' });
    store.getState().resolveInterpreter();
    expect(store.getState().note).toBeNull();
    expect(store.getState().sheet).toBeNull();
  });
  it('escalate swaps the open interpreter in place', () => {
    const store = createDaybookStore(1);
    store.getState().openSheet('interpreter', { key: 'Nausea', origin: 'feel' });
    store.getState().escalateInterpreter();
    expect(store.getState().sheet!.payload).toMatchObject({ key: 'Nausea', escalated: true });
  });
  it('"Something else…" opens the inline input; submitNote records free text', () => {
    const store = createDaybookStore(1);
    store.getState().selectFace(1);
    store.getState().chooseChip('Something else…');
    expect(store.getState().noteInputOpen).toBe(true);
    store.getState().submitNote('left hip aches');
    expect(store.getState()).toMatchObject({ note: 'left hip aches', phase: 'page', noteInputOpen: false });
  });
  it('switchDay resets to a fresh check-in and closes any sheet', () => {
    const store = createDaybookStore(1);
    store.getState().selectFace(0);
    store.getState().openSheet('medrail', null);
    store.getState().switchDay(10);
    expect(store.getState()).toMatchObject({ day: 10, phase: 'checkin', face: null, note: null, sheet: null });
  });
  it('logDose counts per day and survives nothing else', () => {
    const store = createDaybookStore(1);
    store.getState().logDose();
    store.getState().logDose();
    expect(store.getState().logged[1]).toBe(2);
    store.getState().switchDay(3);
    expect(store.getState().logged[3] ?? 0).toBe(0);   // per-day counts, day switch doesn't clear (session-scope)
  });
  it('receipt taps reopen earlier phases with state preserved', () => {
    const store = createDaybookStore(1);
    store.getState().selectFace(4);
    store.getState().chooseChip('Nothing new');
    store.getState().reopenCheckin();
    expect(store.getState()).toMatchObject({ phase: 'checkin', face: 4 });   // preselected (line 895)
    store.getState().selectFace(4);
    store.getState().reopenNoted();
    expect(store.getState().phase).toBe('noted');
  });
});
