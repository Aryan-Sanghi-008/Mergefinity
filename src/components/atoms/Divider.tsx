/**
 * @file Divider.tsx
 * @layer components/atoms
 * @description Hairline divider using theme DIVIDER color.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS } from '@/styles';

export interface DividerProps {
  /** Line orientation. */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Renders a 0.5dp theme-colored divider.
 */
const Divider = memo(({ orientation = 'horizontal' }: DividerProps) => {
  const { theme } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        horizontal: {
          height: SPACING_TOKENS.DIVIDER_THICKNESS,
          alignSelf: 'stretch',
          backgroundColor: theme.DIVIDER,
        },
        vertical: {
          width: SPACING_TOKENS.DIVIDER_THICKNESS,
          alignSelf: 'stretch',
          backgroundColor: theme.DIVIDER,
        },
      }),
    [theme.DIVIDER],
  );

  return (
    <View
      style={orientation === 'horizontal' ? styles.horizontal : styles.vertical}
      importantForAccessibility="no"
    />
  );
});

Divider.displayName = 'Divider';

export { Divider };
