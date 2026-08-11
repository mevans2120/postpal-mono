import type { DayContent, MedGroup } from '@postpal/content';
import { Pressable, Text, View } from 'react-native';
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

  const [val, max, meterLabel] = rail.meter;
  const pct = max ? Math.round((val / max) * 100) : 0;

  return (
    <View>
      <Text className="font-serif text-[20px] text-ink">{rail.title}</Text>
      {rail.groups.map((group, gi) => (
        <View key={gi}>
          <Text
            className={`text-[10px] tracking-[1.6px] font-sans-bold mt-4 mb-[2px] ${
              group.now ? 'text-clay-deep' : 'text-mut'
            }`}
          >
            {group.label}
          </Text>
          {group.rows.map((row, ri) => (
            <MedRow key={ri} row={row} group={group} onLog={logDose} />
          ))}
        </View>
      ))}
      <View className="flex-row items-center gap-2.5 mt-3">
        <Text className="text-[10px] tracking-[1.2px] font-sans-bold text-mut">{meterLabel}</Text>
        <View className="flex-1 h-[5px] rounded-[3px] bg-line overflow-hidden">
          {/* Computed percentage width — a legit technical inline style; NativeWind
              can't express a dynamic value like this via className. */}
          <View className="h-full bg-pine" style={{ width: `${pct}%` }} />
        </View>
        <Text className="text-[10px] tracking-[1.2px] font-sans-bold text-mut">
          {val} / {max} MG
        </Text>
      </View>
      <Text className="font-serif-italic text-[13.5px] text-pine mt-3.5">{renderCopy(rail.quiet)}</Text>
      {rail.paired ? <Text className="text-[11.5px] text-mut mt-2">{rail.paired}</Text> : null}
    </View>
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
    ? 'bg-clay-soft rounded-xl py-3 px-3 my-1.5 -mx-[2px] flex-row items-center gap-3'
    : `flex-row items-center gap-3 py-2.5 border-b border-line${group.done ? ' opacity-40' : ''}`;
  const tmCls = `w-11 text-[11.5px] font-sans-bold ${group.now ? 'text-clay-deep' : 'text-mut'}`;
  const medCls = `font-serif text-[15.5px] text-ink${group.done ? ' line-through' : ''}`;

  return (
    <View className={rowCls}>
      <Text className={tmCls}>{tm}</Text>
      <View>
        <Text className={medCls}>{main}</Text>
        {sub ? <Text className="font-sans-semibold text-[11px] text-mut mt-[1px]">{sub}</Text> : null}
      </View>
      {status === 'LOG' ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log it"
          onPress={onLog}
          hitSlop={8}
          className="ml-auto bg-clay-fill rounded-full py-[9px] px-4"
        >
          <Text className="text-white text-[12px] font-sans-bold">Log it</Text>
        </Pressable>
      ) : status ? (
        <Text className="ml-auto text-[11px] font-sans-bold text-pine">{status}</Text>
      ) : null}
    </View>
  );
}
