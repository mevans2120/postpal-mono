import type { ProcedureContent } from '@postpal/content';
import { listDays } from '@postpal/content';
import { useDaybook } from '../store';

export interface DaySwitcherProps {
  content: ProcedureContent;
}

/**
 * The dev-only day switcher (prototype lines 200–215, 1074–1080). Deliberately
 * NOT product-styled — the hardcoded grays are intentional so it never reads as
 * part of the product. Fixed pill row from listDays(content); each pill switches
 * the store to a fresh check-in for that day.
 */
export function DaySwitcher({ content }: DaySwitcherProps) {
  const currentDay = useDaybook((s) => s.day);
  const switchDay = useDaybook((s) => s.switchDay);

  return (
    <div
      aria-label="Prototype day switcher (dev control)"
      className="fixed top-[42px] right-2.5 flex gap-1 z-[100]"
    >
      {listDays(content).map((n) => {
        const active = n === currentDay;
        return (
          <button
            key={n}
            type="button"
            aria-label={`Day ${n}`}
            onClick={() => switchDay(n)}
            className={`font-sans text-[10px] font-semibold rounded-[10px] py-[2px] px-[7px] cursor-pointer border ${
              active
                ? 'text-white bg-[#888] border-[#888]'
                : 'text-[#888] bg-[#eee] border-[#ccc]'
            }`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
