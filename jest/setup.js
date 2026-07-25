/**
 * Jest setup — native module mocks shared across suites (P-18).
 * Worklets must be mocked before Reanimated loads (Reanimated 4).
 */

jest.mock('react-native-worklets', () =>
  require('react-native-worklets/src/mock'),
);

require('react-native-reanimated').setUpTests();

jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(async () => ({
        sound: {
          playAsync: jest.fn(async () => undefined),
          setPositionAsync: jest.fn(async () => undefined),
          setRateAsync: jest.fn(async () => undefined),
          stopAsync: jest.fn(async () => undefined),
        },
      })),
    },
    setAudioModeAsync: jest.fn(async () => undefined),
  },
}));

jest.mock('expo-keep-awake', () => ({
  activateKeepAwakeAsync: jest.fn(async () => undefined),
  deactivateKeepAwake: jest.fn(async () => undefined),
  useKeepAwake: jest.fn(),
}));
