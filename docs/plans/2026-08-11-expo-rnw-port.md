# Expo + React Native Web Port — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or subagent-driven-development) to implement this plan task-by-task, with a code review after each task.

**Goal:** Rebuild PostPal's visual layer on Expo + React Native + React Native Web so ONE codebase runs on web + iOS + Android with native widgets on mobile — reusing `@postpal/content`, the Zustand store, and `deriveDayView` unchanged, and matching the fidelity of the existing web build.

**Architecture:** A single Expo Router app (`apps/app`) targets all three platforms. `packages/content` is untouched. `packages/ui` is transformed from React-DOM components into universal React Native components (View/Text/Pressable + NativeWind + react-native-svg + Reanimated + @gorhom/bottom-sheet), keeping `store.ts` and `derive.ts` verbatim. The Next.js `apps/web` is retired — Expo's web target (React Native Web) replaces it. The spike (`apps/app`, commit `8110170`) already validated the stack on web + iOS; this plan scales it to the whole app.

**Tech stack:** Expo SDK 57, React Native 0.86, React Native Web 0.21, NativeWind 4.2 (Tailwind v3 config model), react-native-svg 15, react-native-reanimated 4.5 + react-native-gesture-handler 2.32 (already installed), @gorhom/bottom-sheet (to add), expo-google-fonts (Petrona + Albert Sans), Zustand 5, Zod 4. Testing: keep node-env Jest for logic (store/derive/schema); add jest-expo + @testing-library/react-native for components.

**Fidelity spec (unchanged):** `prototypes/daybook.html` remains the visual/behavioral source of truth. The DOM `packages/ui` (on `main`) is the reference implementation to port from — each component already exists there, reviewed and tested. This is a **translation**, not a redesign.

**Working branch:** `feat/expo-rnw-spike` (continue on it, or rename to `feat/expo-rnw-port`). `main` retains the DOM web build as history; `apps/web` and the DOM `packages/ui` stay intact on `main`.

---

## What carries over vs. what is rebuilt

**Reused verbatim (do not rewrite):**
- `packages/content/**` — schema + all clinical copy + `demo-pae`. Zero changes (Zod runs on Hermes).
- `packages/ui/src/store.ts` (Zustand vanilla + context — DOM-free) and its test.
- `packages/ui/src/derive.ts` (`deriveDayView` — pure logic; `structuredClone` exists on Hermes/RN 0.86) and its test.
- Every design decision, copy string, layout value, and the state-machine semantics — already reviewed.

**Rebuilt (DOM → RN):** every visual component — `renderCopy`, `FaceGlyph`, `Receipt`, `useSettle`, `HeroBlock`, `CheckIn`, `NotedView`, `TodayPage`, `NextBar`, `DaySwitcher`, `Daybook`, and the whole `sheets/*` system. Plus: the two web CSS files (`styles/tokens.css`, `styles/daybook.css`) become a NativeWind preset + Reanimated animations; `test-utils.tsx` (jsdom) becomes an RN render helper.

**Deleted:** `apps/web` (Next.js) — retired. Recoverable from `main`/history.

> Note: with a single universal Expo app, `packages/ui` is no longer about sharing across multiple apps (RNW shares across *platforms* automatically). It's kept as a package for separation of concerns, isolated testing, and the option of a future second surface (e.g. a clinic dashboard). Components could alternatively live in `apps/app`; we keep the package to honor the shared-UI thesis.

---

## The DOM → RN conversion discipline (the spike's key finding — apply everywhere)

These are the systematic differences the spike proved out. Encode them once (Task 1) so screen authors don't re-derive them:

