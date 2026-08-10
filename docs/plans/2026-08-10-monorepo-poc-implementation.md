# Monorepo PoC Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Port the Daybook prototype into a real monorepo — `apps/web` (Next.js App Router) composing `@postpal/ui` (React + Zustand + Tailwind) and `@postpal/content` (Zod schema + AVC/UFE content instance) — with behavior parity against `prototypes/daybook.html`.

**Architecture:** npm workspaces, no Turborepo. Packages ship raw TypeScript consumed via Next.js `transpilePackages`. Content is immutable data validated by a procedure-agnostic Zod schema; all runtime state (check-in progress, logged doses, open sheet) lives in a Zustand store in `@postpal/ui`; the med rail and Next slot are *derived* from content ⊕ store state. Design doc: `docs/plans/2026-08-10-monorepo-poc-design.md`.

**Tech Stack:** TypeScript (strict, `verbatimModuleSyntax`), Next.js 16 App Router, React 19, Zod 4, Zustand 5, Tailwind CSS 4 (CSS-first `@theme`), Jest 30 + @swc/jest + React Testing Library, Playwright via the webapp-testing skill for the final parity pass.

**Working directory:** `.worktrees/monorepo-poc` (branch `feature/monorepo-poc`). All paths below are relative to that worktree root.

**The spec is the prototype.** `prototypes/daybook.html` (1,090 lines) is the source of truth for all copy, styling values, and behavior. Line references below point into that file. When this plan and the prototype disagree, the prototype wins — except for the four deliberate deviations listed next.

**Deliberate deviations from the prototype (everything else is parity):**
1. Content is immutable — `logNowDose()`'s mutation of `DAYS` becomes a pure derivation from a logged-dose count in the store.
2. No `innerHTML` — copy's `<em>`/`<b>` markup renders through a `renderCopy()` parser.
3. `SELF_CARE_DEFAULT` and `EMERGENCY_LINE` (prototype lines 726–727) move into content `meta` — they're clinical copy, so they belong to the clinic's content, not the UI.
4. HTML entities in copy strings (`&gt;`, `&amp;`) become literal characters (`>`, `&`) — we're no longer concatenating HTML.

---

## Task 1: Root workspace scaffold

**Files:**
- Create: `package.json`, `tsconfig.base.json`, `jest.config.js`
- Modify: `.gitignore`

**Step 1:** Create `package.json`:

```json
{
  "name": "postpal-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "npm run dev -w apps/web",
    "build": "npm run build -w apps/web",
    "test": "jest",
    "typecheck": "npm run typecheck --workspaces --if-present"
  },
  "devDependencies": {
    "@swc/core": "^1.7.0",
    "@swc/jest": "^0.2.36",
    "@testing-library/jest-dom": "^6.4.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/jest": "^30.0.0",
    "jest": "^30.0.0",
    "jest-environment-jsdom": "^30.0.0",
    "typescript": "^5.5.0"
  }
}
```

**Step 2:** Create `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "noEmit": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true
  }
}
```

`verbatimModuleSyntax` enforces `import type` for type-only imports (project rule).

**Step 3:** Create root `jest.config.js` (projects filled in as workspaces appear):

```js
module.exports = {
  projects: [
    '<rootDir>/packages/content/jest.config.js'
  ]
};
```

**Step 4:** Append to `.gitignore`:

```
node_modules/
.next/
```

**Step 5:** Verify: `npm install` succeeds (creates root `package-lock.json`). `npx tsc -p tsconfig.base.json --noEmit` errors with "No inputs were found" — expected, the base config is extend-only.

**Step 6:** Commit: `git add -A && git commit -m "chore: scaffold npm workspaces root with shared ts/jest config"`

---

## Task 2: `@postpal/content` scaffold + copy-string and meta schemas

The schema formalizes the prototype's `selfCheckDays()` (lines 455–496). TDD from here on.

**Files:**
- Create: `packages/content/package.json`, `packages/content/tsconfig.json`, `packages/content/jest.config.js`
- Create: `packages/content/src/schema.ts`
- Test: `packages/content/src/schema.test.ts`

**Step 1:** Create `packages/content/package.json`:

```json
{
  "name": "@postpal/content",
  "version": "0.0.0",
  "private": true,
  "exports": { ".": "./src/index.ts" },
  "scripts": { "typecheck": "tsc --noEmit" },
  "dependencies": { "zod": "^4.0.0" }
}
```

`packages/content/tsconfig.json`:

```json
{ "extends": "../../tsconfig.base.json", "include": ["src"] }
```

`packages/content/jest.config.js`:

```js
const swcTransform = ['@swc/jest', {
  jsc: { parser: { syntax: 'typescript', tsx: true }, transform: { react: { runtime: 'automatic' } } }
}];
module.exports = {
  displayName: 'content',
  testEnvironment: 'node',
  transform: { '^.+\\.(t|j)sx?$': swcTransform }
};
```

Run `npm install` at root so zod links.

**Step 2: Write the failing test** — `packages/content/src/schema.test.ts`:

```ts
import { CopyString, MetaSchema } from './schema';

describe('CopyString', () => {
  it('accepts plain text and em/b markup', () => {
    expect(CopyString.parse('Cramping in waves')).toBe('Cramping in waves');
    expect(CopyString.parse('call if it reaches <b>101°F</b>')).toContain('<b>');
    expect(CopyString.parse('eases <em>from here</em>')).toContain('<em>');
  });
  it('rejects any other tag', () => {
    expect(() => CopyString.parse('<script>alert(1)</script>')).toThrow();
    expect(() => CopyString.parse('a <span>styled</span> word')).toThrow();
    expect(() => CopyString.parse('line<br>break')).toThrow();
  });
});

describe('MetaSchema', () => {
  it('requires clinic identity and the shared clinical lines', () => {
    expect(() => MetaSchema.parse({ id: 'avc-ufe', clinic: 'AVC' })).toThrow();
    expect(MetaSchema.parse({
      id: 'avc-ufe',
      clinic: 'Advanced Vascular Centers',
      procedure: 'Uterine fibroid embolization (UFE)',
      contactName: 'Carrie, PA-C',
      selfCareDefault: 'Try what is on today’s page.',
      emergencyLine: 'Sudden severe pain? <b>Call 911.</b>'
    }).contactName).toBe('Carrie, PA-C');
  });
});
```

**Step 3:** Run: `npx jest packages/content -t CopyString`
Expected: FAIL — `Cannot find module './schema'`.

**Step 4: Minimal implementation** — `packages/content/src/schema.ts`:

```ts
import { z } from 'zod';

/**
 * Copy fields may contain ONLY <em> and <b> markup (rendered by
 * @postpal/ui renderCopy — never innerHTML). Anything else fails parse.
 */
export const CopyString = z.string().refine(
  (s) => !/<(?!\/?(em|b)>)/.test(s),
  { message: 'copy may only contain <em> and <b> tags' }
);

export const MetaSchema = z.object({
  id: z.string(),
  clinic: z.string(),
  procedure: z.string(),
  contactName: z.string(),
  selfCareDefault: CopyString,
  emergencyLine: CopyString
});
```

**Step 5:** Run: `npx jest packages/content` — Expected: PASS (3 tests).

**Step 6:** Commit: `git add -A && git commit -m "feat(content): scaffold package with copy-string and meta schemas"`

---

## Task 3: Leaf schemas — interpreter, sheets, day fragments

Shapes mirror the prototype's `DAYS` entries exactly (see day 1, lines 232–275).

**Files:**
- Modify: `packages/content/src/schema.ts`
- Test: `packages/content/src/schema.test.ts`

**Step 1: Write the failing tests** (append):

```ts
import {
  InterpreterSchema, MedRailSchema, CanCantSchema, CycleSchema, NextSchema
} from './schema';

describe('leaf schemas', () => {
  it('parses a prototype-shaped interpreter, care optional', () => {
    const parsed = InterpreterSchema.parse({
      tag: 'EXPECTED ON DAY 1',
      head: 'Strong, wave-like cramping is the procedure working.',
      body: 'Most women describe day 1 as the hardest.',
      threshold: 'call if pain is <b>not controlled by your scheduled medicines</b>'
    });
    expect(parsed.care).toBeUndefined();
  });

  it('parses a med rail with 3-tuple rows and meter', () => {
    const rail = MedRailSchema.parse({
      title: 'Your medicines · day 1',
      groups: [
        { label: 'THIS MORNING', rows: [['8:00', 'Ibuprofen 800', 'taken 8:10 ✓']], done: true },
        { label: 'NEXT · IN 40 MIN', rows: [['1:00', 'Ibuprofen 800|take with food', 'LOG']], now: true }
      ],
      meter: [0, 4000, 'TYLENOL TODAY'],
      quiet: 'After the 9:00 doses, nothing until morning. Rest.',
      paired: 'Tasha is paired and can log doses for you.'
    });
    expect(rail.groups[1].now).toBe(true);
  });

  it('constrains next.tone and next.sheet to enums', () => {
    expect(() => NextSchema.parse({ label: 'x', sub: 'y', tone: 'mauve', sheet: 'medrail' })).toThrow();
    expect(() => NextSchema.parse({ label: 'x', sub: 'y', tone: 'pine', sheet: 'popover' })).toThrow();
    expect(NextSchema.parse({ label: 'Cycle 1 check-in', sub: 'when your period ends', tone: 'pine', sheet: 'cycle' }).sheet).toBe('cycle');
  });

  it('parses cancant and cycle sheets', () => {
    expect(CanCantSchema.parse({
      title: 'What you can do — and not yet',
      back: 'driving ✓',
      notYet: [['Baths, pools & hot tubs', '4 days — Feb 26']],
      footnote: 'Cleared dates come from your clinic’s discharge instructions.'
    }).notYet).toHaveLength(1);
    expect(CycleSchema.parse({
      title: 'Your first period since UFE — how did it compare?',
      options: ['Lighter', 'Same', 'Heavier'],
      footnote: 'Heavier for the first one or two cycles is common.'
    }).options).toHaveLength(3);
  });
});
```

