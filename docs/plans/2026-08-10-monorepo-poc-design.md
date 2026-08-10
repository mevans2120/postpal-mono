# Monorepo Proof of Concept — Design

**Date:** 2026-08-10
**Status:** Validated design, not yet implemented
**Scope:** Prove the monorepo approach by porting the Daybook prototype (`prototypes/daybook.html`) into a real workspace structure: a Next.js app composing a shared UI package and a shared content package.
**Follows from:** `docs/strategy/2026-06-09-product-strategy-evaluation.md` step 3 (tech planning: monorepo structure, clinic content authoring/versioning) and the completed prototype (`docs/plans/2026-06-10-daybook-interactive-prototype.md`).

---

## What this PoC exists to prove

The prototype already discovered the product's natural seam: a 215-line `DAYS` content object on one side, a generic state machine and sheet system on the other. This PoC hardens that seam into real package boundaries and succeeds when three claims hold:

1. **A second procedure is a content file, not a code change.** Adding day 6, or a PAE variant, means writing data that satisfies the schema — nothing in `ui` or `web` moves.
2. **A second surface could consume `@postpal/ui` without touching `apps/web`.** The shared-UI package is the main reason for this PoC (per decision 2026-08-10): a future native app or clinic portal imports the same components.
3. **Incomplete clinic content fails CI before it can render.** The prototype's `selfCheckDays()` console check becomes a schema that breaks the build.

Decisions locked during design review (2026-08-10):

- PoC scope: structure + content separation. No persistence, no care-tracker reuse yet.
- Content shape: generic procedure-agnostic schema + one AVC/UFE instance (no CMS-shaped IDs yet).
- Styling: Tailwind theme tokens + a small global CSS layer for the fidelity-critical bits.
- UI location: `packages/ui` from day one, consumed by `apps/web`.

## 1. Monorepo structure & tooling

```
postpal-monorepo/
├── apps/
│   └── web/                  # Next.js App Router — composes ui + content
├── packages/
│   ├── content/              # @postpal/content — schema + AVC/UFE instance
│   └── ui/                   # @postpal/ui — all Daybook components
├── prototypes/               # untouched — stays deployed as-is
└── docs/
```

