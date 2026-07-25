/**
 * @file PurchaseSheet.tsx
 * @layer components/molecules
 * @description Bottom purchase sheet with loading state (P-16).
 */

import { memo, useMemo } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';

export type PurchaseSheetVariant = 'themebundle' | 'removeads';

export interface PurchaseSheetProps {
  /** Whether the sheet is visible. */
  visible: boolean;
  /** Product variant. */
  variant: PurchaseSheetVariant;
  /** True while purchase is processing. */
  loading?: boolean;
  /** Confirm purchase. */
  onConfirm: () => void;
  /** Dismiss without purchasing. */
  onCancel: () => void;
}

/**
 * Bottom sheet for Remove Ads / Theme Bundle purchases.
 */
const PurchaseSheet = memo(
  ({
    visible,
    variant,
    loading = false,
    onConfirm,
    onCancel,
  }: PurchaseSheetProps) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const title =
      variant === 'removeads'
        ? STRINGS.PURCHASE_REMOVE_ADS_TITLE
        : STRINGS.PURCHASE_THEMES_TITLE;
    const body =
      variant === 'removeads'
        ? STRINGS.PURCHASE_REMOVE_ADS_BODY
        : STRINGS.PURCHASE_THEMES_BODY;
    const confirmLabel =
      variant === 'removeads'
        ? STRINGS.PURCHASE_REMOVE_ADS_CONFIRM
        : STRINGS.PURCHASE_THEMES_CONFIRM;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={loading ? undefined : onCancel}
      >
        <Pressable
          style={styles.scrim}
          onPress={loading ? undefined : onCancel}
          accessibilityRole="button"
          accessibilityLabel={STRINGS.CANCEL}
        />
        <View
          style={[
            styles.sheet,
            { paddingBottom: insets.bottom + SPACING_TOKENS.lg },
          ]}
          accessibilityViewIsModal
        >
          <Text style={styles.title} allowFontScaling={false}>
            {title}
          </Text>
          <Text style={styles.body} allowFontScaling={false}>
            {body}
          </Text>
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={theme.ACCENT} />
              <Text style={styles.loadingText} allowFontScaling={false}>
                {STRINGS.PURCHASE_LOADING}
              </Text>
            </View>
          ) : (
            <View style={styles.actions}>
              <Pressable
                style={styles.secondary}
                onPress={onCancel}
                accessibilityRole="button"
                accessibilityLabel={STRINGS.CANCEL}
              >
                <Text style={styles.secondaryText} allowFontScaling={false}>
                  {STRINGS.CANCEL}
                </Text>
              </Pressable>
              <Pressable
                style={styles.primary}
                onPress={onConfirm}
                accessibilityRole="button"
                accessibilityLabel={confirmLabel}
              >
                <Text style={styles.primaryText} allowFontScaling={false}>
                  {confirmLabel}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    );
  },
);

PurchaseSheet.displayName = 'PurchaseSheet';

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    scrim: {
      ...StyleSheet.absoluteFill,
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    sheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.SURFACE,
      borderTopLeftRadius: SPACING_TOKENS.CARD_RADIUS,
      borderTopRightRadius: SPACING_TOKENS.CARD_RADIUS,
      paddingHorizontal: SPACING_TOKENS.SCREEN_PADDING,
      paddingTop: SPACING_TOKENS.lg,
      gap: SPACING_TOKENS.md,
    },
    title: {
      ...TYPOGRAPHY.title,
      color: theme.TEXT_PRIMARY,
    },
    body: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_MUTED,
    },
    loadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING_TOKENS.sm,
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
    },
    loadingText: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_MUTED,
    },
    actions: {
      flexDirection: 'row',
      gap: SPACING_TOKENS.sm,
      marginTop: SPACING_TOKENS.sm,
    },
    primary: {
      flex: 1,
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      borderRadius: SPACING_TOKENS.BUTTON_RADIUS,
      backgroundColor: theme.BUTTON_BG,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: SPACING_TOKENS.md,
    },
    primaryText: {
      ...TYPOGRAPHY.body,
      color: theme.BUTTON_TEXT,
      fontFamily: TYPOGRAPHY.score.fontFamily,
    },
    secondary: {
      flex: 1,
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      borderRadius: SPACING_TOKENS.BUTTON_RADIUS,
      borderWidth: SPACING_TOKENS.DIVIDER_THICKNESS,
      borderColor: theme.DIVIDER,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: SPACING_TOKENS.md,
    },
    secondaryText: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_PRIMARY,
    },
  });
}

export { PurchaseSheet };
