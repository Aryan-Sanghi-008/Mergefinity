/**
 * @file theme-lab.tsx
 * @layer app
 * @description P-04 test screen — live ThemeName swap without rebuild.
 */
import { router } from 'expo-router';
import { memo, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import {
  getTileFontSize,
  SPACING_TOKENS,
  THEME_LAB_PREVIEW_VALUES,
  TYPOGRAPHY,
  type ThemeTokens,
} from '@/styles';
import type { ThemeName } from '@/types';

const THEME_OPTIONS: { name: ThemeName; label: string }[] = [
  { name: 'classic', label: STRINGS.THEME_CLASSIC },
  { name: 'dark', label: STRINGS.THEME_DARK },
  { name: 'midnight', label: STRINGS.THEME_MIDNIGHT },
  { name: 'obsidian', label: STRINGS.THEME_OBSIDIAN },
  { name: 'ivory', label: STRINGS.THEME_IVORY },
];

const PREVIEW_2 = THEME_LAB_PREVIEW_VALUES[0]!;
const PREVIEW_8 = THEME_LAB_PREVIEW_VALUES[1]!;
const PREVIEW_2048 = THEME_LAB_PREVIEW_VALUES[2]!;
const PREVIEW_MAX = THEME_LAB_PREVIEW_VALUES[3]!;

/**
 * Theme lab — verifies token swap across surface, board, and tiles.
 */
const ThemeLabScreen = memo(() => {
  const { theme, themeName, setThemeName } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top + SPACING_TOKENS.SCREEN_PADDING,
          paddingBottom: insets.bottom + SPACING_TOKENS.SCREEN_PADDING,
        },
      ]}
    >
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel={STRINGS.A11Y_BACK}
        style={styles.back}
      >
        <Text style={styles.backText} allowFontScaling={false}>
          {STRINGS.A11Y_BACK}
        </Text>
      </Pressable>

      <Text style={styles.title} allowFontScaling={false}>
        {STRINGS.THEME_LAB_TITLE}
      </Text>
      <Text style={styles.hint} allowFontScaling={false}>
        {STRINGS.THEME_LAB_HINT}
      </Text>

      <View style={styles.board}>
        <View style={styles.tile2}>
          <Text style={styles.tileText2} allowFontScaling={false}>
            {PREVIEW_2}
          </Text>
        </View>
        <View style={styles.tile8}>
          <Text style={styles.tileText8} allowFontScaling={false}>
            {PREVIEW_8}
          </Text>
        </View>
        <View style={styles.tile2048}>
          <Text style={styles.tileText2048} allowFontScaling={false}>
            {PREVIEW_2048}
          </Text>
        </View>
        <View style={styles.tileMax}>
          <Text style={styles.tileTextMax} allowFontScaling={false}>
            {PREVIEW_MAX}
          </Text>
        </View>
      </View>

      <View style={styles.options}>
        {THEME_OPTIONS.map((option) => {
          const selected = option.name === themeName;
          return (
            <Pressable
              key={option.name}
              onPress={() => setThemeName(option.name)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={option.label}
              style={selected ? styles.optionSelected : styles.option}
            >
              <Text
                style={selected ? styles.optionTextSelected : styles.optionText}
                allowFontScaling={false}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
});

ThemeLabScreen.displayName = 'ThemeLabScreen';

function createStyles(theme: ThemeTokens) {
  const tileBase = {
    width: SPACING_TOKENS.TILE_SIZE,
    height: SPACING_TOKENS.TILE_SIZE,
    borderRadius: SPACING_TOKENS.TILE_RADIUS,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    elevation: theme.elevation.TILE_ELEVATION,
  };

  const textBase = {
    ...TYPOGRAPHY.tileValue,
  };

  return StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: theme.SURFACE,
      paddingHorizontal: SPACING_TOKENS.SCREEN_PADDING,
    },
    back: {
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      justifyContent: 'center',
      marginBottom: SPACING_TOKENS.md,
    },
    backText: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_SECONDARY,
    },
    title: {
      ...TYPOGRAPHY.title,
      color: theme.TEXT_PRIMARY,
      marginBottom: SPACING_TOKENS.xs,
    },
    hint: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_MUTED,
      marginBottom: SPACING_TOKENS.lg,
    },
    board: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: theme.BOARD_BG,
      borderRadius: SPACING_TOKENS.BOARD_RADIUS,
      padding: SPACING_TOKENS.BOARD_PADDING,
      gap: SPACING_TOKENS.TILE_GAP,
      marginBottom: SPACING_TOKENS.xl,
      elevation: theme.elevation.BOARD_ELEVATION,
      shadowColor: theme.elevation.shadowColor,
      shadowOpacity: theme.elevation.shadowOpacity,
      shadowRadius: theme.elevation.shadowRadius,
      shadowOffset: theme.elevation.shadowOffset,
    },
    tile2: {
      ...tileBase,
      backgroundColor: theme.TILE_BG[PREVIEW_2],
    },
    tile8: {
      ...tileBase,
      backgroundColor: theme.TILE_BG[PREVIEW_8],
    },
    tile2048: {
      ...tileBase,
      backgroundColor: theme.TILE_BG[PREVIEW_2048],
    },
    tileMax: {
      ...tileBase,
      backgroundColor: theme.TILE_BG[PREVIEW_MAX],
    },
    tileText2: {
      ...textBase,
      color: theme.TILE_TEXT[PREVIEW_2],
      fontSize: getTileFontSize(PREVIEW_2),
    },
    tileText8: {
      ...textBase,
      color: theme.TILE_TEXT[PREVIEW_8],
      fontSize: getTileFontSize(PREVIEW_8),
    },
    tileText2048: {
      ...textBase,
      color: theme.TILE_TEXT[PREVIEW_2048],
      fontSize: getTileFontSize(PREVIEW_2048),
    },
    tileTextMax: {
      ...textBase,
      color: theme.TILE_TEXT[PREVIEW_MAX],
      fontSize: getTileFontSize(PREVIEW_MAX),
    },
    options: {
      gap: SPACING_TOKENS.sm,
    },
    option: {
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      borderRadius: SPACING_TOKENS.BUTTON_RADIUS,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.DIVIDER,
      paddingHorizontal: SPACING_TOKENS.md,
      justifyContent: 'center',
      backgroundColor: theme.SURFACE,
    },
    optionSelected: {
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      borderRadius: SPACING_TOKENS.BUTTON_RADIUS,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.BUTTON_BG,
      paddingHorizontal: SPACING_TOKENS.md,
      justifyContent: 'center',
      backgroundColor: theme.BUTTON_BG,
    },
    optionText: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_PRIMARY,
    },
    optionTextSelected: {
      ...TYPOGRAPHY.body,
      color: theme.BUTTON_TEXT,
    },
  });
}

export default ThemeLabScreen;
