/**
 * @file haptics.utils.test.ts
 * @layer utils
 * @description Gating tests for haptics helpers.
 */

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest mock factory
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import { useSettingsStore } from '@/store/settingsStore';

import { isHapticsEnabled } from './haptics.utils';

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
