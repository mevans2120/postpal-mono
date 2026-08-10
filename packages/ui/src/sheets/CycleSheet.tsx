import type { Cycle } from '@postpal/content';
import { useDaybook } from '../store';

export interface CycleSheetProps {
  cycle: Cycle;
}

/**
 * The cycle check-in sheet (prototype cycleHTML, lines 714–721). The pills are
 * the day's options; the chosen one comes from the store's cycleAnswer, and
 * choosing reveals the footnote as the confirmation line. (Per the Task 8 review
 * decision, cycleAnswer resets on day switch — deliberately unlike the prototype.)
 */
export function CycleSheet({ cycle }: CycleSheetProps) {
  const selected = useDaybook((s) => s.cycleAnswer);
  const answerCycle = useDaybook((s) => s.answerCycle);

  return (
    <>
      <div className="font-serif text-[20px] font-medium">{cycle.title}</div>
      <div className="flex gap-2 mt-3.5">
        {cycle.options.map((opt) => {
          const sel = selected === opt;
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={sel}
              onClick={() => answerCycle(opt)}
              className={`flex-1 min-h-11 text-center text-[11.5px] font-bold border rounded-full py-[11px] font-sans cursor-pointer ${
                sel ? 'bg-pine-soft text-pine border-pine-soft' : 'text-mut border-line'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selected ? (
        <div className="font-serif italic text-[13.5px] text-pine mt-3.5">{cycle.footnote}</div>
      ) : null}
    </>
  );
}
