import { fireEvent, screen } from '@testing-library/react-native';
import { avcUfe, getDay, SOMETHING_ELSE } from '@postpal/content';
import { renderWithStore } from '../test-utils';
import { SheetBody } from './SheetBody';

/**
 * Journey tests render <SheetBody content={avcUfe} /> directly, driving
 * store.openSheet/etc via the renderWithStore proxy and store actions wired
 * inside the bodies via fireEvent — NOT <SheetHost>. @gorhom/bottom-sheet's
 * BottomSheetModal renders through a portal that needs a
 * BottomSheetModalProvider (added in Task 8's apps/app root), which is
 * impractical to stand up here; SheetBody is the exact same tree SheetHost
 * mounts inside the real sheet, so every assertion below (store transitions
 * + rendered content) holds either way. SheetHost's present/dismiss wrapping
 * itself is verified at runtime in Task 8.
 */
describe('sheet system', () => {
  it('day 5: med rail — "Log it" strikes the NOW dose and the rail re-derives', () => {
    const store = renderWithStore(5, <SheetBody content={avcUfe} />);
    store.getState().openSheet('medrail');

    expect(screen.getByText('Your medicines · day 5')).toBeTruthy();
    expect(screen.getByText('NEXT · IN 3 H')).toBeTruthy();
    // the sub-label under the NOW row's name — unique to that row, since the
    // same medicine name ("Ibuprofen 800") also appears, undecorated, in the
    // earlier-today and later-today rows.
    expect(screen.getByText('take with food')).toBeTruthy();
    expect(screen.getByLabelText('Log it')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Log it'));

    expect(store.getState().logged[5]).toBe(1);
    // observable re-derivation: the NOW dose is struck into "earlier today"
    // and the next scheduled dose is promoted — the same derivation the Next
    // slot reads, so they always agree.
    expect(screen.getByText('taken just now ✓')).toBeTruthy();
    expect(screen.getByText('NEXT · LATER TODAY')).toBeTruthy();
  });

  it('day 5: interpreter answers first — "Yes, that helps" records the note and advances', () => {
    const store = renderWithStore(5, <SheetBody content={avcUfe} />);
    store.getState().openSheet('interpreter', { key: 'Warm / feverish', origin: 'chips' });

    expect(screen.getByText('WORTH CHECKING AT DAY 5')).toBeTruthy();
    expect(screen.getByText('THE ONE LINE YOUR CLINIC WATCHES')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Yes, that helps'));

    expect(store.getState().note).toBe('warm / feverish');
    expect(store.getState().phase).toBe('page');
    expect(store.getState().sheet).toBeNull();
  });

  it('"Not quite" escalates in place: threshold gate + care + 911 line, and NO call button', () => {
    const store = renderWithStore(5, <SheetBody content={avcUfe} />);
    store.getState().openSheet('interpreter', { key: 'Warm / feverish', origin: 'chips' });

    fireEvent.press(screen.getByLabelText('Not quite'));

    expect(screen.getByText('THE ONE THING TO WATCH FOR')).toBeTruthy();
    // the self-care line — "Warm / feverish" has no interp.care override, so
    // this is meta.selfCareDefault.
    expect(screen.getByText(/usually just needs a little more time/)).toBeTruthy();
    // the 911 line
    expect(screen.getByText(/Call 911/)).toBeTruthy();

    // the safety assertion: no call/phone control anywhere in the escalated
    // view, and "Back to today" is the ONLY button.
    expect(screen.queryByLabelText(/call|phone/i)).toBeNull();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0].props.accessibilityLabel).toBe('Back to today');

    fireEvent.press(screen.getByLabelText('Back to today'));

    expect(store.getState().note).toBe('warm / feverish');
    expect(store.getState().phase).toBe('page');
    expect(store.getState().sheet).toBeNull();
  });

  it('day 20: cycle check-in — choosing an option sets cycleAnswer and reveals the footnote', () => {
    const cycle = getDay(avcUfe, 20).cycle!;
    const store = renderWithStore(20, <SheetBody content={avcUfe} />);
    store.getState().openSheet('cycle');

    expect(screen.getByText(cycle.title)).toBeTruthy();
    for (const opt of cycle.options) {
      expect(screen.getByLabelText(opt)).toBeTruthy();
    }
    expect(screen.queryByText(cycle.footnote)).toBeNull();

    fireEvent.press(screen.getByLabelText('Heavier'));

    expect(store.getState().cycleAnswer).toBe('Heavier');
    expect(screen.getByText(cycle.footnote)).toBeTruthy();
  });

  it("day 10: can/can't — back, not-yet countdowns, and the footnote render", () => {
    const cancant = getDay(avcUfe, 10).cancant!;
    renderWithStore(10, <SheetBody content={avcUfe} />).getState().openSheet('cancant');

    expect(screen.getByText(cancant.title)).toBeTruthy();
    expect(screen.getByText(cancant.back)).toBeTruthy();
    expect(screen.getByText('Baths, pools & hot tubs')).toBeTruthy();
    expect(screen.getByText('Tampons (pads until then)')).toBeTruthy();
    expect(screen.getAllByText('4 days — Feb 26')).toHaveLength(2);
    expect(screen.getByText(cancant.footnote)).toBeTruthy();
  });

  it('day 3: "Feeling something?" lists the day\'s symptoms and swaps the sheet to the interpreter', () => {
    const store = renderWithStore(3, <SheetBody content={avcUfe} />);
    store.getState().openSheet('feel');

    expect(screen.getByText('What are you feeling?')).toBeTruthy();
    for (const key of Object.keys(getDay(avcUfe, 3).interpreters)) {
      expect(screen.getByLabelText(key)).toBeTruthy();
    }
    expect(screen.getByLabelText(SOMETHING_ELSE)).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Still feverish'));

    expect(store.getState().sheet).toEqual({
      kind: 'interpreter',
      payload: { key: 'Still feverish', origin: 'feel' }
    });
    expect(screen.getByText('EXPECTED THROUGH DAY 3')).toBeTruthy();
  });

  it('day 3: a feel-origin "Yes, that helps" closes the sheet WITHOUT recording a note', () => {
    const store = renderWithStore(3, <SheetBody content={avcUfe} />);
    store.getState().openSheet('feel');
    fireEvent.press(screen.getByLabelText('Still feverish'));
    // now in the interpreter with origin 'feel' — resolving must just close,
    // never record (only origin 'chips' records; the store owns that branch).
    fireEvent.press(screen.getByLabelText('Yes, that helps'));

    expect(store.getState().sheet).toBeNull();
    expect(store.getState().note).toBeNull();
    expect(store.getState().phase).toBe('checkin');
  });

  it('day 3: "Feeling something?" → "Something else…" hands off to chooseChip and closes the sheet', () => {
    const store = renderWithStore(3, <SheetBody content={avcUfe} />);
    store.getState().openSheet('feel');

    fireEvent.press(screen.getByLabelText(SOMETHING_ELSE));

    expect(store.getState().sheet).toBeNull();
  });
});
