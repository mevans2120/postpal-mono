import type { DayContent } from '@postpal/content';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { HeroBlock } from './HeroBlock';
import { Receipt } from '../primitives/Receipt';
import { FaceGlyph } from '../primitives/FaceGlyph';
import { faceAckKey, faceReceiptText } from '../primitives/faces';
import { useSettle, settleEntering } from '../primitives/useSettle';
import { useDaybook } from '../store';

export interface NotedViewProps {
  day: DayContent;
}

/**
 * The noted phase (prototype render lines 920–983): the truncated hero, the
 * face receipt (tap to change how today feels), the ack line, and the one
 * follow-up ask — the day's chips, or the inline note input when it's open.
 * Assumes state.face is set (this phase is only reached after selectFace).
 */
export function NotedView({ day }: NotedViewProps) {
  const dayNum = useDaybook((s) => s.day);
  const phase = useDaybook((s) => s.phase);
  const face = useDaybook((s) => s.face);
  const noteInputOpen = useDaybook((s) => s.noteInputOpen);
  const noteDraft = useDaybook((s) => s.noteDraft);
  const reopenCheckin = useDaybook((s) => s.reopenCheckin);
  const chooseChip = useDaybook((s) => s.chooseChip);
  const submitNote = useDaybook((s) => s.submitNote);
  const cancelNote = useDaybook((s) => s.cancelNote);
  const setNoteDraft = useDaybook((s) => s.setNoteDraft);
  const settle = useSettle(dayNum, phase);
  const reduceMotion = useReducedMotion();

  if (face === null) return null;

  return (
    <>
      <HeroBlock day={day} className="mt-[34px]" />

      <Receipt
        icon={<FaceGlyph index={face} selected size={30} />}
        onActivate={reopenCheckin}
        label="Change how today feels"
        settle={settle}
      >
        Today feels: <Text className="font-serif-italic text-pine">{faceReceiptText(face)}</Text>
      </Receipt>

      <Animated.View entering={settleEntering(settle, reduceMotion, 100)}>
        <Text className="font-serif-italic text-[13.5px] text-pine mt-2.5">{day.ack[faceAckKey(face)]}</Text>
      </Animated.View>

      <Animated.View entering={settleEntering(settle, reduceMotion, 200)}>
        <View className="mt-[22px]">
          <Text className="font-sans-bold text-[11px] tracking-[1.76px] text-pine">ANYTHING TO NOTE TODAY?</Text>
          {noteInputOpen ? (
            <View className="flex-row items-center gap-2 mt-2.5">
              <TextInput
                autoFocus
                accessibilityLabel="Your note"
                placeholder="A few words is plenty"
                placeholderTextColor="#a89a88"
                value={noteDraft}
                onChangeText={setNoteDraft}
                onSubmitEditing={() => submitNote(noteDraft)}
                returnKeyType="done"
                className="flex-1 font-sans text-[13px] text-ink bg-card border border-line rounded-full py-[9px] px-3.5"
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="note it"
                onPress={() => submitNote(noteDraft)}
                hitSlop={8}
              >
                <Text className="font-sans-semibold text-[12.5px] text-clay-deep">note it</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to the choices"
                onPress={cancelNote}
                hitSlop={8}
              >
                <Text className="font-sans text-[12.5px] text-mut">back</Text>
              </Pressable>
            </View>
          ) : (
            <View className="flex-row flex-wrap gap-[9px] mt-2.5">
              {day.chips.map((chip) => (
                <Pressable
                  key={chip}
                  accessibilityRole="button"
                  accessibilityLabel={chip}
                  onPress={() => chooseChip(chip)}
                  className="bg-card border border-line rounded-full py-[9px] px-3.5"
                >
                  <Text className="font-sans-semibold text-[12.5px] text-ink">{chip}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </Animated.View>
    </>
  );
}
