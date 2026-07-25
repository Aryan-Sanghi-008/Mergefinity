/**
 * @file ConfirmDialog.tsx
 * @layer components/molecules
 * @description Simple confirm / cancel modal (mode switch, restart).
 */

import { memo, useMemo } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/atoms';
import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY } from '@/styles';

export interface ConfirmDialogProps {
  /** Whether the dialog is visible. */
  visible: boolean;
  /** Title copy. */
  title: string;
  /** Supporting message. */
  message: string;
  /** Confirm action. */
  onConfirm: () => void;
  /** Cancel / dismiss. */
  onCancel: () => void;
  /** Confirm button label. */
  confirmLabel?: string;
  /** Cancel button label. */
  cancelLabel?: string;
}

/**
 * Centered confirm sheet over a dim scrim.
 */
const ConfirmDialog = memo(
  ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmLabel = STRINGS.CONFIRM,
    cancelLabel = STRINGS.CANCEL,
  }: ConfirmDialogProps) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
      <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.scrim}>
          <View style={styles.card} accessibilityViewIsModal>
            <Text style={styles.title} allowFontScaling={false}>
              {title}
            </Text>
            <Text style={styles.sub} allowFontScaling={false}>
              {message}
            </Text>
            <View style={styles.actions}>
              <PrimaryButton label={confirmLabel} onPress={onConfirm} haptic="medium" />
              <PrimaryButton label={cancelLabel} onPress={onCancel} haptic="none" />
            </View>
          </View>
        </View>
      </Modal>
    );
  },
);

ConfirmDialog.displayName = 'ConfirmDialog';

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

export { ConfirmDialog };
