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
