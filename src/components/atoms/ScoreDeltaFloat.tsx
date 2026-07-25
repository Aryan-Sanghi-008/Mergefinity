/**
 * @file ScoreDeltaFloat.tsx
 * @layer components/atoms
 * @description Floating +N label over the score panel.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY } from '@/styles';

export interface ScoreDeltaFloatProps {
  /** Points gained this move. */
  amount: number;
  /** Whether the float is mounted. */
  visible: boolean;
  /** Reanimated translate / opacity style. */
  animatedStyle: StyleProp<ViewStyle>;
}

/**
 * Brief +N reward float (P-07).
 */
const ScoreDeltaFloat = memo(
  ({ amount, visible, animatedStyle }: ScoreDeltaFloatProps) => {
    const { theme } = useTheme();
    const styles = useMemo(
      () =>
        StyleSheet.create({
          wrap: {
            position: 'absolute',
            right: SPACING_TOKENS.sm,
            top: 0,
          },
          label: {
            ...TYPOGRAPHY.score,
            color: theme.ACCENT,
          },
        }),
      [theme.ACCENT],
    );

    if (!visible || amount <= 0) {
      return null;
    }

    return (
      <Animated.View style={[styles.wrap, animatedStyle]} importantForAccessibility="no">
        <Text style={styles.label} allowFontScaling={false}>
          {`${STRINGS.SCORE_DELTA_PREFIX}${amount}`}
        </Text>
      </Animated.View>
    );
  },
);

ScoreDeltaFloat.displayName = 'ScoreDeltaFloat';

export { ScoreDeltaFloat };
