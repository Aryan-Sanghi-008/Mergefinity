/**
 * @file settings.tsx
 * @layer app
 * @description Settings sheet — theme, gameplay, info stubs (P-14).
 */

import Constants from 'expo-constants';
import { Link, Stack, useRouter } from 'expo-router';
import { memo, useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ConfirmDialog,
  PurchaseSheet,
  SettingsLinkRow,
  SettingsToggleRow,
} from '@/components/molecules';
import { STRINGS } from '@/constants';
import {
  useHapticsEnabled,
  useSetHapticsEnabled,
  useSetSoundEnabled,
  useSoundEnabled,
} from '@/hooks/useSettings';
import {
  useHasRemovedAds,
  usePurchaseActions,
} from '@/hooks/usePurchase';
import { useResetStats } from '@/hooks/useStats';
import { useThemePreference } from '@/hooks/useThemePreference';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';
import type { ThemeName } from '@/types';
import { Toast } from '@/components/atoms';

const THEME_LABELS: Record<ThemeName, string> = {
  classic: STRINGS.THEME_CLASSIC,
  dark: STRINGS.THEME_DARK,
  midnight: STRINGS.THEME_MIDNIGHT,
  obsidian: STRINGS.THEME_OBSIDIAN,
  ivory: STRINGS.THEME_IVORY,
};

/**
 * Settings screen — pushed from GameHeader gear as a modal sheet.
 */
const SettingsScreen = memo(() => {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const hapticsEnabled = useHapticsEnabled();
  const setHapticsEnabled = useSetHapticsEnabled();
  const soundEnabled = useSoundEnabled();
  const setSoundEnabled = useSetSoundEnabled();
  const resetStats = useResetStats();
  const {
    savedTheme,
    followSystemDark,
    setFollowSystemDark,
  } = useThemePreference();
  const hasRemovedAds = useHasRemovedAds();
  const {
    isPurchasing,
    purchaseRemoveAds,
    restorePurchases,
  } = usePurchaseActions();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [removeAdsVisible, setRemoveAdsVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastTitle, setToastTitle] = useState('');
  const [toastBody, setToastBody] = useState('');
  const styles = useMemo(() => createStyles(theme), [theme]);

  const appVersion =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '1.0.0';

  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  const onHapticsChange = useCallback(
    (next: boolean) => {
      setHapticsEnabled(next);
    },
    [setHapticsEnabled],
  );

  const onSoundChange = useCallback(
    (next: boolean) => {
      setSoundEnabled(next);
    },
    [setSoundEnabled],
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

  const showToast = useCallback((title: string, body: string) => {
    setToastTitle(title);
    setToastBody(body);
    setToastVisible(true);
  }, []);

  const onRestore = useCallback(() => {
    void (async () => {
      try {
        const receipts = await restorePurchases();
        if (receipts.removeAds || receipts.themeBundle) {
          showToast(
            STRINGS.PURCHASE_SUCCESS_TITLE,
            STRINGS.PURCHASE_RESTORE_SUCCESS,
          );
        } else {
          showToast(
            STRINGS.PURCHASE_SUCCESS_TITLE,
            STRINGS.PURCHASE_RESTORE_EMPTY,
          );
        }
      } catch {
        showToast(STRINGS.PURCHASE_ERROR_TITLE, STRINGS.PURCHASE_ERROR_BODY);
      }
    })();
  }, [restorePurchases, showToast]);

  const onRemoveAdsPress = useCallback(() => {
    if (hasRemovedAds) {
      showToast(
        STRINGS.PURCHASE_SUCCESS_TITLE,
        STRINGS.PURCHASE_SUCCESS_REMOVE_ADS,
      );
      return;
    }
    setRemoveAdsVisible(true);
  }, [hasRemovedAds, showToast]);

  const onConfirmRemoveAds = useCallback(() => {
    void (async () => {
      try {
        await purchaseRemoveAds();
        setRemoveAdsVisible(false);
        showToast(
          STRINGS.PURCHASE_SUCCESS_TITLE,
          STRINGS.PURCHASE_SUCCESS_REMOVE_ADS,
        );
      } catch {
        showToast(STRINGS.PURCHASE_ERROR_TITLE, STRINGS.PURCHASE_ERROR_BODY);
      }
    })();
  }, [purchaseRemoveAds, showToast]);

  const onCancelRemoveAds = useCallback(() => {
    if (isPurchasing) {
      return;
    }
    setRemoveAdsVisible(false);
  }, [isPurchasing]);

  const showComingSoon = useCallback(() => {
    Alert.alert(
      STRINGS.SETTINGS_COMING_SOON_TITLE,
      STRINGS.SETTINGS_COMING_SOON_BODY,
    );
  }, []);

  const onPrivacy = useCallback(() => {
    router.push('/about');
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
          {STRINGS.SETTINGS_TITLE}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle} allowFontScaling={false}>
            {STRINGS.SETTINGS_SECTION_GAMEPLAY}
          </Text>
          <SettingsToggleRow
            label={STRINGS.SETTINGS_HAPTICS}
            value={hapticsEnabled}
            onValueChange={onHapticsChange}
          />
          <SettingsToggleRow
            label={STRINGS.SETTINGS_SOUND}
            value={soundEnabled}
            onValueChange={onSoundChange}
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
            {STRINGS.SETTINGS_SECTION_PURCHASES}
          </Text>
          <SettingsLinkRow
            label={STRINGS.SETTINGS_REMOVE_ADS}
            onPress={onRemoveAdsPress}
          />
          <SettingsLinkRow
            label={STRINGS.SETTINGS_RESTORE_PURCHASES}
            onPress={onRestore}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle} allowFontScaling={false}>
            {STRINGS.SETTINGS_SECTION_INFO}
          </Text>
          <SettingsLinkRow
            label={STRINGS.SETTINGS_RATE_APP}
            onPress={showComingSoon}
          />
          <SettingsLinkRow
            label={STRINGS.SETTINGS_PRIVACY}
            onPress={onPrivacy}
          />
          <SettingsLinkRow
            label={STRINGS.SETTINGS_LICENSES}
            onPress={showComingSoon}
          />
          <Text style={styles.version} allowFontScaling={false}>
            {`${STRINGS.SETTINGS_VERSION} ${appVersion}`}
          </Text>
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={confirmVisible}
        title={STRINGS.SETTINGS_RESET_STATS_CONFIRM_TITLE}
        message={STRINGS.SETTINGS_RESET_STATS_CONFIRM}
        onConfirm={onConfirmReset}
        onCancel={onCancelReset}
      />
      <PurchaseSheet
        visible={removeAdsVisible}
        variant="removeads"
        loading={isPurchasing}
        onConfirm={onConfirmRemoveAds}
        onCancel={onCancelRemoveAds}
      />
      <Toast
        visible={toastVisible}
        title={toastTitle}
        description={toastBody}
        onDismiss={() => setToastVisible(false)}
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
      paddingHorizontal: SPACING_TOKENS.SCREEN_PADDING,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING_TOKENS.md,
      marginBottom: SPACING_TOKENS.md,
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
    content: {
      paddingBottom: SPACING_TOKENS.xl,
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
    version: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_MUTED,
      marginTop: SPACING_TOKENS.sm,
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      textAlignVertical: 'center',
    },
  });
}

export default SettingsScreen;
