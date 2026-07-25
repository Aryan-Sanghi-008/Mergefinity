/**
 * @file themes.tsx
 * @layer app
 * @description Theme picker — free + premium with preview unlock (P-13).
 */

import { Stack, useRouter } from 'expo-router';
import { memo, useCallback, useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PurchaseSheet, ThemePreviewCard } from '@/components/molecules';
import { STRINGS } from '@/constants';
import { useThemePreference } from '@/hooks/useThemePreference';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';
import type { ThemeName } from '@/types';
import { isPremiumTheme, THEME_PICKER_ORDER } from '@/utils/themeResolve';

const COLUMN_COUNT = 2;

const THEME_LABELS: Record<ThemeName, string> = {
  classic: STRINGS.THEME_CLASSIC,
  dark: STRINGS.THEME_DARK,
  midnight: STRINGS.THEME_MIDNIGHT,
  obsidian: STRINGS.THEME_OBSIDIAN,
  ivory: STRINGS.THEME_IVORY,
};

/**
 * Themes screen — thin composition of picker cards + purchase stub.
 */
const ThemesScreen = memo(() => {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {
    savedTheme,
    hasPremiumThemes,
    purchaseSheetVisible,
    isPreviewing,
    isPurchasing,
    selectTheme,
    confirmPurchase,
    cancelPurchase,
  } = useThemePreference();

  const onBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + SPACING_TOKENS.sm,
          paddingBottom: insets.bottom,
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
          {STRINGS.THEMES_TITLE}
        </Text>
      </View>
      {isPreviewing ? (
        <Text style={styles.previewHint} allowFontScaling={false}>
          {STRINGS.THEME_PREVIEW_HINT}
        </Text>
      ) : null}
      <FlatList
        data={[...THEME_PICKER_ORDER]}
        keyExtractor={(item) => item}
        numColumns={COLUMN_COUNT}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const locked = isPremiumTheme(item) && !hasPremiumThemes;
          return (
            <View style={styles.cardSlot}>
              <ThemePreviewCard
                themeName={item}
                label={THEME_LABELS[item]}
                selected={savedTheme === item}
                locked={locked}
                onPress={() => selectTheme(item)}
              />
            </View>
          );
        }}
      />
      <PurchaseSheet
        visible={purchaseSheetVisible}
        variant="themebundle"
        loading={isPurchasing}
        onConfirm={confirmPurchase}
        onCancel={cancelPurchase}
      />
    </View>
  );
});

ThemesScreen.displayName = 'ThemesScreen';

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
    previewHint: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_MUTED,
      marginBottom: SPACING_TOKENS.sm,
    },
    list: {
      paddingBottom: SPACING_TOKENS.xl * SPACING_TOKENS.LAYOUT_DOUBLE,
      gap: SPACING_TOKENS.sm,
    },
    row: {
      gap: SPACING_TOKENS.sm,
    },
    cardSlot: {
      flex: 1,
    },
  });
}

export default ThemesScreen;
