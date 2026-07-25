/**
 * @file index.tsx
 * @layer app
 * @description Game screen — modes, board, timer, overlays, onboarding (P-10 / P-14 / P-19).
 */

import { useFocusEffect, useRouter } from 'expo-router';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TimerReadout } from '@/components/atoms';
import {
  AchievementToast,
  ConfirmDialog,
  GameOverOverlay,
  ModeSelector,
  OnboardingOverlay,
  WinOverlay,
} from '@/components/molecules';
import {
  GameBoard,
  GameControls,
  GameErrorBoundary,
  GameHeader,
} from '@/components/organisms';
import { STRINGS } from '@/constants';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useGameMode } from '@/hooks/useGameMode';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, type ThemeTokens } from '@/styles';
import type { Direction } from '@/types';

const KEEP_AWAKE_TAG = 'mergefinity-game';

/**
 * Home / game screen — zero game logic; hooks own store + motion.
 */
const GameScreen = memo(() => {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const game = useGameEngine();
  const modeApi = useGameMode();
  const onboarding = useOnboarding();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const winTitle = game.isTimeUpWin ? STRINGS.TIME_UP_TITLE : STRINGS.WIN_TITLE;
  const winSub = game.isTimeUpWin ? STRINGS.TIME_UP_SUB : STRINGS.WIN_SUB;

  const onSettingsPress = useCallback(() => {
    router.push('/settings');
  }, [router]);

  const onSwipe = useCallback(
    (direction: Direction) => {
      if (onboarding.showOnboarding) {
        void onboarding.completeOnboarding();
      }
      game.onMove(direction);
    },
    [game, onboarding],
  );

  useFocusEffect(
    useCallback(() => {
      void activateKeepAwakeAsync(KEEP_AWAKE_TAG);
      return () => {
        void deactivateKeepAwake(KEEP_AWAKE_TAG);
      };
    }, []),
  );

  return (
    <GameErrorBoundary
      surfaceColor={theme.SURFACE}
      textColor={theme.TEXT_PRIMARY}
      mutedColor={theme.TEXT_MUTED}
    >
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
            onSwipe={onSwipe}
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
        <OnboardingOverlay visible={onboarding.showOnboarding} />
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
    </GameErrorBoundary>
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
      position: 'relative',
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
