import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { renderCopy } from './renderCopy';

// RN port of the DOM renderCopy.test.tsx (deleted). Renders into a parent
// <Text> (RN has no <p>) and queries via getByText / toHaveTextContent.
// Preserves all five original behaviors, including the two regressions this
// port exists to guard: source-order text for unclosed tags, and a stray
// closing tag not throwing.
describe('renderCopy', () => {
  it('renders plain text as-is', () => {
    render(<Text>{renderCopy('Rest today.')}</Text>);
    expect(screen.getByText('Rest today.')).toBeTruthy();
  });

  it('renders em and b with the given classes', () => {
    render(
      <Text>
        {renderCopy('call if it reaches <b>101°F</b> — <em>soon</em>', {
          b: 'text-alert',
          em: 'italic text-clay',
        })}
      </Text>,
    );
    expect(screen.getByText('101°F').props.className).toBe('text-alert');
    expect(screen.getByText('soon').props.className).toBe('italic text-clay');
  });

  it('never uses innerHTML — unknown tags render as literal text', () => {
    render(<Text testID="out">{renderCopy('a <span>b</span>')}</Text>);
    expect(screen.getByTestId('out')).toHaveTextContent('a <span>b</span>');
  });

  it('preserves text order for unclosed tags', () => {
    render(<Text testID="out">{renderCopy('<em>a <b>c')}</Text>);
    expect(screen.getByTestId('out')).toHaveTextContent('a c');
  });

  it('renders a stray closing tag without throwing, dropping the tag', () => {
    render(<Text testID="out">{renderCopy('</em> huh')}</Text>);
    expect(screen.getByTestId('out')).toHaveTextContent(' huh');
  });
});