| Web (DOM) | React Native | Where it bites |
|---|---|---|
| `line-height: 1.36` (unitless) | absolute px: `leading-[33px]` | every text block — unitless collapses lines in RN |
| `letter-spacing: .14em` | px: `.14em × 11px = tracking-[1.54px]` | eyebrows, labels, NEXT micro-label |
| `font-style: italic` / `font-bold` (synthesized) | a **separate loaded font family** per weight/italic | hero `<em>` → `font-serif-italic`; bold labels → `font-sans-bold` |
| `position: fixed` | absolute footer `View` below a `ScrollView`, or flex-column with a bottom `View` | NextBar, sheet overlay, day switcher |
| `box-shadow` | `shadow-[…]` (NativeWind maps to shadow props/elevation) | face cards, sheet, Next pill |
| CSS `@keyframes` + transitions | Reanimated `entering`/`exiting` + `useReducedMotion()` | `.settle` stagger, sheet slide |
| DOM focus (`document.activeElement`) | RN accessibility props + `@gorhom/bottom-sheet` a11y | sheet focus management |
| `<div>`/`<span>`/`<button>`/`<input>` | `View`/`Text`/`Pressable`/`TextInput` | everything |
| `<em>`/`<b>` in `renderCopy` | nested `<Text>` (inherits size/line-height; overrides family/color) | all copy |
| CSS `@theme` tokens (Tailwind v4) | `theme.extend` in `tailwind.config.js` (NativeWind = Tailwind v3) | the palette |

---

## Task 1: Transform `packages/ui` into an RN package + shared foundation

**Files:**
- Modify: `packages/ui/package.json` (deps + peers + scripts), `packages/ui/jest.config.js`
- Create: `packages/ui/preset.js` (shared NativeWind preset — tokens + fonts), `packages/ui/src/primitives/typography.tsx` (text-scale), `packages/ui/src/test-utils.tsx` (RN)
- Move/port: `packages/ui/src/primitives/renderCopy.tsx`, `FaceGlyph.tsx`, `faces.ts` (from the spike + DOM reference)
- Delete: `packages/ui/src/styles/tokens.css`, `styles/daybook.css` (web-only)
- Keep untouched: `packages/ui/src/store.ts`, `store.test.ts`, `derive.ts`, `derive.test.ts`

**Step 1:** `package.json` — drop `react-dom`; add `react-native` to peers; add deps `nativewind`, `react-native-svg`, `react-native-reanimated`, `react-native-gesture-handler`, `@gorhom/bottom-sheet`; keep `zustand`, `@postpal/content`. Add a `tailwindcss@^3.4` devDep.

**Step 2:** `packages/ui/preset.js` — a NativeWind preset carrying the color tokens and `fontFamily` map (lift verbatim from `apps/app/tailwind.config.js` — the spike's `theme.extend.colors` and the `sans`/`sans-semibold`/`sans-bold`/`serif`/`serif-italic` families). Both `apps/app/tailwind.config.js` and any package-level config `require('@postpal/ui/preset')` so the palette has ONE source.

**Step 3:** `packages/ui/src/primitives/typography.tsx` — encode the px-lineHeight/tracking/italic-family discipline once. Export a small `<Txt variant=...>` (or className constants) for the recurring text roles from the Task 6.5 table: `eyebrow`, `hero` (24.5px/33px serif), `heroEm` (serif-italic clay), `facelab`, `body` (15px serif), `chapterHeading` (18.5px serif-italic), `factK`, `factV`, `receipt` (24.5px serif). Screens use these instead of re-deriving arbitrary values.

**Step 4:** Port `renderCopy.tsx` from the spike **with the unclosed-tag fix** — the spike's version (line 53) flushes innermost-first (`while (stack.length) out.push(...stack.pop()!.children)`), the exact text-reordering bug fixed in the DOM version. Replace with source-order flush `for (const frame of stack) out.push(...frame.children)`, and port the two regression tests (`'<em>a <b>c'` → `'a c'`; `'</em> huh'` doesn't throw). Port `FaceGlyph.tsx` (react-native-svg, from the spike) and `faces.ts` (FACE_MOUTHS/FACE_LABELS/faceReceiptText/faceAckKey — from the DOM reference, pure module).

**Step 5:** Testing — set `packages/ui/jest.config.js` to two projects: a **node** project for `store`/`derive` (unchanged), and a **jest-expo** project (`preset: 'jest-expo'`, `@testing-library/react-native`, NativeWind jsx transform) for `*.rn.test.tsx` component tests. `test-utils.tsx` becomes `renderWithStore(day, ui)` using `@testing-library/react-native`'s `render` inside the store context provider.

