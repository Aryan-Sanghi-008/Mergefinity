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

export type { RowTileMove, ShiftRowResult } from './board.types';

export type {
  AchievementActions,
  AchievementState,
  AchievementStore,
  CommitMovePayload,
  GameActions,
  GameState,
  GameStatus,
  GameStore,
  PurchaseActions,
  PurchaseState,
  PurchaseStore,
  SettingsActions,
  SettingsState,
  SettingsStore,
  StatsActions,
  StatsState,
  StatsStore,
} from './store.types';

export type {
  Achievement,
  AchievementCategory,
  AchievementContext,
  AchievementDefinition,
  AchievementId,
  AchievementProgress,
  AchievementStatus,
} from './achievement.types';

export type {
  GameEndOutcome,
  GameStats,
  LifetimeStats,
  RecordGameEndPayload,
  SessionRecord,
} from './stats.types';

export type {
  BoardTileEntity,
  IconName,
  OverlayKind,
  SettingsSection,
  TabName,
  TileMotionPhase,
} from './ui.types';
