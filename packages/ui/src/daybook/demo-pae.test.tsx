import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { demoPae, avcUfe, listDays } from '@postpal/content';
import { Daybook } from './Daybook';

/**
 * PoC success criterion 1 — "a second procedure is a content file, not a code
 * change." demoPae is a SECOND ProcedureContent instance authored purely as data
 * (packages/content/src/demo-pae). This test renders it through the exact same
 * <Daybook> component the AVC/UFE app uses, with ZERO changes to @postpal/ui.
 * If the UI had hardcoded anything UFE-specific, these assertions would fail.
 */
describe('demo PAE receipt — a second procedure with zero UI changes', () => {
  it('is a distinct, independently-parsed procedure instance', () => {
    expect(demoPae.meta.id).toBe('demo-pae');
    expect(demoPae.meta.procedure).toContain('Prostate artery embolization');
    expect(demoPae.meta.id).not.toBe(avcUfe.meta.id);
    expect(listDays(demoPae)).toEqual([1]); // the switcher renders whatever days exist
  });

  it('renders its own procedure copy under the unchanged Daybook', () => {
    render(<Daybook content={demoPae} initialDay={1} statusLabel="Demo Patient · PAE" />);
    expect(screen.getByText('DAY 1 · MORNING CHECK-IN')).toBeInTheDocument();
    // PAE-specific hero, not the UFE prototype copy — proves it's rendering THIS content
    expect(screen.getByText(/tender day/)).toBeInTheDocument();
    expect(screen.getByText('Demo Patient · PAE')).toBeInTheDocument();
    // five faces render from the shared UI, regardless of procedure
    expect(screen.getAllByRole('button', { name: /day$/ })).toHaveLength(5);
  });

  it('drives a full check-in → page flow with the new content', async () => {
    render(<Daybook content={demoPae} initialDay={1} statusLabel="Demo Patient · PAE" />);
    await userEvent.click(screen.getByRole('button', { name: 'a good day' }));
    await userEvent.click(screen.getByRole('button', { name: 'Nothing new' }));
    // the same question-led chapters render for PAE content...
    expect(screen.getByText('How today might feel')).toBeInTheDocument();
    expect(screen.getByText('What you can do — and not yet')).toBeInTheDocument();
    expect(screen.getByText("What's ahead")).toBeInTheDocument();
    // ...and the null-omission logic still holds: this day has meds: null
    expect(screen.queryByText('Your medicines today')).not.toBeInTheDocument();
    // the Next slot carries the PAE milestone (pine cancant), not a UFE dose
    expect(
      screen.getByRole('button', { name: /next: lifting clears/i })
    ).toBeInTheDocument();
  });
});
