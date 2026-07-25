/**
 * @file index.tsx
 * @layer app
 * @description Game screen — modes, board, timer, overlays (P-10 / P-14).
 */

import { useRouter } from 'expo-router';
import { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TimerReadout } from '@/components/atoms';
import {
  AchievementToast,
  ConfirmDialog,
  GameOverOverlay,
  ModeSelector,
  WinOverlay,
} from '@/components/molecules';
import { GameBoard, GameControls, GameHeader } from '@/components/organisms';
import { STRINGS } from '@/constants';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useGameMode } from '@/hooks/useGameMode';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, type ThemeTokens } from '@/styles';

/**
 * Home / game screen — zero game logic; hooks own store + motion.
 */
const GameScreen = memo(() => {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const game = useGameEngine();
  const modeApi = useGameMode();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const winTitle = game.isTimeUpWin ? STRINGS.TIME_UP_TITLE : STRINGS.WIN_TITLE;
  const winSub = game.isTimeUpWin ? STRINGS.TIME_UP_SUB : STRINGS.WIN_SUB;

  const onSettingsPress = useCallback(() => {
    router.push('/settings');
  }, [router]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + SPACING_TOKENS.sm,
        },
      ]}
    >
      <GameHeader
        score={game.scoreValue}
        bestScore={game.bestScoreValue}
        scoreDeltaAmount={game.scoreDelta.amount}
        scoreDeltaVisible={game.scoreDelta.visible}
        scoreDeltaStyle={game.scoreDelta.animatedStyle as object}
        onSettingsPress={onSettingsPress}
      />
      <ModeSelector
        selected={modeApi.mode}
        onSelect={modeApi.requestModeChange}
      />
      {game.hasTimer ? (
        <View style={styles.timerRow}>
          <TimerReadout remainingMs={game.timerRemaining} />
        </View>
      ) : null}
      <View style={styles.boardSlot}>
        <GameBoard
          tiles={game.tiles}
          onSwipe={game.onMove}
          animationLock={game.animationLock}
          edgePulseStyle={game.edgePulse.animatedStyle}
          cellCount={game.cellCount}
        />
      </View>
      <GameControls
        onNewGame={game.onNewGame}
        onUndo={game.onUndo}
        undoDisabled={game.undoDisabled}
        {...(game.undoRemaining > 0 ? { undoRemaining: game.undoRemaining } : {})}
      />
      <WinOverlay
        visible={game.status === 'won'}
        title={winTitle}
        subtitle={winSub}
        showContinue={!game.isTimeUpWin}
        {...(!game.isTimeUpWin ? { onContinue: game.onContinue } : {})}
        onNewGame={game.onNewGame}
      />
      <GameOverOverlay
        visible={game.status === 'lost'}
        finalScore={game.score}
        onTryAgain={game.onNewGame}
        onNewGame={game.onNewGame}
      />
      <ConfirmDialog
        visible={modeApi.pendingMode !== null}
        title={STRINGS.MODE_SWITCH_CONFIRM}
        message={STRINGS.MODE_SWITCH_CONFIRM_SUB}
        onConfirm={modeApi.confirmModeChange}
        onCancel={modeApi.cancelModeChange}
      />
      <AchievementToast
        achievementId={game.achievementToastId}
        onDismiss={game.onAchievementToastDismiss}
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
      gap: SPACING_TOKENS.sm,
    },
    timerRow: {
      alignItems: 'center',
    },
    boardSlot: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

export default GameScreen;
