/**
 * @file sound.utils.test.ts
 * @layer utils
 * @description Unit tests for SoundManager enable gate (P-15).
 */

import { useSettingsStore } from '@/store/settingsStore';
import { SoundManager } from '@/utils/sound.utils';

const mockPlay = jest.fn();
const mockPause = jest.fn();
const mockSeekTo = jest.fn(async () => undefined);
const mockSetPlaybackRate = jest.fn();
const mockRemove = jest.fn();
const mockCreateAudioPlayer = jest.fn(() => ({
  play: mockPlay,
  pause: mockPause,
  seekTo: mockSeekTo,
  setPlaybackRate: mockSetPlaybackRate,
  remove: mockRemove,
  volume: 1,
}));
const mockSetAudioModeAsync = jest.fn(async (_mode?: unknown) => undefined);

jest.mock('expo-audio', () => ({
  createAudioPlayer: () => mockCreateAudioPlayer(),
  setAudioModeAsync: (mode: unknown) => mockSetAudioModeAsync(mode),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ),
);

describe('SoundManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSettingsStore.setState({ soundEnabled: true });
    SoundManager.resetForTests();
    SoundManager.setEnabled(true);
  });

  it('preloads with silent-mode disabled on iOS', async () => {
    await SoundManager.preload();
    expect(mockSetAudioModeAsync).toHaveBeenCalledWith(
      expect.objectContaining({ playsInSilentMode: false }),
    );
    expect(mockCreateAudioPlayer).toHaveBeenCalled();
  });

  it('does not play when sound is disabled via settings', async () => {
    await SoundManager.preload();
    useSettingsStore.setState({ soundEnabled: false });
    SoundManager.setEnabled(false);
    mockPlay.mockClear();
    SoundManager.play('win_chime');
    await Promise.resolve();
    expect(mockPlay).not.toHaveBeenCalled();
  });

  it('setEnabled(false) stops playback', async () => {
    await SoundManager.preload();
    SoundManager.setEnabled(false);
    expect(mockPause).toHaveBeenCalled();
  });
});
