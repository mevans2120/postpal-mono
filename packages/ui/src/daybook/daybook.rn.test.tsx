import { render, screen, fireEvent } from '@testing-library/react-native';
import { avcUfe, getDay } from '@postpal/content';
import { deriveDayView } from '../derive';
import { Daybook } from './Daybook';

// The Daybook shell owns its store internally (created once per mount), so
// these tests drive it purely through the rendered UI — pressing the day
// switcher / faces — and assert against what's on screen, mirroring how a
// real consumer (and Task 8's apps/app) uses <Daybook>.

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
