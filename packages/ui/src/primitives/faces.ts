/**
 * The five faces from the v7 concept, good → hard. Only the mouth differs.
 * Ported verbatim from prototypes/daybook.html lines 505–514. Pure module —
 * no React; FaceGlyph consumes FACE_MOUTHS to draw the SVG path.
 */
export const FACE_MOUTHS = [
  'M10.5 20.5 Q17 26 23.5 20.5',
  'M11 21 Q17 24.5 23 21',
  'M11 21.5 H23',
  'M11 23 Q17 20 23 23',
  'M10.5 24 Q17 19 23.5 24'
];

export const FACE_LABELS = ['a good day', 'a pretty good day', 'an okay day', 'a harder day', 'a hard day'];

export const faceReceiptText = (i: number): string =>
  i <= 1 ? 'a little better' : i === 2 ? 'about the same' : 'harder than yesterday';

export const faceAckKey = (i: number): 'better' | 'same' | 'worse' =>
  i <= 1 ? 'better' : i === 2 ? 'same' : 'worse';
