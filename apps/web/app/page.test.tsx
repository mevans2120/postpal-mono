import { render, screen } from '@testing-library/react';
import Home from './page';

it('composes content and ui into the daybook', () => {
  render(<Home />);
  expect(screen.getByText('DAY 5 · MORNING CHECK-IN')).toBeInTheDocument();
  expect(screen.getByText('Maya · UFE Feb 12')).toBeInTheDocument();
});
