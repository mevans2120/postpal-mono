import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ProcedureContent } from '@postpal/content';
import { getDay } from '@postpal/content';
import { useDaybook } from '../store';
import type { OpenSheet, OpenSheetKind } from '../store';
import { MedRailSheet } from './MedRailSheet';
import { CanCantSheet } from './CanCantSheet';
import { CycleSheet } from './CycleSheet';
import { InterpreterSheet } from './InterpreterSheet';
import { FeelSheet } from './FeelSheet';

/** Sheet accessible names (prototype SHEET_LABELS, lines 606–612). */
const SHEET_LABELS: Record<OpenSheetKind, string> = {
  medrail: 'Your medicines today',
  cancant: 'What you can do — and not yet',
  cycle: 'Cycle check-in',
  interpreter: 'What this symptom means',
  feel: 'What are you feeling?'
};

const EXIT_MS = 280; // matches the daybook.css 240ms transition + a settle margin (prototype line 846)

/** Reduced motion — or no matchMedia at all (jsdom/SSR) — unmounts instantly. */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export interface SheetHostProps {
  content: ProcedureContent;
}

/**
 * The single sheet overlay (prototype renderSheet/openSheet/closeSheet, lines
 * 616–630, 839–878). It reads store.sheet and mounts #sheet-root with the dim
 * scrim and the .sheet dialog. The store owns which sheet is open; this host
 * owns the presentation lifecycle the store can't express:
 *
 *   • Focus — on a fresh open it captures document.activeElement as the opener,
 *     then focuses the sheet (preventScroll). On close it restores focus to that
 *     opener if it's still connected (a chip opener may be gone once the page
 *     phase renders — then focus just stays put, as in the prototype).
 *   • Enter/exit — the CSS transition is keyed on #sheet-root.open, so the host
 *     toggles that class: added a frame after mount (so the slide-up plays), and
 *     on close removed first, then the DOM is unmounted after EXIT_MS. Under
 *     reduced motion both happen instantly (no timer, no rAF).
 *   • Content swaps (feel → interpreter, escalate) rebuild the body inside the
 *     already-open root: no opener re-capture, no slide replay.
 *   • Escape and the scrim/grab both close, via the store's closeSheet.
 */
export function SheetHost({ content }: SheetHostProps) {
  const sheet = useDaybook((s) => s.sheet);
  const closeSheet = useDaybook((s) => s.closeSheet);
  const dayNum = useDaybook((s) => s.day);
  const day = getDay(content, dayNum);

  // `rendered` is what's actually in the DOM — it lags the store on close so the
  // exit animation can finish before unmount. `open` drives the CSS transition.
  const [rendered, setRendered] = useState<OpenSheet | null>(sheet);
  const [open, setOpen] = useState(false);

  const renderedRef = useRef<OpenSheet | null>(rendered);
  const openerRef = useRef<HTMLElement | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Store → local. Open/swap set `rendered` immediately; close schedules it.
  useLayoutEffect(() => {
    if (sheet) {
      if (exitTimer.current) {
        clearTimeout(exitTimer.current);
        exitTimer.current = null;
      }
      if (renderedRef.current == null) {
        // fresh open: remember who to return focus to (content swaps keep it)
        openerRef.current = document.activeElement as HTMLElement | null;
      }
      renderedRef.current = sheet;
      setRendered(sheet);
    } else if (renderedRef.current != null) {
      setOpen(false); // slide out
      const finish = () => {
        exitTimer.current = null;
        renderedRef.current = null;
        setRendered(null);
        const opener = openerRef.current;
        openerRef.current = null;
        if (opener && opener.isConnected) opener.focus();
      };
      if (prefersReducedMotion()) finish();
      else exitTimer.current = setTimeout(finish, EXIT_MS);
    }
  }, [sheet]);

  // On (re)mount of the body: focus the sheet, then flip `open` on. A fresh open
  // wants the frame delay so the slide-up plays; a swap keeps `open` already true.
  useLayoutEffect(() => {
    if (!rendered) return;
    sheetRef.current?.focus({ preventScroll: true });
    if (prefersReducedMotion()) {
      setOpen(true);
      return;
    }
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setOpen(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, [rendered]);

  // Escape closes while a sheet is up (prototype document handler, line 1082).
  useEffect(() => {
    if (!rendered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSheet();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [rendered, closeSheet]);

  // Clear a pending exit timer if the host unmounts mid-animation.
  useEffect(() => () => {
    if (exitTimer.current) clearTimeout(exitTimer.current);
  }, []);

  if (!rendered) return null;

  return (
    <div id="sheet-root" className={open ? 'open' : undefined}>
      <div
        className="dim fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[rgba(43,33,24,.32)] z-[60]"
        onClick={closeSheet}
      />
      <div
        ref={sheetRef}
        className="sheet fixed bottom-0 inset-x-0 w-full max-w-[430px] mx-auto bg-paper rounded-t-[26px] px-[22px] pt-4 pb-[calc(18px+env(safe-area-inset-bottom))] shadow-[0_-12px_40px_rgba(43,33,24,.25)] max-h-[82dvh] overflow-y-auto z-[61] outline-none"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-label={SHEET_LABELS[rendered.kind] ?? 'Sheet'}
      >
        <div
          className="relative hit-grab w-10 h-1 rounded-[2px] bg-line mx-auto mb-3.5 cursor-pointer"
          aria-hidden="true"
          onClick={closeSheet}
        />
        <SheetBody rendered={rendered} content={content} dayNum={dayNum} />
      </div>
    </div>
  );
}

function SheetBody({
  rendered,
  content,
  dayNum
}: {
  rendered: OpenSheet;
  content: ProcedureContent;
  dayNum: number;
}) {
  const day = getDay(content, dayNum);
  const { kind, payload } = rendered;

  switch (kind) {
    case 'medrail':
      return <MedRailSheet day={day} />;
    case 'cancant':
      return day.cancant ? <CanCantSheet cancant={day.cancant} /> : null;
    case 'cycle':
      return day.cycle ? <CycleSheet cycle={day.cycle} /> : null;
    case 'interpreter': {
      const key = payload?.key;
      const interp = key ? day.interpreters[key] : undefined;
      if (!interp) return null;
      return (
        <InterpreterSheet interp={interp} escalated={!!payload?.escalated} meta={content.meta} />
      );
    }
    case 'feel':
      return <FeelSheet day={day} />;
    default:
      return null;
  }
}
