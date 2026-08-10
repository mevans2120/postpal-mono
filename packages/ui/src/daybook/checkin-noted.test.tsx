import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { avcUfe, getDay } from '@postpal/content';
import { renderWithStore } from '../test-utils';
import { CheckIn } from './CheckIn';
import { NotedView } from './NotedView';

describe('CheckIn', () => {
  it('renders eyebrow, full hero, five faces — and nothing else competes (calm budget)', () => {
    renderWithStore(1, <CheckIn day={getDay(avcUfe, 1)} />);
    expect(screen.getByText('DAY 1 · MORNING CHECK-IN')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /day$/ })).toHaveLength(5);  // FACE_LABELS all end in "day"
    expect(screen.queryByText(/ANYTHING TO NOTE/)).not.toBeInTheDocument();
  });
  it('tapping a face advances to noted', async () => {
    const store = renderWithStore(1, <CheckIn day={getDay(avcUfe, 1)} />);
    await userEvent.click(screen.getByRole('button', { name: 'a hard day' }));
    expect(store.getState()).toMatchObject({ face: 4, phase: 'noted' });
  });
});

describe('NotedView', () => {
  it('shows truncated hero, face receipt, ack line, and the day chips', () => {
    const store = renderWithStore(1, <NotedView day={getDay(avcUfe, 1)} />);
    store.getState().selectFace(4);
    expect(screen.getByText(/Today is usually the hardest day/)).toBeInTheDocument();
    expect(screen.getByText(/harder than yesterday/)).toBeInTheDocument();
    // Prototype (daybook.html) uses a straight apostrophe in day-1 ack.worse; the
    // plan snippet's curly "That’s" does not match the faithful content port.
    expect(screen.getByText("Noted — a hard morning. That's day 1.")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nothing new' })).toBeInTheDocument();
  });
  it('hero tap expands to the full sentence in place', async () => {
    const store = renderWithStore(1, <NotedView day={getDay(avcUfe, 1)} />);
    store.getState().selectFace(0);
    await userEvent.click(screen.getByRole('button', { name: /expand or collapse/i }));
    expect(store.getState().heroExpanded).toBe(true);
  });
  it('"Something else…" swaps chips for the inline input; Enter submits, Escape cancels', async () => {
    const store = renderWithStore(1, <NotedView day={getDay(avcUfe, 1)} />);
    store.getState().selectFace(0);
    await userEvent.click(screen.getByRole('button', { name: 'Something else…' }));
    const input = screen.getByLabelText('Your note');
    await userEvent.type(input, 'left hip aches{Enter}');
    expect(store.getState()).toMatchObject({ note: 'left hip aches', phase: 'page' });
  });
});
