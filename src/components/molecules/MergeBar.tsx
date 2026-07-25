/**
 * @file MergeBar.tsx
 * @layer components/molecules
 * @description Horizontal merge-count bar for the statistics histogram.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';
import type { CellValue } from '@/types';

const BAR_MIN_FRACTION = 0.04;
const PERCENT = 100;

export interface MergeBarProps {
  /** Tile value label. */
  value: CellValue;
  /** Merge count. */
  count: number;
  /** Width fraction 0–1 relative to the max bar. */
  fraction: number;
}

/**
 * Label + scaled horizontal bar (no chart library).
 */
const MergeBar = memo(({ value, count, fraction }: MergeBarProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const widthPercent = Math.max(fraction, BAR_MIN_FRACTION) * PERCENT;

  return (
    <View
      style={styles.row}
      accessibilityLabel={`${value}, ${count}`}
    >
      <Text style={styles.label} allowFontScaling={false}>
        {value}
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${widthPercent}%` }]} />
      </View>
      <Text style={styles.count} allowFontScaling={false}>
        {count}
      </Text>
    </View>
  );
});

MergeBar.displayName = 'MergeBar';

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      gap: SPACING_TOKENS.sm,
    },
    label: {
      ...TYPOGRAPHY.body,
      fontFamily: TYPOGRAPHY.score.fontFamily,
      color: theme.TEXT_MUTED,
      width: SPACING_TOKENS.xl + SPACING_TOKENS.sm,
      textAlign: 'right',
    },
    track: {
      flex: 1,
      height: SPACING_TOKENS.md,
      borderRadius: SPACING_TOKENS.xs,
      backgroundColor: theme.SCORE_BG,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: SPACING_TOKENS.xs,
      backgroundColor: theme.ACCENT,
    },
    count: {
      ...TYPOGRAPHY.body,
      fontFamily: TYPOGRAPHY.score.fontFamily,
      color: theme.TEXT_PRIMARY,
      minWidth: SPACING_TOKENS.xl,
      textAlign: 'right',
    },
  });
}

export { MergeBar };
