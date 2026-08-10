import type { DayContent, MedGroup } from '@postpal/content';
import { deriveDayView } from '../derive';
import { renderCopy } from '../primitives/renderCopy';
import { useDaybook } from '../store';

export interface MedRailSheetProps {
  day: DayContent;
}

/**
 * The medicine rail (prototype medrailHTML/medRowHTML, lines 677–700). The rail
 * is derived from content ⊕ the day's logged-dose count, so logging the NOW dose
 * strikes it into the done group and promotes the next scheduled dose — the same
 * derivation the Next slot reads, so they always agree. Log calls logDose(),
 * which bumps the count and re-derives.
 */
export function MedRailSheet({ day }: MedRailSheetProps) {
  const logged = useDaybook((s) => s.logged[s.day] ?? 0);
  const logDose = useDaybook((s) => s.logDose);
  const rail = deriveDayView(day, logged).medrail;
  if (!rail) return null;

  const [val, max, label] = rail.meter;
  const pct = max ? Math.round((val / max) * 100) : 0;

  return (
    <>
      <div className="font-serif text-[20px] font-medium">{rail.title}</div>
      {rail.groups.map((group, gi) => (
        <div key={gi}>
          <div
            className={`text-[10px] tracking-[.16em] font-bold mt-4 mb-[2px] ${group.now ? 'text-clay-deep' : 'text-mut'}`}
          >
            {group.label}
          </div>
          {group.rows.map((row, ri) => (
            <MedRow key={ri} row={row} group={group} onLog={logDose} />
          ))}
        </div>
      ))}
      <div className="flex items-center gap-2.5 mt-3">
        <span className="text-[10px] tracking-[.12em] font-bold text-mut whitespace-nowrap">{label}</span>
        <span className="flex-1 h-[5px] rounded-[3px] bg-line overflow-hidden">
          <i className="block h-full bg-pine" style={{ width: `${pct}%` }} />
        </span>
        <span className="text-[10px] tracking-[.12em] font-bold text-mut whitespace-nowrap">
          {val} / {max} MG
        </span>
      </div>
      <div className="font-serif italic text-[13.5px] text-pine mt-3.5">{renderCopy(rail.quiet)}</div>
      {rail.paired ? <div className="text-[11.5px] text-mut mt-2">{rail.paired}</div> : null}
    </>
  );
}

function MedRow({
  row,
  group,
  onLog
}: {
  row: [string, string, string];
  group: MedGroup;
  onLog: () => void;
}) {
  const [tm, name, status] = row;
  const [main, sub] = name.split('|');
  const rowCls = group.now
    ? 'bg-clay-soft rounded-xl py-3 px-3 my-1.5 -mx-[2px] flex items-center gap-3'
    : `flex items-center gap-3 py-2.5 border-b border-line${group.done ? ' opacity-40' : ''}`;
  const tmCls = `flex-none w-11 text-[11.5px] font-bold ${group.now ? 'text-clay-deep' : 'text-mut'}`;
  const medCls = `font-serif text-[15.5px]${group.done ? ' line-through decoration-1' : ''}`;

  return (
    <div className={rowCls}>
      <span className={tmCls}>{tm}</span>
      <span className={medCls}>
        {main}
        {sub ? <small className="block font-sans text-[11px] text-mut font-semibold mt-[1px]">{sub}</small> : null}
      </span>
      {status === 'LOG' ? (
        <button
          type="button"
          onClick={onLog}
          className="relative hit-log ml-auto bg-clay-fill text-white rounded-full text-[12px] font-bold py-[9px] px-4 whitespace-nowrap font-sans cursor-pointer active:bg-clay-deep"
        >
          Log it
        </button>
      ) : status ? (
        <span className="ml-auto text-[11px] font-bold whitespace-nowrap text-pine">{status}</span>
      ) : null}
    </div>
  );
}
