/**
 * @file _layout.tsx
 * @layer app
 * @description Tab navigator layout for game and settings screens.
 */
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

import { STRINGS } from '@/constants';
import { THEME } from '@/styles/theme';

/**
 * Bottom tab layout (thin — navigation only).
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: THEME.colors.text,
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: STRINGS.GAME_TITLE, tabBarLabel: STRINGS.TAB_GAME }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: STRINGS.SETTINGS_TITLE, tabBarLabel: STRINGS.TAB_SETTINGS }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: THEME.colors.background,
  },
  tabBar: {
    backgroundColor: THEME.colors.background,
  },
});