**Step 6:** Verify: `npm test -w @postpal/ui` — store/derive/renderCopy tests green (renderCopy now includes the order-fix regression tests). `npm run typecheck -w @postpal/ui` clean.

**Step 7:** Commit: `refactor(ui): convert package to React Native + shared NativeWind preset and typography scale`

---

## Task 2: `Receipt` + `useSettle` (Reanimated) primitives

**Files:** `packages/ui/src/primitives/Receipt.tsx`, `useSettle.ts`, tests

**Step 1:** `Receipt.tsx` — a `Pressable` (role/accessibility `button`) with the `.receipt` layout (flex-row, gap, py-4, border-b line), an icon slot and a `<Text>` children slot, `onPress` → `onActivate`. RN Pressable already gives press states and a11y; no keyboard handler needed.

**Step 2:** `useSettle.ts` — keep the same signature/semantics (settle once per `day:phase`, render-pure via effect — the DOM fix), but return a Reanimated **entering** animation descriptor instead of a CSS class. Components apply `Animated.View entering={settle ? FadeInDown.duration(200).delay(d) : undefined}`. Gate on `useReducedMotion()` from reanimated (returns no animation when reduce is on). This replaces the `@keyframes settle` + `--d` stagger.

**Step 3:** Verify with `@testing-library/react-native`: Receipt fires `onActivate` on press; the settle hook returns an animation on first mount of a `day:phase` and none on re-render (StrictMode-safe, mirroring the DOM test).

**Step 4:** Commit: `feat(ui): RN Receipt and Reanimated-based useSettle`

---

## Task 3: `HeroBlock` + `CheckIn` (promote the spike, wire the store)

**Files:** `packages/ui/src/daybook/HeroBlock.tsx`, `CheckIn.tsx`, `status.tsx` (shared status row), tests

**Step 1:** Promote the spike's check-in (`apps/app/src/app/index.tsx`) into `packages/ui`: split into `CheckIn` (status row + eyebrow + full hero + facelab + 5 `FaceGlyph` faces + facecap) and a shared `HeroBlock` (eyebrow + hero via `renderCopy`, tappable to toggle `heroExpanded`). Faces are `Pressable` → `store.selectFace(i)`, with `accessibilityLabel={FACE_LABELS[i]}` and `accessibilityState={{selected}}`.

**Step 2:** Wire to the store via `useDaybook` selectors (the store/context are reused unchanged). CheckIn takes `{ day, statusLabel }`.

**Step 3:** Verify (RN testing): five faces render with correct a11y labels; pressing a face advances to `noted`; calm budget (no chips) in checkin.

**Step 4:** Commit: `feat(ui): check-in and shared hero block on RN`

---

## Task 4: `NotedView`

**Files:** `packages/ui/src/daybook/NotedView.tsx`, test

