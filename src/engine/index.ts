/**
 * @file index.ts
 * @layer engine
 * @description Public barrel for pure game engine exports.
 */

export {
  cloneBoard,
  createEmptyBoard,
  getEmptyCells,
  spawnTile,
} from './boardUtils';

export { normalizeRotations, rotateBoard, rotateIndex } from './boardRotator';

export { shiftRowLeft } from './rowShifter';

export { resolveMove } from './moveResolver';

export { calculateMergeScore, scoreFromMerge } from './scoreCalculator';

export { isLost, isWon } from './winCondition';
