/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind uses the Tailwind v3 config model (not the web app's v4 @theme).
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
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
      // RN gotcha: fontStyle:'italic' and fontWeight do NOT synthesize reliably
      // against a custom family — each weight/italic is its OWN loaded family.
      // So the hero <em> maps to the italic family, and bold labels map to the
      // bold family, rather than relying on the `italic`/`font-bold` utilities.
      fontFamily: {
        sans: ['AlbertSans_400Regular'],
        'sans-semibold': ['AlbertSans_600SemiBold'],
        'sans-bold': ['AlbertSans_700Bold'],
        serif: ['Petrona_500Medium'],
        'serif-italic': ['Petrona_500Medium_Italic'],
      },
    },
  },
  plugins: [],
};
