/**
 * @file useOnboarding.test.ts
 * @layer hooks
 * @description Onboarding persist flag (P-19).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import { STORAGE_KEYS } from '@/constants';

import { useOnboarding } from './useOnboarding';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ),
);

describe('useOnboarding', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('shows onboarding when flag is unset', async () => {
    const { result } = await renderHook(() => useOnboarding());
    await waitFor(() => expect(result.current.hydrated).toBe(true));
    expect(result.current.showOnboarding).toBe(true);
  });

  it('hides after completeOnboarding and subsequent mounts', async () => {
    const first = await renderHook(() => useOnboarding());
    await waitFor(() => expect(first.result.current.hydrated).toBe(true));

    await act(async () => {
      await first.result.current.completeOnboarding();
    });
    expect(first.result.current.showOnboarding).toBe(false);
    expect(await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE)).toBe(
      '1',
    );

    const second = await renderHook(() => useOnboarding());
    await waitFor(() => expect(second.result.current.hydrated).toBe(true));
    expect(second.result.current.showOnboarding).toBe(false);
  });
});
