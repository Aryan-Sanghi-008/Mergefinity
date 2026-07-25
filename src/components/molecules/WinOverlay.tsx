/**
 * @file WinOverlay.tsx
 * @layer components/molecules
 * @description Win modal — Keep Going / New Game.
 */

import { memo, useMemo } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/atoms';
import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY } from '@/styles';

export interface WinOverlayProps {
  /** Whether the overlay is visible. */
  visible: boolean;
  /** Continue past 2048. */
  onContinue: () => void;
  /** Start a new game. */
  onNewGame: () => void;
}

/**
 * First-win celebration overlay (no emoji / confetti).
 */
const WinOverlay = memo(({ visible, onContinue, onNewGame }: WinOverlayProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.scrim}>
        <View style={styles.card} accessibilityViewIsModal>
          <Text style={styles.title} allowFontScaling={false}>
            {STRINGS.WIN_TITLE}
          </Text>
          <Text style={styles.sub} allowFontScaling={false}>
            {STRINGS.WIN_SUB}
          </Text>
          <View style={styles.actions}>
            <PrimaryButton label={STRINGS.CONTINUE} onPress={onContinue} />
            <PrimaryButton label={STRINGS.NEW_GAME} onPress={onNewGame} />
          </View>
        </View>
      </View>
    </Modal>
  );
});

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
