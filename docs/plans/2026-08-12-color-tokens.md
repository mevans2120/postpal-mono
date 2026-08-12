# Single-source color tokens

**Goal:** Give PostPal's palette exactly ONE home. Today `preset.js` is the source for NativeWind `className` colors, but a handful of colors are hardcoded as hex where `className` can't reach — `react-native-svg` color props, `@gorhom/bottom-sheet` style-object props, and `TextInput.placeholderTextColor` — plus three arbitrary `[#...]` values that were never tokens at all. Lift every color into one `tokens.js` module consumed by BOTH `preset.js` (build-time, `require`) and the component style/SVG sites (runtime, `import`).

**Why:** The cross-platform audit graded conformance A but flagged 9 raw hex occurrences in `packages/ui/src` as the one seam in the design-token story. Closing it means a color changes in exactly one place, and the three non-token values get reconciled into the palette.

## Design

- **`packages/ui/tokens.js`** (CommonJS) — the single palette. Exports `{ colors }`, a flat map of kebab-case name → hex. Kebab keys so `preset.js` can spread them straight into Tailwind's `theme.extend.colors` (the class names stay `text-clay-deep` etc.).
- **`packages/ui/tokens.d.ts`** — hand-written types (enumerated keys) so the `.tsx` sites get key-checked autocomplete while `preset.js`/tailwind `require` the runtime `.js`. (Tailwind config is evaluated as plain CommonJS by Metro, so the source of truth must be `.js`, not `.ts`.)
- **`preset.js`** — `const { colors } = require('./tokens')`; `theme.extend.colors: colors`. All tokens (incl. the 3 new ones) become `className` utilities.
- **Component sites** import `{ colors }` from `../../tokens` (relative, package-internal — no self-referential package import) and reference `colors.paper`, `colors['clay-deep']`, etc. instead of hex literals.

### Three colors promoted from arbitrary → named tokens

| Hex | New token | Was | Becomes |
|---|---|---|---|
| `#e7cdb6` | `clay-soft-line` | `border-[#e7cdb6]` (InterpreterSheet escalated card) | `border-clay-soft-line` |
| `#5a4d40` | `ink-soft` | `text-[#5a4d40]` (InterpreterSheet answer body) | `text-ink-soft` |
| `#a89a88` | `mut-soft` | `placeholderTextColor="#a89a88"` (NotedView input) | `colors['mut-soft']` (style prop — not className-reachable) |

## Tasks

1. **`tokens.js` + `tokens.d.ts`** — the 12 existing colors from `preset.js` + the 3 new ones. Doc comment names the two consumers.
2. **`preset.js`** — require `./tokens`, spread `colors` into `theme.extend.colors`; keep `fontFamily` as-is. Update the doc comment (colors now live in `tokens.js`).
3. **`FaceGlyph.tsx`** — `import { colors }`; `stroke = selected ? colors['clay-deep'] : colors.mut`; `fill = selected ? colors.clay : 'none'`.
4. **`SheetHost.tsx`** — replace the `PAPER`/`LINE` consts with `colors.paper`/`colors.line` in `backgroundStyle`/`handleIndicatorStyle`.
5. **`InterpreterSheet.tsx`** — `ALERT` → `colors.alert`; `border-[#e7cdb6]` → `border-clay-soft-line`; `text-[#5a4d40]` → `text-ink-soft`.
6. **`NotedView.tsx`** — `placeholderTextColor={colors['mut-soft']}`.

## Verify

- `grep -rnE "#[0-9a-fA-F]{6}" packages/ui/src` → **zero** raw hex in `src` (all hex now lives only in `tokens.js` at the package root).
- `npm test` → 85 green (className changes don't touch content/behavior assertions).
- `npm run typecheck` → clean across all workspaces (the `.d.ts` types the `colors` accesses).
- `npx expo export --platform web` → builds (proves NativeWind generates the 3 new token classes), then re-render the interpreter answer + escalation screens to confirm `ink-soft` / `clay-soft-line` render identically (same hex, so pixel-identical — this only checks the new classes actually generate).

## Out of scope

- No visual change — every value is identical, just relocated. Purely a single-source refactor.
- Not adding a `@postpal/ui/tokens` package export (YAGNI — nothing outside the package needs raw tokens; apps consume colors through `preset`). Add later if a second surface needs it.
