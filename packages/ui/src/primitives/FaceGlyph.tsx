import Svg, { Circle, Path } from 'react-native-svg';
import { FACE_MOUTHS } from './faces';
import { colors } from '../../tokens';

export interface FaceGlyphProps {
  index: number;
  selected?: boolean;
  /** rendered size — number (px) or a percentage string of the parent cell */
  size?: number | string;
}

/**
 * RN port of the prototype's faceSvg() (daybook.html lines 517–528) using
 * react-native-svg. Five faces, good -> hard; only the mouth path differs
 * (FACE_MOUTHS, from ./faces — the shared pure module, not duplicated here).
 * The selected treatment — clay fill at 15% opacity, clay-deep strokes — comes
 * from v7 state 2's receipt glyph. Colors come from tokens.js (react-native-svg
 * takes literal color values, not className).
 */
export function FaceGlyph({ index, selected = false, size = '80%' }: FaceGlyphProps) {
  const stroke = selected ? colors['clay-deep'] : colors.mut;
  const sw = selected ? 1.7 : 1.5;
  const eye = selected ? 1.7 : 1.6;

  return (
    <Svg width={size} height={size} viewBox="0 0 34 34">
      <Circle
        cx={17}
        cy={17}
        r={14}
        fill={selected ? colors.clay : 'none'}
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