**Step 2:** Run: `npx jest packages/content -t "leaf schemas"` — Expected: FAIL (not exported).

**Step 3: Implement** (append to `schema.ts`):

```ts
export const SheetKindSchema = z.enum(['medrail', 'cancant', 'cycle']);
export const ToneSchema = z.enum(['clay', 'pine']);

export const InterpreterSchema = z.object({
  tag: z.string(),
  head: CopyString,
  body: CopyString,
  threshold: CopyString,
  care: CopyString.optional()          // overrides meta.selfCareDefault (line 726)
});

export const MedRowSchema = z.tuple([z.string(), z.string(), z.string()]);
export const MedGroupSchema = z.object({
  label: z.string(),
  rows: z.array(MedRowSchema),
  done: z.boolean().optional(),
  now: z.boolean().optional()
});
export const MedRailSchema = z.object({
  title: z.string(),
  groups: z.array(MedGroupSchema),
  meter: z.tuple([z.number(), z.number(), z.string()]),
  quiet: CopyString,
  paired: z.string().nullable()
});

export const CanCantSchema = z.object({
  title: z.string(),
  back: z.string(),
  notYet: z.array(z.tuple([z.string(), z.string()])),
  footnote: z.string()
});

export const CycleSchema = z.object({
  title: z.string(),
  options: z.array(z.string()).min(2),
  footnote: z.string()
});

export const AckSchema = z.object({ better: z.string(), same: z.string(), worse: z.string() });
export const FeelEntrySchema = z.object({ body: CopyString, note: z.string().optional() });
export const AheadSchema = z.object({ k: z.string(), v: z.string(), details: z.boolean().optional() });
export const MedsLineSchema = z.object({ k: z.string(), line: z.string(), sheet: SheetKindSchema });
export const NextSchema = z.object({
  label: z.string(), sub: z.string(), tone: ToneSchema, sheet: SheetKindSchema
});
```

**Step 4:** Run: `npx jest packages/content` — Expected: PASS.

**Step 5:** Commit: `git commit -am "feat(content): leaf schemas for interpreter, med rail, sheets"`

---

## Task 4: `DayContent` + `ProcedureContent` with cross-reference refinements

This is where `selfCheckDays()` becomes enforcement.

**Files:**
- Modify: `packages/content/src/schema.ts`
- Test: `packages/content/src/schema.test.ts`

**Step 1: Write the failing tests.** Build a minimal-valid day fixture in the test file (helper `validDay()` returning a day with 3 chips `['Nothing new', 'Fever or chills', 'Something else…']`, one interpreter keyed `'Fever or chills'`, `next: { …sheet: 'medrail' }`, a `medrail`, `back: null`, `notYet: 'driving <b>24h</b>'`, plus the other required fields with short strings). Then:

```ts
describe('DayContentSchema cross-checks', () => {
  it('accepts a complete day', () => {
    expect(() => DayContentSchema.parse(validDay())).not.toThrow();
  });
  it('rejects a symptom chip with no interpreter', () => {
    const day = validDay();
    day.chips.push('Nausea');                          // no matching interpreter
    expect(() => DayContentSchema.parse(day)).toThrow(/interpreter/);
  });
  it('rejects next.sheet pointing at a missing sheet object', () => {
    const day = validDay();
    delete day.medrail;                                // next.sheet === 'medrail'
    expect(() => DayContentSchema.parse(day)).toThrow(/next\.sheet/);
  });
  it('rejects meds.sheet pointing at a missing sheet object', () => {
    const day = validDay();
    day.meds = { k: 'SO FAR', line: 'x', sheet: 'cycle' };  // no cycle object
    expect(() => DayContentSchema.parse(day)).toThrow(/meds\.sheet/);
  });
  it('rejects back and notYet both null', () => {
    const day = validDay();
    day.back = null; day.notYet = null;
    expect(() => DayContentSchema.parse(day)).toThrow(/back.*notYet|notYet.*back/);
  });
});
```

**Step 2:** Run — Expected: FAIL (`DayContentSchema` not exported).

**Step 3: Implement** (append):

```ts
/** Chips that intentionally have no interpreter (prototype line 457). */
const CHIPS_WITHOUT_INTERPRETERS = new Set(['Nothing new', 'Something else…']);

export const DayContentSchema = z.object({
  eyebrow: z.string(),
  heroFull: CopyString,
  heroShort: CopyString,
  chips: z.array(z.string()).min(1),
  ack: AckSchema,
  feel: z.array(FeelEntrySchema).min(1),
  turn: z.string(),
  back: z.string().nullable(),
  notYet: CopyString.nullable(),
  meds: MedsLineSchema.nullable(),
  ahead: z.array(AheadSchema).min(1),
  next: NextSchema,
  medrail: MedRailSchema.optional(),
  cancant: CanCantSchema.optional(),
  cycle: CycleSchema.optional(),
  interpreters: z.record(z.string(), InterpreterSchema)
}).superRefine((day, ctx) => {
  for (const chip of day.chips) {
    if (!CHIPS_WITHOUT_INTERPRETERS.has(chip) && !day.interpreters[chip]) {
      ctx.addIssue({ code: 'custom', message: `chip "${chip}" has no matching interpreter` });
    }
  }
  if (!day[day.next.sheet]) {
    ctx.addIssue({ code: 'custom', message: `next.sheet "${day.next.sheet}" has no matching sheet object` });
  }
  if (day.meds && !day[day.meds.sheet]) {
    ctx.addIssue({ code: 'custom', message: `meds.sheet "${day.meds.sheet}" has no matching sheet object` });
  }
  if (day.back == null && day.notYet == null) {
    ctx.addIssue({ code: 'custom', message: 'day has neither "back" nor "notYet" — the can/can’t chapter would render bare' });
  }
});

export const ProcedureContentSchema = z.object({
  meta: MetaSchema,
  days: z.record(z.string(), DayContentSchema)
});

export type Meta = z.infer<typeof MetaSchema>;
export type Interpreter = z.infer<typeof InterpreterSchema>;
export type MedRail = z.infer<typeof MedRailSchema>;
export type MedGroup = z.infer<typeof MedGroupSchema>;
export type CanCant = z.infer<typeof CanCantSchema>;
export type Cycle = z.infer<typeof CycleSchema>;
export type MedsLine = z.infer<typeof MedsLineSchema>;
export type Next = z.infer<typeof NextSchema>;
export type SheetKind = z.infer<typeof SheetKindSchema>;
export type DayContent = z.infer<typeof DayContentSchema>;
export type ProcedureContent = z.infer<typeof ProcedureContentSchema>;
```

**Step 4:** Run: `npx jest packages/content` — Expected: PASS (all suites).

**Step 5:** Commit: `git commit -am "feat(content): day and procedure schemas enforce selfCheckDays rules"`

---

## Task 5: Port the AVC/UFE content instance

**Files:**
- Create: `packages/content/src/avc-ufe/days/day-01.ts` … `day-03.ts`, `day-05.ts`, `day-10.ts`, `day-20.ts`
- Create: `packages/content/src/avc-ufe/index.ts`, `packages/content/src/index.ts`
- Test: `packages/content/src/avc-ufe/avc-ufe.test.ts`

**Step 1: Write the failing test:**

```ts
import { avcUfe, getDay, listDays } from '../index';
import { ProcedureContentSchema } from '../schema';

describe('AVC/UFE content instance', () => {
  it('parses against the schema — the CI-enforced selfCheckDays', () => {
    expect(() => ProcedureContentSchema.parse(avcUfe)).not.toThrow();
  });
  it('exposes exactly the five prototype days', () => {
    expect(listDays(avcUfe)).toEqual([1, 3, 5, 10, 20]);
  });
  it('keeps day-specific shape: day 1 no back, day 20 no meds or notYet', () => {
    expect(getDay(avcUfe, 1).back).toBeNull();
    expect(getDay(avcUfe, 20).meds).toBeNull();
    expect(getDay(avcUfe, 20).notYet).toBeNull();
    expect(getDay(avcUfe, 20).next.sheet).toBe('cycle');
  });
  it('decoded HTML entities into literal characters', () => {
    expect(getDay(avcUfe, 3).notYet).toContain('lifting >10 lb');
    expect(getDay(avcUfe, 10).cancant!.notYet[0][0]).toContain('&');  // "Baths, pools & hot tubs"
  });
});
```

**Step 2:** Run — Expected: FAIL.

**Step 3: Port the data.** Source: the `DAYS` object, `prototypes/daybook.html` lines 231–445 (day 1: 232–275, day 3: 276–319, day 5: 320–363, day 10: 364–409, day 20: 410–445). Copy **verbatim** — this copy is clinically grounded; do not re-author a single word. Per day file:

```ts
// day-01.ts
import type { DayContent } from '../../schema';

export const day01: DayContent = {
  eyebrow: 'DAY 1 · MORNING CHECK-IN',
  /* … the full day-1 object from lines 233–274 … */
};
```

