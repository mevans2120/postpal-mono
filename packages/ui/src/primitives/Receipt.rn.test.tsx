import { Text } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Receipt } from './Receipt';

describe('Receipt', () => {
  it('calls onActivate when pressed', () => {
    const onActivate = jest.fn();
    render(
      <Receipt icon={<Text>icon</Text>} onActivate={onActivate} label="Today feels: a little better">
        Today feels: a little better
      </Receipt>
    );
    fireEvent.press(screen.getByLabelText('Today feels: a little better'));
    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it('is queryable as an accessible button by its label', () => {
    render(
      <Receipt icon={<Text>icon</Text>} onActivate={() => {}} label="Today feels: a little better">
        Today feels: a little better
      </Receipt>
    );
    expect(screen.getByRole('button', { name: 'Today feels: a little better' })).toBeTruthy();
  });

  it('renders its children text', () => {
    render(
      <Receipt icon={<Text>icon</Text>} onActivate={() => {}} label="Today feels: a little better">
        Today feels: a little better
      </Receipt>
    );
    expect(screen.getByText('Today feels: a little better')).toBeTruthy();
  });
});
