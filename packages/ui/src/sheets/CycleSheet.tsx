import type { Cycle } from '@postpal/content';
import { Pressable, Text, View } from 'react-native';
import { useDaybook } from '../store';

export interface CycleSheetProps {
  cycle: Cycle;
}

/**
 * The cycle check-in sheet (prototype cycleHTML, lines 714–721). The pills are
 * the day's options; the chosen one comes from the store's cycleAnswer, and
 * choosing reveals the footnote as the confirmation line. (Per the Task 8 review
 * decision, cycleAnswer resets on day switch — deliberately unlike the prototype.)
 */
export function CycleSheet({ cycle }: CycleSheetProps) {
  const selected = useDaybook((s) => s.cycleAnswer);
  const answerCycle = useDaybook((s) => s.answerCycle);

  return (
    <View>
      <Text className="font-serif text-[20px] text-ink">{cycle.title}</Text>
      <View className="flex-row gap-2 mt-3.5">
        {cycle.options.map((opt) => {
          const sel = selected === opt;
          return (
            <Pressable
              key={opt}
              accessibilityRole="button"
              accessibilityLabel={opt}
              accessibilityState={{ selected: sel }}
              onPress={() => answerCycle(opt)}
              className={`flex-1 min-h-11 items-center justify-center border rounded-full py-[11px] ${
                sel ? 'bg-pine-soft border-pine-soft' : 'border-line'
              }`}
            >
              <Text className={`text-[11.5px] font-sans-bold ${sel ? 'text-pine' : 'text-mut'}`}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
      {selected ? (
        <Text className="font-serif-italic text-[13.5px] text-pine mt-3.5">{cycle.footnote}</Text>
      ) : null}
    </View>
  );
}
