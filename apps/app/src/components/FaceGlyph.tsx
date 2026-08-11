import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

/**
 * JSX port of the prototype's faceSvg() (daybook.html lines 517–528) using
 * react-native-svg. Five faces, good -> hard; only the mouth path differs.
 */
const FACE_MOUTHS = [
  'M10.5 20.5 Q17 26 23.5 20.5',
  'M11 21 Q17 24.5 23 21',
  'M11 21.5 H23',
  'M11 23 Q17 20 23 23',
  'M10.5 24 Q17 19 23.5 24',
];

type FaceGlyphProps = {
  index: number;
  selected?: boolean;
  /** rendered size — number (px) or a percentage string of the parent cell */
  size?: number | string;
};

export function FaceGlyph({ index, selected = false, size = '80%' }: FaceGlyphProps) {
  const stroke = selected ? '#8a4630' : '#7a6c5c';
  const sw = selected ? 1.7 : 1.5;
  const eye = selected ? 1.7 : 1.6;

  return (
    <Svg width={size} height={size} viewBox="0 0 34 34">
      <Circle
        cx={17}
        cy={17}
        r={14}
        fill={selected ? '#c4674a' : 'none'}
        fillOpacity={selected ? 0.15 : undefined}
        stroke={stroke}
        strokeWidth={sw}
      />
      <Circle cx={12} cy={14} r={eye} fill={stroke} />
      <Circle cx={22} cy={14} r={eye} fill={stroke} />
      <Path
        d={FACE_MOUTHS[index]}
        stroke={stroke}
        strokeWidth={sw}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export const FACE_COUNT = FACE_MOUTHS.length;
