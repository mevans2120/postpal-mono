import { screen, fireEvent } from '@testing-library/react-native';
import { avcUfe, getDay } from '@postpal/content';
import { renderWithStore } from '../test-utils';
import { HeroBlock } from './HeroBlock';

// Day 5's short/full hero copy diverge past "...lifting around now…" — the
// full sentence goes on to "though plenty of recoveries take until week
// two", a substring unique to heroFull. renderCopy splits copy into nested
// <Text> nodes, so assertions read the Pressable's aggregate text content
// (toHaveTextContent, RNTL's built-in matcher) rather than an exact getByText.
describe('HeroBlock', () => {
  it('shows the short hero, expands to the full hero on press, and collapses back', () => {
    const day = getDay(avcUfe, 5);
    renderWithStore(5, <HeroBlock day={day} />);
    const hero = screen.getByLabelText("Expand or collapse today's reading");

    expect(hero).toHaveTextContent('lifting around now', { exact: false });
    expect(hero).not.toHaveTextContent('though plenty of recoveries take until week two', { exact: false });

    fireEvent.press(hero);
    expect(hero).toHaveTextContent('though plenty of recoveries take until week two', { exact: false });

    fireEvent.press(hero);
    expect(hero).toHaveTextContent('lifting around now', { exact: false });
    expect(hero).not.toHaveTextContent('though plenty of recoveries take until week two', { exact: false });
  });
});
