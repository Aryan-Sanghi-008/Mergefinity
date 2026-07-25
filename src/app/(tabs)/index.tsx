/**
 * @file index.tsx
 * @layer app
 * @description Game screen — animated board, swipe, overlays (P-07).
 */

import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { GameOverOverlay, WinOverlay } from '@/components/molecules';
import { GameBoard, GameControls, GameHeader } from '@/components/organisms';
import { useDemoGame } from '@/hooks/useDemoGame';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, type ThemeTokens } from '@/styles';

/**
 * Home / game screen — composes organisms; state via `useDemoGame` until P-09.
 */
const GameScreen = memo(() => {
  const { theme } = useTheme();
  const game = useDemoGame();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <GameHeader
        score={game.scoreValue}
        bestScore={game.bestScoreValue}
        scoreDeltaAmount={game.scoreDelta.amount}
        scoreDeltaVisible={game.scoreDelta.visible}
        scoreDeltaStyle={game.scoreDelta.animatedStyle as object}
      />
      <View style={styles.boardSlot}>
        <GameBoard
          tiles={game.tiles}
          onSwipe={game.onMove}
          animationLock={game.animationLock}
          edgePulseStyle={game.edgePulse.animatedStyle}
        />
      </View>
      <GameControls
        onNewGame={game.onNewGame}
        onUndo={game.onUndo}
        undoDisabled={game.undoDisabled}
        undoRemaining={game.undoRemaining}
      />
      <WinOverlay
        visible={game.status === 'won'}
        onContinue={game.onContinue}
        onNewGame={game.onNewGame}
      />
      <GameOverOverlay
        visible={game.status === 'lost'}
        finalScore={game.score}
        onTryAgain={game.onNewGame}
        onNewGame={game.onNewGame}
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
