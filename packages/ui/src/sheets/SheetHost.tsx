import type { ProcedureContent } from '@postpal/content';

export interface SheetHostProps {
  content: ProcedureContent;
}

/**
 * Placeholder for the sheet system. Task 7 implements the bottom-sheet host on
 * @gorhom/bottom-sheet (driven by store.sheet). Rendered by the Daybook shell
 * so the composition is complete; a no-op until then.
 */
export function SheetHost(_props: SheetHostProps): null {
  return null;
}
