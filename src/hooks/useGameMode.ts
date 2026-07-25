/**
 * @file useGameMode.ts
 * @layer hooks
 * @description Mode selection with soft-restart confirmation (P-10).
 */

import { useCallback, useState } from 'react';

import { useGameStore } from '@/store/gameStore';
import type { GameMode } from '@/types';

export interface UseGameModeResult {
  /** Active mode. */
  mode: GameMode;
  /** Pending mode awaiting confirm (null when idle). */
  pendingMode: GameMode | null;
  /** Request a mode change (may open confirm). */
  requestModeChange: (mode: GameMode) => void;
  /** Confirm pending switch (restarts board). */
  confirmModeChange: () => void;
  /** Dismiss confirm without switching. */
  cancelModeChange: () => void;
}

/**
 * Mode pills API — confirms when the current session has progress.
 */
export function useGameMode(): UseGameModeResult {
  const mode = useGameStore((s) => s.mode);
  const moveCount = useGameStore((s) => s.moveCount);
  const score = useGameStore((s) => s.score);
  const setMode = useGameStore((s) => s.setMode);
  const [pendingMode, setPendingMode] = useState<GameMode | null>(null);

  const hasProgress = moveCount > 0 || score > 0;

  const requestModeChange = useCallback(
    (next: GameMode) => {
      if (next === mode) {
        return;
      }
      if (hasProgress) {
        setPendingMode(next);
        return;
      }
      setMode(next);
    },
    [mode, hasProgress, setMode],
  );

  const confirmModeChange = useCallback(() => {
    if (pendingMode === null) {
      return;
    }
    setMode(pendingMode);
    setPendingMode(null);
  }, [pendingMode, setMode]);

  const cancelModeChange = useCallback(() => {
    setPendingMode(null);
  }, []);

  return {
    mode,
    pendingMode,
    requestModeChange,
    confirmModeChange,
    cancelModeChange,
  };
}