**Step 1:** Port from the DOM `NotedView`: HeroBlock (truncated) + face `Receipt` (FaceGlyph 30 + "Today feels: <em>…</em>") + ack line + `ANYTHING TO NOTE TODAY?` + chips (`Pressable`s → `store.chooseChip`) OR the inline note input when `noteInputOpen` (RN `TextInput`, value↔`noteDraft`, submit/`cancel` buttons; on native there's no Escape — provide a visible "back" control, which the DOM already has). Settle via Task-2 animations.

**Step 2:** Verify: chips render per day; a symptom chip opens the interpreter sheet (Task 7) before recording; "Nothing new" → page; "Something else…" → input (phase-guarded in the store already).

**Step 3:** Commit: `feat(ui): noted view on RN`

---

## Task 5: `TodayPage` (four chapters)

**Files:** `packages/ui/src/daybook/TodayPage.tsx`, test

**Step 1:** Port the four chapters from the DOM `TodayPage`: hero + face receipt + note receipt (note as a plain `<Text>` child — the XSS-safe port; never through `renderCopy`); *How today might feel* (feel entries via `renderCopy`, margin notes, the `.noop` "Keep reading" dead-end as a non-pressable styled `Text`); *What you can do — and not yet* (BACK/NOT YET, omitted when null); *Your medicines today* (omitted when `meds` null; line from `deriveDayView(day, logged).medsLine`; "open →" `Pressable` → `openSheet(meds.sheet)`); *What's ahead*. Preserve the settle stagger delays (60/120/180/240/300ms) via Task-2 animations. Keep the straight-ASCII "What's ahead" apostrophe.

**Step 2:** Verify across days: day 1 no BACK; day 20 no meds chapter, no NOT YET, "everything ✓"; user-note text renders as literal text (no markup injection).

**Step 3:** Commit: `feat(ui): today page with four chapters on RN`

---

## Task 6: `NextBar` + `DaySwitcher` + `Daybook` shell

**Files:** `packages/ui/src/daybook/NextBar.tsx`, `DaySwitcher.tsx`, `Daybook.tsx`, `packages/ui/src/index.ts`, test

**Step 1:** `NextBar` — absolute footer `View` (the fixed→absolute pattern the spike proved), Next slot from `deriveDayView(day, logged).next` (tone → `bg-clay-fill`/`bg-pine`), `accessibilityLabel` `Next: {label} — {sub}`, `onPress` → `openSheet(next.sheet)`; right "Feeling something?" → `openSheet('feel')`. Renders in every phase.

**Step 2:** `DaySwitcher` — dev-control pill row from `listDays(content)`; keep it visually not-product (the muted grays). `onPress` → `switchDay`.

**Step 3:** `Daybook` shell — creates the store once (`useRef(createDaybookStore(initialDay))`), provides `DaybookStoreContext`, renders the status row once + exactly one phase view (CheckIn/NotedView/TodayPage — the one-view-per-phase mount model `useSettle` depends on), NextBar, DaySwitcher, and the SheetHost (Task 7). Wrap content in `SafeAreaView`. Props `{ content, initialDay?, statusLabel }`. `index.ts` exports `Daybook` + store types. Keep the `'use client'`-equivalent boundary irrelevant on RN (native has no server components; RNW handles it).

**Step 4:** Verify: initial day renders check-in with the correct tone Next slot; day switcher moves days and lands on a fresh check-in; day 10 pine milestone; day 20 pine cycle slot.

**Step 5:** Commit: `feat(ui): next bar, day switcher, and daybook shell on RN`

---

## Task 7: The sheet system (`@gorhom/bottom-sheet`)

**Files:** `packages/ui/src/sheets/SheetHost.tsx` + `MedRailSheet.tsx`, `CanCantSheet.tsx`, `CycleSheet.tsx`, `InterpreterSheet.tsx`, `FeelSheet.tsx`, test

**Step 1:** `SheetHost` — driven by `store.sheet`; render a `BottomSheetModal` (from `@gorhom/bottom-sheet`) that presents when `sheet` is non-null and dismisses to `closeSheet` on backdrop/drag. This replaces the hand-rolled DOM overlay + focus management + CSS slide: the library provides the slide animation (Reanimated), the grab handle, backdrop, accessibility, and keyboard handling. Reduced-motion respected via the library/reanimated. Content swaps (feel→interpreter, escalate) update the body without re-presenting.

**Step 2:** Port the five bodies from the DOM `sheets/*`, DOM→RN, reusing the store actions and `deriveDayView`:
- `MedRailSheet` — `deriveDayView(day, logged)` groups/rows; done rows struck (RN `textDecorationLine`); NOW row clay-soft; "Log it" `Pressable` → `logDose`; Tylenol meter (a `View` bar); quiet/paired lines.
- `CanCantSheet`, `CycleSheet` (pills → `answerCycle`, footnote on select).
- `InterpreterSheet` — answer view (tag/head/body/threshold + alert icon via react-native-svg + "THE ONE LINE YOUR CLINIC WATCHES", "Yes, that helps" → `resolveInterpreter`, "Not quite" → `escalateInterpreter`); escalated view (gate threshold, `interp.care ?? meta.selfCareDefault`, `meta.emergencyLine` via `renderCopy`, single "Back to today"). **No call button** (deviation #3 preserved).
- `FeelSheet` — interpreter keys as chips + "Something else…" (→ `chooseChip(SOMETHING_ELSE)` + `closeSheet`, phase-guarded in the store).

**Step 3:** Verify the journeys (RN testing, mirroring the DOM sheet tests): day 1 Log → rail + Next update; day 5 symptom chip → interpreter → "Yes" records + advances; "Not quite" → escalation with 911 line and NO call button; day 20 cycle → "Heavier" → footnote; day 10 can/can't; feel → interpreter.

**Step 4:** Commit: `feat(ui): sheet system on RN via @gorhom/bottom-sheet`

---

## Task 8: `apps/app` integration — thin shell, fonts, all three targets

**Files:** `apps/app/src/app/_layout.tsx`, `apps/app/src/app/index.tsx`, `apps/app/package.json`, `apps/app/tailwind.config.js`

**Step 1:** `_layout.tsx` — load fonts (Petrona + Albert Sans, incl. italic families) via `useFonts`; wrap the tree in `GestureHandlerRootView` + `BottomSheetModalProvider` + `SafeAreaProvider` (required by the sheet library). Splash held until fonts ready.

**Step 2:** `index.tsx` — collapse the spike's inline screen to `<Daybook content={avcUfe} initialDay={5} statusLabel="Maya · UFE Feb 12" />` from `@postpal/ui`. Add `@postpal/ui` as a workspace dep. `tailwind.config.js` `require('@postpal/ui/preset')` and extend `content` globs to include `packages/ui/src`.

**Step 3:** Verify: `npx expo start --web` renders the full app (all days/phases/sheets); iOS simulator run works; Android (if an emulator/SDK is available — else note it). `npm test` + `npm run typecheck` green across workspaces.

**Step 4:** Commit: `feat(app): compose @postpal/ui Daybook across web + iOS + Android`

---

## Task 9: Retire `apps/web`, cross-platform parity pass, final verification

**Step 1:** Delete `apps/web` and remove it from the root workspace/jest config (recoverable from `main`/history). Update the root `package.json` `dev`/`build` scripts to target `apps/app`. Update the `demo-pae` render test to the RN `Daybook` (criterion 1 — a second procedure still renders unchanged).

**Step 2:** Parity screenshots vs `prototypes/screenshots/`: web (Playwright, 430px), iOS (simulator), Android (emulator if available) for days 1/3/5/10/20 in the page phase, plus the med-rail/interpreter/cycle sheets. The prototype is the spec; report drift.

**Step 3:** Accessibility spot-check on native: faces reachable via screen reader (VoiceOver labels), sheet dismissable, reduced-motion honored.

**Step 4:** Full gate: `npm test` (all projects), `npm run typecheck`, `npx expo export --platform web` (web build), and a native build (`expo run:ios` Release) succeed.

**Step 5:** Update `CLAUDE.md`/README for the new structure (one Expo app, retired Next.js). Commit, push `feat/expo-rnw-spike`, and use `finishing-a-development-branch`.

---

## Out of scope (deliberately)

- Real backend/persistence/auth/real notifications — state still resets on reload; the day switcher stays a dev control.
- EAS build/submit pipelines, App Store/Play submission — separate effort.
- New product surfaces (clinic dashboard) — the package boundary leaves room; nothing built.
- Pixel-identical parity on every platform — target is visually-equivalent, fidelity-faithful (the spike showed this is achievable; platform seams like native status bars are expected).

## Risks & mitigations

- **Sheet fidelity** is the biggest unknown (the DOM sheet is bespoke). Mitigation: `@gorhom/bottom-sheet` is the researched, RNW-compatible choice; Task 7 is the one to review hardest, and it can fall back to a custom Reanimated modal if the library constrains the design.
- **Android** wasn't in the spike. Mitigation: Task 8/9 add an Android run; RNW/Expo makes it low-risk, but budget time for platform-specific font/shadow tweaks.
- **Testing infra churn** (jsdom → jest-expo). Mitigation: Task 1 sets it up once; logic tests (the bulk of confidence) are unaffected.
