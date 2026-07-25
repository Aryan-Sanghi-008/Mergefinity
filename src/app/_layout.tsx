/**
 * @file _layout.tsx
 * @layer app
 * @description Root layout — theme, audio, ads consent, IAP sync (P-14–P-16).
 */
import { useEffect } from 'react';
import { Alert, AppState, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { STRINGS } from '@/constants';
import { ThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/hooks/useTheme';
import { setConsentPrompter } from '@/utils/ads.utils';
import { syncPurchases } from '@/utils/iap.utils';
import { SoundManager } from '@/utils/sound.utils';

/**
 * Status bar synced to active theme luminance.
 */
function ThemedStatusBar() {
  const { themeName } = useTheme();
  const lightContent =
    themeName === 'dark' || themeName === 'midnight' || themeName === 'obsidian';
  return <StatusBar style={lightContent ? 'light' : 'dark'} />;
}

/**
 * Preloads SFX once at app start (P-15 latency DoD).
 */
function AudioBootstrap() {
  useEffect(() => {
    void SoundManager.preload();
  }, []);
  return null;
}

/**
 * Consent UI bridge + foreground purchase sync (P-16).
 */
function MonetizationBootstrap() {
  useEffect(() => {
    setConsentPrompter(
      () =>
        new Promise<'personalized' | 'non_personalized'>((resolve) => {
          Alert.alert(STRINGS.ADS_CONSENT_TITLE, STRINGS.ADS_CONSENT_BODY, [
            {
              text: STRINGS.ADS_CONSENT_DECLINE,
              style: 'cancel',
              onPress: () => resolve('non_personalized'),
            },
            {
              text: STRINGS.ADS_CONSENT_ALLOW,
              onPress: () => resolve('personalized'),
            },
          ]);
        }),
    );
    return () => {
      setConsentPrompter(null);
    };
  }, []);

  useEffect(() => {
    void syncPurchases();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void syncPurchases();
      }
    });
    return () => sub.remove();
  }, []);

  return null;
}

/**
 * Root application layout.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider>
        <AudioBootstrap />
        <MonetizationBootstrap />
        <ThemedStatusBar />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
          <Stack.Screen name="about" options={{ presentation: 'modal' }} />
          <Stack.Screen name="themes" />
          <Stack.Screen name="theme-lab" />
          <Stack.Screen name="game" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
