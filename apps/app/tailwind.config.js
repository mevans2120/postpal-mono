/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind uses the Tailwind v3 config model (not the web app's v4 @theme).
  // The palette + fontFamily map live in ONE place: @postpal/ui/preset.
  content: ['./src/**/*.{js,jsx,ts,tsx}', '../../packages/ui/src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('@postpal/ui/preset')],
  plugins: [],
};
