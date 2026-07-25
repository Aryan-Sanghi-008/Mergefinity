/**
 * @file settings.tsx
 * @layer app
 * @description Settings — haptics, theme lab, reset statistics (P-08 / P-11).
 */

import { Link } from 'expo-router';
import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ConfirmDialog, SettingsToggleRow } from '@/components/molecules';
import { STRINGS } from '@/constants';
import {
  useHapticsEnabled,
  useSetHapticsEnabled,
} from '@/hooks/useSettings';
import { useResetStats } from '@/hooks/useStats';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';

/**
 * Settings screen — haptics toggle + stats reset.
 */
const SettingsScreen = memo(() => {
  const { theme } = useTheme();
  const hapticsEnabled = useHapticsEnabled();
  const setHapticsEnabled = useSetHapticsEnabled();
  const resetStats = useResetStats();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const onHapticsChange = useCallback(
    (next: boolean) => {
      setHapticsEnabled(next);
    },
    [setHapticsEnabled],
  );

  const onResetPress = useCallback(() => {
    setConfirmVisible(true);
  }, []);

  const onCancelReset = useCallback(() => {
    setConfirmVisible(false);
  }, []);

  const onConfirmReset = useCallback(() => {
    resetStats();
    setConfirmVisible(false);
  }, [resetStats]);

  return (
    <View style={styles.container}>
      <Text style={styles.title} allowFontScaling={false}>
        {STRINGS.SETTINGS_TITLE}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle} allowFontScaling={false}>
          {STRINGS.SETTINGS_SECTION_GAMEPLAY}
        </Text>
        <SettingsToggleRow
          label={STRINGS.SETTINGS_HAPTICS}
          value={hapticsEnabled}
          onValueChange={onHapticsChange}
        />
        <Pressable
          style={styles.resetButton}
          onPress={onResetPress}
          accessibilityRole="button"
          accessibilityLabel={STRINGS.SETTINGS_RESET_STATS}
        >
          <Text style={styles.resetButtonText} allowFontScaling={false}>
            {STRINGS.SETTINGS_RESET_STATS}
          </Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle} allowFontScaling={false}>
          {STRINGS.SETTINGS_SECTION_THEME}
        </Text>
        <Link href="/theme-lab" asChild>
          <Pressable
            style={styles.labButton}
            accessibilityRole="button"
            accessibilityLabel={STRINGS.THEME_LAB_OPEN}
          >
            <Text style={styles.labButtonText} allowFontScaling={false}>
              {STRINGS.THEME_LAB_OPEN}
            </Text>
          </Pressable>
        </Link>
      </View>

      <ConfirmDialog
        visible={confirmVisible}
        title={STRINGS.SETTINGS_RESET_STATS_CONFIRM_TITLE}
        message={STRINGS.SETTINGS_RESET_STATS_CONFIRM}
        onConfirm={onConfirmReset}
        onCancel={onCancelReset}
      />
    </View>
  );
});

SettingsScreen.displayName = 'SettingsScreen';

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.SURFACE,
      padding: SPACING_TOKENS.SCREEN_PADDING,
    },
    title: {
      ...TYPOGRAPHY.title,
      color: theme.TEXT_PRIMARY,
      marginBottom: SPACING_TOKENS.lg,
    },
    section: {
      marginBottom: SPACING_TOKENS.xl,
    },
    sectionTitle: {
      ...TYPOGRAPHY.scoreLabel,
      color: theme.TEXT_MUTED,
      marginBottom: SPACING_TOKENS.sm,
      textTransform: 'uppercase',
    },
    labButton: {
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      minWidth: SPACING_TOKENS.TAP_TARGET_MIN,
      paddingHorizontal: SPACING_TOKENS.lg,
      paddingVertical: SPACING_TOKENS.sm,
      borderRadius: SPACING_TOKENS.BUTTON_RADIUS,
      backgroundColor: theme.BUTTON_BG,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
    },
    labButtonText: {
      ...TYPOGRAPHY.body,
      color: theme.BUTTON_TEXT,
      fontFamily: TYPOGRAPHY.score.fontFamily,
    },
    resetButton: {
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      justifyContent: 'center',
      marginTop: SPACING_TOKENS.sm,
    },
    resetButtonText: {
      ...TYPOGRAPHY.body,
      color: theme.ACCENT,
    },
  });
}

export default SettingsScreen;
