import { StrictMode } from 'react';
import { renderHook } from '@testing-library/react-native';
import { useSettle, settleEntering } from './useSettle';
import type { Phase } from '../store';

// RN port of the dormant DOM useSettle.test.tsx (deleted) — same four cases,
// via @testing-library/react-native's renderHook instead of
// @testing-library/react's. useSettle itself is untouched (render-pure,
// effect-written ref), so its behavior is identical on RN.
describe('useSettle', () => {
  it('returns true on the first render of a given day:phase key', () => {
    const { result } = renderHook(() => useSettle(1, 'checkin'));
    expect(result.current).toBe(true);
  });

  it('returns false on same-key re-renders (e.g. a hero toggle within the same phase)', () => {
    const { result, rerender } = renderHook(
      ({ day, phase }: { day: number; phase: Phase }) => useSettle(day, phase),
      { initialProps: { day: 1, phase: 'checkin' as Phase } }
    );
    expect(result.current).toBe(true);
    rerender({ day: 1, phase: 'checkin' as Phase });
    expect(result.current).toBe(false);
  });

  it('returns true again when the key changes (day switch, same phase)', () => {
    const { result, rerender } = renderHook(
      ({ day, phase }: { day: number; phase: Phase }) => useSettle(day, phase),
      { initialProps: { day: 1, phase: 'checkin' as Phase } }
    );
    expect(result.current).toBe(true);
    rerender({ day: 1, phase: 'checkin' as Phase });
    expect(result.current).toBe(false);
    rerender({ day: 2, phase: 'checkin' as Phase });
    expect(result.current).toBe(true);
  });

  it('returns true on first mount even under React.StrictMode', () => {
    const { result } = renderHook(() => useSettle(1, 'checkin'), {
      wrapper: StrictMode,
    });
    expect(result.current).toBe(true);
  });
});

describe('settleEntering', () => {
  it('returns undefined when settle is false, or when reduceMotion is true', () => {
    expect(settleEntering(false, false)).toBeUndefined();
    expect(settleEntering(true, true)).toBeUndefined();
  });

  it('returns a truthy entering descriptor when settle is true and reduceMotion is false', () => {
    expect(settleEntering(true, false)).toBeTruthy();
  });
});
