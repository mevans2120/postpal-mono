'use client';

// Daybook is a client component (hooks, context, effects). Declaring the
// boundary here — on the package's public entry — lets any consumer render it
// from a Server Component without adding their own wrapper (PoC criterion 2:
// a second surface consumes @postpal/ui unchanged).
import { useRef } from 'react';
import type { ProcedureContent } from '@postpal/content';
import { getDay } from '@postpal/content';
import { createDaybookStore, DaybookStoreContext, useDaybook } from '../store';
import type { DaybookStore } from '../store';
import { CheckIn } from './CheckIn';
import { NotedView } from './NotedView';
import { TodayPage } from './TodayPage';
import { NextBar } from './NextBar';
import { DaySwitcher } from './DaySwitcher';
import { SheetHost } from '../sheets/SheetHost';

export interface DaybookProps {
  content: ProcedureContent;
  /** Which day's check-in to open on (defaults to day 5, the prototype's start). */
  initialDay?: number;
  /** The status-line identity, e.g. "Maya · UFE Feb 12". */
  statusLabel: string;
}

/**
 * The Daybook shell. Owns the store (created ONCE per mount), provides it via
 * context, and renders the 430px column: the stable status line, exactly one
 * phase view (check-in / noted / page), and the two always-present fixtures —
 * the Next-slot bar and the dev day switcher. The sheet host mounts here too
 * (Task 14 — currently a no-op placeholder).
 *
 * The status line lives here, ABOVE the swapped phase view, so it is stable
 * across phase changes. The prototype re-emits STATUS_HTML at the top of every
 * phase (lines 897/931/1020); rendering it once in the shell is the faithful
 * simplification. CheckIn/NotedView/TodayPage therefore must NOT render it.
 *
 * Phase dispatch mounts exactly ONE view — this one-view-per-phase model is
 * required for useSettle (its keyed first-render detection depends on the view
 * remounting on phase change), so we never keep all three mounted and toggle.
 */
export function Daybook({ content, initialDay = 5, statusLabel }: DaybookProps) {
  const storeRef = useRef<DaybookStore>(undefined);
  if (!storeRef.current) storeRef.current = createDaybookStore(initialDay);

  return (
    <DaybookStoreContext.Provider value={storeRef.current}>
      <div className="max-w-[430px] mx-auto min-h-dvh bg-paper font-sans text-ink">
        <DaySwitcher content={content} />
        <DaybookBody content={content} statusLabel={statusLabel} />
      </div>
    </DaybookStoreContext.Provider>
  );
}

interface DaybookBodyProps {
  content: ProcedureContent;
  statusLabel: string;
}

function DaybookBody({ content, statusLabel }: DaybookBodyProps) {
  const dayNum = useDaybook((s) => s.day);
  const phase = useDaybook((s) => s.phase);
  const day = getDay(content, dayNum);

  return (
    <>
      <main className="pt-[22px] px-6 pb-[120px]">
        <div className="flex justify-between text-[11px] font-semibold text-mut">
          <span>9:41</span>
          <span>{statusLabel}</span>
        </div>
        {phase === 'checkin' ? (
          <CheckIn day={day} />
        ) : phase === 'noted' ? (
          <NotedView day={day} />
        ) : (
          <TodayPage day={day} />
        )}
      </main>
      <NextBar day={day} />
      <SheetHost content={content} />
    </>
  );
}
