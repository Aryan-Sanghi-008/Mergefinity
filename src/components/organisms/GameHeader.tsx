/**
 * @file GameHeader.tsx
 * @layer components/organisms
 * @description Game title (left) + ScorePanel (right).
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ScorePanel } from '@/components/molecules';
import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';

export interface GameHeaderProps {
  /** Current score. */
  score: number;
  /** Best score. */
  bestScore: number;
}

/**
 * Minimal chrome above the board — title + scores.
 */
const GameHeader = memo(({ score, bestScore }: GameHeaderProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.row}>
      <Text style={styles.title} allowFontScaling={false}>
        {STRINGS.GAME_TITLE}
      </Text>
      <ScorePanel score={score} bestScore={bestScore} />
    </View>
  );
});

GameHeader.displayName = 'GameHeader';

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    row: {
      width: '100%',
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING_TOKENS.SCREEN_PADDING,
    },
    title: {
      ...TYPOGRAPHY.title,
      color: theme.TEXT_PRIMARY,
      flexShrink: 1,
      marginRight: SPACING_TOKENS.sm,
    },
  });
}

export { GameHeader };
