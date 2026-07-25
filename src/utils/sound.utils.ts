/**
 * @file sound.utils.ts
 * @layer utils
 * @description SoundManager singleton — preload / play / enable (P-15).
 */

import { Audio, type AVPlaybackSource } from 'expo-av';

import {
  SLIDE_PITCH_BY_DIRECTION,
  type SoundId,
} from '@/constants/sound.constants';
import { useSettingsStore } from '@/store/settingsStore';
import type { Direction } from '@/types';

const SOUND_SOURCES: Record<SoundId, AVPlaybackSource> = {
  tile_slide: require('@/assets/sounds/tile_slide.wav') as AVPlaybackSource,
  tile_merge_low: require('@/assets/sounds/tile_merge_low.wav') as AVPlaybackSource,
  tile_merge_high: require('@/assets/sounds/tile_merge_high.wav') as AVPlaybackSource,
  win_chime: require('@/assets/sounds/win_chime.wav') as AVPlaybackSource,
  game_over: require('@/assets/sounds/game_over.wav') as AVPlaybackSource,
  achievement_unlock: require('@/assets/sounds/achievement_unlock.wav') as AVPlaybackSource,
};

/**
 * Singleton audio player. All SFX go through here; gated by `soundEnabled`.
 */
class SoundManagerImpl {
  private sounds = new Map<SoundId, Audio.Sound>();

  private enabled = true;

  private preloaded = false;

  private preloadPromise: Promise<void> | null = null;

  /**
   * Sync gate with settings; stops playback immediately when disabled.
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      void this.stopAll();
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
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: false,
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const entries = Object.entries(SOUND_SOURCES) as [
        SoundId,
        AVPlaybackSource,
      ][];
      await Promise.all(
        entries.map(async ([id, source]) => {
          const { sound } = await Audio.Sound.createAsync(source, {
            shouldPlay: false,
            volume: 1,
          });
          this.sounds.set(id, sound);
        }),
      );
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
      const sound = this.sounds.get(id);
      if (sound === undefined) {
        return;
      }
      await sound.setRateAsync(rate, true);
      await sound.setPositionAsync(0);
      if (!this.isEnabled()) {
        return;
      }
      await sound.playAsync();
    } catch {
      // Audio is best-effort (web / missing native module).
    }
  }

  private async stopAll(): Promise<void> {
    await Promise.all(
      [...this.sounds.values()].map(async (sound) => {
        try {
          await sound.stopAsync();
        } catch {
          // ignore
        }
      }),
    );
  }

  /** Clears preload state for unit tests. */
  resetForTests(): void {
    this.sounds.clear();
    this.preloaded = false;
    this.preloadPromise = null;
    this.enabled = true;
  }
}

/** Shared SoundManager instance. */
export const SoundManager = new SoundManagerImpl();
