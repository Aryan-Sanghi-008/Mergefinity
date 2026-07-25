/**
 * @file SettingsToggleRow.tsx
 * @layer components/molecules
 * @description Label + Switch row for settings gameplay toggles.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';

export interface SettingsToggleRowProps {
  /** Row label. */
  label: string;
  /** Current value. */
  value: boolean;
  /** Change handler. */
  onValueChange: (next: boolean) => void;
  /** TalkBack label override. */
  accessibilityLabel?: string;
}

/**
 * Full-width settings toggle meeting 44dp tap target.
 */
const SettingsToggleRow = memo(
  ({ label, value, onValueChange, accessibilityLabel }: SettingsToggleRowProps) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const stateLabel = value ? STRINGS.SETTINGS_ON : STRINGS.SETTINGS_OFF;

    return (
      <View style={styles.row}>
        <Text style={styles.label} allowFontScaling={false}>
          {label}
        </Text>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: theme.DIVIDER,
            true: theme.ACCENT,
          }}
          thumbColor={theme.BUTTON_TEXT}
          accessibilityRole="switch"
          accessibilityLabel={accessibilityLabel ?? `${label}, ${stateLabel}`}
          accessibilityState={{ checked: value }}
        />
      </View>
    );
  },
);

SettingsToggleRow.displayName = 'SettingsToggleRow';

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    row: {
      width: '100%',
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: SPACING_TOKENS.xs,
    },
    label: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_PRIMARY,
      flexShrink: 1,
      marginRight: SPACING_TOKENS.sm,
    },
  });
}

export { SettingsToggleRow };
