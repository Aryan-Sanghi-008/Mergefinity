/**
 * @file haptics.utils.test.ts
 * @layer utils
 * @description Gating tests for haptics helpers.
 */

import { useSettingsStore } from '@/store/settingsStore';

import { isHapticsEnabled } from './haptics.utils';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ),
);

describe('isHapticsEnabled', () => {
  afterEach(() => {
    useSettingsStore.setState({ hapticsEnabled: true });
  });

  it('reflects settingsStore.hapticsEnabled', () => {
    useSettingsStore.setState({ hapticsEnabled: true });
    expect(isHapticsEnabled()).toBe(true);
    useSettingsStore.setState({ hapticsEnabled: false });
    expect(isHapticsEnabled()).toBe(false);
  });
});
