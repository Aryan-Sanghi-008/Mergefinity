/**
 * @file index.ts
 * @layer store
 * @description Barrel for Zustand stores — hooks wrap these for components.
 */

export { useAchievementStore } from './achievementStore';
export { useGameStore } from './gameStore';
export type { GamePersistedSlice } from './gameStore';
export { analytics } from './middleware/analytics.middleware';
export { usePurchaseStore } from './purchaseStore';
export { useSettingsStore } from './settingsStore';
export { useStatsStore } from './statsStore';
