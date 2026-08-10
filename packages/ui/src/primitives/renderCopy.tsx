import type { ReactNode } from 'react';

export interface CopyClasses { em?: string; b?: string }

const TOKEN = /<(\/?)(em|b)>/g;

/**
 * Renders the constrained copy markup (<em>/<b> only — enforced by
 * @postpal/content CopyString) as React elements. No innerHTML anywhere.
 * Unknown tags never reach here in valid content; if they do, they render
 * as literal text, which is the safe failure.
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
      const Tag = frame.tag;
      push(<Tag key={key++} className={classes[frame.tag]}>{frame.children}</Tag>);
    }
  }
  const tail = copy.slice(last);
  if (tail) push(tail);
  // unclosed tags: flush children as plain text (malformed content already failed parse)
  while (stack.length) out.push(...stack.pop()!.children);
  return out;
}
