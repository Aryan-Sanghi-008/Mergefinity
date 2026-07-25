/**
 * @file audio.middleware.test.ts
 * @layer store/middleware
 * @description Unit tests for commit-move SFX routing (P-15).
 */

import { playCommitMoveSounds } from '@/store/middleware/audio.middleware';
import { SoundManager } from '@/utils/sound.utils';

jest.mock('@/utils/sound.utils', () => ({
  SoundManager: {
    play: jest.fn(),
    playSlide: jest.fn(),
    setEnabled: jest.fn(),
    preload: jest.fn(async () => undefined),
  },
}));

describe('playCommitMoveSounds', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('plays slide and low merge for merges below 128', () => {
    playCommitMoveSounds(
      {
        board: [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        scoreDelta: 4,
        mergeValues: [4, 8],
        direction: 'UP',
      },
      'playing',
    );
    expect(SoundManager.playSlide).toHaveBeenCalledWith('UP');
    expect(SoundManager.play).toHaveBeenCalledWith('tile_merge_low');
  });

  it('plays high merge when any merge is >= 128', () => {
    playCommitMoveSounds(
      {
        board: [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        scoreDelta: 128,
        mergeValues: [64, 128],
        direction: 'LEFT',
      },
      'playing',
    );
    expect(SoundManager.play).toHaveBeenCalledWith('tile_merge_high');
  });

  it('plays win_chime when status is won', () => {
    playCommitMoveSounds(
      {
        board: [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        scoreDelta: 0,
        mergeValues: [],
        direction: 'DOWN',
      },
      'won',
    );
    expect(SoundManager.play).toHaveBeenCalledWith('win_chime');
  });

  it('plays game_over when status is lost', () => {
    playCommitMoveSounds(
      {
        board: [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        scoreDelta: 0,
        mergeValues: [],
        direction: 'RIGHT',
      },
      'lost',
    );
    expect(SoundManager.play).toHaveBeenCalledWith('game_over');
  });
});