- **npm workspaces, no Turborepo.** Three workspaces need no build orchestration; `npm run dev -w apps/web` is the whole story. Turborepo is a later add.
- **Namespace `@postpal/*`**, internal deps declared as `"@postpal/ui": "*"` (npm workspaces' equivalent of the `workspace:*` convention).
- **Packages ship raw TypeScript — no build step.** `apps/web` consumes them via Next.js `transpilePackages`. No tsup/rollup config, no dist folders, no watch-mode coordination. Trade-off: packages are only consumable by bundler-based apps, which is fine until a non-Next consumer exists.
- **Shared config at root:** one strict `tsconfig.base.json` each workspace extends; ESLint and Prettier at root.
- **Vercel:** the existing `vercel.json` deployment of `prototypes/` stays untouched — shared prototype links never break. `apps/web` becomes a second Vercel project with root directory `apps/web`, with the same `noindex` treatment.
- **Jest at root** with per-workspace projects config, so `npm test` runs content + ui + web suites in one pass.

## 2. `@postpal/content` — schema + AVC/UFE instance

```
packages/content/
├── src/
│   ├── schema.ts            # Zod schemas + inferred types
│   ├── avc-ufe/
│   │   ├── index.ts         # ProcedureContent instance
│   │   └── days/            # day-01.ts, day-03.ts … one file per day
│   └── index.ts             # exports: schemas, types, getDay(), listDays()
└── schema.test.ts           # parse the instance; port of selfCheckDays()
```

- **The schema is procedure-agnostic; the instance is not.** `ProcedureContentSchema` describes any short-recovery arc: `{ meta: { id, clinic, procedure, contactName }, days: Record<number, DayContent> }`, with `DayContentSchema`, `InterpreterSchema`, `MedRailSchema`, and sheet schemas mirroring the shapes already proven in `DAYS`.
- **`selfCheckDays()` becomes the schema itself.** Required fields are Zod-required. The cross-reference rules move into `.superRefine()`: every symptom chip has a matching interpreter, `next.sheet` and `meds.sheet` point at real sheet objects, `back` and `notYet` are never both null. The test parses the AVC/UFE instance; CI fails on incomplete content.
- **Inline markup stays, but constrained.** Copy fields may contain only `<em>`/`<b>` (documented in the schema). A `renderCopy()` helper in `@postpal/ui` parses that subset into React elements — no `dangerouslySetInnerHTML`, which retires the prototype's trusted-HTML shortcut.
- **Tones and sheet kinds are enums** (`clay | pine`; `medrail | cancant | cycle`) so invalid content fails at parse, not at render.

## 3. `@postpal/ui` — components + state

```
packages/ui/
├── src/
│   ├── daybook/          # CheckIn, NotedView, TodayPage, NextBar, DaySwitcher
│   ├── sheets/           # SheetHost + MedRail, CanCant, Cycle, Interpreter, Feel
│   ├── primitives/       # FaceGlyph, Chip, Receipt, Chapter, Threshold, renderCopy
│   ├── store.ts          # Zustand store
│   └── styles/           # tokens.css (Tailwind @theme) + daybook.css (the small layer)
```

- **Components are content-in, events-out.** Each takes typed props from `@postpal/content` and knows nothing about which clinic or day it renders. The package boundary enforces the content/rendering split the prototype only implied.
- **The Zustand store ports `freshState()`** — `day, phase, face, note, heroExpanded, noteInputOpen, noteDraft, sheet` — with actions (`selectFace`, `chooseChip`, `openSheet`, `closeSheet`, `logDose`, `switchDay`…) replacing the prototype's global `render()` calls.
- **Deliberate fix: content becomes immutable.** The prototype's `logNowDose()` mutates `DAYS` in place. Here, dose logging writes runtime state to the store (`takenDoses`), and the med rail + Next slot render a derived view: content ⊕ runtime state. Same behavior, but the content package stays read-only — required if content is ever authored externally.
- **Styling:** `tokens.css` maps the palette (`--paper`, `--clay`, `--clay-fill`, `--clay-deep`, `--pine`…) to Tailwind theme tokens, preserving the documented WCAG contrast pairs (see the contrast note at the top of `prototypes/daybook.html`). `daybook.css` carries verbatim what Tailwind handles poorly: the `::before` tap-target extensions (≥44px), `.settle` keyframes with stagger, and sheet transitions — all gated behind `prefers-reduced-motion: no-preference` as in the prototype.
- **Fonts** (Petrona + Albert Sans) load via `next/font` in the app and are exposed as CSS variables the ui package consumes.
- **Accessibility carries over as ported behavior, not vibes:** sheet `role="dialog"` + `aria-modal`, focus moves into the sheet on open and returns to the opener on close, focus successor logic on in-place rebuilds, Escape closes, reduced-motion gating. Verified in the test pass.
- **`apps/web` is thin:** one page, fonts, `<Daybook content={avcUfe} />`. The DaySwitcher remains a dev control, deliberately not product-styled.

## 4. Testing & verification

- **Jest, three layers.**
  - `content`: parse the AVC/UFE instance against the schema, plus a deliberately-broken fixture proving the refinements catch a missing interpreter.
  - `ui` (React Testing Library): face tap advances checkin → noted; symptom chip opens the interpreter before recording; "Yes, that helps" lands on the page with the note recorded; `logDose` updates both the rail and the Next slot (including the terminal "Medicines done" pine state); day 20 renders no meds chapter and no NOT YET line.
  - `web`: one smoke test that the page composes.
- **Playwright parity pass** (webapp-testing skill) against the `apps/web` dev server: the same journeys the prototype verified — day-5 happy path (face → Nothing new → 4 chapters → med rail → Log → slot updates), day-20 cycle check-in, day-1 dose logging — plus per-day screenshots compared side by side with `prototypes/screenshots/`. **The prototype is the spec; drift is a bug.**

## Out of scope (deliberately)

- Persistence, auth, notifications — state still resets on reload
- Real day-progression logic — the day switcher stays a dev control
- CMS integration or content IDs/provenance (schema leaves room; nothing built)
- care-tracker code reuse (separate evaluation, per strategy doc)
- Turborepo, night theming, native app

## Optional receipt

If we want claim 1 provable in the repo: a stub `content/demo-pae/` with one day of placeholder content, rendering under the same UI with zero code changes. Cheap to add at the end; skip if it feels like scope creep.
