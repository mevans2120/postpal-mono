import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { avcUfe } from '@postpal/content';
import { Daybook } from './Daybook';

describe('Daybook shell', () => {
  it('renders the check-in for the initial day with the clay dose Next slot', () => {
    render(<Daybook content={avcUfe} initialDay={5} statusLabel="Maya · UFE Feb 12" />);
    expect(screen.getByText('DAY 5 · MORNING CHECK-IN')).toBeInTheDocument();
    // the shell owns the status row (moved out of CheckIn in Task 13)
    expect(screen.getByText('9:41')).toBeInTheDocument();
    expect(screen.getByText('Maya · UFE Feb 12')).toBeInTheDocument();
    const next = screen.getByRole('button', { name: /next: ibuprofen 800/i });
    expect(next.className).toContain('bg-clay-fill');
  });
  it('day switcher moves between days and always lands on a fresh check-in', async () => {
    render(<Daybook content={avcUfe} initialDay={5} statusLabel="Maya · UFE Feb 12" />);
    await userEvent.click(screen.getByRole('button', { name: 'Day 20' }));
    expect(screen.getByText('DAY 20 · CHECK-IN')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next: cycle 1 check-in/i }).className).toContain('bg-pine');
  });
  it('day 10 shows the pine milestone slot', async () => {
    render(<Daybook content={avcUfe} initialDay={10} statusLabel="Maya · UFE Feb 12" />);
    expect(screen.getByRole('button', { name: /next: baths & pools clear/i })).toBeInTheDocument();
  });
});
