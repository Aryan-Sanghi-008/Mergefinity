/**
 * @file sound.utils.test.ts
 * @layer utils
 * @description Unit tests for SoundManager enable gate (P-15).
 */

import { useSettingsStore } from '@/store/settingsStore';
import { SoundManager } from '@/utils/sound.utils';

const mockPlayAsync = jest.fn(async () => undefined);
const mockSetPositionAsync = jest.fn(async () => undefined);
const mockSetRateAsync = jest.fn(async () => undefined);
const mockStopAsync = jest.fn(async () => undefined);
const mockCreateAsync = jest.fn(async (_source?: unknown, _initial?: unknown) => ({
  sound: {
    playAsync: mockPlayAsync,
    setPositionAsync: mockSetPositionAsync,
    setRateAsync: mockSetRateAsync,
    stopAsync: mockStopAsync,
  },
}));
const mockSetAudioModeAsync = jest.fn(async (_mode?: unknown) => undefined);

jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: (source: unknown, initial?: unknown) =>
        mockCreateAsync(source, initial),
    },
    setAudioModeAsync: (mode: unknown) => mockSetAudioModeAsync(mode),
  },
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
      expect.objectContaining({ playsInSilentModeIOS: false }),
    );
    expect(mockCreateAsync).toHaveBeenCalled();
  });

  it('does not play when sound is disabled via settings', async () => {
    await SoundManager.preload();
    useSettingsStore.setState({ soundEnabled: false });
    SoundManager.setEnabled(false);
    mockPlayAsync.mockClear();
    SoundManager.play('win_chime');
    await Promise.resolve();
    expect(mockPlayAsync).not.toHaveBeenCalled();
  });

  it('setEnabled(false) stops playback', async () => {
    await SoundManager.preload();
    SoundManager.setEnabled(false);
    expect(mockStopAsync).toHaveBeenCalled();
  });
});
