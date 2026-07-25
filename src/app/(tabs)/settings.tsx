/**
 * @file settings.tsx
 * @layer app
 * @description Settings screen — thin shell pending Phase 5 polish.
 */
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { STRINGS } from '@/constants';
import { THEME } from '@/styles/theme';

/**
 * Settings screen placeholder.
 */
const SettingsScreen = memo(() => (
  <View style={styles.container}>
    <Text style={styles.title} allowFontScaling={false}>
      {STRINGS.SETTINGS_TITLE}
    </Text>
    <Text style={styles.sub} allowFontScaling={false}>
      {STRINGS.SETTINGS_PLACEHOLDER}
    </Text>
  </View>
));

SettingsScreen.displayName = 'SettingsScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.background,
    padding: THEME.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
  },
  sub: {
    fontSize: 14,
    color: THEME.colors.textMuted,
  },
});

export default SettingsScreen;
