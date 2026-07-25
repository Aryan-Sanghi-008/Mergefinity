/**
 * @file index.tsx
 * @layer app
 * @description Game screen — thin shell pending Phase 4 organisms.
 */
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { STRINGS } from '@/constants';
import { THEME } from '@/styles/theme';

/**
 * Home / game screen placeholder.
 */
const GameScreen = memo(() => (
  <View style={styles.container}>
    <Text style={styles.title} allowFontScaling={false}>
      {STRINGS.GAME_TITLE}
    </Text>
    <Text style={styles.hint} allowFontScaling={false}>
      {STRINGS.SWIPE_HINT}
    </Text>
  </View>
));

GameScreen.displayName = 'GameScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.background,
    padding: THEME.spacing.lg,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
  },
  hint: {
    fontSize: 16,
    color: THEME.colors.textMuted,
  },
});

export default GameScreen;
