import { render, screen, fireEvent } from '@testing-library/react-native';
import { avcUfe, getDay } from '@postpal/content';
import { renderWithStore } from '../test-utils';
import { FACE_LABELS } from '../primitives/faces';
import { CheckIn } from './CheckIn';

describe('CheckIn', () => {
  it('renders five faces, each reachable by its FACE_LABELS accessibility label', () => {
    renderWithStore(1, <CheckIn day={getDay(avcUfe, 1)} />);
    expect(screen.getAllByRole('button')).toHaveLength(5);
    for (const label of FACE_LABELS) {
      expect(screen.getByLabelText(label)).toBeTruthy();
    }
  });

  it('pressing a face drives the store to noted with the matching face', () => {
    const store = renderWithStore(1, <CheckIn day={getDay(avcUfe, 1)} />);
    fireEvent.press(screen.getByLabelText('an okay day'));
    expect(store.getState()).toMatchObject({ face: 2, phase: 'noted' });
  });

  it('calm budget — no note-taking UI competes with the face ask', () => {
    renderWithStore(1, <CheckIn day={getDay(avcUfe, 1)} />);
    expect(screen.queryByText('ANYTHING TO NOTE TODAY?')).toBeNull();
    expect(screen.queryByText('Nothing new')).toBeNull();
  });
});
