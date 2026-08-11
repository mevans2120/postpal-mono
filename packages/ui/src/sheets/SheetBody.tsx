import type { ProcedureContent } from '@postpal/content';
import { getDay } from '@postpal/content';
import type { OpenSheetKind } from '../store';
import { useDaybook } from '../store';
import { CanCantSheet } from './CanCantSheet';
import { CycleSheet } from './CycleSheet';
import { FeelSheet } from './FeelSheet';
import { InterpreterSheet } from './InterpreterSheet';
import { MedRailSheet } from './MedRailSheet';

export interface SheetBodyProps {
  content: ProcedureContent;
}

/**
 * Each sheet's accessible dialog name (the prototype's per-sheet aria-label).
 * Read by SheetHost for the BottomSheetModal's accessibilityLabel — kept here,
 * beside the kind dispatch it mirrors, as the single source.
 */
export const SHEET_LABELS: Record<OpenSheetKind, string> = {
  medrail: 'Your medicines today',
  cancant: 'What you can do — and not yet',
  cycle: 'Cycle check-in',
  interpreter: 'What this symptom means',
  feel: 'What are you feeling?'
};

/**
 * Dispatches store.sheet to the matching sheet body (the prototype's
 * SheetBody switch, daybook.html renderSheet). Deliberately free of any
 * @gorhom/bottom-sheet import: SheetHost wraps this in the real
 * BottomSheetModal (its present/dismiss wrapping is verified at runtime in
 * Task 8), while this component is what sheets.rn.test.tsx renders directly —
 * so the journey tests need no bottom-sheet transform/mock/provider setup.
 *
 * Uses ONLY View/Text/Pressable/react-native-svg (via the five bodies), so it
 * — and they — render standalone, both here and inside the real sheet.
 */
export function SheetBody({ content }: SheetBodyProps) {
  const sheet = useDaybook((s) => s.sheet);
  const dayNum = useDaybook((s) => s.day);
  if (!sheet) return null;

  const day = getDay(content, dayNum);

  switch (sheet.kind) {
    case 'medrail':
      return <MedRailSheet day={day} />;
    case 'cancant':
      return day.cancant ? <CanCantSheet cancant={day.cancant} /> : null;
    case 'cycle':
      return day.cycle ? <CycleSheet cycle={day.cycle} /> : null;
    case 'interpreter': {
      const key = sheet.payload?.key;
      const interp = key ? day.interpreters[key] : undefined;
      return interp ? (
        <InterpreterSheet interp={interp} escalated={!!sheet.payload?.escalated} meta={content.meta} />
      ) : null;
    }
    case 'feel':
      return <FeelSheet day={day} />;
    default:
      return null;
  }
}
