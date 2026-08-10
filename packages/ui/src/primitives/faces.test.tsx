import { render } from '@testing-library/react';
import { FaceGlyph } from './FaceGlyph';
import { FACE_LABELS, faceReceiptText, faceAckKey } from './faces';

describe('faces', () => {
  it('has five labels good → hard', () => {
    expect(FACE_LABELS).toHaveLength(5);
    expect(FACE_LABELS[0]).toBe('a good day');
    expect(FACE_LABELS[4]).toBe('a hard day');
  });
  it('maps face index to receipt text and ack key (lines 513–514)', () => {
    expect(faceReceiptText(0)).toBe('a little better');
    expect(faceReceiptText(2)).toBe('about the same');
    expect(faceReceiptText(4)).toBe('harder than yesterday');
    expect(faceAckKey(1)).toBe('better');
    expect(faceAckKey(3)).toBe('worse');
  });
  it('renders an svg with the selected treatment', () => {
    const { container } = render(<FaceGlyph index={0} selected />);
    expect(container.querySelector('svg circle[fill="#c4674a"]')).toBeInTheDocument();
  });
});
