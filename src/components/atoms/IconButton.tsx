/**
 * @file IconButton.tsx
 * @layer components/atoms
 * @description 44×44dp icon pressable with geometric glyph.
 */

import * as Haptics from 'expo-haptics';
import { memo, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, type GestureResponderEvent } from 'react-native';

import { IconGlyph } from '@/components/atoms/glyphs';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS } from '@/styles';
import type { IconName } from '@/types';

export interface IconButtonProps {
  /** Icon glyph name. */
  name: IconName;
  /** Press handler. */
  onPress: (event: GestureResponderEvent) => void;
  /** TalkBack label (required). */
  accessibilityLabel: string;
  /** Disabled state. */
  disabled?: boolean;
  /** Glyph color override. */
  color?: string;
}

/**
 * Square icon button meeting minimum tap target size.
 */
const IconButton = memo(
  ({
    name,
    onPress,
    accessibilityLabel,
    disabled = false,
    color,
  }: IconButtonProps) => {
    const { theme } = useTheme();
    const styles = useMemo(
      () => createStyles(disabled),
      [disabled],
    );

    const handlePress = useCallback(
      (event: GestureResponderEvent) => {
        if (disabled) {
          return;
        }
        void Haptics.selectionAsync();
        onPress(event);
      },
      [disabled, onPress],
    );

    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        style={styles.button}
      >
        <IconGlyph name={name} color={color ?? theme.TEXT_PRIMARY} />
      </Pressable>
    );
  },
);

IconButton.displayName = 'IconButton';

function createStyles(disabled: boolean) {
  return StyleSheet.create({
    button: {
      width: SPACING_TOKENS.TAP_TARGET_MIN,
      height: SPACING_TOKENS.TAP_TARGET_MIN,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? SPACING_TOKENS.OPACITY_DISABLED : 1,
    },
  });
}

export { IconButton };
