/**
 * @file _layout.tsx
 * @layer app
 * @description Tab navigator — Game / Statistics / Achievements (P-14).
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
        headerShown: false,
        tabBarActiveTintColor: theme.BUTTON_BG,
        tabBarInactiveTintColor: theme.TEXT_MUTED,
        tabBarStyle: styles.tabBar,
        freezeOnBlur: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: STRINGS.GAME_TITLE,
          tabBarLabel: STRINGS.TAB_GAME,
          lazy: false,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: STRINGS.STATS_TITLE,
          tabBarLabel: STRINGS.TAB_STATISTICS,
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: STRINGS.ACHIEVEMENTS_TITLE,
          tabBarLabel: STRINGS.TAB_ACHIEVEMENTS,
        }}
      />
    </Tabs>
  );
}

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    tabBar: {
      backgroundColor: theme.SURFACE,
      borderTopColor: theme.DIVIDER,
    },
  });
}
