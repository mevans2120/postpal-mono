import { screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { avcUfe, getDay } from '@postpal/content';
import { renderWithStore } from '../test-utils';
import { TodayPage } from './TodayPage';

describe('TodayPage', () => {
  const setup = (dayNum: number, note = 'nothing new') => {
    const store = renderWithStore(dayNum, <TodayPage day={getDay(avcUfe, dayNum)} />);
    store.getState().selectFace(2);
    store.getState().submitNote(note);   // fast-path to page phase
    return store;
  };
  it('renders both receipts and all four chapters on day 5', () => {
    setup(5);
    expect(screen.getByText(/about the same/)).toBeInTheDocument();
    expect(screen.getByText(/Noted:/)).toBeInTheDocument();
    expect(screen.getByText('How today might feel')).toBeInTheDocument();
    expect(screen.getByText('What you can do — and not yet')).toBeInTheDocument();
    expect(screen.getByText('Your medicines today')).toBeInTheDocument();
    expect(screen.getByText("What's ahead")).toBeInTheDocument();
  });
  it('day 1 has no BACK line; day 20 has no meds chapter and no NOT YET', () => {
    setup(1);
    expect(screen.queryByText('BACK')).not.toBeInTheDocument();
    cleanup();
    setup(20);
    expect(screen.queryByText('Your medicines today')).not.toBeInTheDocument();
    expect(screen.queryByText('NOT YET')).not.toBeInTheDocument();
    expect(screen.getByText(/everything ✓/)).toBeInTheDocument();
  });
  it('the note receipt reopens the noted phase', async () => {
    const store = setup(5);
    await userEvent.click(screen.getByRole('button', { name: /change what you noted/i }));
    expect(store.getState().phase).toBe('noted');
  });
  it('user-entered notes render as text, not markup', () => {
    setup(5, '<img src=x onerror=alert(1)>');
    expect(screen.getByText(/Noted:/).parentElement!.querySelector('img')).toBeNull();
  });
});