Transformations while copying (and none other):
- Decode entities: `&gt;` → `>`, `&amp;` → `&` (they appear in `notYet` strings and `turn: "eating & energy"`).
- Keep `<em>`/`<b>` markup in strings — `CopyString` allows exactly those.
- `DayContent` type will force `back`/`notYet`/`meds` explicit `null`s where the prototype has them.

`avc-ufe/index.ts`:

```ts
import type { ProcedureContent } from '../schema';
import { day01 } from './days/day-01';
import { day03 } from './days/day-03';
import { day05 } from './days/day-05';
import { day10 } from './days/day-10';
import { day20 } from './days/day-20';

export const avcUfe: ProcedureContent = {
  meta: {
    id: 'avc-ufe',
    clinic: 'Advanced Vascular Centers',
    procedure: 'Uterine fibroid embolization (UFE)',
    contactName: 'Carrie, PA-C',
    // moved from ui constants (prototype lines 726–727) — clinical copy is content
    selfCareDefault: 'If that’s not you yet, it usually just needs a little more time. Try what’s on today’s page, and check back in an hour.',
    emergencyLine: 'Sudden severe pain, heavy bleeding, or trouble breathing? <b>Call 911.</b>'
  },
  days: { 1: day01, 3: day03, 5: day05, 10: day10, 20: day20 }
};
```

`src/index.ts`:

```ts
export * from './schema';
export { avcUfe } from './avc-ufe';
import type { ProcedureContent, DayContent } from './schema';

export function listDays(content: ProcedureContent): number[] {
  return Object.keys(content.days).map(Number).sort((a, b) => a - b);
}
export function getDay(content: ProcedureContent, day: number): DayContent {
  const d = content.days[day];
  if (!d) throw new Error(`no content for day ${day}`);
  return d;
}
```

**Step 4:** Run: `npx jest packages/content` — Expected: PASS. Also `npm run typecheck -w packages/content` — clean.

**Step 5:** Spot-check fidelity: `grep -c 'Carrie' packages/content/src/avc-ufe/days/*.ts` — every day file ≥1. Diff a sampled string (day 3 `heroFull`) character-for-character against line 278 of the prototype.

**Step 6:** Commit: `git commit -am "feat(content): AVC/UFE five-day instance ported verbatim from prototype"`

---

## Task 6: `@postpal/ui` scaffold + styles (tokens.css, daybook.css)

**Files:**
- Create: `packages/ui/package.json`, `packages/ui/tsconfig.json`, `packages/ui/jest.config.js`, `packages/ui/jest.setup.ts`
- Create: `packages/ui/src/styles/tokens.css`, `packages/ui/src/styles/daybook.css`
- Modify: root `jest.config.js` (add ui project)

**Step 1:** `packages/ui/package.json`:

```json
{
  "name": "@postpal/ui",
  "version": "0.0.0",
  "private": true,
  "exports": {
    ".": "./src/index.ts",
    "./styles/*": "./src/styles/*"
  },
  "scripts": { "typecheck": "tsc --noEmit" },
  "dependencies": {
    "@postpal/content": "*",
    "zustand": "^5.0.0"
  },
  "peerDependencies": { "react": "^19.0.0", "react-dom": "^19.0.0" },
  "devDependencies": { "react": "^19.0.0", "react-dom": "^19.0.0", "@types/react": "^19.0.0", "@types/react-dom": "^19.0.0" }
}
```

`tsconfig.json` mirrors content's. `jest.config.js`:

```js
const swcTransform = ['@swc/jest', {
  jsc: { parser: { syntax: 'typescript', tsx: true }, transform: { react: { runtime: 'automatic' } } }
}];
module.exports = {
  displayName: 'ui',
  testEnvironment: 'jsdom',
  transform: { '^.+\\.(t|j)sx?$': swcTransform },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
};
```

and `packages/ui/jest.setup.ts`:

```ts
import '@testing-library/jest-dom';
```

**Step 2:** Root `jest.config.js` gains `'<rootDir>/packages/ui/jest.config.js'`. Run `npm install`.

**Step 3:** Create `packages/ui/src/styles/tokens.css` — the palette from prototype line 18, as Tailwind v4 theme tokens:

```css
/* Palette from prototypes/daybook.html:18. Contrast pairs are load-bearing
   (see the contrast note at daybook.html:10–17): white small text goes on
   clay-fill (4.75:1) never clay; small clay text on paper uses clay-deep. */
@theme {
  --color-paper: #faf6f0;
  --color-card: #ffffff;
  --color-ink: #2b2118;
  --color-mut: #7a6c5c;
  --color-clay: #c4674a;
  --color-clay-fill: #b05b40;
  --color-clay-deep: #8a4630;
  --color-clay-soft: #f3e4d3;
  --color-pine: #3d5a4c;
  --color-pine-soft: #e4ebe6;
  --color-line: #e6ddd1;
  --color-alert: #9c3a2a;
  --font-serif: var(--font-petrona), 'Petrona', serif;
  --font-sans: var(--font-albert), 'Albert Sans', sans-serif;
}
```

**Step 4:** Create `packages/ui/src/styles/daybook.css` — the small layer Tailwind handles poorly. Port **verbatim** from the prototype, renaming tap-target rules to additive `hit-*` classes:

- From lines 168–186: `.hit-chip::before`, `.hit-log::before`, `.hit-grab::before`, `.hit-go::before`, `.hit-notebtn::before`, `.hit-notebtn-quiet::before` — same geometry, same comments. Each partner element also gets Tailwind `relative`.
- From lines 187–198: the `@media (prefers-reduced-motion: no-preference)` block — sheet `.dim`/`.sheet` transitions keyed on `#sheet-root.open`, `@keyframes settle`, `.settle` with `--d` stagger. Keep ids `#sheet-root` and classes `.dim`, `.sheet`, `.settle` — the sheet host renders those names.
- From lines 67–69: `.noop` (prototype-edge pressed state).

**Step 5:** Verify: `npx jest` at root runs both projects (ui has no tests yet — passes with "no tests found" allowed via `passWithNoTests: true` added to the ui config until Task 7). Typecheck clean.

**Step 6:** Commit: `git commit -am "feat(ui): scaffold package with theme tokens and fidelity CSS layer"`

---

## Task 6.5: Style mapping reference (no code — read before Tasks 10–14)

Components use Tailwind utilities per this mapping (values transcribed from prototype CSS lines 18–205). This table **is** the stylesheet port; do not improvise values. `[x]` = arbitrary value.

