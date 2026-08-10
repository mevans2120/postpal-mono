import { FACE_MOUTHS } from './faces';

export interface FaceGlyphProps {
  index: number;
  selected?: boolean;
  size?: number;
}

/**
 * JSX port of the prototype's faceSvg() (daybook.html lines 517–528). The
 * selected treatment — clay fill at 15% opacity, #8a4630 strokes — comes from
 * v7 state 2's receipt glyph. Decorative: aria-hidden, labelled by its opener.
 */
export function FaceGlyph({ index, selected = false, size }: FaceGlyphProps) {
  const stroke = selected ? '#8a4630' : '#7a6c5c';
  const sw = selected ? 1.7 : 1.5;
  const eye = selected ? 1.7 : 1.6;
  return (
    <svg
      {...(size ? { width: size, height: size } : {})}
      viewBox="0 0 34 34"
      aria-hidden="true"
    >
      <circle
        cx="17"
        cy="17"
        r="14"
        fill={selected ? '#c4674a' : 'none'}
        {...(selected ? { opacity: 0.15 } : {})}
        stroke={stroke}
        strokeWidth={sw}
      />
      <circle cx="12" cy="14" r={eye} fill={stroke} />
      <circle cx="22" cy="14" r={eye} fill={stroke} />
      <path d={FACE_MOUTHS[index]} stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
    </svg>
  );
}
