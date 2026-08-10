import type { CSSProperties, KeyboardEvent } from 'react';
import type { DayContent } from '@postpal/content';
import { HeroBlock } from './HeroBlock';
import { Receipt } from '../primitives/Receipt';
import { FaceGlyph } from '../primitives/FaceGlyph';
import { FACE_LABELS, faceAckKey, faceReceiptText } from '../primitives/faces';
import { useSettle } from '../primitives/useSettle';
import { useDaybook } from '../store';

export interface NotedViewProps {
  day: DayContent;
}

/**
 * The noted phase (prototype render lines 920–983): the truncated hero, the
 * face receipt (tap to change how today feels), the ack line, and the one
 * follow-up ask — the day's chips, or the inline note input when it's open.
 * Assumes state.face is set (this phase is only reached after selectFace).
 */
export function NotedView({ day }: NotedViewProps) {
  const dayNum = useDaybook((s) => s.day);
  const phase = useDaybook((s) => s.phase);
  const face = useDaybook((s) => s.face);
  const noteInputOpen = useDaybook((s) => s.noteInputOpen);
  const noteDraft = useDaybook((s) => s.noteDraft);
  const reopenCheckin = useDaybook((s) => s.reopenCheckin);
  const chooseChip = useDaybook((s) => s.chooseChip);
  const submitNote = useDaybook((s) => s.submitNote);
  const cancelNote = useDaybook((s) => s.cancelNote);
  const setNoteDraft = useDaybook((s) => s.setNoteDraft);
  const settle = useSettle(dayNum, phase);

  if (face === null) return null;

  const settleCls = settle ? ' settle' : '';
  const delay = (ms: string): CSSProperties => ({ '--d': ms } as CSSProperties);

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submitNote(noteDraft);
    else if (e.key === 'Escape') cancelNote();
  };

  return (
    <>
      <HeroBlock day={day} className="mt-[34px]" />

      <Receipt
        icon={<FaceGlyph index={face} selected size={30} />}
        onActivate={reopenCheckin}
        label="Change how today feels"
        settle={settle}
      >
        Today feels: <span className="italic text-pine">{faceReceiptText(face)}</span>
      </Receipt>

      <div
        className={`font-serif italic text-[13.5px] text-pine mt-2.5${settleCls}`}
        style={delay('100ms')}
      >
        {day.ack[faceAckKey(face)]}
      </div>

      <div className={`mt-[22px]${settleCls}`} style={delay('200ms')}>
        <span className="text-[11px] tracking-[.16em] font-bold text-pine">ANYTHING TO NOTE TODAY?</span>
        {noteInputOpen ? (
          <div className="flex items-center gap-2 mt-2.5">
            <input
              type="text"
              autoFocus
              aria-label="Your note"
              placeholder="A few words is plenty"
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              onKeyDown={onInputKeyDown}
              className="flex-1 min-w-0 font-sans text-[13px] text-ink bg-card border border-line rounded-full py-[9px] px-3.5 outline-none focus:border-clay"
            />
            <button
              type="button"
              onClick={() => submitNote(noteDraft)}
              className="relative hit-notebtn font-sans text-[12.5px] font-semibold text-clay-deep py-[9px] px-1 whitespace-nowrap"
            >
              note it
            </button>
            <button
              type="button"
              aria-label="Back to the choices"
              onClick={cancelNote}
              className="relative hit-notebtn-quiet font-sans text-[12.5px] font-medium text-mut py-[9px] px-1 whitespace-nowrap"
            >
              back
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-[9px] mt-2.5">
            {day.chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => chooseChip(chip)}
                className="relative hit-chip font-sans text-[12.5px] font-semibold text-ink bg-card border border-line rounded-full py-[9px] px-3.5 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
