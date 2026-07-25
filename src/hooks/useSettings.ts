/**
 * @file useSettings.ts
 * @layer hooks
 * @description Targeted settings selectors — components never import the store.
 */

import { useSettingsStore } from '@/store/settingsStore';

/**
 * @returns Whether haptic feedback is enabled.
 */
export function useHapticsEnabled(): boolean {
  return useSettingsStore((state) => state.hapticsEnabled);
}

/**
 * @returns Setter for haptics preference.
 */
export function useSetHapticsEnabled(): (enabled: boolean) => void {
  return useSettingsStore((state) => state.setHapticsEnabled);
}

/**
 * @returns Whether sound effects are enabled.
 */
export function useSoundEnabled(): boolean {
  return useSettingsStore((state) => state.soundEnabled);
}

/**
 * @returns Setter for sound preference.
 */
export function useSetSoundEnabled(): (enabled: boolean) => void {
  return useSettingsStore((state) => state.setSoundEnabled);
}
