/**
 * @file GameOverOverlay.test.tsx
 * @layer components/molecules
 * @description Game over overlay visibility (P-18).
 */

import { render, screen } from '@testing-library/react-native';

import { ThemeProvider } from '@/context/ThemeContext';
import { STRINGS } from '@/constants';

import { GameOverOverlay } from './GameOverOverlay';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ),
);

describe('GameOverOverlay', () => {
  it('shows title and score when status is lost (visible)', async () => {
    await render(
      <ThemeProvider>
        <GameOverOverlay
          visible
          finalScore={1234}
          onTryAgain={jest.fn()}
          onNewGame={jest.fn()}
        />
      </ThemeProvider>,
    );
    expect(screen.getByText(STRINGS.GAME_OVER_TITLE)).toBeTruthy();
    expect(screen.getByText('1234')).toBeTruthy();
    expect(screen.getByText(STRINGS.TRY_AGAIN)).toBeTruthy();
  });
});
