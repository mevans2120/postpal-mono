import type { DayContent } from '@postpal/content';
import { deriveDayView } from '../derive';
import { useDaybook } from '../store';

export interface NextBarProps {
  day: DayContent;
}

/**
 * The fixed Next-slot bar (prototype renderNextbar, lines 583–598). The left
 * slot is whatever is genuinely next in the recovery — a dose (clay) or a
 * milestone/cycle (pine) — derived from content ⊕ the day's logged-dose count.
 * The right slot is the constant, quiet symptom door. Renders in EVERY phase;
 * the phase never changes it, only the day (and doses logged today) does.
 */
export function NextBar({ day }: NextBarProps) {
  const logged = useDaybook((s) => s.logged[s.day] ?? 0);
  const openSheet = useDaybook((s) => s.openSheet);
  const next = deriveDayView(day, logged).next;
  const tone = next.tone === 'clay' ? 'bg-clay-fill' : 'bg-pine';

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-paper border-t border-line px-6 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] z-50">
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => openSheet(next.sheet)}
          aria-label={`Next: ${next.label} — ${next.sub}`}
          className={`flex-[1.5] rounded-full py-[11px] px-4 text-white flex items-center gap-2.5 text-left font-sans cursor-pointer ${tone}`}
        >
          <span className="text-[9px] tracking-[.16em] font-bold opacity-90">NEXT</span>
          <span className="text-[13px] font-bold leading-[1.25]">
            {next.label}
            <small className="block font-semibold text-[10.5px] opacity-95">{next.sub}</small>
          </span>
        </button>
        <button
          type="button"
          onClick={() => openSheet('feel')}
          aria-label="Feeling something? Check a symptom"
          className="flex-1 border-[1.5px] border-line bg-card text-mut rounded-full flex items-center justify-center text-[12px] font-bold px-2 font-sans cursor-pointer"
        >
          Feeling something?
        </button>
      </div>
    </nav>
  );
}
