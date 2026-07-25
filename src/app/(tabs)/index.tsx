/**
 * @file index.tsx
 * @layer app
 * @description Game screen — thin shell pending Phase 4 organisms.
 */
import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';

/**
 * Home / game screen placeholder.
 */
const GameScreen = memo(() => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.title} allowFontScaling={false}>
        {STRINGS.GAME_TITLE}
      </Text>
      <Text style={styles.hint} allowFontScaling={false}>
        {STRINGS.SWIPE_HINT}
      </Text>
    </View>
  );
});

GameScreen.displayName = 'GameScreen';

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.SURFACE,
      padding: SPACING_TOKENS.SCREEN_PADDING,
    },
    title: {
      ...TYPOGRAPHY.title,
      color: theme.TEXT_PRIMARY,
      marginBottom: SPACING_TOKENS.sm,
    },
    hint: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_MUTED,
    },
  });
}

export default GameScreen;
