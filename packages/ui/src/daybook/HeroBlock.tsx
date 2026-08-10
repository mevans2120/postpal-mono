import type { KeyboardEvent } from 'react';
import type { DayContent } from '@postpal/content';
import { renderCopy } from '../primitives/renderCopy';
import { useDaybook } from '../store';

export interface HeroBlockProps {
  day: DayContent;
  /** Outer-wrapper margin, e.g. "mt-[34px]" (noted) or "mt-[30px]" (page). */
  className?: string;
}

/**
 * Eyebrow + truncated hero on a hairline rule (prototype heroBlockHTML, lines
 * 546–555). Tapping the hero toggles the full sentence back in place; the
 * hairline stays. Shared by NotedView and TodayPage — CheckIn shows the full
 * hero with no hairline and no toggle, so it does NOT use HeroBlock.
 */
export function HeroBlock({ day, className }: HeroBlockProps) {
  const heroExpanded = useDaybook((s) => s.heroExpanded);
  const toggleHero = useDaybook((s) => s.toggleHero);
  const copy = heroExpanded ? day.heroFull : day.heroShort;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleHero();
    }
  };

  return (
    <div className={className}>
      <div className="text-[11px] tracking-[.14em] font-bold text-pine">{day.eyebrow}</div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Expand or collapse today's reading"
        onClick={toggleHero}
        onKeyDown={onKeyDown}
        className="font-serif font-medium text-[24.5px] leading-[1.36] mt-3 pb-4 border-b border-line"
      >
        {renderCopy(copy, { em: 'italic text-clay' })}
      </div>
    </div>
  );
}
