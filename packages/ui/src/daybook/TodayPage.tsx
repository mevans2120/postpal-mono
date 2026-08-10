import type { CSSProperties } from 'react';
import type { DayContent } from '@postpal/content';
import { HeroBlock } from './HeroBlock';
import { Receipt } from '../primitives/Receipt';
import { FaceGlyph } from '../primitives/FaceGlyph';
import { faceReceiptText } from '../primitives/faces';
import { renderCopy } from '../primitives/renderCopy';
import { useSettle } from '../primitives/useSettle';
import { deriveDayView } from '../derive';
import { useDaybook } from '../store';

export interface TodayPageProps {
  day: DayContent;
}

/**
 * The page phase (prototype render lines 984–1060): hero + two receipts above
 * the fold, then the four question-led chapters. Chapters 2 and 3 shrink as the
 * recovery does — BACK/NOT YET lines drop when null, and the medicines chapter
 * disappears entirely once meds is null (day 20). Assumes state.face is set.
 */
export function TodayPage({ day }: TodayPageProps) {
  const dayNum = useDaybook((s) => s.day);
  const phase = useDaybook((s) => s.phase);
  const face = useDaybook((s) => s.face);
  const note = useDaybook((s) => s.note);
  const logged = useDaybook((s) => s.logged[s.day] ?? 0);
  const reopenCheckin = useDaybook((s) => s.reopenCheckin);
  const reopenNoted = useDaybook((s) => s.reopenNoted);
  const openSheet = useDaybook((s) => s.openSheet);
  const settle = useSettle(dayNum, phase);

  if (face === null) return null;

  const settleCls = settle ? ' settle' : '';
  const delay = (ms: string): CSSProperties => ({ '--d': ms } as CSSProperties);
  const medsLine = deriveDayView(day, logged).medsLine;

  return (
    <>
      <HeroBlock day={day} className="mt-[30px]" />

      {/* face receipt — reflects the selected face, tap to change how today feels */}
      <Receipt
        icon={<FaceGlyph index={face} selected size={30} />}
        onActivate={reopenCheckin}
        label="Change how today feels"
        settle={settle}
      >
        Today feels: <span className="italic text-pine">{faceReceiptText(face)}</span>
      </Receipt>

      {/* note receipt — the pine ✓ dot; the note renders as a plain string child
          (React auto-escapes), the XSS-safe port of the prototype's esc() */}
      <Receipt
        icon={
          <span className="w-[30px] h-[30px] rounded-full bg-pine-soft flex items-center justify-center text-pine text-[15px] font-bold">
            ✓
          </span>
        }
        onActivate={reopenNoted}
        label="Change what you noted"
        settle={settle}
        delay="60ms"
      >
        Noted: <span className="italic text-pine">{note}</span>
      </Receipt>

      {/* chapter 1: the reading */}
      <div className={`mt-6${settleCls}`} style={delay('120ms')}>
        <h5 className="font-serif text-[18.5px] font-medium italic text-ink border-t border-line pt-3.5">
          How today might feel
        </h5>
        {day.feel.map((entry, i) => (
          <div key={i} className="mt-4">
            <p className="font-serif text-[15px] leading-[1.6]">
              {renderCopy(entry.body, { b: 'font-semibold' })}
            </p>
            {entry.note ? (
              <span className="block font-serif italic text-[12.5px] text-clay-deep mt-[9px] pl-[11px] border-l-2 border-clay">
                {entry.note}
              </span>
            ) : null}
          </div>
        ))}
        {/* "Keep reading" is a prototype edge — pressed state only, no behavior. */}
        <p className="text-[12px] font-bold text-mut mt-3 noop">
          Keep reading: <b className="text-clay-deep">{day.turn} →</b>
        </p>
      </div>

      {/* chapter 2: can / can't yet */}
      <div className={`mt-6${settleCls}`} style={delay('180ms')}>
        <h5 className="font-serif text-[18.5px] font-medium italic text-ink border-t border-line pt-3.5">
          What you can do — and not yet
        </h5>
        {day.back ? (
          <div className="flex items-baseline gap-2 text-[13px] mt-2.5 leading-[1.5]">
            <span className="flex-none text-[10.5px] tracking-[.12em] font-bold text-mut w-[74px]">BACK</span>
            <span className="font-serif text-[14px]">
              <span className="text-pine font-semibold">{day.back}</span>
            </span>
          </div>
        ) : null}
        {day.notYet ? (
          <div className="flex items-baseline gap-2 text-[13px] mt-2.5 leading-[1.5]">
            <span className="flex-none text-[10.5px] tracking-[.12em] font-bold text-mut w-[74px]">NOT YET</span>
            <span className="font-serif text-[14px]">
              {renderCopy(day.notYet, { b: 'font-sans text-[11.5px] font-bold text-clay-deep' })}
            </span>
          </div>
        ) : null}
      </div>

      {/* chapter 3: meds (absent on day 20) */}
      {day.meds ? (
        <div className={`mt-6${settleCls}`} style={delay('240ms')}>
          <h5 className="font-serif text-[18.5px] font-medium italic text-ink border-t border-line pt-3.5">
            Your medicines today
          </h5>
          <div className="flex items-baseline gap-2 text-[13px] mt-2.5 leading-[1.5]">
            <span className="flex-none text-[10.5px] tracking-[.12em] font-bold text-mut w-[74px]">{day.meds.k}</span>
            <span className="font-serif text-[14px]">{medsLine}</span>
            <button
              type="button"
              onClick={() => openSheet(day.meds!.sheet)}
              aria-label="Open today's medicine rail"
              className="relative hit-go ml-auto text-clay-deep font-bold text-[12px] whitespace-nowrap"
            >
              open →
            </button>
          </div>
        </div>
      ) : null}

      {/* chapter 4: ahead */}
      <div className={`mt-6${settleCls}`} style={delay('300ms')}>
        <h5 className="font-serif text-[18.5px] font-medium italic text-ink border-t border-line pt-3.5">
          What’s ahead
        </h5>
        {day.ahead.map((item, i) => (
          <div key={i} className="flex items-baseline gap-2 text-[13px] mt-2.5 leading-[1.5]">
            <span className="flex-none text-[10.5px] tracking-[.12em] font-bold text-mut w-[74px]">{item.k}</span>
            <span className="font-serif text-[14px]">{item.v}</span>
            {item.details ? (
              <span className="ml-auto text-clay-deep font-bold text-[12px] whitespace-nowrap noop">details →</span>
            ) : null}
          </div>
        ))}
      </div>

      <div
        className={`text-center text-mut text-[15px] tracking-[.2em] mb-1.5 mt-[14px]${settleCls}`}
        style={delay('300ms')}
      >
        ⌄
      </div>
    </>
  );
}
