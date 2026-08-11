import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';
import { Txt } from './typography';
import { settleEntering } from './useSettle';

export interface ReceiptProps {
  icon: ReactNode;
  children: ReactNode;
  onActivate: () => void;
  label: string;
  settle?: boolean;
  delayMs?: number;
}

/**
 * A tappable receipt row (.receipt, prototype line 39). RN's Pressable
 * already gives press states and — on web, via RNW — focus + Enter/Space
 * activation, so unlike the DOM version there's no onKeyDown to port. When
 * `settle`, the row mounts with a Reanimated `entering` animation (staggered
 * by `delayMs`) in place of the DOM's `.settle` keyframe + `--d` custom
 * property; see useSettle.ts for why the animation only ever fires on mount.
 */
export function Receipt({ icon, children, onActivate, label, settle = false, delayMs }: ReceiptProps) {
  const reduceMotion = useReducedMotion();
  return (
    <Animated.View entering={settleEntering(settle, reduceMotion, delayMs)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onActivate}
        className="flex-row items-center gap-[13px] py-4 px-[2px] border-b border-line"
      >
        <View className="shrink-0">{icon}</View>
        <Txt variant="receipt">{children}</Txt>
      </Pressable>
    </Animated.View>
  );
}
