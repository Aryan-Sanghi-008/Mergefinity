/**
 * @file about.tsx
 * @layer app
 * @description About — version, build, credits, privacy stub (P-14).
 */

import Constants from 'expo-constants';
import { Stack, useRouter } from 'expo-router';
import { memo, useCallback, useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SettingsLinkRow } from '@/components/molecules';
import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';

/**
 * About screen — thin info sheet from Settings INFO.
 */
const AboutScreen = memo(() => {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const appVersion =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '1.0.0';
  const buildNumber =
    Constants.nativeBuildVersion ?? Constants.expoConfig?.ios?.buildNumber;

  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  const onPrivacyStub = useCallback(() => {
    Alert.alert(STRINGS.SETTINGS_PRIVACY, STRINGS.ABOUT_PRIVACY_STUB);
  }, []);

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
          {STRINGS.ABOUT_TITLE}
        </Text>
      </View>

      <Text style={styles.credits} allowFontScaling={false}>
        {STRINGS.ABOUT_CREDITS}
      </Text>
      <Text style={styles.meta} allowFontScaling={false}>
        {`${STRINGS.SETTINGS_VERSION} ${appVersion}`}
      </Text>
      {buildNumber ? (
        <Text style={styles.meta} allowFontScaling={false}>
          {`${STRINGS.ABOUT_BUILD_PREFIX}${buildNumber}`}
        </Text>
      ) : null}

      <View style={styles.section}>
        <SettingsLinkRow
          label={STRINGS.SETTINGS_PRIVACY}
          onPress={onPrivacyStub}
        />
      </View>
    </View>
  );
});

AboutScreen.displayName = 'AboutScreen';

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
    credits: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_PRIMARY,
      marginBottom: SPACING_TOKENS.md,
    },
    meta: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_MUTED,
      marginBottom: SPACING_TOKENS.xs,
    },
    section: {
      marginTop: SPACING_TOKENS.xl,
    },
  });
}

export default AboutScreen;
