import type { ProcedureContent } from '@postpal/content';
import { listDays } from '@postpal/content';
import { Pressable, Text, View } from 'react-native';
import { useDaybook } from '../store';

export interface DaySwitcherProps {
  content: ProcedureContent;
}

/**
 * The dev-only day switcher (prototype lines 200–215, 1074–1080). Deliberately
 * NOT product-styled — the hardcoded grays are intentional so it never reads as
 * part of the product. Absolute overlay pill row from listDays(content); each
 * pill switches the store to a fresh check-in for that day.
 *
 * Note: as a child of the shell's SafeAreaView, `top-[42px]` is measured from
 * below the top safe-area inset, so on notched devices it sits at inset + 42px
 * rather than the DOM's raw viewport 42px. That is intentional — it keeps the
 * dev pills clear of the notch/Dynamic Island instead of tucking under it.
 */
export function DaySwitcher({ content }: DaySwitcherProps) {
  const currentDay = useDaybook((s) => s.day);
  const switchDay = useDaybook((s) => s.switchDay);

  return (
    <View
      accessibilityLabel="Prototype day switcher (dev control)"
      className="absolute top-[42px] right-2.5 z-[100] flex-row gap-1"
    >
      {listDays(content).map((n) => {
        const active = n === currentDay;
        return (
          <Pressable
            key={n}
            accessibilityRole="button"
            accessibilityLabel={`Day ${n}`}
            onPress={() => switchDay(n)}
            className={`rounded-[10px] border py-[2px] px-[7px] ${
              active ? 'bg-[#888] border-[#888]' : 'bg-[#eee] border-[#ccc]'
            }`}
          >
            <Text className={`font-sans-semibold text-[10px] ${active ? 'text-white' : 'text-[#888]'}`}>
              {n}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
