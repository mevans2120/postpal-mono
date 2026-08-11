import type { DayContent } from '@postpal/content';
import { SOMETHING_ELSE } from '@postpal/content';
import { Pressable, Text, View } from 'react-native';
import { useDaybook } from '../store';

export interface FeelSheetProps {
  day: DayContent;
}

/**
 * The "What are you feeling?" sheet (prototype feelHTML + its wiring, lines
 * 760–770, 822–836). The day's interpreter keys become chips that swap this
 * sheet's content to the interpreter (origin 'feel', so resolving just closes).
 * "Something else…" hands off to chooseChip — which opens the inline note input
 * only in the noted phase (store phase-guard) — then closes the sheet.
 */
export function FeelSheet({ day }: FeelSheetProps) {
  const openSheet = useDaybook((s) => s.openSheet);
  const chooseChip = useDaybook((s) => s.chooseChip);
  const closeSheet = useDaybook((s) => s.closeSheet);

  return (
    <View>
      <Text className="font-serif text-[20px] text-ink">What are you feeling?</Text>
      <View className="flex-row flex-wrap gap-[9px] mt-3.5">
        {Object.keys(day.interpreters).map((key) => (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityLabel={key}
            onPress={() => openSheet('interpreter', { key, origin: 'feel' })}
            hitSlop={8}
            className="bg-card border border-line rounded-full py-[9px] px-3.5"
          >
            <Text className="font-sans-semibold text-[12.5px] text-ink">{key}</Text>
          </Pressable>
        ))}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={SOMETHING_ELSE}
          onPress={() => {
            chooseChip(SOMETHING_ELSE);
            closeSheet();
          }}
          hitSlop={8}
          className="bg-card border border-line rounded-full py-[9px] px-3.5"
        >
          <Text className="font-sans-semibold text-[12.5px] text-ink">{SOMETHING_ELSE}</Text>
        </Pressable>
      </View>
    </View>
  );
}
