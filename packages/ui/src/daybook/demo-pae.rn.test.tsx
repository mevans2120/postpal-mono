import { render, screen, fireEvent } from '@testing-library/react-native';
import { demoPae, avcUfe, listDays } from '@postpal/content';
import { Daybook } from './Daybook';

/**
 * PoC success criterion 1 — "a second procedure is a content file, not a code
 * change." demoPae is a SECOND ProcedureContent instance authored purely as
 * data (packages/content/src/demo-pae). This test renders it through the
 * exact same <Daybook> component the AVC/UFE app uses, with ZERO changes to
 * @postpal/ui. If the UI had hardcoded anything UFE-specific, these
 * assertions would fail. <Daybook> self-hosts its BottomSheetModalProvider
 * (below the store context), so it renders directly with no wrapper.
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
    expect(screen.getByText('DAY 1 · MORNING CHECK-IN')).toBeTruthy();
    // PAE-specific hero, not the UFE prototype copy — proves it's rendering THIS content
    expect(screen.getByText(/tender day/)).toBeTruthy();
    expect(screen.getByText('Demo Patient · PAE')).toBeTruthy();
    // five faces render from the shared UI, regardless of procedure
    expect(screen.getAllByRole('button', { name: /day$/ })).toHaveLength(5);
  });

  it('drives a full check-in → page flow with the new content', () => {
    render(<Daybook content={demoPae} initialDay={1} statusLabel="Demo Patient · PAE" />);
    fireEvent.press(screen.getByLabelText('a good day'));
    fireEvent.press(screen.getByLabelText('Nothing new'));
    // the same question-led chapters render for PAE content...
    expect(screen.getByText('How today might feel')).toBeTruthy();
    expect(screen.getByText('What you can do — and not yet')).toBeTruthy();
    expect(screen.getByText("What's ahead")).toBeTruthy();
    // ...and the null-omission logic still holds: this day has meds: null
    expect(screen.queryByText('Your medicines today')).toBeNull();
    // the Next slot carries the PAE milestone (pine cancant), not a UFE dose
    expect(screen.getByRole('button', { name: /next: lifting clears/i })).toBeTruthy();
  });
});
