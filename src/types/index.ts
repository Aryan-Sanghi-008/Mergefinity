/**
 * @file index.ts
 * @layer types
 * @description Public barrel for all domain types — import from `@/types` only.
 */

export type {
  Board,
  CellValue,
  Direction,
  GameMode,
  GameSnapshot,
  MoveResult,
  ThemeName,
  TileMove,
} from './game.types';

export type { ShiftRowResult } from './board.types';

export type {
  GameActions,
  GameState,
  GameStatus,
  GameStore,
} from './store.types';

export type {
  Achievement,
  AchievementCategory,
  AchievementId,
  AchievementProgress,
  AchievementStatus,
} from './achievement.types';

export type { GameStats, LifetimeStats, SessionRecord } from './stats.types';

export type { IconName, OverlayKind, SettingsSection, TabName } from './ui.types';
