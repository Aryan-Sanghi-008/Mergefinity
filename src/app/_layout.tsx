/**
 * @file _layout.tsx
 * @layer app
 * @description Root layout — GestureHandlerRootView, ThemeProvider, audio preload (P-14 / P-15).
 */
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/hooks/useTheme';
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
 * Root application layout.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider>
        <AudioBootstrap />
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
