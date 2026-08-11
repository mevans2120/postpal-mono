import { View, Text } from 'react-native';

export interface StatusRowProps {
  statusLabel: string;
}

/**
 * The stable status line (prototype STATUS_HTML): a hardcoded clock and the
 * patient/procedure identity. Extracted from the spike (apps/app/src/app/
 * index.tsx) so the Daybook shell (Task 6) can render it ONCE, above the
 * swapped phase view — CheckIn/NotedView/TodayPage do not render it
 * themselves. "9:41" is the prototype's hardcoded clock — kept literal.
 */
export function StatusRow({ statusLabel }: StatusRowProps) {
  return (
    <View className="flex-row justify-between">
      <Text className="font-sans-semibold text-[11px] text-mut">9:41</Text>
      <Text className="font-sans-semibold text-[11px] text-mut">{statusLabel}</Text>
    </View>
  );
}
