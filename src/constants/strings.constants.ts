/**
 * @file strings.constants.ts
 * @layer constants
 * @description All user-visible Mergefinity strings.
 */

export const STRINGS = {
  GAME_TITLE: 'Mergefinity',
  SCORE_LABEL: 'SCORE',
  BEST_LABEL: 'BEST',
  NEW_GAME: 'New Game',
  UNDO: 'Undo',
  GAME_OVER_TITLE: 'Game Over!',
  GAME_OVER_SUB: 'No more moves available.',
  WIN_TITLE: 'You Win!',
  WIN_SUB: 'You reached 2048!',
  CONTINUE: 'Keep Going',
  TRY_AGAIN: 'Try Again',
  SWIPE_HINT: 'Swipe to move tiles',
  SETTINGS_TITLE: 'Settings',
  SETTINGS_PLACEHOLDER: 'Settings coming in a later phase.',
  TAB_GAME: 'Play',
  TAB_SETTINGS: 'Settings',
} as const;

export type StringKey = keyof typeof STRINGS;
