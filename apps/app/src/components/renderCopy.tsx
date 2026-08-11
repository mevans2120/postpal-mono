import React from 'react';
import { Text } from 'react-native';
import type { ReactNode } from 'react';

/**
 * RN port of @postpal/ui's renderCopy. Parses the constrained copy markup
 * (`<em>` / `<b>` only — enforced by @postpal/content's CopyString) into
 * nested <Text> elements. NO DOM / innerHTML — this runs on native and web.
 *
 * Nested <Text> in React Native inherits font-size / line-height / color from
 * its parent <Text>, so an <em> inside the hero renders at the hero's scale
 * while overriding fontFamily (italic) and color (clay).
 *
 * RN gotcha carried by the caller's class map: because fontStyle:'italic' does
 * not synthesize against a custom family, `em` should map to the *italic font
 * family* (e.g. 'font-serif-italic'), not to the `italic` utility.
 */
type CopyClasses = { em?: string; b?: string };

const TOKEN = /<(\/?)(em|b)>/g;

export function renderCopy(copy: string, classes: CopyClasses = {}): ReactNode[] {
  const out: ReactNode[] = [];
  const stack: { tag: 'em' | 'b'; children: ReactNode[] }[] = [];
  let last = 0;
  let key = 0;
  const push = (node: ReactNode) =>
    (stack.length ? stack[stack.length - 1].children : out).push(node);

  for (const m of copy.matchAll(TOKEN)) {
    const text = copy.slice(last, m.index);
    if (text) push(text);
    last = m.index + m[0].length;
    const close = m[1];
    const tag = m[2] as 'em' | 'b';
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
  // Unclosed tags: flush children as plain text (malformed content already
  // failed the content schema's parse, so this is a safe fallback).
  while (stack.length) out.push(...stack.pop()!.children);
  return out;
}
