import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { createContext, useContext } from 'react';
import type { SheetKind } from '@postpal/content';
import { NOTHING_NEW, SOMETHING_ELSE } from '@postpal/content';

export type Phase = 'checkin' | 'noted' | 'page';
export type OpenSheetKind = SheetKind | 'interpreter' | 'feel';
export interface SheetPayload { key?: string; origin?: 'chips' | 'feel'; escalated?: boolean }
export interface OpenSheet { kind: OpenSheetKind; payload: SheetPayload | null }

export interface DaybookState {
  day: number;
  phase: Phase;
  face: number | null;
  note: string | null;
  heroExpanded: boolean;
  noteInputOpen: boolean;
  noteDraft: string;
  sheet: OpenSheet | null;
  logged: Record<number, number>;
  cycleAnswer: string | null;
  switchDay: (day: number) => void;
  selectFace: (i: number) => void;
  toggleHero: () => void;
  reopenCheckin: () => void;
  reopenNoted: () => void;
  chooseChip: (chip: string) => void;
  submitNote: (text: string) => void;
  cancelNote: () => void;
  setNoteDraft: (text: string) => void;
  openSheet: (kind: OpenSheet['kind'], payload?: SheetPayload | null) => void;
  closeSheet: () => void;
  resolveInterpreter: () => void;
  escalateInterpreter: () => void;
  logDose: () => void;
  answerCycle: (option: string) => void;
}

const fresh = (day: number) => ({
  day, phase: 'checkin' as Phase, face: null, note: null,
  heroExpanded: false, noteInputOpen: false, noteDraft: '', sheet: null, cycleAnswer: null
});

export function createDaybookStore(initialDay: number) {
  return createStore<DaybookState>((set, get) => ({
    ...fresh(initialDay),
    logged: {},
    switchDay: (day) => set({ ...fresh(day) }),               // logged survives: session-scope
    selectFace: (i) => set({ face: i, phase: 'noted' }),
    toggleHero: () => set((s) => ({ heroExpanded: !s.heroExpanded })),
    reopenCheckin: () => set({ phase: 'checkin', heroExpanded: false, noteInputOpen: false }),
    reopenNoted: () => set({ phase: 'noted', noteInputOpen: false }),
    chooseChip: (chip) => {
      if (chip === NOTHING_NEW) set({ note: 'nothing new', phase: 'page' });
      // prototype line 828: only route to the inline note input from the noted
      // phase; from other phases (e.g. the feel sheet) the sheet just closes.
      else if (chip === SOMETHING_ELSE) { if (get().phase === 'noted') set({ noteInputOpen: true }); }
      else set({ sheet: { kind: 'interpreter', payload: { key: chip, origin: 'chips' } } });
    },
    submitNote: (text) => {
      const t = text.trim();
      if (!t) return;
      set({ note: t, noteDraft: '', noteInputOpen: false, phase: 'page' });
    },
    cancelNote: () => set({ noteDraft: '', noteInputOpen: false }),
    setNoteDraft: (text) => set({ noteDraft: text }),
    openSheet: (kind, payload = null) => set({ sheet: { kind, payload } }),
    closeSheet: () => set({ sheet: null }),
    resolveInterpreter: () => {
      const { sheet } = get();
      const payload = sheet?.payload;
      if (payload?.origin === 'chips' && payload.key) {
        set({ note: payload.key.toLowerCase(), phase: 'page', sheet: null });
      } else {
        set({ sheet: null });
      }
    },
    escalateInterpreter: () => {
      const { sheet } = get();
      if (sheet?.kind !== 'interpreter' || !sheet.payload) return;
      set({ sheet: { kind: 'interpreter', payload: { ...sheet.payload, escalated: true } } });
    },
    logDose: () => set((s) => ({ logged: { ...s.logged, [s.day]: (s.logged[s.day] ?? 0) + 1 } })),
    answerCycle: (option) => set({ cycleAnswer: option })
  }));
}

export type DaybookStore = ReturnType<typeof createDaybookStore>;
export const DaybookStoreContext = createContext<DaybookStore | null>(null);
export function useDaybook<T>(selector: (s: DaybookState) => T): T {
  const store = useContext(DaybookStoreContext);
  if (!store) throw new Error('useDaybook must be used inside <Daybook>');
  return useStore(store, selector);
}
