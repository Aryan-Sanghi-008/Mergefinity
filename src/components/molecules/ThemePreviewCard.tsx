/**
 * @file ThemePreviewCard.tsx
 * @layer components/molecules
 * @description Selectable theme card with 2×2 preview (P-13).
 */

import { memo, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemePreviewTile } from '@/components/molecules/ThemePreviewTile';
import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPE_SCALE, TYPOGRAPHY, type ThemeTokens } from '@/styles';
import type { ThemeName } from '@/types';

export interface ThemePreviewCardProps {
  /** Theme this card represents. */
  themeName: ThemeName;
  /** Display label. */
  label: string;
  /** Whether this theme is the saved/selected preference. */
  selected: boolean;
  /** Whether the theme is locked behind IAP. */
  locked: boolean;
  /** Press handler. */
  onPress: () => void;
}

/**
 * Theme picker card — preview tile + name + lock/selected affordances.
 */
const ThemePreviewCard = memo(
  ({ themeName, label, selected, locked, onPress }: ThemePreviewCardProps) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme, selected), [theme, selected]);

    const a11yParts = [label, 'theme'];
    if (selected) {
      a11yParts.push(STRINGS.A11Y_THEME_SELECTED);
    }
    if (locked) {
      a11yParts.push(STRINGS.A11Y_THEME_LOCKED);
    } else {
      a11yParts.push(STRINGS.A11Y_THEME_APPLY);
    }

    return (
      <Pressable
        style={styles.card}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected, disabled: false }}
        accessibilityLabel={a11yParts.join(', ')}
      >
        <View style={styles.header}>
          <Text style={styles.label} allowFontScaling={false}>
            {label}
          </Text>
          {selected ? (
            <Text style={styles.badge} allowFontScaling={false}>
              {STRINGS.THEME_SELECTED}
            </Text>
          ) : null}
          {locked ? (
            <Text style={styles.lock} allowFontScaling={false}>
              {STRINGS.THEME_LOCKED_IAP}
            </Text>
          ) : null}
        </View>
        <ThemePreviewTile themeName={themeName} />
      </Pressable>
    );
  },
);

ThemePreviewCard.displayName = 'ThemePreviewCard';

function createStyles(theme: ThemeTokens, selected: boolean) {
  return StyleSheet.create({
    card: {
      flex: 1,
      padding: SPACING_TOKENS.md,
      borderRadius: SPACING_TOKENS.CARD_RADIUS,
      borderWidth: selected ? SPACING_TOKENS.LAYOUT_DOUBLE * SPACING_TOKENS.DIVIDER_THICKNESS : SPACING_TOKENS.DIVIDER_THICKNESS,
      borderColor: selected ? theme.ACCENT : theme.DIVIDER,
      backgroundColor: theme.SURFACE,
      gap: SPACING_TOKENS.sm,
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN * SPACING_TOKENS.LAYOUT_TRIPLE,
    },
    header: {
      gap: SPACING_TOKENS.xs,
    },
    label: {
      ...TYPOGRAPHY.body,
      fontFamily: TYPOGRAPHY.score.fontFamily,
      color: theme.TEXT_PRIMARY,
    },
    badge: {
      ...TYPOGRAPHY.body,
      fontSize: TYPE_SCALE.caption,
      color: theme.ACCENT,
    },
    lock: {
      ...TYPOGRAPHY.body,
      fontSize: TYPE_SCALE.caption,
      color: theme.TEXT_MUTED,
    },
  });
}

export { ThemePreviewCard };