| Prototype class (line) | Tailwind classes |
|---|---|
| `body` (20) | on the app shell: `max-w-[430px] mx-auto min-h-dvh bg-paper font-sans text-ink` |
| `#page` (21) | `pt-[22px] px-6 pb-[120px]` |
| `.status` (24) | `flex justify-between text-[11px] font-semibold text-mut` |
| `.eyebrow` (25) | `text-[11px] tracking-[.14em] font-bold text-pine` |
| `.bigtext` (26) | `font-serif font-medium text-[24.5px] leading-[1.36] mt-3`; copy `em` → `italic text-clay` |
| `.facelab` (30) | `text-[11px] tracking-[.16em] font-bold text-mut` |
| `.faces` (31) | `flex gap-2.5 mt-3.5` |
| `.face` (32) | `flex-1 aspect-[1/1.18] bg-card border border-line rounded-[18px] flex items-center justify-center shadow-[0_2px_8px_rgba(43,33,24,.05)] cursor-pointer p-0`; `.sel` → `border-clay shadow-[0_2px_8px_rgba(138,70,48,.12)]`; inner svg `w-[80%] h-auto` |
| `.facecap` (34) | `flex justify-between text-[11.5px] text-mut mt-2.5 italic font-serif` |
| `.herorow` (38) | `pb-4 border-b border-line` |
| `.receipt` (39) | `flex items-center gap-[13px] py-4 px-[2px] border-b border-line` |
| `.rdot` (41) | `flex-none w-[30px] h-[30px] rounded-full bg-pine-soft flex items-center justify-center text-pine text-[15px] font-bold` |
| `.rtext` (42) | `font-serif text-[24.5px] font-medium leading-[1.3]`; `em` → `italic text-pine` |
| `.ackline` (47) | `font-serif italic text-[13.5px] text-pine mt-2.5` |
| `.sect` (50) | `mt-6`; `h5` (51) → `font-serif text-[18.5px] font-medium italic text-ink border-t border-line pt-3.5` |
| `.factline` (52) | `flex items-baseline gap-2 text-[13px] mt-2.5 leading-[1.5]`; `.k` → `flex-none text-[10.5px] tracking-[.12em] font-bold text-mut w-[74px]`; `.v` → `font-serif text-[14px]`; `.v b` → `font-sans text-[11.5px] font-bold text-clay-deep`; `.ok` → `text-pine font-semibold`; `.go` → `ml-auto text-clay-deep font-bold text-[12px] whitespace-nowrap` (+ `relative hit-go` on button form) |
| `.entry` (59) | `mt-4`; `.body` → `font-serif text-[15px] leading-[1.6]`, `b` → `font-semibold` |
| `.marginnote` (62) | `block font-serif italic text-[12.5px] text-clay-deep mt-[9px] pl-[11px] border-l-2 border-clay` |
| `.turn` (63) | `text-[12px] font-bold text-mut mt-1`; `b` → `text-clay-deep` |
| `.scrollhint` (65) | `text-center text-mut text-[15px] tracking-[.2em] my-1.5` |
| `.chips` (72) | `flex flex-wrap gap-[9px] mt-2.5` |
| `.chip` (73) | `relative hit-chip font-sans text-[12.5px] font-semibold text-ink bg-card border border-line rounded-full py-[9px] px-3.5 cursor-pointer` |
| `.notein` (76–80) | wrap `flex items-center gap-2 mt-2.5`; input `flex-1 min-w-0 font-sans text-[13px] text-ink bg-card border border-line rounded-full py-[9px] px-3.5 outline-none focus:border-clay`; `.notebtn` `relative hit-notebtn font-sans text-[12.5px] font-semibold text-clay-deep py-[9px] px-1 whitespace-nowrap`; quiet variant `text-mut font-medium hit-notebtn-quiet` |
| `#nextbar` (86) | `fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-paper border-t border-line px-6 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] z-50` |
| `.pair .next` (88–96) | `flex-[1.5] rounded-full py-[11px] px-4 text-white flex items-center gap-2.5 text-left font-sans cursor-pointer` + tone `bg-clay-fill` / `bg-pine`; `.k` `text-[9px] tracking-[.16em] font-bold opacity-90`; `.v` `text-[13px] font-bold leading-[1.25]`; `small` `block font-semibold text-[10.5px] opacity-95` |
| `.pair .feel` (97) | `flex-1 border-[1.5px] border-line bg-card text-mut rounded-full flex items-center justify-center text-[12px] font-bold px-2 font-sans cursor-pointer` |
| `.dim` (106) | `fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[rgba(43,33,24,.32)] z-[60]` (+ `dim` class for the CSS transition) |
| `.sheet` (107) | `fixed bottom-0 inset-x-0 w-full max-w-[430px] mx-auto bg-paper rounded-t-[26px] px-[22px] pt-4 pb-[calc(18px+env(safe-area-inset-bottom))] shadow-[0_-12px_40px_rgba(43,33,24,.25)] max-h-[82dvh] overflow-y-auto z-[61] outline-none` (+ `sheet` class) |
| `.grab` (111) | `relative hit-grab w-10 h-1 rounded-[2px] bg-line mx-auto mb-3.5 cursor-pointer` |
| `.sheettitle` (112) | `font-serif text-[20px] font-medium` |
| `.tlgroup` (115) | `text-[10px] tracking-[.16em] font-bold text-mut mt-4 mb-[2px]`; now → `text-clay-deep` |
| `.tl` (117) | `flex items-center gap-3 py-2.5 border-b border-line`; `.tm` `flex-none w-11 text-[11.5px] font-bold text-mut`; `.med` `font-serif text-[15.5px]`; `.med small` `block font-sans text-[11px] text-mut font-semibold mt-[1px]`; done row `opacity-40` + med `line-through decoration-1`; now row `bg-clay-soft rounded-xl py-3 px-3 border-b-0 my-1.5 -mx-[2px]` + tm `text-clay-deep` |
| `.tl .log` (125) | `relative hit-log ml-auto bg-clay-fill text-white rounded-full text-[12px] font-bold py-[9px] px-4 whitespace-nowrap font-sans cursor-pointer active:bg-clay-deep` |
| `.tl .ok` / `.cd` (127–128) | `ml-auto text-[11px] font-bold whitespace-nowrap` + `text-pine` / `text-clay-deep` |
| `.meter` (129–132) | `flex items-center gap-2.5 mt-3`; `.lab` `text-[10px] tracking-[.12em] font-bold text-mut whitespace-nowrap`; `.bar` `flex-1 h-[5px] rounded-[3px] bg-line overflow-hidden`; fill `block h-full bg-pine` |
| `.quietline` (133) | `font-serif italic text-[13.5px] text-pine mt-3.5`; `.paired` (134) `text-[11.5px] text-mut mt-2`; `.sheetnote` (135) `text-[11.5px] text-mut mt-3.5`; `.cc-back` (136) `font-serif text-[14.5px] font-semibold text-pine pt-2 pb-2.5 border-b border-line` |
| `.cyc-pills` (139–143) | `flex gap-2 mt-3.5`; pill `flex-1 min-h-11 text-center text-[11.5px] font-bold text-mut border border-line rounded-full py-[11px] font-sans cursor-pointer`; sel `bg-pine-soft text-pine border-pine-soft` |
| `.tag` (146) | `text-[10.5px] font-bold tracking-[.16em] text-pine` |
| sheet `h4` (147) | `font-serif text-[21px] font-medium leading-[1.3] mt-2 mb-2.5`; sheet `p` (148) `text-[14px] leading-[1.6] text-[#5a4d40]` |
| `.threshold` (149) | `flex gap-2.5 items-start bg-white border border-line rounded-xl py-3 px-3.5 mt-3.5 text-[13px]`; `b` → `text-alert`; `.lab` (159) `block text-[10px] tracking-[.12em] font-bold text-mut mb-[3px]`; `.gate` (160) `bg-clay-soft border-[#e7cdb6]` |
| `.sheetacts` (151) | `flex gap-2.5 mt-4`; `.btn` `flex-1 text-center rounded-full py-[13px] px-2.5 font-bold text-[13.5px] font-sans cursor-pointer`; primary `bg-clay-fill text-white active:bg-clay-deep`; ghost `border-[1.5px] border-line text-mut active:bg-card` |
| `.askrow`/`.asklab`/`.gatelead`/`.gatecalm`/`.emerg` (161–166) | `mt-[18px]` / `block text-[10.5px] tracking-[.14em] font-bold text-mut text-center mb-2.5` / `font-serif text-[18.5px] font-medium leading-[1.32] mb-1` / `text-[13px] text-mut leading-[1.55] mt-3` / `flex gap-2 items-start text-[11.5px] text-mut mt-4 pt-3 border-t border-line`, `b` → `text-alert` |
| `#day-switcher` (203–205) | `fixed top-[42px] right-2.5 flex gap-1 z-[100]`; pill `font-sans text-[10px] font-semibold text-[#888] bg-[#eee] border border-[#ccc] rounded-[10px] py-[2px] px-[7px] cursor-pointer`; active `text-white bg-[#888] border-[#888]` (dev control — hardcoded grays are intentional, it must not look like product) |

---

## Task 7: `renderCopy` — the constrained markup renderer

**Files:**
- Create: `packages/ui/src/primitives/renderCopy.tsx`
- Test: `packages/ui/src/primitives/renderCopy.test.tsx`

**Step 1: Write the failing test:**

```tsx
import { render, screen } from '@testing-library/react';
import { renderCopy } from './renderCopy';

describe('renderCopy', () => {
  it('renders plain text as-is', () => {
    render(<p>{renderCopy('Rest today.')}</p>);
    expect(screen.getByText('Rest today.')).toBeInTheDocument();
  });
  it('renders em and b with the given classes', () => {
    render(<p>{renderCopy('call if it reaches <b>101°F</b> — <em>soon</em>', { b: 'text-alert', em: 'italic text-clay' })}</p>);
    const b = screen.getByText('101°F');
    expect(b.tagName).toBe('B');
    expect(b).toHaveClass('text-alert');
    expect(screen.getByText('soon').tagName).toBe('EM');
  });
  it('never uses innerHTML — unknown tags render as literal text', () => {
    render(<p data-testid="out">{renderCopy('a <span>b</span>')}</p>);
    expect(screen.getByTestId('out').querySelector('span')).toBeNull();
  });
});
```

**Step 2:** Run: `npx jest packages/ui -t renderCopy` — Expected: FAIL.

**Step 3: Implement:**

```tsx
import type { ReactNode } from 'react';

export interface CopyClasses { em?: string; b?: string }

const TOKEN = /<(\/?)(em|b)>/g;

/**
 * Renders the constrained copy markup (<em>/<b> only — enforced by
 * @postpal/content CopyString) as React elements. No innerHTML anywhere.
 * Unknown tags never reach here in valid content; if they do, they render
 * as literal text, which is the safe failure.
 */
export function renderCopy(copy: string, classes: CopyClasses = {}): ReactNode[] {
  const out: ReactNode[] = [];
  let stack: { tag: 'em' | 'b'; children: ReactNode[] }[] = [];
  let last = 0;
  let key = 0;
  const push = (node: ReactNode) => (stack.length ? stack[stack.length - 1].children : out).push(node);

  for (const m of copy.matchAll(TOKEN)) {
    const text = copy.slice(last, m.index);
    if (text) push(text);
    last = m.index + m[0].length;
    const [, close, tag] = m as unknown as [string, string, 'em' | 'b'];
    if (!close) {
      stack.push({ tag, children: [] });
    } else {
      const frame = stack.pop();
      if (!frame) continue;
      const Tag = frame.tag;
      push(<Tag key={key++} className={classes[frame.tag]}>{frame.children}</Tag>);
    }
  }
  const tail = copy.slice(last);
  if (tail) push(tail);
  // unclosed tags: flush children as plain text (malformed content already failed parse)
  while (stack.length) out.push(...stack.pop()!.children);
  return out;
}
```

**Step 4:** Run — Expected: PASS. Remove `passWithNoTests` from the ui jest config.

**Step 5:** Commit: `git commit -am "feat(ui): renderCopy constrained markup renderer"`

---

## Task 8: The Zustand store

Ports `freshState()` (line 449) and the transition logic scattered through `render()`/`wireSheet()`.

