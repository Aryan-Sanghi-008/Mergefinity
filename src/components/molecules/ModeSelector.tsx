/**
 * @file ModeSelector.tsx
 * @layer components/molecules
 * @description Horizontal pill row for game mode selection.
 */

import { memo, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY } from '@/styles';
import type { GameMode } from '@/types';

const MODE_OPTIONS: { mode: GameMode; label: string }[] = [
  { mode: 'classic', label: STRINGS.MODE_CLASSIC },
  { mode: 'endless', label: STRINGS.MODE_ENDLESS },
  { mode: 'challenge', label: STRINGS.MODE_CHALLENGE },
  { mode: 'time-attack', label: STRINGS.MODE_TIME_ATTACK },
];

export interface ModeSelectorProps {
  /** Currently selected mode. */
  selected: GameMode;
  /** Mode change handler. */
  onSelect: (mode: GameMode) => void;
}

/**
 * Scrollable mode pills above the board.
 */
const ModeSelector = memo(({ selected, onSelect }: ModeSelectorProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist"
    >
      {MODE_OPTIONS.map((option) => {
        const isSelected = option.mode === selected;
        return (
          <Pressable
            key={option.mode}
            onPress={() => onSelect(option.mode)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={option.label}
            style={isSelected ? styles.pillSelected : styles.pill}
          >
            <Text
              style={isSelected ? styles.pillTextSelected : styles.pillText}
              allowFontScaling={false}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
});

ModeSelector.displayName = 'ModeSelector';

function createStyles(theme: {
  BUTTON_BG: string;
  BUTTON_TEXT: string;
  DIVIDER: string;
  SURFACE: string;
  TEXT_PRIMARY: string;
}) {
  const pillBase = {
    minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
    paddingHorizontal: SPACING_TOKENS.md,
    borderRadius: SPACING_TOKENS.TAP_TARGET_MIN / SPACING_TOKENS.LAYOUT_DOUBLE,
    borderWidth: SPACING_TOKENS.DIVIDER_THICKNESS,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: SPACING_TOKENS.sm,
      paddingHorizontal: SPACING_TOKENS.SCREEN_PADDING,
    },
    pill: {
      ...pillBase,
      borderColor: theme.DIVIDER,
      backgroundColor: theme.SURFACE,
    },
    pillSelected: {
      ...pillBase,
      borderColor: theme.BUTTON_BG,
      backgroundColor: theme.BUTTON_BG,
    },
    pillText: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_PRIMARY,
    },
    pillTextSelected: {
      ...TYPOGRAPHY.body,
      color: theme.BUTTON_TEXT,
    },
  });
}

export { ModeSelector };
