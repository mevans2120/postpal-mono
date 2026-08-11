/**
 * The single source of PostPal's design tokens for NativeWind (Tailwind v3
 * config model — NativeWind does not support the DOM package's Tailwind v4
 * @theme syntax). Palette from prototypes/daybook.html:18; fontFamily per the
 * RN gotcha that fontStyle:'italic'/fontWeight do NOT reliably synthesize
 * against a custom family — each weight/italic is its OWN loaded family, so
 * `<em>` maps to `font-serif-italic` (not `italic`) and bold labels map to
 * `font-sans-bold`/`font-sans-semibold` (not `font-bold`).
 *
 * Consumers: `presets: [require('@postpal/ui/preset')]` in their
 * tailwind.config.js (see apps/app/tailwind.config.js).
 */
module.exports = {
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        paper: '#faf6f0',
        card: '#ffffff',
        ink: '#2b2118',
        mut: '#7a6c5c',
        clay: '#c4674a',
        'clay-fill': '#b05b40',
        'clay-deep': '#8a4630',
        'clay-soft': '#f3e4d3',
        pine: '#3d5a4c',
        'pine-soft': '#e4ebe6',
        line: '#e6ddd1',
        alert: '#9c3a2a',
      },
      fontFamily: {
        sans: ['AlbertSans_400Regular'],
        'sans-semibold': ['AlbertSans_600SemiBold'],
        'sans-bold': ['AlbertSans_700Bold'],
        serif: ['Petrona_500Medium'],
        'serif-italic': ['Petrona_500Medium_Italic'],
      },
    },
  },
};
