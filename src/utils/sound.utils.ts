/**
 * @file sound.utils.ts
 * @layer utils
 * @description SoundManager singleton — preload / play / enable (P-15).
 */

import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioSource,
} from 'expo-audio';

import {
  SLIDE_PITCH_BY_DIRECTION,
  type SoundId,
} from '@/constants/sound.constants';
import { useSettingsStore } from '@/store/settingsStore';
import type { Direction } from '@/types';

const SOUND_SOURCES: Record<SoundId, AudioSource> = {
  tile_slide: require('@/assets/sounds/tile_slide.wav') as number,
  tile_merge_low: require('@/assets/sounds/tile_merge_low.wav') as number,
  tile_merge_high: require('@/assets/sounds/tile_merge_high.wav') as number,
  win_chime: require('@/assets/sounds/win_chime.wav') as number,
  game_over: require('@/assets/sounds/game_over.wav') as number,
  achievement_unlock: require('@/assets/sounds/achievement_unlock.wav') as number,
};

/**
 * Singleton audio player. All SFX go through here; gated by `soundEnabled`.
 */
class SoundManagerImpl {
  private players = new Map<SoundId, AudioPlayer>();

  private enabled = true;

  private preloaded = false;

  private preloadPromise: Promise<void> | null = null;

  /**
   * Sync gate with settings; stops playback immediately when disabled.
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  /**
   * Configure session (respect iOS silent switch) and load all clips.
   */
  async preload(): Promise<void> {
    if (this.preloaded) {
      return;
    }
    if (this.preloadPromise !== null) {
      await this.preloadPromise;
      return;
    }

    this.preloadPromise = (async () => {
      this.enabled = useSettingsStore.getState().soundEnabled;
      await setAudioModeAsync({
        playsInSilentMode: false,
        shouldPlayInBackground: false,
        interruptionMode: 'mixWithOthers',
      });

      const entries = Object.entries(SOUND_SOURCES) as [SoundId, AudioSource][];
      for (const [id, source] of entries) {
        const player = createAudioPlayer(source, { keepAudioSessionActive: true });
        player.volume = 1;
        this.players.set(id, player);
      }
      this.preloaded = true;
    })();

    try {
      await this.preloadPromise;
    } finally {
      this.preloadPromise = null;
    }
  }

  /**
   * Play a preloaded clip if sound is enabled.
   */
  play(id: SoundId, options?: { rate?: number }): void {
    if (!this.isEnabled()) {
      return;
    }
    void this.playAsync(id, options?.rate ?? 1);
  }

  /**
   * Slide whoosh with direction-based pitch.
   */
  playSlide(direction: Direction): void {
    this.play('tile_slide', {
      rate: SLIDE_PITCH_BY_DIRECTION[direction],
    });
  }

  private isEnabled(): boolean {
    return this.enabled && useSettingsStore.getState().soundEnabled;
  }

  private async playAsync(id: SoundId, rate: number): Promise<void> {
    try {
      if (!this.preloaded) {
        await this.preload();
      }
      if (!this.isEnabled()) {
        return;
      }
      const player = this.players.get(id);
      if (player === undefined) {
        return;
      }
      player.setPlaybackRate(rate);
      await player.seekTo(0);
      if (!this.isEnabled()) {
        return;
      }
      player.play();
    } catch {
      // Audio is best-effort (web / missing native module).
    }
  }

  private stopAll(): void {
    for (const player of this.players.values()) {
      try {
        player.pause();
      } catch {
        // ignore
      }
    }
  }

  /** Clears preload state for unit tests. */
  resetForTests(): void {
    for (const player of this.players.values()) {
      try {
        player.remove();
      } catch {
        // ignore
      }
    }
    this.players.clear();
    this.preloaded = false;
    this.preloadPromise = null;
    this.enabled = true;
  }
}

/** Shared SoundManager instance. */
export const SoundManager = new SoundManagerImpl();
