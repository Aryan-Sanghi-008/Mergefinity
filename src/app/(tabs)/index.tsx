/**
 * @file index.tsx
 * @layer app
 * @description Game screen — header + square board + controls (P-06).
 */

import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { GameBoard, GameControls, GameHeader } from '@/components/organisms';
import { useDemoGame } from '@/hooks/useDemoGame';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, type ThemeTokens } from '@/styles';

/**
 * Home / game screen — composes organisms; state via `useDemoGame` until P-09.
 */
const GameScreen = memo(() => {
  const { theme } = useTheme();
  const {
    board,
    score,
    bestScore,
    undoRemaining,
    undoDisabled,
    onNewGame,
    onUndo,
  } = useDemoGame();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <GameHeader score={score} bestScore={bestScore} />
      <View style={styles.boardSlot}>
        <GameBoard board={board} />
      </View>
      <GameControls
        onNewGame={onNewGame}
        onUndo={onUndo}
        undoDisabled={undoDisabled}
        undoRemaining={undoRemaining}
      />
    </View>
  );
});

GameScreen.displayName = 'GameScreen';

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: theme.SURFACE,
      paddingVertical: SPACING_TOKENS.sm,
    },
    boardSlot: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

export default GameScreen;
