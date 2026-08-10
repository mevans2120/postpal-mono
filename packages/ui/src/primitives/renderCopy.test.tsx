import { render, screen } from '@testing-library/react';
import { renderCopy } from './renderCopy';

describe('renderCopy', () => {
  it('renders plain text as-is', () => {
    render(<p>{renderCopy('Rest today.')}</p>);
    expect(screen.getByText('Rest today.')).toBeInTheDocument();
  });
  it('renders em and b with the given classes', () => {
    render(<p>{renderCopy('call if it reaches <b>101°F</b> — <em>soon</em>', { b: 'text-alert', em: 'italic text-clay' })}</p>);
    const b = screen.getByText('101°F');
    expect(b.tagName).toBe('B');
    expect(b).toHaveClass('text-alert');
    expect(screen.getByText('soon').tagName).toBe('EM');
  });
  it('never uses innerHTML — unknown tags render as literal text', () => {
    render(<p data-testid="out">{renderCopy('a <span>b</span>')}</p>);
    expect(screen.getByTestId('out').querySelector('span')).toBeNull();
  });
  it('preserves text order for unclosed tags', () => {
    render(<p data-testid="out">{renderCopy('<em>a <b>c')}</p>);
    expect(screen.getByTestId('out').textContent).toBe('a c');
  });
  it('renders a stray closing tag without throwing, dropping the tag', () => {
    render(<p data-testid="out">{renderCopy('</em> huh')}</p>);
    expect(screen.getByTestId('out').textContent).toBe(' huh');
  });
});
