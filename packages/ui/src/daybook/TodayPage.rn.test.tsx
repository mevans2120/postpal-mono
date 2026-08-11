import { screen, fireEvent } from '@testing-library/react-native';
import { avcUfe, getDay, NOTHING_NEW } from '@postpal/content';
import { renderWithStore } from '../test-utils';
import { deriveDayView } from '../derive';
import { TodayPage } from './TodayPage';

// Every test drives the store past 'noted' into the 'page' phase (TodayPage
// needs face !== null and is only reached that way), via the renderWithStore
// proxy so each action runs inside act() and flushes the re-render.
describe('TodayPage', () => {
  it('renders the full page on day 5: hero, two receipts, four chapters, BACK/NOT YET, and the meds line; "open" opens the med rail', () => {
    const day5 = getDay(avcUfe, 5);
    const store = renderWithStore(5, <TodayPage day={day5} />);
    store.getState().selectFace(2);
    store.getState().chooseChip(NOTHING_NEW);
    expect(store.getState().phase).toBe('page');

    // hero + the two receipts
    expect(screen.getByText(day5.eyebrow)).toBeTruthy();
    expect(screen.getByLabelText('Change how today feels')).toBeTruthy();
    expect(screen.getByLabelText('Change what you noted')).toBeTruthy();

    // all four chapter headings
    expect(screen.getByText('How today might feel')).toBeTruthy();
    expect(screen.getByText('What you can do — and not yet')).toBeTruthy();
    expect(screen.getByText('Your medicines today')).toBeTruthy();
    expect(screen.getByText("What's ahead")).toBeTruthy();

    // BACK and NOT YET rows (both present on day 5)
    expect(screen.getByText('BACK')).toBeTruthy();
    expect(screen.getByText(day5.back!)).toBeTruthy();
    expect(screen.getByText('NOT YET')).toBeTruthy();

    // the meds chapter's line, computed the same way the component does
    const medsLine = deriveDayView(day5, 0).medsLine;
    expect(screen.getByText(medsLine!)).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Open today's medicine rail"));
    expect(store.getState().sheet?.kind).toBe('medrail');
  });

  it('day 1: the BACK row is absent (day-01.ts back is null; notYet is not)', () => {
    const day1 = getDay(avcUfe, 1);
    expect(day1.back).toBeNull();
    expect(day1.notYet).not.toBeNull();

    const store = renderWithStore(1, <TodayPage day={day1} />);
    store.getState().selectFace(2);
    store.getState().chooseChip(NOTHING_NEW);

    expect(screen.queryByText('BACK')).toBeNull();
    expect(screen.getByText('NOT YET')).toBeTruthy();
  });

  it('day 20: the meds chapter and the NOT YET row are absent (day-20.ts meds and notYet are null)', () => {
    const day20 = getDay(avcUfe, 20);
    expect(day20.meds).toBeNull();
    expect(day20.notYet).toBeNull();

    const store = renderWithStore(20, <TodayPage day={day20} />);
    store.getState().selectFace(2);
    store.getState().chooseChip(NOTHING_NEW);

    expect(screen.queryByText('Your medicines today')).toBeNull();
    expect(screen.queryByText('NOT YET')).toBeNull();
    // BACK is present on day 20 ("everything ✓ — all restrictions cleared on day 14")
    expect(screen.getByText('BACK')).toBeTruthy();
    expect(screen.getByText(day20.back!)).toBeTruthy();
  });

  it('a user-entered note renders as literal text, never parsed as markup', () => {
    const store = renderWithStore(5, <TodayPage day={getDay(avcUfe, 5)} />);
    store.getState().selectFace(2);
    store.getState().submitNote('<b>evil</b>');

    expect(screen.getByText('<b>evil</b>')).toBeTruthy();
  });
});
