/**
 * @file settings.tsx
 * @layer app
 * @description Settings screen — thin shell with link to theme lab (P-04).
 */
import { Link } from 'expo-router';
import { memo, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';

/**
 * Settings screen placeholder.
 */
const SettingsScreen = memo(() => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.title} allowFontScaling={false}>
        {STRINGS.SETTINGS_TITLE}
      </Text>
      <Text style={styles.sub} allowFontScaling={false}>
        {STRINGS.SETTINGS_PLACEHOLDER}
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
  );
});

SettingsScreen.displayName = 'SettingsScreen';

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.SURFACE,
      padding: SPACING_TOKENS.SCREEN_PADDING,
    },
    title: {
      ...TYPOGRAPHY.title,
      color: theme.TEXT_PRIMARY,
      marginBottom: SPACING_TOKENS.sm,
    },
    sub: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_MUTED,
      marginBottom: SPACING_TOKENS.lg,
      textAlign: 'center',
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
    },
    labButtonText: {
      ...TYPOGRAPHY.body,
      color: theme.BUTTON_TEXT,
      fontFamily: TYPOGRAPHY.score.fontFamily,
    },
  });
}

export default SettingsScreen;
