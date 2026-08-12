import { render, screen, fireEvent } from '@testing-library/react-native';
import { avcUfe, getDay } from '@postpal/content';
import { deriveDayView } from '../derive';
import { Daybook } from './Daybook';

// The Daybook shell owns its store internally (created once per mount) AND
// hosts its own BottomSheetModalProvider (below the store context), so these
// tests render <Daybook> directly — no external provider — exactly as a real
// consumer (apps/app) does, and drive it through the rendered UI.
//
// Rendering with NO external provider is itself a partial regression guard for
// the @gorhom-portal / store-context bug (see Daybook.tsx): if the provider
// were ever removed from <Daybook>, SheetHost's BottomSheetModal would throw
// "BottomSheetModalInternalContext cannot be null!" at mount and every test
// here would fail. The FULL invariant — that the portaled SheetBody resolves
// DaybookStoreContext — can't be unit-tested: @gorhom's BottomSheetModal is
// inert in jest-expo (present() errors against the mocked native runtime and
// unmounts the tree), so no sheet body renders in-test. That path is instead
// verified by the live web render (all sheet journeys, zero console errors).

const n5 = deriveDayView(getDay(avcUfe, 5), 0).next;
const n10 = deriveDayView(getDay(avcUfe, 10), 0).next;
const n20 = deriveDayView(getDay(avcUfe, 20), 0).next;

describe('Daybook shell', () => {
  it('renders the check-in for the initial day with the clay dose Next slot', () => {
    render(<Daybook content={avcUfe} initialDay={5} statusLabel="Maya · UFE Feb 12" />);

    expect(screen.getByText('Maya · UFE Feb 12')).toBeTruthy();
    expect(screen.getByText('HOW DOES TODAY FEEL?')).toBeTruthy();

    const next = screen.getByLabelText(`Next: ${n5.label} — ${n5.sub}`);
    expect(next.props.className).toContain('bg-clay-fill');
    expect(screen.getByLabelText('Feeling something? Check a symptom')).toBeTruthy();
  });

  it('day switcher moves to day 10 and lands on a fresh check-in with the pine milestone slot', () => {
    render(<Daybook content={avcUfe} initialDay={5} statusLabel="Maya · UFE Feb 12" />);

    fireEvent.press(screen.getByLabelText('Day 10'));

    expect(screen.getByText('DAY 10 · MORNING CHECK-IN')).toBeTruthy();
    expect(screen.getByText('HOW DOES TODAY FEEL?')).toBeTruthy();
    const next = screen.getByLabelText(`Next: ${n10.label} — ${n10.sub}`);
    expect(next.props.className).toContain('bg-pine');
  });

  it('day 20 shows the pine cycle Next slot', () => {
    render(<Daybook content={avcUfe} initialDay={5} statusLabel="Maya · UFE Feb 12" />);

    fireEvent.press(screen.getByLabelText('Day 20'));

    const next = screen.getByLabelText(`Next: ${n20.label} — ${n20.sub}`);
    expect(next.props.className).toContain('bg-pine');
  });

  it('picking a face advances the shell from check-in to the noted view', () => {
    render(<Daybook content={avcUfe} initialDay={5} statusLabel="Maya · UFE Feb 12" />);

    fireEvent.press(screen.getByLabelText('an okay day'));

    expect(screen.getByLabelText('Nothing new')).toBeTruthy();
  });
});
