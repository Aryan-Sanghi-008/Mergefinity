/**
 * @file settingsStore.test.ts
 * @layer store
 * @description Settings setters and persist merge (P-18).
 */

import { useSettingsStore } from './settingsStore';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ),
);

describe('useSettingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      theme: 'classic',
      followSystemDark: false,
      hapticsEnabled: true,
      soundEnabled: true,
      boardSize: 4,
    });
  });

  it('toggles haptics and sound', () => {
    useSettingsStore.getState().setHapticsEnabled(false);
    useSettingsStore.getState().setSoundEnabled(false);
    expect(useSettingsStore.getState().hapticsEnabled).toBe(false);
    expect(useSettingsStore.getState().soundEnabled).toBe(false);
  });

  it('sets theme, system dark follow, and board size', () => {
    useSettingsStore.getState().setTheme('midnight');
    useSettingsStore.getState().setFollowSystemDark(true);
    useSettingsStore.getState().setBoardSize(5);
    expect(useSettingsStore.getState().theme).toBe('midnight');
    expect(useSettingsStore.getState().followSystemDark).toBe(true);
    expect(useSettingsStore.getState().boardSize).toBe(5);
  });
});
