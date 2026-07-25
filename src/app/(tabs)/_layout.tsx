/**
 * @file _layout.tsx
 * @layer app
 * @description Tab navigator layout for game and settings screens.
 */
import { Tabs } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import type { ThemeTokens } from '@/styles';

/**
 * Bottom tab layout (thin — navigation only).
 */
export default function TabsLayout() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Tabs
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: theme.TEXT_PRIMARY,
        tabBarActiveTintColor: theme.BUTTON_BG,
        tabBarInactiveTintColor: theme.TEXT_MUTED,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: STRINGS.GAME_TITLE, tabBarLabel: STRINGS.TAB_GAME }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: STRINGS.STATS_TITLE,
          tabBarLabel: STRINGS.TAB_STATISTICS,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: STRINGS.SETTINGS_TITLE, tabBarLabel: STRINGS.TAB_SETTINGS }}
      />
    </Tabs>
  );
}

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    header: {
      backgroundColor: theme.SURFACE,
    },
    tabBar: {
      backgroundColor: theme.SURFACE,
      borderTopColor: theme.DIVIDER,
    },
  });
}
