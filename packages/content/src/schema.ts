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

/**
 * Sentinel chip labels that route by identity rather than an interpreter (both
 * the user-facing label and the value passed to chooseChip). Single-sourced here
 * so @postpal/ui compares against these instead of re-hardcoding the literals.
 */
export const NOTHING_NEW = 'Nothing new';
export const SOMETHING_ELSE = 'Something else…';   // note U+2026 ellipsis

/** Chips that intentionally have no interpreter (prototype line 457). */
export const CHIPS_WITHOUT_INTERPRETERS = new Set([NOTHING_NEW, SOMETHING_ELSE]);

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
