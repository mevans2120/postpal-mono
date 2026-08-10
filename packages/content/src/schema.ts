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
