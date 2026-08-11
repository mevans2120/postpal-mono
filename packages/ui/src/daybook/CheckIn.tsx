import type { DayContent } from '@postpal/content';
import { Pressable, Text, View } from 'react-native';
import { renderCopy } from '../primitives/renderCopy';
import { FaceGlyph } from '../primitives/FaceGlyph';
import { FACE_LABELS, FACE_MOUTHS } from '../primitives/faces';
import { typography } from '../primitives/typography';
import { useDaybook } from '../store';

export interface CheckInProps {
  day: DayContent;
}

/**
 * The check-in phase (prototype render lines 893–919). Calm budget: eyebrow,
 * the FULL hero (no hairline, no toggle), and the one ask — five faces. Nothing
 * else competes. The status line is owned by the Daybook shell (rendered once,
 * above the phase view), so this view does not render it. Returning from a
 * face-receipt tap keeps the chosen face preselected (state.face survives).
 */
export function CheckIn({ day }: CheckInProps) {
  const face = useDaybook((s) => s.face);
  const selectFace = useDaybook((s) => s.selectFace);

  return (
    <>
      <View className="mt-[44px]">
        <Text className={`${typography.eyebrow} text-pine`}>{day.eyebrow}</Text>
        <Text className={`${typography.hero} mt-3`}>
          {renderCopy(day.heroFull, { em: 'font-serif-italic text-clay' })}
        </Text>
      </View>
      <View className="mt-9">
        <Text className={typography.facelab}>HOW DOES TODAY FEEL?</Text>
        <View className="flex-row gap-2.5 mt-3.5">
          {FACE_MOUTHS.map((_, i) => {
            const sel = face === i;
            return (
              <Pressable
                key={i}
                accessibilityRole="button"
                accessibilityLabel={FACE_LABELS[i]}
                accessibilityState={{ selected: sel }}
                onPress={() => selectFace(i)}
                className={`flex-1 aspect-[1/1.18] bg-card border rounded-[18px] items-center justify-center ${
                  sel
                    ? 'border-clay shadow-[0_2px_8px_rgba(138,70,48,.12)]'
                    : 'border-line shadow-[0_2px_8px_rgba(43,33,24,.05)]'
                }`}
              >
                <FaceGlyph index={i} selected={sel} size="80%" />
              </Pressable>
            );
          })}
        </View>
        <View className="flex-row justify-between mt-2.5">
          <Text className="font-serif-italic text-[11.5px] text-mut">a good day</Text>
          <Text className="font-serif-italic text-[11.5px] text-mut">a hard day</Text>
        </View>
      </View>
    </>
  );
}
