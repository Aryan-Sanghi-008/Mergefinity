/**
 * @file StatRow.tsx
 * @layer components/molecules
 * @description Label + right-aligned value row for statistics.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY } from '@/styles';

export interface StatRowProps {
  /** Left label. */
  label: string;
  /** Right value. */
  value: string;
}

/**
 * Single statistics row.
 */
const StatRow = memo(({ label, value }: StatRowProps) => {
  const { theme } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
          paddingVertical: SPACING_TOKENS.xs,
        },
        label: {
          ...TYPOGRAPHY.body,
          color: theme.TEXT_MUTED,
          flex: 1,
          paddingRight: SPACING_TOKENS.sm,
        },
        value: {
          ...TYPOGRAPHY.body,
          fontFamily: TYPOGRAPHY.score.fontFamily,
          color: theme.TEXT_PRIMARY,
        },
      }),
    [theme],
  );

  return (
    <View style={styles.row} accessibilityLabel={`${label}, ${value}`}>
      <Text style={styles.label} allowFontScaling={false}>
        {label}
      </Text>
      <Text style={styles.value} allowFontScaling={false}>
        {value}
      </Text>
    </View>
  );
});

StatRow.displayName = 'StatRow';

export { StatRow };
