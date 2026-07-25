/**
 * @file SettingsLinkRow.tsx
 * @layer components/molecules
 * @description Label + chevron row for settings navigation stubs (P-14).
 */

import { memo, useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';

export interface SettingsLinkRowProps {
  /** Row label. */
  label: string;
  /** Press handler. */
  onPress: () => void;
  /** TalkBack label (defaults to `label`). */
  accessibilityLabel?: string;
}

/**
 * Full-width settings link meeting 44dp tap target.
 */
const SettingsLinkRow = memo(
  ({ label, onPress, accessibilityLabel }: SettingsLinkRowProps) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
      <Pressable
        style={styles.row}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
      >
        <Text style={styles.label} allowFontScaling={false}>
          {label}
        </Text>
        <Text style={styles.chevron} allowFontScaling={false}>
          ›
        </Text>
      </Pressable>
    );
  },
);

SettingsLinkRow.displayName = 'SettingsLinkRow';

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    row: {
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    label: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_PRIMARY,
      flexShrink: 1,
    },
    chevron: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_MUTED,
      marginLeft: SPACING_TOKENS.sm,
    },
  });
}

export { SettingsLinkRow };
