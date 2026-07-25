/**
 * @file audio.middleware.ts
 * @layer store/middleware
 * @description Triggers SFX from store actions — never from UI (P-15).
 */

import type { StateCreator } from 'zustand';

import { MERGE_SFX_HIGH_THRESHOLD } from '@/constants/sound.constants';
import type {
  AchievementStore,
  CommitMovePayload,
  GameStore,
  SettingsStore,
} from '@/types';
import { SoundManager } from '@/utils/sound.utils';

/**
 * Plays slide / merge / win / lose after a committed move.
 */
export function playCommitMoveSounds(
  payload: CommitMovePayload,
  nextStatus: GameStore['status'],
): void {
  SoundManager.playSlide(payload.direction);

  if (payload.mergeValues.length > 0) {
    const peak = Math.max(...payload.mergeValues);
    SoundManager.play(
      peak >= MERGE_SFX_HIGH_THRESHOLD ? 'tile_merge_high' : 'tile_merge_low',
    );
  }

  if (nextStatus === 'won') {
    SoundManager.play('win_chime');
  } else if (nextStatus === 'lost') {
    SoundManager.play('game_over');
  }
}

/**
 * Wraps game store actions with audio side effects.
 */
export function audioGame<T extends GameStore>(
  config: StateCreator<T, [], []>,
): StateCreator<T, [], []> {
  return (set, get, api) => {
    const store = config(set, get, api);
    const commitMove = store.commitMove.bind(store);
    const expireTimer = store.expireTimer.bind(store);

    store.commitMove = (payload) => {
      commitMove(payload);
      playCommitMoveSounds(payload, get().status);
    };

    store.expireTimer = () => {
      expireTimer();
      if (get().status === 'won') {
        SoundManager.play('win_chime');
      }
    };

    return store;
  };
}

/**
 * Wraps achievement unlocks with unlock SFX.
 */
export function audioAchievements<T extends AchievementStore>(
  config: StateCreator<T, [], []>,
): StateCreator<T, [], []> {
  return (set, get, api) => {
    const store = config(set, get, api);
    const unlock = store.unlock.bind(store);
    const unlockMany = store.unlockMany.bind(store);

    store.unlock = (id) => {
      const wasLocked = get().progress[id]?.status !== 'unlocked';
      unlock(id);
      if (wasLocked && get().progress[id]?.status === 'unlocked') {
        SoundManager.play('achievement_unlock');
      }
    };

    store.unlockMany = (ids) => {
      if (ids.length === 0) {
        return;
      }
      const pending = ids.filter(
        (id) => get().progress[id]?.status !== 'unlocked',
      );
      unlockMany(ids);
      if (pending.some((id) => get().progress[id]?.status === 'unlocked')) {
        SoundManager.play('achievement_unlock');
      }
    };

    return store;
  };
}

/**
 * Syncs SoundManager when the settings toggle changes.
 */
export function audioSettings<T extends SettingsStore>(
  config: StateCreator<T, [], []>,
): StateCreator<T, [], []> {
  return (set, get, api) => {
    const store = config(set, get, api);
    const setSoundEnabled = store.setSoundEnabled.bind(store);

    store.setSoundEnabled = (enabled) => {
      setSoundEnabled(enabled);
      SoundManager.setEnabled(enabled);
    };

    return store;
  };
}
