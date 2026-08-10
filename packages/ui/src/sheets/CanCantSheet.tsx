import type { CanCant } from '@postpal/content';

export interface CanCantSheetProps {
  cancant: CanCant;
}

/**
 * The can / can't-yet sheet (prototype cancantHTML, lines 702–712): what's back
 * as one line, then the not-yet rows with their cleared-date countdowns, and the
 * footnote sourcing those dates to the clinic's discharge instructions.
 */
export function CanCantSheet({ cancant }: CanCantSheetProps) {
  return (
    <>
      <div className="font-serif text-[20px] font-medium">{cancant.title}</div>
      <div className="text-[10px] tracking-[.16em] font-bold text-mut mt-4 mb-[2px]">BACK</div>
      <div className="font-serif text-[14.5px] font-semibold text-pine pt-2 pb-2.5 border-b border-line">
        {cancant.back}
      </div>
      <div className="text-[10px] tracking-[.16em] font-bold text-mut mt-4 mb-[2px]">NOT YET</div>
      {cancant.notYet.map(([name, countdown], i) => (
        <div key={i} className="flex items-center gap-3 py-2.5 border-b border-line">
          <span className="font-serif text-[15.5px]">{name}</span>
          <span className="ml-auto text-[11px] font-bold whitespace-nowrap text-clay-deep">{countdown}</span>
        </div>
      ))}
      <div className="text-[11.5px] text-mut mt-3.5">{cancant.footnote}</div>
    </>
  );
}
