import type { CanCant } from '@postpal/content';
import { Text, View } from 'react-native';

export interface CanCantSheetProps {
  cancant: CanCant;
}

/**
 * The can / can't-yet sheet (prototype cancantHTML, lines 702–712): what's back
 * as one line, then the not-yet rows with their cleared-date countdowns, and the
 * footnote sourcing those dates to the clinic's discharge instructions. A pure
 * prop — no store — same as the DOM version.
 */
export function CanCantSheet({ cancant }: CanCantSheetProps) {
  return (
    <View>
      <Text className="font-serif text-[20px] text-ink">{cancant.title}</Text>
      <Text className="text-[10px] tracking-[1.6px] font-sans-bold text-mut mt-4 mb-[2px]">BACK</Text>
      <Text className="font-serif-semibold text-[14.5px] text-pine pt-2 pb-2.5 border-b border-line">
        {cancant.back}
      </Text>
      <Text className="text-[10px] tracking-[1.6px] font-sans-bold text-mut mt-4 mb-[2px]">NOT YET</Text>
      {cancant.notYet.map(([name, countdown], i) => (
        <View key={i} className="flex-row items-center gap-3 py-2.5 border-b border-line">
          <Text className="font-serif text-[15.5px] text-ink">{name}</Text>
          <Text className="ml-auto text-[11px] font-sans-bold text-clay-deep">{countdown}</Text>
        </View>
      ))}
      <Text className="font-sans text-[11.5px] text-mut mt-3.5">{cancant.footnote}</Text>
    </View>
  );
}
