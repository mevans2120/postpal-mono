import type { DayContent } from '@postpal/content';
import { Pressable, Text, View } from 'react-native';
import { deriveDayView } from '../derive';
import { useDaybook } from '../store';

export interface NextBarProps {
  day: DayContent;
}

/**
 * The Next-slot footer (prototype renderNextbar, lines 583–598). The left
 * slot is whatever is genuinely next in the recovery — a dose (clay) or a
 * milestone/cycle (pine) — derived from content ⊕ the day's logged-dose count.
 * The right slot is the constant, quiet symptom door. Renders in EVERY phase;
 * the phase never changes it, only the day (and doses logged today) does.
 *
 * RN has no `position: fixed`; the spike proved a flex-column footer instead
 * — this View sits after the ScrollView in the shell, so no absolute
 * positioning or safe-area math here (the shell's SafeAreaView handles the
 * bottom inset).
 */
export function NextBar({ day }: NextBarProps) {
  const logged = useDaybook((s) => s.logged[s.day] ?? 0);
  const openSheet = useDaybook((s) => s.openSheet);
  const next = deriveDayView(day, logged).next;
  const tone = next.tone === 'clay' ? 'bg-clay-fill' : 'bg-pine';

  return (
    <View className="border-t border-line bg-paper px-6 pt-3 pb-3">
      <View className="flex-row gap-2.5">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Next: ${next.label} — ${next.sub}`}
          onPress={() => openSheet(next.sheet)}
          className={`flex-[1.5] flex-row items-center gap-2.5 rounded-full py-[11px] px-4 ${tone}`}
        >
          <Text className="font-sans-bold text-[9px] tracking-[1.44px] text-white opacity-90">NEXT</Text>
          <View>
            <Text className="font-sans-bold text-[13px] leading-[16px] text-white">{next.label}</Text>
            <Text className="font-sans-semibold text-[10.5px] text-white opacity-95">{next.sub}</Text>
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Feeling something? Check a symptom"
          onPress={() => openSheet('feel')}
          className="flex-1 items-center justify-center rounded-full border-[1.5px] border-line bg-card px-2"
        >
          <Text className="font-sans-bold text-[12px] text-mut">Feeling something?</Text>
        </Pressable>
      </View>
    </View>
  );
}
