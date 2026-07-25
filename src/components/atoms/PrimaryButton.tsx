/**
 * @file PrimaryButton.tsx
 * @layer components/atoms
 * @description Themed primary pressable with haptic, disabled, and loading states.
 */

import * as Haptics from 'expo-haptics';
import { memo, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
} from 'react-native';

import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY } from '@/styles';

export interface PrimaryButtonProps {
  /** Button label. */
  label: string;
  /** Press handler. */
  onPress: (event: GestureResponderEvent) => void;
  /** Disabled state. */
  disabled?: boolean;
  /** Shows a spinner and blocks presses. */
  loading?: boolean;
  /** Accessibility label override. */
  accessibilityLabel?: string;
}

/**
 * Full-width-friendly primary action button.
 */
const PrimaryButton = memo(
  ({
    label,
    onPress,
    disabled = false,
    loading = false,
    accessibilityLabel,
  }: PrimaryButtonProps) => {
    const { theme } = useTheme();
    const isDisabled = disabled || loading;
    const styles = useMemo(
      () => createStyles(theme.BUTTON_BG, theme.BUTTON_TEXT, isDisabled),
      [theme, isDisabled],
    );

    const handlePress = useCallback(
      (event: GestureResponderEvent) => {
        if (isDisabled) {
          return;
        }
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(event);
      },
      [isDisabled, onPress],
    );

    return (
      <Pressable
        onPress={handlePress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        accessibilityLabel={accessibilityLabel ?? label}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color={theme.BUTTON_TEXT} accessibilityLabel={STRINGS.LOADING} />
        ) : (
          <Text style={styles.label} allowFontScaling={false}>
            {label}
          </Text>
        )}
      </Pressable>
    );
  },
);

PrimaryButton.displayName = 'PrimaryButton';

function createStyles(backgroundColor: string, color: string, disabled: boolean) {
  return StyleSheet.create({
    button: {
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      paddingHorizontal: SPACING_TOKENS.lg,
      paddingVertical: SPACING_TOKENS.sm,
      borderRadius: SPACING_TOKENS.BUTTON_RADIUS,
      backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? SPACING_TOKENS.OPACITY_DISABLED : 1,
    },
    label: {
      ...TYPOGRAPHY.body,
      fontFamily: TYPOGRAPHY.score.fontFamily,
      color,
    },
  });
}

export { PrimaryButton };
