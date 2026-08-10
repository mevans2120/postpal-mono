import type { DayContent } from '@postpal/content';
import { renderCopy } from '../primitives/renderCopy';
import { FaceGlyph } from '../primitives/FaceGlyph';
import { FACE_LABELS, FACE_MOUTHS } from '../primitives/faces';
import { useDaybook } from '../store';

export interface CheckInProps {
  day: DayContent;
}

/**
 * The check-in phase (prototype render lines 893–919). Calm budget: eyebrow,
 * the FULL hero (no hairline, no toggle), and the one ask — five faces. Nothing
 * else competes. The status line is owned by the Daybook shell (rendered once,
 * above the phase view), so this view does not render it. Returning from a
 * face-receipt tap keeps the chosen face preselected (state.face survives).
 */
export function CheckIn({ day }: CheckInProps) {
  const face = useDaybook((s) => s.face);
  const selectFace = useDaybook((s) => s.selectFace);

  return (
    <>
      <div className="mt-[44px]">
        <div className="text-[11px] tracking-[.14em] font-bold text-pine">{day.eyebrow}</div>
        <div className="font-serif font-medium text-[24.5px] leading-[1.36] mt-3">
          {renderCopy(day.heroFull, { em: 'italic text-clay' })}
        </div>
      </div>
      <div className="mt-9">
        <span className="text-[11px] tracking-[.16em] font-bold text-mut">HOW DOES TODAY FEEL?</span>
        <div className="flex gap-2.5 mt-3.5">
          {FACE_MOUTHS.map((_, i) => {
            const sel = face === i;
            return (
              <button
                key={i}
                type="button"
                data-face={i}
                aria-label={FACE_LABELS[i]}
                aria-pressed={sel}
                onClick={() => selectFace(i)}
                className={`flex-1 aspect-[1/1.18] bg-card border rounded-[18px] flex items-center justify-center cursor-pointer p-0 [&>svg]:w-[80%] [&>svg]:h-auto ${
                  sel
                    ? 'border-clay shadow-[0_2px_8px_rgba(138,70,48,.12)]'
                    : 'border-line shadow-[0_2px_8px_rgba(43,33,24,.05)]'
                }`}
              >
                <FaceGlyph index={i} selected={sel} />
              </button>
            );
          })}
        </div>
        <div className="flex justify-between text-[11.5px] text-mut mt-2.5 italic font-serif">
          <span>a good day</span>
          <span>a hard day</span>
        </div>
      </div>
    </>
  );
}
