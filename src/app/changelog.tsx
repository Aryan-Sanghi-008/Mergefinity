/**
 * @file changelog.tsx
 * @layer app
 * @description In-app changelog from constants (P-19).
 */

import { Stack, useRouter } from 'expo-router';
import { memo, useCallback, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CHANGELOG_ENTRIES, STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';

/**
 * Changelog modal — curated release notes.
 */
const ChangelogScreen = memo(() => {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + SPACING_TOKENS.sm,
          paddingBottom: insets.bottom + SPACING_TOKENS.SCREEN_PADDING,
        },
      ]}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={STRINGS.A11Y_BACK}
          style={styles.back}
        >
          <Text style={styles.backText} allowFontScaling={false}>
            {STRINGS.A11Y_BACK}
          </Text>
        </Pressable>
        <Text style={styles.title} allowFontScaling={false}>
          {STRINGS.CHANGELOG_TITLE}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {CHANGELOG_ENTRIES.map((entry) => (
          <View key={entry.version} style={styles.entry}>
            <Text style={styles.version} allowFontScaling={false}>
              {`v${entry.version}`}
            </Text>
            <Text style={styles.date} allowFontScaling={false}>
              {entry.date}
            </Text>
            {entry.highlights.map((line) => (
              <Text key={line} style={styles.bullet} allowFontScaling={false}>
                {`• ${line}`}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
});

ChangelogScreen.displayName = 'ChangelogScreen';

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.SURFACE,
      paddingHorizontal: SPACING_TOKENS.SCREEN_PADDING,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING_TOKENS.md,
      marginBottom: SPACING_TOKENS.lg,
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
    },
    back: {
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      justifyContent: 'center',
      paddingRight: SPACING_TOKENS.sm,
    },
    backText: {
      ...TYPOGRAPHY.body,
      color: theme.ACCENT,
    },
    title: {
      ...TYPOGRAPHY.title,
      color: theme.TEXT_PRIMARY,
      flex: 1,
    },
    scroll: {
      gap: SPACING_TOKENS.lg,
      paddingBottom: SPACING_TOKENS.xl,
    },
    entry: {
      gap: SPACING_TOKENS.xs,
    },
    version: {
      ...TYPOGRAPHY.title,
      color: theme.TEXT_PRIMARY,
    },
    date: {
      ...TYPOGRAPHY.scoreLabel,
      color: theme.TEXT_MUTED,
      marginBottom: SPACING_TOKENS.xs,
    },
    bullet: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_PRIMARY,
    },
  });
}

export default ChangelogScreen;
