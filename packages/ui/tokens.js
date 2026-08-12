/**
 * The single source of truth for PostPal's color palette (from
 * prototypes/daybook.html:18). Consumed by BOTH:
 *   - preset.js — spread into NativeWind's theme.extend.colors (build time,
 *     via require), so every token is also a `className` utility (text-clay,
 *     bg-paper, border-line, …).
 *   - the RN sites where `className` can't reach a color — react-native-svg
 *     color props (FaceGlyph), @gorhom/bottom-sheet style-object props
 *     (SheetHost), and TextInput.placeholderTextColor (NotedView) — which
 *     `import { colors }` from here (runtime).
 *
 * Kept as CommonJS (.js) because tailwind.config.js is evaluated as plain
 * CommonJS by Metro, so the source of truth cannot be a .ts. tokens.d.ts gives
 * the .tsx importers their types.
 */
const colors = {
  paper: '#faf6f0',
  card: '#ffffff',
  ink: '#2b2118',
  'ink-soft': '#5a4d40', // softer ink for interpreter reading body copy
  mut: '#7a6c5c',
  'mut-soft': '#a89a88', // lighter mut — the note-input placeholder tone
  clay: '#c4674a',
  'clay-fill': '#b05b40',
  'clay-deep': '#8a4630',
  'clay-soft': '#f3e4d3',
  'clay-soft-line': '#e7cdb6', // the border that pairs with clay-soft (escalation card)
  pine: '#3d5a4c',
  'pine-soft': '#e4ebe6',
  line: '#e6ddd1',
  alert: '#9c3a2a',
};

module.exports = { colors };
