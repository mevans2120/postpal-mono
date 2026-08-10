import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { avcUfe } from '@postpal/content';
import { Daybook } from '../daybook/Daybook';

describe('sheet system', () => {
  it('day 1: Next → med rail → Log → rail and Next slot update', async () => {
    render(<Daybook content={avcUfe} initialDay={1} statusLabel="Maya · UFE Feb 12" />);
    await userEvent.click(screen.getByRole('button', { name: /next: ibuprofen 800/i }));
    expect(screen.getByRole('dialog', { name: /your medicines/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Log it' }));
    expect(screen.getByText('taken just now ✓')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next: ibuprofen 800 — 6:00/i })).toBeInTheDocument();
  });
  it('day 5: symptom chip → interpreter answers first → "Yes, that helps" records and advances', async () => {
    render(<Daybook content={avcUfe} initialDay={5} statusLabel="Maya · UFE Feb 12" />);
    await userEvent.click(screen.getByRole('button', { name: 'a harder day' }));
    await userEvent.click(screen.getByRole('button', { name: 'Warm / feverish' }));
    expect(screen.getByText('WORTH CHECKING AT DAY 5')).toBeInTheDocument();
    expect(screen.getByText(/THE ONE LINE YOUR CLINIC WATCHES/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Yes, that helps' }));
    expect(screen.getByText(/warm \/ feverish/)).toBeInTheDocument();   // note receipt on the page
  });
  it('"Not quite" escalates in place: threshold gate + self-care + 911 line, no call button', async () => {
    render(<Daybook content={avcUfe} initialDay={5} statusLabel="Maya · UFE Feb 12" />);
    await userEvent.click(screen.getByRole('button', { name: 'a harder day' }));
    await userEvent.click(screen.getByRole('button', { name: 'Warm / feverish' }));
    await userEvent.click(screen.getByRole('button', { name: 'Not quite' }));
    expect(screen.getByText(/THE ONE THING TO WATCH FOR/)).toBeInTheDocument();
    expect(screen.getByText(/Call 911/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /call carrie/i })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Back to today' }));
    expect(screen.getByText(/warm \/ feverish/)).toBeInTheDocument();
  });
  it('day 20: Next → cycle sheet → choosing reveals the footnote', async () => {
    render(<Daybook content={avcUfe} initialDay={20} statusLabel="Maya · UFE Feb 12" />);
    await userEvent.click(screen.getByRole('button', { name: /next: cycle 1 check-in/i }));
    await userEvent.click(screen.getByRole('button', { name: 'Heavier' }));
    expect(screen.getByText(/Heavier for the first one or two cycles is common/)).toBeInTheDocument();
  });
  it('day 10: Next → can/can’t sheet with countdowns', async () => {
    render(<Daybook content={avcUfe} initialDay={10} statusLabel="Maya · UFE Feb 12" />);
    await userEvent.click(screen.getByRole('button', { name: /next: baths & pools clear/i }));
    expect(screen.getByText('Baths, pools & hot tubs')).toBeInTheDocument();
    expect(screen.getAllByText('4 days — Feb 26')).toHaveLength(2);
  });
  it('"Feeling something?" lists the day’s symptoms and swaps to the interpreter', async () => {
    render(<Daybook content={avcUfe} initialDay={3} statusLabel="Maya · UFE Feb 12" />);
    await userEvent.click(screen.getByRole('button', { name: /feeling something/i }));
    await userEvent.click(screen.getByRole('button', { name: 'Still feverish' }));
    expect(screen.getByText('EXPECTED THROUGH DAY 3')).toBeInTheDocument();
  });
  it('Escape closes; focus returns to the opener', async () => {
    render(<Daybook content={avcUfe} initialDay={1} statusLabel="Maya · UFE Feb 12" />);
    const opener = screen.getByRole('button', { name: /next: ibuprofen 800/i });
    await userEvent.click(opener);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });
});
