/**
 * @file ScorePanel.test.tsx
 * @layer components/molecules
 * @description Score panel updates with numeric props (P-18).
 */

import { render, screen } from '@testing-library/react-native';

import { ThemeProvider } from '@/context/ThemeContext';
import { STRINGS } from '@/constants';

import { ScorePanel } from './ScorePanel';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual(
    '@react-native-async-storage/async-storage/jest/async-storage-mock',
  ),
);

describe('ScorePanel', () => {
  it('renders current and best scores', async () => {
    await render(
      <ThemeProvider>
        <ScorePanel score={42} bestScore={9001} />
      </ThemeProvider>,
    );
    expect(screen.getByText(STRINGS.SCORE_LABEL)).toBeTruthy();
    expect(screen.getByText(STRINGS.BEST_LABEL)).toBeTruthy();
    expect(screen.getByText('42')).toBeTruthy();
    expect(screen.getByText('9001')).toBeTruthy();
  });
});