**Files:**
- Create: `packages/ui/src/store.ts`
- Test: `packages/ui/src/store.test.ts`

**Step 1: Write the failing tests** — drive the store as pure logic (no components):

```ts
import { createDaybookStore } from './store';

const CHIPS_D1 = ['Nothing new', 'Cramping is intense', 'Fever or chills', 'Nausea', 'Something else…'];

describe('daybook store', () => {
  it('starts a fresh check-in on day 5', () => {
    const s = createDaybookStore(5).getState();
    expect(s).toMatchObject({ day: 5, phase: 'checkin', face: null, note: null, sheet: null });
  });
  it('selectFace advances checkin → noted', () => {
    const store = createDaybookStore(1);
    store.getState().selectFace(2);
    expect(store.getState()).toMatchObject({ face: 2, phase: 'noted' });
  });
  it('"Nothing new" records the note and lands on the page', () => {
    const store = createDaybookStore(1);
    store.getState().selectFace(0);
    store.getState().chooseChip('Nothing new');
    expect(store.getState()).toMatchObject({ note: 'nothing new', phase: 'page', sheet: null });
  });
  it('a symptom chip opens the interpreter BEFORE recording anything', () => {
    const store = createDaybookStore(1);
    store.getState().selectFace(3);
    store.getState().chooseChip('Fever or chills');
    expect(store.getState().phase).toBe('noted');           // not advanced yet
    expect(store.getState().note).toBeNull();
    expect(store.getState().sheet).toEqual({ kind: 'interpreter', payload: { key: 'Fever or chills', origin: 'chips' } });
  });
  it('resolving a chip-opened interpreter records the note lowercased and advances', () => {
    const store = createDaybookStore(1);
    store.getState().selectFace(3);
    store.getState().chooseChip('Fever or chills');
    store.getState().resolveInterpreter();
    expect(store.getState()).toMatchObject({ note: 'fever or chills', phase: 'page', sheet: null });
  });
  it('a feel-opened interpreter resolves without recording', () => {
    const store = createDaybookStore(1);
    store.getState().openSheet('interpreter', { key: 'Nausea', origin: 'feel' });
    store.getState().resolveInterpreter();
    expect(store.getState().note).toBeNull();
    expect(store.getState().sheet).toBeNull();
  });
  it('escalate swaps the open interpreter in place', () => {
    const store = createDaybookStore(1);
    store.getState().openSheet('interpreter', { key: 'Nausea', origin: 'feel' });
    store.getState().escalateInterpreter();
    expect(store.getState().sheet!.payload).toMatchObject({ key: 'Nausea', escalated: true });
  });
  it('"Something else…" opens the inline input; submitNote records free text', () => {
    const store = createDaybookStore(1);
    store.getState().selectFace(1);
    store.getState().chooseChip('Something else…');
    expect(store.getState().noteInputOpen).toBe(true);
    store.getState().submitNote('left hip aches');
    expect(store.getState()).toMatchObject({ note: 'left hip aches', phase: 'page', noteInputOpen: false });
  });
  it('switchDay resets to a fresh check-in and closes any sheet', () => {
    const store = createDaybookStore(1);
    store.getState().selectFace(0);
    store.getState().openSheet('medrail', null);
    store.getState().switchDay(10);
    expect(store.getState()).toMatchObject({ day: 10, phase: 'checkin', face: null, note: null, sheet: null });
  });
  it('logDose counts per day and survives nothing else', () => {
    const store = createDaybookStore(1);
    store.getState().logDose();
    store.getState().logDose();
    expect(store.getState().logged[1]).toBe(2);
    store.getState().switchDay(3);
    expect(store.getState().logged[3] ?? 0).toBe(0);   // per-day counts, day switch doesn't clear (session-scope)
  });
  it('receipt taps reopen earlier phases with state preserved', () => {
    const store = createDaybookStore(1);
    store.getState().selectFace(4);
    store.getState().chooseChip('Nothing new');
    store.getState().reopenCheckin();
    expect(store.getState()).toMatchObject({ phase: 'checkin', face: 4 });   // preselected (line 895)
    store.getState().selectFace(4);
    store.getState().reopenNoted();
    expect(store.getState().phase).toBe('noted');
  });
});
```

**Step 2:** Run — Expected: FAIL.

**Step 3: Implement** `packages/ui/src/store.ts`:

```ts
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { createContext, useContext } from 'react';
import type { SheetKind } from '@postpal/content';

export type Phase = 'checkin' | 'noted' | 'page';
export type OpenSheetKind = SheetKind | 'interpreter' | 'feel';
export interface SheetPayload { key?: string; origin?: 'chips' | 'feel'; escalated?: boolean }
export interface OpenSheet { kind: OpenSheetKind; payload: SheetPayload | null }

export interface DaybookState {
  day: number;
  phase: Phase;
  face: number | null;
  note: string | null;
  heroExpanded: boolean;
  noteInputOpen: boolean;
  noteDraft: string;
  sheet: OpenSheet | null;
  logged: Record<number, number>;
  cycleAnswer: string | null;
  switchDay: (day: number) => void;
  selectFace: (i: number) => void;
  toggleHero: () => void;
  reopenCheckin: () => void;
  reopenNoted: () => void;
  chooseChip: (chip: string) => void;
  submitNote: (text: string) => void;
  cancelNote: () => void;
  setNoteDraft: (text: string) => void;
  openSheet: (kind: OpenSheet['kind'], payload?: SheetPayload | null) => void;
  closeSheet: () => void;
  resolveInterpreter: () => void;
  escalateInterpreter: () => void;
  logDose: () => void;
  answerCycle: (option: string) => void;
}

const fresh = (day: number) => ({
  day, phase: 'checkin' as Phase, face: null, note: null,
  heroExpanded: false, noteInputOpen: false, noteDraft: '', sheet: null, cycleAnswer: null
});

export function createDaybookStore(initialDay: number) {
  return createStore<DaybookState>((set, get) => ({
    ...fresh(initialDay),
    logged: {},
    switchDay: (day) => set({ ...fresh(day) }),               // logged survives: session-scope
    selectFace: (i) => set({ face: i, phase: 'noted' }),
    toggleHero: () => set((s) => ({ heroExpanded: !s.heroExpanded })),
    reopenCheckin: () => set({ phase: 'checkin', heroExpanded: false, noteInputOpen: false }),
    reopenNoted: () => set({ phase: 'noted', noteInputOpen: false }),
    chooseChip: (chip) => {
      if (chip === 'Nothing new') set({ note: 'nothing new', phase: 'page' });
      else if (chip === 'Something else…') set({ noteInputOpen: true });
      else set({ sheet: { kind: 'interpreter', payload: { key: chip, origin: 'chips' } } });
    },
    submitNote: (text) => {
      const t = text.trim();
      if (!t) return;
      set({ note: t, noteDraft: '', noteInputOpen: false, phase: 'page' });
    },
    cancelNote: () => set({ noteDraft: '', noteInputOpen: false }),
    setNoteDraft: (text) => set({ noteDraft: text }),
    openSheet: (kind, payload = null) => set({ sheet: { kind, payload } }),
    closeSheet: () => set({ sheet: null }),
    resolveInterpreter: () => {
      const { sheet } = get();
      const payload = sheet?.payload;
      if (payload?.origin === 'chips' && payload.key) {
        set({ note: payload.key.toLowerCase(), phase: 'page', sheet: null });
      } else {
        set({ sheet: null });
      }
    },
    escalateInterpreter: () => {
      const { sheet } = get();
      if (sheet?.kind !== 'interpreter' || !sheet.payload) return;
      set({ sheet: { kind: 'interpreter', payload: { ...sheet.payload, escalated: true } } });
    },
    logDose: () => set((s) => ({ logged: { ...s.logged, [s.day]: (s.logged[s.day] ?? 0) + 1 } })),
    answerCycle: (option) => set({ cycleAnswer: option })
  }));
}

export type DaybookStore = ReturnType<typeof createDaybookStore>;
export const DaybookStoreContext = createContext<DaybookStore | null>(null);
export function useDaybook<T>(selector: (s: DaybookState) => T): T {
  const store = useContext(DaybookStoreContext);
  if (!store) throw new Error('useDaybook must be used inside <Daybook>');
  return useStore(store, selector);
}
```

(Vanilla store + context, not a module-level store, so tests and multiple mounts get isolated instances.)

**Step 4:** Run: `npx jest packages/ui` — Expected: PASS.

**Step 5:** Commit: `git commit -am "feat(ui): zustand store ports the prototype state machine"`

---

## Task 9: Dose derivation — content ⊕ logged count → rail, Next slot, meds line

Ports `logNowDose()` (lines 635–675) as a pure function. Strategy: deep-clone the content rail, apply the prototype's algorithm `logged` times, return the result plus the derived Next slot and meds line. Exact-parity by construction.

**Files:**
- Create: `packages/ui/src/derive.ts`
- Test: `packages/ui/src/derive.test.ts`

**Step 1: Write the failing tests** (import `avcUfe`, `getDay` from `@postpal/content`):

