import { Text } from 'react-native';
import type { ReactNode } from 'react';

export interface CopyClasses { em?: string; b?: string }

const TOKEN = /<(\/?)(em|b)>/g;

/**
 * Renders the constrained copy markup (<em>/<b> only — enforced by
 * @postpal/content CopyString) as nested React Native <Text> elements. No
 * DOM, no innerHTML anywhere — this runs on native and web (RNW). Nested
 * <Text> in React Native inherits font-size/line-height/color from its
 * parent <Text>, so an <em> inside e.g. the hero renders at the hero's scale
 * while only overriding fontFamily (the italic *family* — see the RN gotcha
 * below) and color.
 *
 * RN gotcha carried by the caller's class map: fontStyle:'italic' does not
 * synthesize against a custom font family, so `em` should map to the
 * *italic font family* (e.g. 'font-serif-italic'), not the `italic` utility.
 *
 * Unknown tags never reach here in valid content; if they do, they render as
 * literal text, which is the safe failure. A stray closing tag with no
 * matching opener is dropped silently ('</em> huh' renders as ' huh').
 */
export function renderCopy(copy: string, classes: CopyClasses = {}): ReactNode[] {
  const out: ReactNode[] = [];
  const stack: { tag: 'em' | 'b'; children: ReactNode[] }[] = [];
  let last = 0;
  let key = 0;
  const push = (node: ReactNode) => (stack.length ? stack[stack.length - 1].children : out).push(node);

  for (const m of copy.matchAll(TOKEN)) {
    const index = m.index ?? 0; // matchAll always sets index; ?? satisfies strict TS
    const text = copy.slice(last, index);
    if (text) push(text);
    last = index + m[0].length;
    const close = m[1];
    const tag = m[2] as 'em' | 'b'; // the regex only matches em|b
    if (!close) {
      stack.push({ tag, children: [] });
    } else {
      const frame = stack.pop();
      if (!frame) continue;
      push(
        <Text key={key++} className={classes[frame.tag]}>
          {frame.children}
        </Text>,
      );
    }
  }
  const tail = copy.slice(last);
  if (tail) push(tail);
  // Unclosed tags: CopyString allows unbalanced em/b (it only rejects other
  // tags), so this fallback drops styling but must preserve text order —
  // flush frames bottom-of-stack first (source order). Do NOT pop the stack
  // here (that flushes innermost-first and reorders text).
  for (const frame of stack) out.push(...frame.children);
  return out;
}
