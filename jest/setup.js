/**
 * Jest setup — native module mocks shared across suites (P-18).
 * Worklets must be mocked before Reanimated loads (Reanimated 4).
 */

jest.mock('react-native-worklets', () =>
  require('react-native-worklets/src/mock'),
);

require('react-native-reanimated').setUpTests();

jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    seekTo: jest.fn(async () => undefined),
    setPlaybackRate: jest.fn(),
    remove: jest.fn(),
    volume: 1,
  })),
  setAudioModeAsync: jest.fn(async () => undefined),
}));

jest.mock('expo-keep-awake', () => ({
  activateKeepAwakeAsync: jest.fn(async () => undefined),
  deactivateKeepAwake: jest.fn(async () => undefined),
  useKeepAwake: jest.fn(),
}));

jest.mock('expo-store-review', () => ({
  isAvailableAsync: jest.fn(async () => true),
  requestReview: jest.fn(async () => undefined),
}));
