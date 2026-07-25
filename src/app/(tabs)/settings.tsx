/**
 * @file settings.tsx
 * @layer app
 * @description Settings — haptics, themes, system dark, reset stats (P-08 / P-11 / P-13).
 */

import { Link } from 'expo-router';
import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  ConfirmDialog,
  SettingsToggleRow,
} from '@/components/molecules';
import { STRINGS } from '@/constants';
import {
  useHapticsEnabled,
  useSetHapticsEnabled,
} from '@/hooks/useSettings';
import { useResetStats } from '@/hooks/useStats';
import { useThemePreference } from '@/hooks/useThemePreference';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';
import type { ThemeName } from '@/types';

const THEME_LABELS: Record<ThemeName, string> = {
  classic: STRINGS.THEME_CLASSIC,
  dark: STRINGS.THEME_DARK,
  midnight: STRINGS.THEME_MIDNIGHT,
  obsidian: STRINGS.THEME_OBSIDIAN,
  ivory: STRINGS.THEME_IVORY,
};

/**
 * Settings screen — gameplay + theme entry + stats reset.
 */
const SettingsScreen = memo(() => {
  const { theme } = useTheme();
  const hapticsEnabled = useHapticsEnabled();
  const setHapticsEnabled = useSetHapticsEnabled();
  const resetStats = useResetStats();
  const {
    savedTheme,
    followSystemDark,
    setFollowSystemDark,
  } = useThemePreference();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const onHapticsChange = useCallback(
    (next: boolean) => {
      setHapticsEnabled(next);
    },
    [setHapticsEnabled],
  );

  const onSystemDarkChange = useCallback(
    (next: boolean) => {
      setFollowSystemDark(next);
    },
    [setFollowSystemDark],
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
        <Text style={styles.currentTheme} allowFontScaling={false}>
          {`${STRINGS.SETTINGS_CURRENT_THEME}: ${THEME_LABELS[savedTheme]}`}
        </Text>
        <Link href="/themes" asChild>
          <Pressable
            style={styles.labButton}
            accessibilityRole="button"
            accessibilityLabel={STRINGS.THEME_OPEN_PICKER}
          >
            <Text style={styles.labButtonText} allowFontScaling={false}>
              {STRINGS.THEME_OPEN_PICKER}
            </Text>
          </Pressable>
        </Link>
        <SettingsToggleRow
          label={STRINGS.SETTINGS_SYSTEM_DARK}
          value={followSystemDark}
          onValueChange={onSystemDarkChange}
        />
        {__DEV__ ? (
          <Link href="/theme-lab" asChild>
            <Pressable
              style={styles.devLink}
              accessibilityRole="button"
              accessibilityLabel={STRINGS.THEME_LAB_OPEN}
            >
              <Text style={styles.devLinkText} allowFontScaling={false}>
                {STRINGS.THEME_LAB_OPEN}
              </Text>
            </Pressable>
          </Link>
        ) : null}
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
    currentTheme: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_PRIMARY,
      marginBottom: SPACING_TOKENS.sm,
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
      marginBottom: SPACING_TOKENS.md,
    },
    labButtonText: {
      ...TYPOGRAPHY.body,
      color: theme.BUTTON_TEXT,
      fontFamily: TYPOGRAPHY.score.fontFamily,
    },
    devLink: {
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      justifyContent: 'center',
      marginTop: SPACING_TOKENS.sm,
    },
    devLinkText: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_MUTED,
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
