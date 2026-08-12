/**
 * PostPal's NativeWind preset (Tailwind v3 config model — NativeWind does not
 * support the DOM package's Tailwind v4 @theme syntax). The color palette lives
 * in ./tokens.js (the single source, also imported by the RN style-prop / SVG /
 * placeholder sites that className can't reach); here it is spread into
 * theme.extend.colors so every token is a className utility too. fontFamily is
 * defined here per the RN gotcha that fontStyle:'italic'/fontWeight do NOT
 * reliably synthesize against a custom family — each weight/italic is its OWN
 * loaded family, so `<em>` maps to `font-serif-italic` (not `italic`) and bold
 * labels map to `font-sans-bold`/`font-sans-semibold` (not `font-bold`).
 *
 * Consumers: `presets: [require('@postpal/ui/preset')]` in their
 * tailwind.config.js (see apps/app/tailwind.config.js).
 */
const { colors } = require('./tokens');

module.exports = {
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ['AlbertSans_400Regular'],
        'sans-semibold': ['AlbertSans_600SemiBold'],
        'sans-bold': ['AlbertSans_700Bold'],
        serif: ['Petrona_500Medium'],
        'serif-italic': ['Petrona_500Medium_Italic'],
        'serif-semibold': ['Petrona_600SemiBold'],
      },
    },
  },
};
