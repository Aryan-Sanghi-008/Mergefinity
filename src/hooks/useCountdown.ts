/**
 * @file useCountdown.ts
 * @layer hooks
 * @description Reanimated countdown for Time Attack (P-10).
 */

import { useEffect, useRef } from 'react';
import {
  cancelAnimation,
  runOnJS,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

export interface UseCountdownParams {
  /** Remaining milliseconds when the timer is armed. */
  remainingMs: number | null;
  /** When true, freezes the countdown (AppState background). */
  paused: boolean;
  /** Fired once when remaining hits 0. */
  onExpire: () => void;
  /** Persist remaining ms when pausing (background). */
  onTick?: (ms: number) => void;
}

export interface UseCountdownResult {
  /** Shared remaining ms for UI-thread display. */
  remainingMs: SharedValue<number>;
}

/**
 * Animates remaining time to 0 with `withTiming`; pauses cancel the animation.
 */
export function useCountdown({
  remainingMs,
  paused,
  onExpire,
  onTick,
}: UseCountdownParams): UseCountdownResult {
  const value = useSharedValue(remainingMs ?? 0);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  const onTickRef = useRef(onTick);
  const wasPausedRef = useRef(paused);

  useEffect(() => {
    onExpireRef.current = onExpire;
    onTickRef.current = onTick;
  }, [onExpire, onTick]);

  /** Sync shared value when store remaining changes (restart / hydrate). */
  useEffect(() => {
    if (remainingMs === null) {
      cancelAnimation(value);
      value.set(0);
      expiredRef.current = false;
      return;
    }
    if (remainingMs <= 0) {
      value.set(0);
      return;
    }
    value.set(remainingMs);
    expiredRef.current = false;
  }, [remainingMs, value]);

  /** Pause: cancel animation and persist remaining. */
  useEffect(() => {
    if (paused && !wasPausedRef.current) {
      cancelAnimation(value);
      onTickRef.current?.(Math.round(value.get()));
    }
    wasPausedRef.current = paused;
  }, [paused, value]);

  /** Run / resume countdown while active. */
  useEffect(() => {
    if (remainingMs === null || paused) {
      return;
    }
    if (remainingMs <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpireRef.current();
      }
      return;
    }

    const fireExpire = () => {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpireRef.current();
      }
    };

    const current = Math.round(value.get());
    const start = current > 0 ? current : remainingMs;
    value.set(start);
    value.set(withTiming(0, { duration: start }, (finished) => {
      if (finished) {
        runOnJS(fireExpire)();
      }
    }));

    return () => {
      cancelAnimation(value);
    };
  }, [remainingMs, paused, value]);

  return { remainingMs: value };
}
