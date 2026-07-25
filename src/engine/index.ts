/**
 * @file index.ts
 * @layer engine
 * @description Public barrel for pure game engine exports.
 */

export {
  createEmptyBoard,
  getEmptyCells,
  shiftRowLeft,
  spawnTile,
} from './boardUtils';

export { resolveMove, rotateBoard } from './moveResolver';

export { calculateMergeBonuses, scoreFromMerge } from './scoreCalculator';

export { isLost, isWon } from './winCondition';
