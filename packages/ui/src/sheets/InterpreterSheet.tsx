import type { Interpreter, Meta } from '@postpal/content';
import { renderCopy } from '../primitives/renderCopy';
import { useDaybook } from '../store';

/**
 * The alert icon (prototype daybook.html line 730) — a small ring-and-bang SVG
 * inlined so the interpreter's threshold and 911 lines carry the same clinical
 * mark. The stroke is the literal --color-alert value, matching the prototype.
 */
function AlertIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      className="flex-none mt-[2px]"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="6" fill="none" stroke="#9c3a2a" strokeWidth="1.5" />
      <path d="M7 4v3.5M7 9.8v.4" stroke="#9c3a2a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export interface InterpreterSheetProps {
  interp: Interpreter;
  escalated: boolean;
  meta: Meta;
}

/**
 * The symptom interpreter (prototype interpreterHTML, lines 729–758). The answer
 * view leads with what the symptom means and the one line the clinic watches;
 * "Not quite" escalates in place to the watch-for gate, self-care, and the 911
 * line — never a phone call. From a check-in chip, resolving records the note
 * and lands on the page; from "Feeling something?" it just closes (the store's
 * resolveInterpreter reads the payload origin).
 */
export function InterpreterSheet({ interp, escalated, meta }: InterpreterSheetProps) {
  const resolveInterpreter = useDaybook((s) => s.resolveInterpreter);
  const escalateInterpreter = useDaybook((s) => s.escalateInterpreter);

  if (escalated) {
    const care = interp.care ?? meta.selfCareDefault;
    return (
      <>
        <div className="font-serif text-[18.5px] font-medium leading-[1.32] mb-1">
          Here’s the line to watch — and what helps right now.
        </div>
        <div className="flex gap-2.5 items-start bg-clay-soft border border-[#e7cdb6] rounded-xl py-3 px-3.5 mt-3.5 text-[13px]">
          <AlertIcon />
          <span>
            <span className="block text-[10px] tracking-[.12em] font-bold text-mut mb-[3px]">
              THE ONE THING TO WATCH FOR
            </span>
            {renderCopy(interp.threshold, { b: 'text-alert' })}
          </span>
        </div>
        <p className="text-[13px] text-mut leading-[1.55] mt-3">{renderCopy(care)}</p>
        <div className="flex gap-2 items-start text-[11.5px] text-mut mt-4 pt-3 border-t border-line">
          <AlertIcon />
          <span>{renderCopy(meta.emergencyLine, { b: 'text-alert' })}</span>
        </div>
        <div className="flex gap-2.5 mt-4">
          <button
            type="button"
            onClick={resolveInterpreter}
            className="flex-1 text-center rounded-full py-[13px] px-2.5 font-bold text-[13.5px] font-sans cursor-pointer border-[1.5px] border-line text-mut active:bg-card"
          >
            Back to today
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <span className="text-[10.5px] font-bold tracking-[.16em] text-pine">{interp.tag}</span>
      <h4 className="font-serif text-[21px] font-medium leading-[1.3] mt-2 mb-2.5">
        {renderCopy(interp.head)}
      </h4>
      <p className="text-[14px] leading-[1.6] text-[#5a4d40]">{renderCopy(interp.body)}</p>
      <div className="flex gap-2.5 items-start bg-white border border-line rounded-xl py-3 px-3.5 mt-3.5 text-[13px]">
        <AlertIcon />
        <span>
          <span className="block text-[10px] tracking-[.12em] font-bold text-mut mb-[3px]">
            THE ONE LINE YOUR CLINIC WATCHES
          </span>
          {renderCopy(interp.threshold, { b: 'text-alert' })}
        </span>
      </div>
      <div className="mt-[18px]">
        <span className="block text-[10.5px] tracking-[.14em] font-bold text-mut text-center mb-2.5">
          DID THIS ANSWER YOUR QUESTION?
        </span>
        <div className="flex gap-2.5 mt-4">
          <button
            type="button"
            onClick={resolveInterpreter}
            className="flex-1 text-center rounded-full py-[13px] px-2.5 font-bold text-[13.5px] font-sans cursor-pointer bg-clay-fill text-white active:bg-clay-deep"
          >
            Yes, that helps
          </button>
          <button
            type="button"
            onClick={escalateInterpreter}
            className="flex-1 text-center rounded-full py-[13px] px-2.5 font-bold text-[13.5px] font-sans cursor-pointer border-[1.5px] border-line text-mut active:bg-card"
          >
            Not quite
          </button>
        </div>
      </div>
    </>
  );
}
