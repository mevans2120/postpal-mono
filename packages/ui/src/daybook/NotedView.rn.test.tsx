import { screen, fireEvent } from '@testing-library/react-native';
import { avcUfe, getDay, NOTHING_NEW, SOMETHING_ELSE } from '@postpal/content';
import { renderWithStore } from '../test-utils';
import { faceAckKey } from '../primitives/faces';
import { NotedView } from './NotedView';

// NotedView needs face !== null (the noted phase is only reached after
// selectFace), so every test drives the store into 'noted' first via the
// renderWithStore proxy (runs the action in act(), flushing the re-render).
describe('NotedView', () => {
  it("renders day 5's five chips", () => {
    const store = renderWithStore(5, <NotedView day={getDay(avcUfe, 5)} />);
    store.getState().selectFace(2);

    for (const chip of getDay(avcUfe, 5).chips) {
      expect(screen.getByLabelText(chip)).toBeTruthy();
    }
  });

  it('a symptom chip opens the interpreter sheet before recording', () => {
    const store = renderWithStore(5, <NotedView day={getDay(avcUfe, 5)} />);
    store.getState().selectFace(2);

    fireEvent.press(screen.getByLabelText('Warm / feverish'));

    expect(store.getState().sheet).toEqual({
      kind: 'interpreter',
      payload: { key: 'Warm / feverish', origin: 'chips' }
    });
    expect(store.getState().phase).toBe('noted');
  });

  it('"Nothing new" records the note and advances to the page', () => {
    const store = renderWithStore(5, <NotedView day={getDay(avcUfe, 5)} />);
    store.getState().selectFace(2);

    fireEvent.press(screen.getByLabelText(NOTHING_NEW));

    expect(store.getState().phase).toBe('page');
    expect(store.getState().note).toBe('nothing new');
  });

  it('"Something else…" opens the note input, and submitting it records the note and advances', () => {
    const store = renderWithStore(5, <NotedView day={getDay(avcUfe, 5)} />);
    store.getState().selectFace(2);

    fireEvent.press(screen.getByLabelText(SOMETHING_ELSE));
    expect(store.getState().noteInputOpen).toBe(true);

    const input = screen.getByLabelText('Your note');
    fireEvent.changeText(input, 'sore');
    fireEvent(input, 'submitEditing');

    expect(store.getState().note).toBe('sore');
    expect(store.getState().phase).toBe('page');
  });

  it('tapping the face receipt reopens the check-in', () => {
    const store = renderWithStore(5, <NotedView day={getDay(avcUfe, 5)} />);
    store.getState().selectFace(2);

    fireEvent.press(screen.getByLabelText('Change how today feels'));

    expect(store.getState().phase).toBe('checkin');
  });

  it("shows the day's ack line for the selected face", () => {
    const day = getDay(avcUfe, 5);
    const store = renderWithStore(5, <NotedView day={day} />);
    store.getState().selectFace(2);

    expect(screen.getByText(day.ack[faceAckKey(2)])).toBeTruthy();
  });
});
