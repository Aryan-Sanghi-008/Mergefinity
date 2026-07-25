/**
 * @file ScoreLabel.tsx
 * @layer components/atoms
 * @description Small muted SCORE / BEST label.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { TYPOGRAPHY } from '@/styles';

export type ScoreLabelKind = 'score' | 'best';

export interface ScoreLabelProps {
  /** Which score field this labels. */
  kind: ScoreLabelKind;
}

/**
 * Renders SCORE or BEST in small caps / tracked label style.
 */
const ScoreLabel = memo(({ kind }: ScoreLabelProps) => {
  const { theme } = useTheme();
  const label = kind === 'score' ? STRINGS.SCORE_LABEL : STRINGS.BEST_LABEL;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        text: {
          ...TYPOGRAPHY.scoreLabel,
          color: theme.TEXT_MUTED,
          textTransform: 'uppercase',
        },
      }),
    [theme.TEXT_MUTED],
  );

  return (
    <Text style={styles.text} allowFontScaling={false} accessibilityRole="text">
      {label}
    </Text>
  );
});

ScoreLabel.displayName = 'ScoreLabel';

export { ScoreLabel };
