/**
 * @file GameOverOverlay.tsx
 * @layer components/molecules
 * @description Full-screen dimmed game-over modal.
 */

import { memo, useMemo } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/atoms';
import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY } from '@/styles';

export interface GameOverOverlayProps {
  /** Whether the overlay is visible. */
  visible: boolean;
  /** Final score to display. */
  finalScore: number;
  /** Try again (restart same mode). */
  onTryAgain: () => void;
  /** Explicit new game action. */
  onNewGame: () => void;
}

/**
 * Game-over scrim with score and primary actions.
 */
const GameOverOverlay = memo(
  ({ visible, finalScore, onTryAgain, onNewGame }: GameOverOverlayProps) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
      <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.scrim}>
          <View style={styles.card} accessibilityViewIsModal>
            <Text style={styles.title} allowFontScaling={false}>
              {STRINGS.GAME_OVER_TITLE}
            </Text>
            <Text style={styles.sub} allowFontScaling={false}>
              {STRINGS.GAME_OVER_SUB}
            </Text>
            <Text style={styles.score} allowFontScaling={false}>
              {finalScore}
            </Text>
            <View style={styles.actions}>
              <PrimaryButton label={STRINGS.TRY_AGAIN} onPress={onTryAgain} />
              <PrimaryButton label={STRINGS.NEW_GAME} onPress={onNewGame} />
            </View>
          </View>
        </View>
      </Modal>
    );
  },
);

GameOverOverlay.displayName = 'GameOverOverlay';

function createStyles(theme: {
  OVERLAY: string;
  SURFACE: string;
  TEXT_PRIMARY: string;
  TEXT_MUTED: string;
}) {
  return StyleSheet.create({
    scrim: {
      flex: 1,
      backgroundColor: theme.OVERLAY,
      alignItems: 'center',
      justifyContent: 'center',
      padding: SPACING_TOKENS.SCREEN_PADDING,
    },
    card: {
      width: '100%',
      backgroundColor: theme.SURFACE,
      borderRadius: SPACING_TOKENS.CARD_RADIUS,
      padding: SPACING_TOKENS.lg,
      gap: SPACING_TOKENS.sm,
    },
    title: {
      ...TYPOGRAPHY.title,
      color: theme.TEXT_PRIMARY,
      textAlign: 'center',
    },
    sub: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_MUTED,
      textAlign: 'center',
    },
    score: {
      ...TYPOGRAPHY.score,
      color: theme.TEXT_PRIMARY,
      textAlign: 'center',
      marginVertical: SPACING_TOKENS.sm,
    },
    actions: {
      gap: SPACING_TOKENS.sm,
      marginTop: SPACING_TOKENS.sm,
    },
  });
}

export { GameOverOverlay };