```ts
import { deriveDayView } from './derive';
import { avcUfe, getDay } from '@postpal/content';

describe('deriveDayView', () => {
  const day1 = () => getDay(avcUfe, 1);

  it('with 0 logged, returns content verbatim', () => {
    const v = deriveDayView(day1(), 0);
    expect(v.next).toEqual(day1().next);
    expect(v.medrail).toEqual(day1().medrail);
    expect(v.medsLine).toBe(day1().meds!.line);
  });

  it('logging the 1:00 dose promotes the 6:00 dose (prototype task-7 loop)', () => {
    const v = deriveDayView(day1(), 1);
    const done = v.medrail!.groups.find((g) => g.done)!;
    expect(done.label).toBe('EARLIER TODAY');
    expect(done.rows.some(([, name, status]) => name === 'Ibuprofen 800' && status === 'taken just now ✓')).toBe(true);
    const now = v.medrail!.groups.find((g) => g.now)!;
    expect(now.rows[0][0]).toBe('6:00');
    expect(v.next.label).toBe('Ibuprofen 800');
    expect(v.next.sub).toBe('6:00 · later today');
    expect(v.medsLine).toMatch(/^3 of 7 doses taken · next: ibuprofen 800 at 6:00/);
  });

  it('logging past the schedule flips Next to the pine terminal state', () => {
    const v = deriveDayView(day1(), 3);        // 1:00, 6:00, 9:00 all logged
    expect(v.next).toMatchObject({ label: 'Medicines done', sub: 'nothing more until morning', tone: 'pine' });
    expect(v.medsLine).toBe('All scheduled doses taken today');
  });

  it('days without scheduled doses pass through (day 10 PRN-only, day 20 no meds)', () => {
    expect(deriveDayView(getDay(avcUfe, 10), 0).medsLine).toBe(getDay(avcUfe, 10).meds!.line);
    expect(deriveDayView(getDay(avcUfe, 20), 0).medrail).toBeUndefined();
  });
});
```

**Step 2:** Run — Expected: FAIL.

**Step 3: Implement** `packages/ui/src/derive.ts`. Transcribe `logNowDose()` faithfully into `applyOneDose(rail, next, meds)` operating on a mutable clone, then:

```ts
import type { DayContent, MedRail, Next } from '@postpal/content';

export interface DayView {
  medrail: MedRail | undefined;
  next: Next;
  medsLine: string | undefined;
}

export function deriveDayView(day: DayContent, logged: number): DayView {
  const medrail: MedRail | undefined = day.medrail && structuredClone(day.medrail);
  const next: Next = structuredClone(day.next);
  let medsLine = day.meds?.line;
  for (let i = 0; i < logged && medrail; i++) {
    medsLine = applyOneDose(medrail, next, medsLine);
  }
  return { medrail, next, medsLine };
}
```

`applyOneDose` is the line-for-line port of lines 635–675: shift the NOW row into the done group (relabeled `EARLIER TODAY`, status `taken just now ✓`), promote the first non-PRN LATER row into NOW (label `NEXT · LATER TODAY`, update `next.label`/`next.sub` to `` `${time} · later today` ``), or — when nothing remains — remove the NOW group and set the terminal `{ label: 'Medicines done', sub: 'nothing more until morning', tone: 'pine' }`. Update the meds line with the same regex logic (lines 666–674). Return the new meds line.

**Step 4:** Run: `npx jest packages/ui -t deriveDayView` — Expected: PASS.

**Step 5:** Commit: `git commit -am "feat(ui): pure dose derivation replaces prototype content mutation"`

---

## Task 10: Primitives — FaceGlyph, faces constants, Receipt, useSettle

**Files:**
- Create: `packages/ui/src/primitives/FaceGlyph.tsx`, `packages/ui/src/primitives/faces.ts`, `packages/ui/src/primitives/Receipt.tsx`, `packages/ui/src/primitives/useSettle.ts`
- Test: `packages/ui/src/primitives/faces.test.tsx`

**Step 1: Failing test:**

```tsx
import { render } from '@testing-library/react';
import { FaceGlyph } from './FaceGlyph';
import { FACE_LABELS, faceReceiptText, faceAckKey } from './faces';

describe('faces', () => {
  it('has five labels good → hard', () => {
    expect(FACE_LABELS).toHaveLength(5);
    expect(FACE_LABELS[0]).toBe('a good day');
    expect(FACE_LABELS[4]).toBe('a hard day');
  });
  it('maps face index to receipt text and ack key (lines 513–514)', () => {
    expect(faceReceiptText(0)).toBe('a little better');
    expect(faceReceiptText(2)).toBe('about the same');
    expect(faceReceiptText(4)).toBe('harder than yesterday');
    expect(faceAckKey(1)).toBe('better');
    expect(faceAckKey(3)).toBe('worse');
  });
  it('renders an svg with the selected treatment', () => {
    const { container } = render(<FaceGlyph index={0} selected />);
    expect(container.querySelector('svg circle[fill="#c4674a"]')).toBeInTheDocument();
  });
});
```

**Step 2:** Run — FAIL. **Step 3:** Implement:
- `faces.ts`: `FACE_MOUTHS` (5 path strings, lines 505–511), `FACE_LABELS` (line 512), `faceReceiptText`, `faceAckKey` (lines 513–514) — copy verbatim.
- `FaceGlyph.tsx`: props `{ index: number; selected?: boolean; size?: number }` — JSX port of `faceSvg()` (lines 517–528): same stroke colors (`#8a4630` selected / `#7a6c5c`), widths, eye radii, 15%-opacity clay fill circle when selected, `aria-hidden`.
- `Receipt.tsx`: props `{ icon: ReactNode; children: ReactNode; onActivate: () => void; label: string; settle?: boolean; delay?: string }` — a `div` with `role="button" tabIndex={0}`, receipt classes from the mapping table, Enter/Space keydown (port of `tap()`, lines 539–544).
- `useSettle.ts`: port of the `lastSettleKey` logic (lines 883–891) — a module hook `useSettle(day: number, phase: Phase): boolean` using a `useRef` for the previous `` `${day}:${phase}` `` key; returns true only on the first render of a given key.

**Step 4:** Run — PASS. **Step 5:** Commit: `git commit -am "feat(ui): face glyphs, receipt, and settle primitives"`

---

## Task 11: CheckIn + NotedView

**Files:**
- Create: `packages/ui/src/daybook/CheckIn.tsx`, `packages/ui/src/daybook/NotedView.tsx`, `packages/ui/src/daybook/HeroBlock.tsx`
- Test: `packages/ui/src/daybook/checkin-noted.test.tsx`

Tests need a harness: a helper that renders children inside `DaybookStoreContext.Provider` with a fresh `createDaybookStore(day)` and returns the store. Put it in `packages/ui/src/test-utils.tsx`.

**Step 1: Failing tests:**

```tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { avcUfe, getDay } from '@postpal/content';
import { renderWithStore } from '../test-utils';
import { CheckIn } from './CheckIn';
import { NotedView } from './NotedView';

describe('CheckIn', () => {
  it('renders eyebrow, full hero, five faces — and nothing else competes (calm budget)', () => {
    renderWithStore(1, <CheckIn day={getDay(avcUfe, 1)} />);
    expect(screen.getByText('DAY 1 · MORNING CHECK-IN')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /day$/ })).toHaveLength(5);  // FACE_LABELS all end in "day"
    expect(screen.queryByText(/ANYTHING TO NOTE/)).not.toBeInTheDocument();
  });
  it('tapping a face advances to noted', async () => {
    const store = renderWithStore(1, <CheckIn day={getDay(avcUfe, 1)} />);
    await userEvent.click(screen.getByRole('button', { name: 'a hard day' }));
    expect(store.getState()).toMatchObject({ face: 4, phase: 'noted' });
  });
});

describe('NotedView', () => {
  it('shows truncated hero, face receipt, ack line, and the day chips', () => {
    const store = renderWithStore(1, <NotedView day={getDay(avcUfe, 1)} />);
    store.getState().selectFace(4);
    expect(screen.getByText(/Today is usually the hardest day/)).toBeInTheDocument();
    expect(screen.getByText(/harder than yesterday/)).toBeInTheDocument();
    expect(screen.getByText('Noted — a hard morning. That’s day 1.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nothing new' })).toBeInTheDocument();
  });
  it('hero tap expands to the full sentence in place', async () => {
    const store = renderWithStore(1, <NotedView day={getDay(avcUfe, 1)} />);
    store.getState().selectFace(0);
    await userEvent.click(screen.getByRole('button', { name: /expand or collapse/i }));
    expect(store.getState().heroExpanded).toBe(true);
  });
  it('"Something else…" swaps chips for the inline input; Enter submits, Escape cancels', async () => {
    const store = renderWithStore(1, <NotedView day={getDay(avcUfe, 1)} />);
    store.getState().selectFace(0);
    await userEvent.click(screen.getByRole('button', { name: 'Something else…' }));
    const input = screen.getByLabelText('Your note');
    await userEvent.type(input, 'left hip aches{Enter}');
    expect(store.getState()).toMatchObject({ note: 'left hip aches', phase: 'page' });
  });
});
```

**Step 2:** Run — FAIL. **Step 3:** Implement:
- `HeroBlock.tsx`: eyebrow + hero (heroShort/heroFull via `heroExpanded`, rendered through `renderCopy` with `em: 'italic text-clay'`), `role="button" tabIndex={0}` with `aria-label="Expand or collapse today's reading"` (lines 548–555). Shared by NotedView and TodayPage.
- `CheckIn.tsx`: status line (`9:41 · {statusLabel}` — statusLabel comes via props from Daybook), eyebrow + full hero, `HOW DOES TODAY FEEL?` label, five `FaceGlyph` buttons with `aria-label={FACE_LABELS[i]}` and `aria-pressed`, facecap row ("a good day" / "a hard day") — port of lines 893–919.
- `NotedView.tsx`: HeroBlock + face receipt (`Receipt` with `FaceGlyph size={30} selected`) + ack line + `ANYTHING TO NOTE TODAY?` + chips or the inline note input (port of lines 920–983; input behavior lines 940–964: draft survives re-renders via `noteDraft`, Enter submits, Escape cancels, empty submit is a no-op, autofocus).

