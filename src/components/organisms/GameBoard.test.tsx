/**
 * @file GameBoard.test.tsx
 * @layer components/organisms
 * @description GameBoard renders a full Classic grid (P-18).
 */

import { render, screen } from '@testing-library/react-native';
import { useSharedValue } from 'react-native-reanimated';
import { View } from 'react-native';

import { ThemeProvider } from '@/context/ThemeContext';
import { STRINGS } from '@/constants';
import type { BoardTileEntity } from '@/types';

import { GameBoard } from './GameBoard';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ),
);

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View: RNView } = require('react-native');
  return {
    GestureHandlerRootView: ({ children }: { children: React.ReactNode }) =>
      React.createElement(RNView, null, children),
    GestureDetector: ({ children }: { children: React.ReactNode }) =>
      React.createElement(RNView, null, children),
    Gesture: {
      Pan: () => ({
        maxPointers: () => ({
          minDistance: () => ({
            minVelocity: () => ({
              onEnd: () => ({}),
            }),
          }),
        }),
      }),
    },
  };
});

function BoardHarness({ tiles }: { tiles: BoardTileEntity[] }) {
  const lock = useSharedValue(false);
  return (
    <View>
      <ThemeProvider>
        <GameBoard
          tiles={tiles}
          onSwipe={jest.fn()}
          animationLock={lock}
          edgePulseStyle={{}}
          cellCount={4}
        />
      </ThemeProvider>
    </View>
  );
}

describe('GameBoard', () => {
  it('exposes the board a11y label and 16 background cells', async () => {
    await render(<BoardHarness tiles={[]} />);
    expect(screen.getByLabelText(STRINGS.A11Y_BOARD)).toBeTruthy();
    expect(screen.getAllByLabelText(STRINGS.A11Y_EMPTY_CELL)).toHaveLength(16);
  });
});