// Daybook composes the store, the status row, the swapped phase view, the
// Next bar, the dev day switcher, and the sheet host. Native has no server
// components / client boundary to declare here — RNW and the RN renderers
// both just run this tree.
import { useRef } from 'react';
import type { ProcedureContent } from '@postpal/content';
import { getDay } from '@postpal/content';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createDaybookStore, DaybookStoreContext, useDaybook } from '../store';
import type { DaybookStore } from '../store';
import { StatusRow } from './status';
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
 * the Next bar and the dev day switcher. The sheet host mounts here too (Task
 * 7 — currently a no-op placeholder).
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
      <View className="flex-1 items-center bg-paper">
        <View className="w-full max-w-[430px] flex-1">
          <SafeAreaView edges={['top', 'bottom']} className="flex-1">
            <DaySwitcher content={content} />
            <DaybookBody content={content} statusLabel={statusLabel} />
          </SafeAreaView>
        </View>
      </View>
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
  // Keys the phase view by day:phase. Reanimated `entering` animations only
  // fire on mount, so this makes a phase change OR a same-phase day switch
  // remount the view, re-firing the settle animations — the RN analog of the
  // DOM re-emitting the settle classes.
  const key = `${dayNum}:${phase}`;

  return (
    <>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-[22px] pb-6"
        showsVerticalScrollIndicator={false}
      >
        <StatusRow statusLabel={statusLabel} />
        {phase === 'checkin' ? (
          <CheckIn key={key} day={day} />
        ) : phase === 'noted' ? (
          <NotedView key={key} day={day} />
        ) : (
          <TodayPage key={key} day={day} />
        )}
      </ScrollView>
      <NextBar day={day} />
      <SheetHost content={content} />
    </>
  );
}
