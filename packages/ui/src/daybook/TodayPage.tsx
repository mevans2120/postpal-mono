import type { DayContent } from '@postpal/content';
import { Pressable, Text, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { HeroBlock } from './HeroBlock';
import { Receipt } from '../primitives/Receipt';
import { FaceGlyph } from '../primitives/FaceGlyph';
import { faceReceiptText } from '../primitives/faces';
import { renderCopy } from '../primitives/renderCopy';
import { typography } from '../primitives/typography';
import { useSettle, settleEntering } from '../primitives/useSettle';
import { deriveDayView } from '../derive';
import { useDaybook } from '../store';

export interface TodayPageProps {
  day: DayContent;
}

/**
 * The page phase (prototype render lines 984–1060): hero + two receipts above
 * the fold, then the four question-led chapters. Chapters 2 and 3 shrink as the
 * recovery does — BACK/NOT YET lines drop when null, and the medicines chapter
 * disappears entirely once meds is null (day 20). Assumes state.face is set.
 */
export function TodayPage({ day }: TodayPageProps) {
  const dayNum = useDaybook((s) => s.day);
  const phase = useDaybook((s) => s.phase);
  const face = useDaybook((s) => s.face);
  const note = useDaybook((s) => s.note);
  const logged = useDaybook((s) => s.logged[s.day] ?? 0);
  const reopenCheckin = useDaybook((s) => s.reopenCheckin);
  const reopenNoted = useDaybook((s) => s.reopenNoted);
  const openSheet = useDaybook((s) => s.openSheet);
  const settle = useSettle(dayNum, phase);
  const reduceMotion = useReducedMotion();

  if (face === null) return null;

  const medsLine = deriveDayView(day, logged).medsLine;

  return (
    <>
      <HeroBlock day={day} className="mt-[30px]" />

      {/* face receipt — reflects the selected face, tap to change how today feels */}
      <Receipt
        icon={<FaceGlyph index={face} selected size={30} />}
        onActivate={reopenCheckin}
        label="Change how today feels"
        settle={settle}
      >
        Today feels: <Text className="font-serif-italic text-pine">{faceReceiptText(face)}</Text>
      </Receipt>

      {/* note receipt — the pine ✓ dot; the note renders as a plain string
          child, never through renderCopy — the XSS-safe port of the
          prototype's esc(). */}
      <Receipt
        icon={
          <View className="w-[30px] h-[30px] rounded-full bg-pine-soft items-center justify-center">
            <Text className="text-pine text-[15px] font-sans-bold">✓</Text>
          </View>
        }
        onActivate={reopenNoted}
        label="Change what you noted"
        settle={settle}
        delayMs={60}
      >
        Noted: <Text className="font-serif-italic text-pine">{note}</Text>
      </Receipt>

      {/* chapter 1: the reading */}
      <Animated.View entering={settleEntering(settle, reduceMotion, 120)}>
        <View className="mt-6 border-t border-line pt-3.5">
          <Text className={typography.chapterHeading}>How today might feel</Text>
          {day.feel.map((entry, i) => (
            <View key={i} className="mt-4">
              <Text className={typography.body}>{renderCopy(entry.body, { b: 'font-serif-semibold' })}</Text>
              {entry.note ? (
                <Text className="font-serif-italic text-[12.5px] text-clay-deep mt-[9px] pl-[11px] border-l-2 border-clay">
                  {entry.note}
                </Text>
              ) : null}
            </View>
          ))}
          {/* "Keep reading" is a prototype edge — pressed state only, no
              behavior (.noop). Ported as static, non-pressable text — see
              the task report for why the affordance is dropped. */}
          <Text className="font-sans-bold text-[12px] text-mut mt-3">
            Keep reading: <Text className="text-clay-deep">{day.turn} →</Text>
          </Text>
        </View>
      </Animated.View>

      {/* chapter 2: can / can't yet */}
      <Animated.View entering={settleEntering(settle, reduceMotion, 180)}>
        <View className="mt-6 border-t border-line pt-3.5">
          <Text className={typography.chapterHeading}>What you can do — and not yet</Text>
          {day.back ? (
            <View className="flex-row items-baseline gap-2 mt-2.5">
              <Text className={`${typography.factK} w-[74px] shrink-0`}>BACK</Text>
              <Text className="font-serif-semibold text-[14px] text-pine">{day.back}</Text>
            </View>
          ) : null}
          {day.notYet ? (
            <View className="flex-row items-baseline gap-2 mt-2.5">
              <Text className={`${typography.factK} w-[74px] shrink-0`}>NOT YET</Text>
              <Text className={typography.factV}>
                {renderCopy(day.notYet, { b: 'font-sans-bold text-[11.5px] text-clay-deep' })}
              </Text>
            </View>
          ) : null}
        </View>
      </Animated.View>

      {/* chapter 3: meds (absent on day 20) */}
      {day.meds ? (
        <Animated.View entering={settleEntering(settle, reduceMotion, 240)}>
          <View className="mt-6 border-t border-line pt-3.5">
            <Text className={typography.chapterHeading}>Your medicines today</Text>
            <View className="flex-row items-baseline gap-2 mt-2.5">
              <Text className={`${typography.factK} w-[74px] shrink-0`}>{day.meds.k}</Text>
              <Text className={typography.factV}>{medsLine}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open today's medicine rail"
                onPress={() => openSheet(day.meds!.sheet)}
                hitSlop={8}
                className="ml-auto"
              >
                <Text className="font-sans-bold text-[12px] text-clay-deep">open →</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      ) : null}

      {/* chapter 4: ahead */}
      <Animated.View entering={settleEntering(settle, reduceMotion, 300)}>
        <View className="mt-6 border-t border-line pt-3.5">
          <Text className={typography.chapterHeading}>What's ahead</Text>
          {day.ahead.map((item, i) => (
            <View key={i} className="flex-row items-baseline gap-2 mt-2.5">
              <Text className={`${typography.factK} w-[74px] shrink-0`}>{item.k}</Text>
              <Text className={typography.factV}>{item.v}</Text>
              {item.details ? (
                <Text className="ml-auto font-sans-bold text-[12px] text-clay-deep">details →</Text>
              ) : null}
            </View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={settleEntering(settle, reduceMotion, 300)}>
        <Text className="text-center text-mut text-[15px] tracking-[3px] mt-[14px] mb-1.5">⌄</Text>
      </Animated.View>
    </>
  );
}
