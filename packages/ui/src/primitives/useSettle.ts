import { useRef } from 'react';
import type { Phase } from '../store';

/**
 * Ports the prototype's lastSettleKey guard (daybook.html lines 883–891): the
 * .settle keyframes replay on every render, and a view re-renders for plenty
 * of reasons (hero toggle, sheet open/close, dose log) — the lower chapters
 * would blink each time. So only the FIRST render of a given day+phase gets
 * the settle classes; same-view re-renders skip them.
 *
 * Design note: the prototype's lastSettleKey is a single module-global because
 * it drives one render() function. Here each view (CheckIn / NotedView /
 * TodayPage) calls useSettle once at its top, and only one is mounted per
 * phase, so a useRef-per-caller is the correct scope: it tracks "have I, this
 * component instance, already settled this day+phase key?" A module-global
 * would wrongly suppress settling when two instances legitimately mount for the
 * same key (e.g. a remount). useRef keeps the guard local and per-instance.
 */
export function useSettle(day: number, phase: Phase): boolean {
  const lastKey = useRef<string | null>(null);
  const key = `${day}:${phase}`;
  const settle = key !== lastKey.current;
  lastKey.current = key;
  return settle;
}
