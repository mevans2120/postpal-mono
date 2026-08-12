import type { Interpreter, Meta } from '@postpal/content';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { renderCopy } from '../primitives/renderCopy';
import { useDaybook } from '../store';
import { colors } from '../../tokens';

// react-native-svg props take literal color values, not Tailwind classNames
// (see FaceGlyph.tsx for the same pattern), so the alert-icon stroke reads the
// alert color from tokens.js.
const ALERT = colors.alert;

/**
 * The alert icon (prototype daybook.html line 730) — a small ring-and-bang SVG
 * inlined so the interpreter's threshold and 911 lines carry the same clinical
 * mark.
 */
function AlertIcon() {
  return (
    <View className="mt-[2px]">
      <Svg width={14} height={14} viewBox="0 0 14 14" accessible={false}>
        <Circle cx={7} cy={7} r={6} fill="none" stroke={ALERT} strokeWidth={1.5} />
        <Path d="M7 4v3.5M7 9.8v.4" stroke={ALERT} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

export interface InterpreterSheetProps {
  interp: Interpreter;
  escalated: boolean;
  meta: Meta;
}

/**
 * The symptom interpreter (prototype interpreterHTML, lines 729–758). The answer
 * view leads with what the symptom means and the one line the clinic watches;
 * "Not quite" escalates in place to the watch-for gate, self-care, and the 911
 * line — never a phone call (deviation #3, deliberate). From a check-in chip,
 * resolving records the note and lands on the page; from "Feeling something?"
 * it just closes (the store's resolveInterpreter reads the payload origin).
 *
 * Neither `interp.head` nor `interp.body` contains `<b>` anywhere in the
 * current content (checked against packages/content/src/avc-ufe/days/*.ts), so
 * their renderCopy calls intentionally carry no `b` class — nothing to style.
 */
export function InterpreterSheet({ interp, escalated, meta }: InterpreterSheetProps) {
  const resolveInterpreter = useDaybook((s) => s.resolveInterpreter);
  const escalateInterpreter = useDaybook((s) => s.escalateInterpreter);

  if (escalated) {
    const care = interp.care ?? meta.selfCareDefault;
    return (
      <View>
        <Text className="font-serif text-[18.5px] leading-[24px] text-ink mb-1">
          Here's the line to watch — and what helps right now.
        </Text>
        <View className="flex-row gap-2.5 items-start bg-clay-soft border border-clay-soft-line rounded-xl py-3 px-3.5 mt-3.5">
          <AlertIcon />
          <View className="flex-1">
            <Text className="text-[10px] tracking-[1.2px] font-sans-bold text-mut mb-[3px]">
              THE ONE THING TO WATCH FOR
            </Text>
            <Text className="font-sans text-[13px] text-ink">
              {renderCopy(interp.threshold, { b: 'font-sans-bold text-alert' })}
            </Text>
          </View>
        </View>
        <Text className="font-sans text-[13px] leading-[20px] text-mut mt-3">
          {renderCopy(care, { b: 'font-sans-bold' })}
        </Text>
        <View className="flex-row gap-2 items-start mt-4 pt-3 border-t border-line">
          <AlertIcon />
          <Text className="flex-1 font-sans text-[11.5px] text-mut">
            {renderCopy(meta.emergencyLine, { b: 'font-sans-bold text-alert' })}
          </Text>
        </View>
        {/* No call/phone button here — deviation #3, deliberate. The 911 line
            above is the only escalation; the single control below just
            returns to today. */}
        <View className="flex-row gap-2.5 mt-4">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to today"
            onPress={resolveInterpreter}
            className="flex-1 items-center justify-center rounded-full py-[13px] px-2.5 border-[1.5px] border-line"
          >
            <Text className="font-sans-bold text-[13.5px] text-mut">Back to today</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text className="text-[10.5px] font-sans-bold tracking-[1.68px] text-pine">{interp.tag}</Text>
      <Text className="font-serif text-[21px] leading-[27px] text-ink mt-2 mb-2.5">{renderCopy(interp.head)}</Text>
      <Text className="font-sans text-[14px] leading-[22px] text-ink-soft">{renderCopy(interp.body)}</Text>
      <View className="flex-row gap-2.5 items-start bg-card border border-line rounded-xl py-3 px-3.5 mt-3.5">
        <AlertIcon />
        <View className="flex-1">
          <Text className="text-[10px] tracking-[1.2px] font-sans-bold text-mut mb-[3px]">
            THE ONE LINE YOUR CLINIC WATCHES
          </Text>
          <Text className="text-[13px] text-ink">
            {renderCopy(interp.threshold, { b: 'font-sans-bold text-alert' })}
          </Text>
        </View>
      </View>
      <View className="mt-[18px]">
        <Text className="text-[10.5px] tracking-[1.47px] font-sans-bold text-mut text-center mb-2.5">
          DID THIS ANSWER YOUR QUESTION?
        </Text>
        <View className="flex-row gap-2.5 mt-4">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Yes, that helps"
            onPress={resolveInterpreter}
            className="flex-1 items-center justify-center rounded-full py-[13px] px-2.5 bg-clay-fill"
          >
            <Text className="font-sans-bold text-[13.5px] text-white">Yes, that helps</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Not quite"
            onPress={escalateInterpreter}
            className="flex-1 items-center justify-center rounded-full py-[13px] px-2.5 border-[1.5px] border-line"
          >
            <Text className="font-sans-bold text-[13.5px] text-mut">Not quite</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
