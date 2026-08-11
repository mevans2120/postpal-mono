import type { DayContent } from '@postpal/content';
import { Pressable, Text, View } from 'react-native';
import { renderCopy } from '../primitives/renderCopy';
import { typography } from '../primitives/typography';
import { useDaybook } from '../store';

export interface HeroBlockProps {
  day: DayContent;
  /** Outer-wrapper margin, e.g. "mt-[34px]" (noted) or "mt-[30px]" (page). */
  className?: string;
}

/**
 * Eyebrow + truncated hero on a hairline rule (prototype heroBlockHTML, lines
 * 546–555). Tapping the hero toggles the full sentence back in place; the
 * hairline stays. Shared by NotedView and TodayPage — CheckIn shows the full
 * hero with no hairline and no toggle, so it does NOT use HeroBlock.
 *
 * RN's Pressable already gives press states and — on web, via RNW — focus +
 * Enter/Space activation, so unlike the DOM version there's no onKeyDown to
 * port.
 */
export function HeroBlock({ day, className }: HeroBlockProps) {
  const heroExpanded = useDaybook((s) => s.heroExpanded);
  const toggleHero = useDaybook((s) => s.toggleHero);
  const copy = heroExpanded ? day.heroFull : day.heroShort;

  return (
    <View className={className}>
      <Text className={`${typography.eyebrow} text-pine`}>{day.eyebrow}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Expand or collapse today's reading"
        onPress={toggleHero}
        className="mt-3 pb-4 border-b border-line"
      >
        <Text className={typography.hero}>{renderCopy(copy, { em: 'font-serif-italic text-clay' })}</Text>
      </Pressable>
    </View>
  );
}