**Step 4:** Run — PASS. **Step 5:** Commit: `git commit -am "feat(ui): check-in and noted views"`

---

## Task 12: TodayPage — the four chapters

**Files:**
- Create: `packages/ui/src/daybook/TodayPage.tsx`
- Test: `packages/ui/src/daybook/today-page.test.tsx`

**Step 1: Failing tests:**

```tsx
describe('TodayPage', () => {
  const setup = (dayNum: number, note = 'nothing new') => {
    const store = renderWithStore(dayNum, <TodayPage day={getDay(avcUfe, dayNum)} />);
    store.getState().selectFace(2);
    store.getState().submitNote(note);   // fast-path to page phase
    return store;
  };
  it('renders both receipts and all four chapters on day 5', () => {
    setup(5);
    expect(screen.getByText(/about the same/)).toBeInTheDocument();
    expect(screen.getByText(/Noted:/)).toBeInTheDocument();
    expect(screen.getByText('How today might feel')).toBeInTheDocument();
    expect(screen.getByText('What you can do — and not yet')).toBeInTheDocument();
    expect(screen.getByText('Your medicines today')).toBeInTheDocument();
    expect(screen.getByText('What’s ahead')).toBeInTheDocument();
  });
  it('day 1 has no BACK line; day 20 has no meds chapter and no NOT YET', () => {
    setup(1);
    expect(screen.queryByText('BACK')).not.toBeInTheDocument();
    cleanup();
    setup(20);
    expect(screen.queryByText('Your medicines today')).not.toBeInTheDocument();
    expect(screen.queryByText('NOT YET')).not.toBeInTheDocument();
    expect(screen.getByText(/everything ✓/)).toBeInTheDocument();
  });
  it('the note receipt reopens the noted phase', async () => {
    const store = setup(5);
    await userEvent.click(screen.getByRole('button', { name: /change what you noted/i }));
    expect(store.getState().phase).toBe('noted');
  });
  it('user-entered notes render as text, not markup', () => {
    setup(5, '<img src=x onerror=alert(1)>');
    expect(screen.getByText(/Noted:/).parentElement!.querySelector('img')).toBeNull();
  });
});
```

**Step 2:** Run — FAIL. **Step 3:** Implement `TodayPage.tsx` — port of lines 984–1060:
- HeroBlock + face receipt + note receipt (`✓` rdot, `Noted: <em>{note}</em>` — note renders as a plain string child, which is the XSS-safe port of `esc()`).
- Chapter 1 `How today might feel`: entries via `renderCopy` (`b: 'font-semibold'`), margin notes, `Keep reading: {turn} →` as `.noop` (pressed-state dead end, line 995).
- Chapter 2: BACK/NOT YET factlines, each omitted when null; NOT YET copy through `renderCopy` (`b` → the countdown style from the mapping table).
- Chapter 3: omitted entirely when `day.meds` is null; meds line text comes from `deriveDayView(day, logged).medsLine`; `open →` button opens `day.meds.sheet`.
- Chapter 4: ahead factlines; `details →` rows are `.noop`.
- Scroll hint `⌄`. Settle classes with the prototype's stagger delays (120/180/240/300ms) driven by `useSettle`.

**Step 4:** Run — PASS. **Step 5:** Commit: `git commit -am "feat(ui): today page with question-led chapters"`

---

## Task 13: NextBar, DaySwitcher, and the Daybook shell

**Files:**
- Create: `packages/ui/src/daybook/NextBar.tsx`, `packages/ui/src/daybook/DaySwitcher.tsx`, `packages/ui/src/daybook/Daybook.tsx`, `packages/ui/src/index.ts`
- Test: `packages/ui/src/daybook/daybook.test.tsx`

**Step 1: Failing tests:**

```tsx
import { Daybook } from './Daybook';

describe('Daybook shell', () => {
  it('renders the check-in for the initial day with the clay dose Next slot', () => {
    render(<Daybook content={avcUfe} initialDay={5} statusLabel="Maya · UFE Feb 12" />);
    expect(screen.getByText('DAY 5 · MORNING CHECK-IN')).toBeInTheDocument();
    const next = screen.getByRole('button', { name: /next: ibuprofen 800/i });
    expect(next.className).toContain('bg-clay-fill');
  });
  it('day switcher moves between days and always lands on a fresh check-in', async () => {
    render(<Daybook content={avcUfe} initialDay={5} statusLabel="Maya · UFE Feb 12" />);
    await userEvent.click(screen.getByRole('button', { name: 'Day 20' }));
    expect(screen.getByText('DAY 20 · CHECK-IN')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next: cycle 1 check-in/i }).className).toContain('bg-pine');
  });
  it('day 10 shows the pine milestone slot', async () => {
    render(<Daybook content={avcUfe} initialDay={10} statusLabel="Maya · UFE Feb 12" />);
    expect(screen.getByRole('button', { name: /next: baths & pools clear/i })).toBeInTheDocument();
  });
});
```

