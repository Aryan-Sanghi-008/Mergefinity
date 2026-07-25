/**
 * Bare-Node smoke entry for the pure engine (P-03 DoD).
 * Run: npm run engine:smoke
 */

import { createEmptyBoard, resolveMove, spawnTile } from '../src/engine';

const board = spawnTile(createEmptyBoard(), () => 0);
const moved = resolveMove(board, 'LEFT');

process.stdout.write(
  `${JSON.stringify({
    ok: true,
    boardChanged: moved.boardChanged,
    cells: moved.board.filter((v) => v !== 0).length,
  })}\n`,
);
