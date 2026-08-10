import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';

export interface ReceiptProps {
  icon: ReactNode;
  children: ReactNode;
  onActivate: () => void;
  label: string;
  settle?: boolean;
  delay?: string;
}

/**
 * A tappable receipt row (.receipt, prototype line 39). Ports tap() (lines
 * 539–544): a div acting as a button — Enter/Space activate, Space
 * preventDefault'd to suppress page scroll. When `settle`, the `.settle`
 * keyframe (daybook.css) runs, staggered by the `--d` custom property.
 */
export function Receipt({ icon, children, onActivate, label, settle = false, delay }: ReceiptProps) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate();
    }
  };
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={onActivate}
      onKeyDown={onKeyDown}
      className={`flex items-center gap-[13px] py-4 px-[2px] border-b border-line${settle ? ' settle' : ''}`}
      style={settle && delay ? ({ '--d': delay } as CSSProperties) : undefined}
    >
      <span className="flex-none flex">{icon}</span>
      <span className="font-serif text-[24.5px] font-medium leading-[1.3]">{children}</span>
    </div>
  );
}
