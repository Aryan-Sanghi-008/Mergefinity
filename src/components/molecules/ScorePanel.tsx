/**
 * @file ScorePanel.tsx
 * @layer components/molecules
 * @description Score + best score side by side.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import {
  ScoreLabel,
  ScoreValue,
} from '@/components/atoms';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS } from '@/styles';

export interface ScorePanelProps {
  /** Current score (static or shared). */
  score: number | SharedValue<number>;
  /** Best score (static or shared). */
  bestScore: number | SharedValue<number>;
}

/**
 * Paired SCORE / BEST readout for the game header.
 */
const ScorePanel = memo(({ score, bestScore }: ScorePanelProps) => {
  const { theme } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          gap: SPACING_TOKENS.sm,
        },
        block: {
          minWidth: SPACING_TOKENS.TAP_TARGET_MIN * SPACING_TOKENS.LAYOUT_DOUBLE,
          paddingHorizontal: SPACING_TOKENS.sm,
          paddingVertical: SPACING_TOKENS.xs,
          borderRadius: SPACING_TOKENS.BUTTON_RADIUS,
          backgroundColor: theme.SCORE_BG,
          alignItems: 'center',
        },
      }),
    [theme.SCORE_BG],
  );

  return (
    <View style={styles.row}>
      <View style={styles.block}>
        <ScoreLabel kind="score" />
        <ScoreValue value={score} />
      </View>
      <View style={styles.block}>
        <ScoreLabel kind="best" />
        <ScoreValue value={bestScore} />
      </View>
    </View>
  );
});

ScorePanel.displayName = 'ScorePanel';

export { ScorePanel };
