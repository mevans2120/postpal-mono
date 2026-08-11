import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDay, avcUfe } from '@postpal/content';

import { renderCopy } from '@/components/renderCopy';
import { FaceGlyph, FACE_COUNT } from '@/components/FaceGlyph';

// Day-5 morning check-in, reusing @postpal/content unchanged.
const day = getDay(avcUfe, 5);

// RN gotchas baked into these classes:
//  - lineHeight in RN is absolute px (unitless 1.36 does NOT work) -> leading-[33px]
//  - letter-spacing in RN is px, not em (.14em @ 11px = 1.54px) -> tracking-[1.54px]
//  - italic is a separate loaded family -> em maps to font-serif-italic, not `italic`
export default function CheckInScreen() {
  return (
    <View className="flex-1 items-center bg-paper">
      <View className="w-full max-w-[430px] flex-1 bg-paper">
        <SafeAreaView edges={['top', 'bottom']} className="flex-1">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="px-6 pb-6 pt-[22px]">
              {/* status row */}
              <View className="flex-row justify-between">
                <Text className="font-sans-semibold text-[11px] text-mut">9:41</Text>
                <Text className="font-sans-semibold text-[11px] text-mut">Maya · UFE Feb 12</Text>
              </View>

              {/* eyebrow + hero */}
              <View className="mt-11">
                <Text className="font-sans-bold text-[11px] tracking-[1.54px] text-pine">
                  {day.eyebrow}
                </Text>
                <Text className="mt-3 font-serif text-[24.5px] leading-[33px] text-ink">
                  {renderCopy(day.heroFull, {
                    em: 'font-serif-italic text-clay',
                    b: 'font-sans-semibold',
                  })}
                </Text>
              </View>

              {/* faces */}
              <View className="mt-9">
                <Text className="font-sans-bold text-[11px] tracking-[1.76px] text-mut">
                  HOW DOES TODAY FEEL?
                </Text>
                <View className="mt-3.5 flex-row gap-2.5">
                  {Array.from({ length: FACE_COUNT }).map((_, i) => (
                    <View
                      key={i}
                      className="aspect-[1/1.18] flex-1 items-center justify-center rounded-[18px] border border-line bg-card shadow-[0_2px_8px_rgba(43,33,24,0.05)]"
                    >
                      <FaceGlyph index={i} size="80%" />
                    </View>
                  ))}
                </View>
                <View className="mt-2.5 flex-row justify-between">
                  <Text className="font-serif-italic text-[11.5px] text-mut">a good day</Text>
                  <Text className="font-serif-italic text-[11.5px] text-mut">a hard day</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Next bar — RN has no position:fixed; this is a flex-column footer
              View pinned below the ScrollView. */}
          <View className="border-t border-line bg-paper px-6 pb-3 pt-3">
            <View className="flex-row gap-[9px]">
              <Pressable className="flex-[1.5] flex-row items-center gap-2.5 rounded-full bg-clay-fill px-4 py-[11px]">
                <Text className="font-sans-bold text-[9px] tracking-[1.44px] text-white opacity-90">
                  NEXT
                </Text>
                <View>
                  <Text className="font-sans-bold text-[13px] leading-[16px] text-white">
                    {day.next.label}
                  </Text>
                  <Text className="font-sans-semibold text-[10.5px] text-white opacity-95">
                    {day.next.sub}
                  </Text>
                </View>
              </Pressable>
              <Pressable className="flex-1 items-center justify-center rounded-full border-[1.5px] border-line bg-card px-2">
                <Text className="font-sans-bold text-[12px] text-mut">Feeling something?</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}
