import type { ReactNode } from 'react';
import { Text } from 'react-native';
import type { TextProps } from 'react-native';

/**
 * The RN text-scale for PostPal's recurring copy roles, so screen authors
 * never have to re-derive these three DOM -> RN conversions themselves:
 *
 *  1. line-height is unitless in CSS (e.g. 1.36) but MUST be an absolute px
 *     value in RN (`leading-[33px]`, not `leading-[1.36]`) — unitless
 *     line-height silently no-ops in React Native.
 *  2. letter-spacing is `em` in CSS but PX in RN — convert at the paired
 *     font-size (`.14em` @ 11px = `tracking-[1.54px]`), never carry the
 *     `em` value over as-is.
 *  3. italic/bold do not reliably synthesize against a custom font family in
 *     RN — each weight/italic is its OWN loaded family (`font-serif-italic`,
 *     `font-sans-bold`), never the `italic`/`font-bold` utilities.
 *
 * Values are lifted from the spike (apps/app/src/app/index.tsx) and the DOM
 * reference (packages/ui/src/daybook/*.tsx, the now-deleted styles/daybook.css).
 */
export const typography = {
  /** Small-caps-style section label, e.g. day.eyebrow. */
  eyebrow: 'font-sans-bold text-[11px] tracking-[1.54px] text-pine',
  /** The hero sentence (pass through renderCopy; pair with heroEm for <em>). */
  hero: 'font-serif text-[24.5px] leading-[33px] text-ink',
  /** An <em> run inside the hero — pass as renderCopy's `em` class. */
  heroEm: 'font-serif-italic text-clay',
  /** "HOW DOES TODAY FEEL?" style face-picker label. */
  facelab: 'font-sans-bold text-[11px] tracking-[1.76px] text-mut',
  /** Reading-chapter body copy (day.feel[].body via renderCopy). */
  body: 'font-serif text-[15px] leading-[24px]',
  /** "How today might feel" / "What you can do" / etc. chapter headings. */
  chapterHeading: 'font-serif-italic text-[18.5px] text-ink',
  /** The left-column fact label, e.g. BACK / NOT YET / an ahead item's k. */
  factK: 'font-sans-bold text-[10.5px] tracking-[1.26px] text-mut',
  /** The right-column fact value, e.g. an ahead item's v. */
  factV: 'font-serif text-[14px] text-ink',
  /** Receipt row text (face/note receipts). */
  receipt: 'font-serif text-[24.5px] leading-[32px]',
} as const satisfies Record<string, string>;

export type TypographyRole = keyof typeof typography;

// This package has no existing cn()/tailwind-merge utility; a full merge
// isn't needed here since callers only ever append layout classes (margin,
// color overrides) after the role's own classes — a plain join is enough.
const cn = (...classes: Array<string | undefined | false>): string => classes.filter(Boolean).join(' ');

export interface TxtProps extends TextProps {
  /** Named `variant`, not `role` — RN's own TextProps.role is an
   * accessibility role (e.g. 'button'), a different concern than a
   * typography preset, and the names would otherwise collide. */
  variant: TypographyRole;
  children?: ReactNode;
}

/** A thin `<Text>` wrapper that applies a typography role's className. */
export function Txt({ variant, className, children, ...rest }: TxtProps) {
  return (
    <Text className={cn(typography[variant], className)} {...rest}>
      {children}
    </Text>
  );
}
