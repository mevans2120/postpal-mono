# PostPal

PostPal is a clinic-prescribed post-procedure recovery companion. A patient
opens a daily "daybook" for their recovery window (e.g. day 1 through day 20
after an embolization procedure), checks in on how today feels, and gets
question-led guidance — what's expected, what they can/can't do yet, today's
medicines, and what's ahead — sourced from their clinic's own copy, not a
generic FAQ.

## Architecture

This is an npm-workspaces monorepo with three packages:

- **`apps/app`** — a single Expo Router app that targets web, iOS, and
  Android from one codebase, using React Native + React Native Web. This is
  the only app; it composes `@postpal/ui` and `@postpal/content`.
- **`packages/content`** — a Zod schema (`ProcedureContent`) plus the
  clinical copy instances (`avc-ufe`, `demo-pae`). Content is parsed at load,
  so incomplete or malformed clinical copy fails the build, not just a test.
- **`packages/ui`** — the shared UI (the `<Daybook>` component and its
  subtree), built on React Native primitives with NativeWind (Tailwind
  classes on RN), Reanimated for motion, and `@gorhom/bottom-sheet` for the
  modal sheets. One implementation renders on every platform via React
  Native Web on the web target and native RN elsewhere.

The Next.js app that previously lived at `apps/web` has been retired now
that Expo's web target replaces it. It's still recoverable from git history
(and from `main`, which predates this port) if needed for reference.

## Running it

```bash
npm install
npm run start        # or: npm run dev — runs `expo start` in apps/app
```

From the Expo CLI, press `w` for web, `i` for iOS simulator, or `a` for
Android emulator.

```bash
npm run build         # `expo export` — production web + native bundles
```

## Testing

```bash
npm test              # jest across the content, ui, and ui-rn projects
npm run typecheck      # tsc --noEmit across all workspaces
```

## What this proves

Three PoC criteria drove the package split:

1. **A second procedure is a content file, not a code change.** `demo-pae`
   is a second `ProcedureContent` instance authored purely as data, and
   renders through the unmodified `<Daybook>` — see
   `packages/ui/src/daybook/demo-pae.rn.test.tsx`.
2. **One UI, three platforms.** `@postpal/ui` has no platform-specific
   branches; the same component tree runs on web (via React Native Web),
   iOS, and Android.
3. **Incomplete content fails fast.** `ProcedureContentSchema.parse(...)`
   runs at module load, so a clinic's copy that's missing a required field
   breaks the build/test run immediately rather than surfacing as a runtime
   gap in the product.
