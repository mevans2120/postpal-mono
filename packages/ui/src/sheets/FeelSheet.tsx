import type { DayContent } from '@postpal/content';
import { SOMETHING_ELSE } from '@postpal/content';
import { useDaybook } from '../store';

export interface FeelSheetProps {
  day: DayContent;
}

/**
 * The "What are you feeling?" sheet (prototype feelHTML + its wiring, lines
 * 760–770, 822–836). The day's interpreter keys become chips that swap this
 * sheet's content to the interpreter (origin 'feel', so resolving just closes).
 * "Something else…" hands off to chooseChip — which opens the inline note input
 * only in the noted phase (store phase-guard) — then closes the sheet.
 */
export function FeelSheet({ day }: FeelSheetProps) {
  const openSheet = useDaybook((s) => s.openSheet);
  const chooseChip = useDaybook((s) => s.chooseChip);
  const closeSheet = useDaybook((s) => s.closeSheet);

  const chipCls =
    'relative hit-chip font-sans text-[12.5px] font-semibold text-ink bg-card border border-line rounded-full py-[9px] px-3.5 cursor-pointer';

  return (
    <>
      <div className="font-serif text-[20px] font-medium">What are you feeling?</div>
      <div className="flex flex-wrap gap-[9px] mt-3.5">
        {Object.keys(day.interpreters).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => openSheet('interpreter', { key, origin: 'feel' })}
            className={chipCls}
          >
            {key}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            chooseChip(SOMETHING_ELSE);
            closeSheet();
          }}
          className={chipCls}
        >
          {SOMETHING_ELSE}
        </button>
      </div>
    </>
  );
}
