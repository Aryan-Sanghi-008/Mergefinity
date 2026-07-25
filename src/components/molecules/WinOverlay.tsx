/**
 * @file WinOverlay.tsx
 * @layer components/molecules
 * @description Win / time-up modal with Reanimated enter + card scale overshoot.
 */

import { memo, useMemo } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { PrimaryButton } from '@/components/atoms';
import { STRINGS } from '@/constants';
import { useOverlayAnimation } from '@/hooks/useOverlayAnimation';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY } from '@/styles';

export interface WinOverlayProps {
  /** Whether the overlay is visible. */
  visible: boolean;
  /** Continue past tile win (hidden for Time Attack expiry). */
  onContinue?: () => void;
  /** Start a new game. */
  onNewGame: () => void;
  /** Optional title override. */
  title?: string;
  /** Optional subtitle override. */
  subtitle?: string;
  /** Show Keep Going (default true when onContinue provided). */
  showContinue?: boolean;
}

/**
 * First-win / time-up celebration overlay (no emoji / confetti).
 */
const WinOverlay = memo(
  ({
    visible,
    onContinue,
    onNewGame,
    title = STRINGS.WIN_TITLE,
    subtitle = STRINGS.WIN_SUB,
    showContinue = true,
  }: WinOverlayProps) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const { scrimStyle, cardStyle } = useOverlayAnimation({
      visible,
      withScaleOvershoot: true,
    });
    const canContinue = showContinue && onContinue !== undefined;

    return (
      <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
        <Animated.View style={[styles.scrim, scrimStyle as object]}>
          <Animated.View
            style={[styles.card, cardStyle as object]}
            accessibilityViewIsModal
          >
            <Text style={styles.title} allowFontScaling={false}>
              {title}
            </Text>
            <Text style={styles.sub} allowFontScaling={false}>
              {subtitle}
            </Text>
            <View style={styles.actions}>
              {canContinue ? (
                <PrimaryButton label={STRINGS.CONTINUE} onPress={onContinue} />
              ) : null}
              <PrimaryButton label={STRINGS.NEW_GAME} onPress={onNewGame} />
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  },
);

WinOverlay.displayName = 'WinOverlay';

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
    actions: {
      gap: SPACING_TOKENS.sm,
      marginTop: SPACING_TOKENS.sm,
    },
  });
}

export { WinOverlay };