**Step 2:** Run — FAIL. **Step 3:** Implement:
- `NextBar.tsx` (lines 583–598): fixed bar, `Next` slot from `deriveDayView(day, logged).next` — micro-label `NEXT`, label + sub, tone class, `aria-label` `` `Next: ${label} — ${sub}` ``; right slot `Feeling something?` opens the `feel` sheet. Renders in every phase.
- `DaySwitcher.tsx` (lines 203–215, 1074–1080): fixed pill row from `listDays(content)`, `aria-label="Day {n}"`, active state, calls `switchDay`.
- `Daybook.tsx`: the shell — creates the store once (`useRef(createDaybookStore(initialDay))`), provides `DaybookStoreContext`, renders the 430px column (`body` classes from the mapping table go here, since the package can't own `<body>`), status line, phase-switched view (`CheckIn`/`NotedView`/`TodayPage`), `NextBar`, `DaySwitcher`, `SheetHost` (Task 14 — stub it as `null` for now). Props: `{ content: ProcedureContent; initialDay?: number; statusLabel: string }`.
- `src/index.ts`: `export { Daybook } from './daybook/Daybook';` plus store/type exports.

**Step 4:** Run — PASS. **Step 5:** Commit: `git commit -am "feat(ui): next-slot bar, day switcher, daybook shell"`

---

## Task 14: SheetHost + the five sheet bodies

The largest task. Port of the sheet system (lines 600–878) minus the content mutation.

**Files:**
- Create: `packages/ui/src/sheets/SheetHost.tsx`, `packages/ui/src/sheets/MedRailSheet.tsx`, `packages/ui/src/sheets/CanCantSheet.tsx`, `packages/ui/src/sheets/CycleSheet.tsx`, `packages/ui/src/sheets/InterpreterSheet.tsx`, `packages/ui/src/sheets/FeelSheet.tsx`
- Modify: `packages/ui/src/daybook/Daybook.tsx` (mount SheetHost)
- Test: `packages/ui/src/sheets/sheets.test.tsx`

**Step 1: Failing tests** — the prototype's Task-7 verification loops as RTL tests:

```tsx
describe('sheet system', () => {
  it('day 1: Next → med rail → Log → rail and Next slot update', async () => {
    render(<Daybook content={avcUfe} initialDay={1} statusLabel="Maya · UFE Feb 12" />);
    await userEvent.click(screen.getByRole('button', { name: /next: ibuprofen 800/i }));
    expect(screen.getByRole('dialog', { name: /your medicines/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Log it' }));
    expect(screen.getByText('taken just now ✓')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next: ibuprofen 800 — 6:00/i })).toBeInTheDocument();
  });
  it('day 5: symptom chip → interpreter answers first → "Yes, that helps" records and advances', async () => {
    render(<Daybook content={avcUfe} initialDay={5} statusLabel="Maya · UFE Feb 12" />);
    await userEvent.click(screen.getByRole('button', { name: 'a harder day' }));
    await userEvent.click(screen.getByRole('button', { name: 'Warm / feverish' }));
    expect(screen.getByText('WORTH CHECKING AT DAY 5')).toBeInTheDocument();
    expect(screen.getByText(/THE ONE LINE YOUR CLINIC WATCHES/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Yes, that helps' }));
    expect(screen.getByText(/warm \/ feverish/)).toBeInTheDocument();   // note receipt on the page
  });
  it('"Not quite" escalates in place: threshold gate + self-care + 911 line, no call button', async () => {
    render(<Daybook content={avcUfe} initialDay={5} statusLabel="Maya · UFE Feb 12" />);
    await userEvent.click(screen.getByRole('button', { name: 'a harder day' }));
    await userEvent.click(screen.getByRole('button', { name: 'Warm / feverish' }));
    await userEvent.click(screen.getByRole('button', { name: 'Not quite' }));
    expect(screen.getByText(/THE ONE THING TO WATCH FOR/)).toBeInTheDocument();
    expect(screen.getByText(/Call 911/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /call carrie/i })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Back to today' }));
    expect(screen.getByText(/warm \/ feverish/)).toBeInTheDocument();
  });
  it('day 20: Next → cycle sheet → choosing reveals the footnote', async () => {
    render(<Daybook content={avcUfe} initialDay={20} statusLabel="Maya · UFE Feb 12" />);
    await userEvent.click(screen.getByRole('button', { name: /next: cycle 1 check-in/i }));
    await userEvent.click(screen.getByRole('button', { name: 'Heavier' }));
    expect(screen.getByText(/Heavier for the first one or two cycles is common/)).toBeInTheDocument();
  });
  it('day 10: Next → can/can’t sheet with countdowns', async () => {
    render(<Daybook content={avcUfe} initialDay={10} statusLabel="Maya · UFE Feb 12" />);
    await userEvent.click(screen.getByRole('button', { name: /next: baths & pools clear/i }));
    expect(screen.getByText('Baths, pools & hot tubs')).toBeInTheDocument();
    expect(screen.getAllByText('4 days — Feb 26')).toHaveLength(2);
  });
  it('"Feeling something?" lists the day’s symptoms and swaps to the interpreter', async () => {
    render(<Daybook content={avcUfe} initialDay={3} statusLabel="Maya · UFE Feb 12" />);
    await userEvent.click(screen.getByRole('button', { name: /feeling something/i }));
    await userEvent.click(screen.getByRole('button', { name: 'Still feverish' }));
    expect(screen.getByText('EXPECTED THROUGH DAY 3')).toBeInTheDocument();
  });
  it('Escape closes; focus returns to the opener', async () => {
    render(<Daybook content={avcUfe} initialDay={1} statusLabel="Maya · UFE Feb 12" />);
    const opener = screen.getByRole('button', { name: /next: ibuprofen 800/i });
    await userEvent.click(opener);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });
});
```

**Step 2:** Run — FAIL. **Step 3:** Implement:
- `SheetHost.tsx`: renders `#sheet-root` with `.dim` + `.sheet` (`role="dialog" aria-modal="true"`, `aria-label` from the `SHEET_LABELS` map, lines 606–612) when `sheet` is non-null. Behavior ports: dim/grab click close; Escape closes (document listener while open); on open, save `document.activeElement` in a ref and focus the sheet (`preventScroll`); on close, restore focus to the saved element if still connected; content swaps (feel → interpreter, escalate) keep the saved opener (lines 616–630). The open/close animation works with the CSS from daybook.css: add the `open` class on the frame after mount (double rAF, line 866); on close, remove it and unmount after a 280ms timeout (lines 843–848) — skip the timeout under reduced motion by unmounting immediately when `matchMedia('(prefers-reduced-motion: reduce)').matches`.
- `MedRailSheet.tsx` (lines 677–700): renders `deriveDayView(day, logged)` rail — groups, rows (`name.split('|')` main/sub), Log button → `logDose()`, Tylenol meter, quiet line, paired line.
- `CanCantSheet.tsx` (lines 702–712), `CycleSheet.tsx` (lines 714–721; selection from `cycleAnswer`, footnote revealed on selection).
- `InterpreterSheet.tsx` (lines 729–758): answer view (tag, head, body, threshold with alert icon + `THE ONE LINE YOUR CLINIC WATCHES`, `DID THIS ANSWER YOUR QUESTION?`, primary `Yes, that helps` → `resolveInterpreter()`, ghost `Not quite` → `escalateInterpreter()`); escalated view (gatelead, threshold `.gate` with `THE ONE THING TO WATCH FOR`, `interp.care ?? meta.selfCareDefault`, `meta.emergencyLine`, single ghost `Back to today` → `resolveInterpreter()`). The alert icon is a small inline SVG component (line 730).
- `FeelSheet.tsx` (lines 760–770, 822–836): the day's interpreter keys as chips + `Something else…` (routes to the noted-phase inline input when `phase === 'noted'`, else just closes).
- Mount `SheetHost` in `Daybook`.

**Step 4:** Run: `npx jest packages/ui` — Expected: PASS (full ui suite). Then `npm test` at root — all projects green.

**Step 5:** Commit: `git commit -am "feat(ui): sheet system — med rail, can/cant, cycle, interpreter, feel"`

---

## Task 15: `apps/web` — compose and run

**Files:**
- Create: `apps/web/package.json`, `apps/web/tsconfig.json`, `apps/web/next.config.ts`, `apps/web/jest.config.js`
- Create: `apps/web/app/layout.tsx`, `apps/web/app/page.tsx`, `apps/web/app/globals.css`
- Test: `apps/web/app/page.test.tsx`
- Modify: root `jest.config.js` (add web project)

**Step 1:** `apps/web/package.json`:

```json
{
  "name": "web",
  "version": "0.0.0",
  "private": true,
  "scripts": { "dev": "next dev", "build": "next build", "start": "next start", "typecheck": "tsc --noEmit" },
  "dependencies": {
    "@postpal/content": "*",
    "@postpal/ui": "*",
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": { "@types/node": "^22.0.0", "tailwindcss": "^4.0.0", "@tailwindcss/postcss": "^4.0.0", "postcss": "^8.4.0" }
}
```

Add `apps/web/postcss.config.mjs`: `export default { plugins: { '@tailwindcss/postcss': {} } };`

**Step 2:** `next.config.ts`:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@postpal/ui', '@postpal/content'],
  async headers() {
    // concept PoC — same noindex treatment as the prototype deployment
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] }];
  }
};
export default nextConfig;
```

`tsconfig.json`: extend the base, add Next's `plugins: [{ "name": "next" }]`, `jsx: "preserve"`, `allowJs`, include `next-env.d.ts`, `.next/types`.

**Step 3:** `app/globals.css`:

```css
@import 'tailwindcss';
@import '@postpal/ui/styles/tokens.css';
@import '@postpal/ui/styles/daybook.css';
/* Tailwind must scan the ui package for class names */
@source '../../../packages/ui/src';
```

`app/layout.tsx` — fonts as CSS variables the tokens consume:

```tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Petrona, Albert_Sans } from 'next/font/google';
import './globals.css';

const petrona = Petrona({ subsets: ['latin'], style: ['normal', 'italic'], weight: ['400', '500', '600'], variable: '--font-petrona' });
const albert = Albert_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-albert' });

export const metadata: Metadata = { title: 'PostPal — Daybook', robots: { index: false } };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${petrona.variable} ${albert.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

`app/page.tsx`:

```tsx
'use client';

import { Daybook } from '@postpal/ui';
import { avcUfe } from '@postpal/content';

export default function Home() {
  return <Daybook content={avcUfe} initialDay={5} statusLabel="Maya · UFE Feb 12" />;
}
```

**Step 4: Smoke test** `app/page.test.tsx` (jest config mirrors ui's jsdom setup; add to root projects):

```tsx
import { render, screen } from '@testing-library/react';
import Home from './page';

it('composes content and ui into the daybook', () => {
  render(<Home />);
  expect(screen.getByText('DAY 5 · MORNING CHECK-IN')).toBeInTheDocument();
  expect(screen.getByText('Maya · UFE Feb 12')).toBeInTheDocument();
});
```

**Step 5:** Run: `npm install`, then `npm test` — all projects PASS. `npm run typecheck` — clean. `npm run build` — succeeds.

**Step 6:** Manual check: `lsof -i :3000` first (project rule), then `npm run dev`. Open `http://localhost:3000` — cream page, Petrona hero, five faces, day switcher; walk day 5 check-in → Nothing new → page.

**Step 7:** Commit: `git commit -am "feat(web): next app composes @postpal/ui and @postpal/content"`

---

## Task 16: Playwright parity pass + final verification

**Step 1:** REQUIRED SUB-SKILL: use the **webapp-testing** skill against `http://localhost:3000` (dev server from Task 15). Script the three prototype-verified journeys:
1. **Day 5 happy path:** face → "Nothing new" → page renders 4 chapters → Next opens med rail → Log → slot reads the 6:00 dose.
2. **Day 20 cycle path:** Next → cycle sheet → "Heavier" → footnote confirms.
3. **Day 5 interpreter path:** harder-day face → "Warm / feverish" chip → answer view → "Not quite" → escalated view (no call button, 911 line) → "Back to today" → note recorded.

**Step 2:** Screenshot each day's page state (days 1, 3, 5, 10, 20) into the session scratchpad and compare side-by-side with `prototypes/screenshots/day-*.png`. The prototype is the spec: typography scale, spacing rhythm, tone colors, and chapter presence must match. File any drift and fix before proceeding.

**Step 3:** Accessibility spot-checks in the running app: tab to a face and press Enter (advances); open a sheet, press Escape (closes, focus returns); enable reduced motion (`emulateMedia`) and confirm sheets still open/close.

**Step 4:** Full gate: `npm test && npm run typecheck && npm run build` — all green.

**Step 5:** Final commit and push: `git push -u origin feature/monorepo-poc`.

**Step 6:** REQUIRED SUB-SKILL: use superpowers:finishing-a-development-branch to decide merge/PR/cleanup with the user. Note for later (not in this PoC): creating the second Vercel project (root directory `apps/web`) is a dashboard step to do after merge.

---

## Success criteria (from the design doc)

1. **A second procedure is a content file** — the schema is procedure-agnostic; nothing in `ui`/`web` names UFE.
2. **A second surface could consume `@postpal/ui`** — `apps/web` contains no components, only composition.
3. **Incomplete content fails CI** — Task 4's refinements + Task 5's parse test.

## Out of scope (do not add)

Persistence, auth, notifications, real day-progression, CMS, care-tracker reuse, Turborepo, night theming, the tab bar. State resets on reload — that is correct behavior for this PoC.
