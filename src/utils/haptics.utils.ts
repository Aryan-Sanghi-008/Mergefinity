/**
 * @file haptics.utils.ts
 * @layer utils
 * @description Gated expo-haptics helpers (P-08 feedback map).
 */

import * as Haptics from 'expo-haptics';

import { useSettingsStore } from '@/store/settingsStore';

/**
 * @returns Whether haptics are enabled in settings (reads store, no React).
 */
export function isHapticsEnabled(): boolean {
  return useSettingsStore.getState().hapticsEnabled;
}

/**
 * Runs `action` only when haptics are enabled.
 */
async function gated(action: () => Promise<void>): Promise<void> {
  if (!isHapticsEnabled()) {
    return;
  }
  try {
    await action();
  } catch {
    // Haptics are best-effort on unsupported devices / web.
  }
}

/** Valid move (board changed, no merge). */
export function hapticMove(): void {
  void gated(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

/** At least one merge in the move. */
export function hapticMerge(): void {
  void gated(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
}

/** Win condition reached. */
export function hapticWin(): void {
  void gated(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  );
}

/** Game over. */
export function hapticGameOver(): void {
  void gated(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  );
}

/** Achievement unlock (P-12+). */
export function hapticAchievement(): void {
  void gated(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  );
}

/** New game button. */
export function hapticNewGame(): void {
  void gated(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
}

/** Generic light press (primary actions). */
export function hapticLight(): void {
  void gated(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

/** Selection tick (icon buttons). */
export function hapticSelection(): void {
  void gated(() => Haptics.selectionAsync());
}
