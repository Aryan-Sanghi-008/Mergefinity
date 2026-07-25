/**
 * @file ControlBar.tsx
 * @layer components/molecules
 * @description New game + undo controls.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IconButton, PrimaryButton } from '@/components/atoms';
import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPE_SCALE, TYPOGRAPHY } from '@/styles';

export interface ControlBarProps {
  /** Start a new game. */
  onNewGame: () => void;
  /** Undo last move. */
  onUndo: () => void;
  /** When true, undo is disabled. */
  undoDisabled: boolean;
  /** Remaining undos to show as a badge (omit when zero/undefined). */
  undoRemaining?: number;
}

/**
 * Control row beneath the board.
 */
const ControlBar = memo(
  ({ onNewGame, onUndo, undoDisabled, undoRemaining }: ControlBarProps) => {
    const { theme } = useTheme();
    const styles = useMemo(
      () =>
        StyleSheet.create({
          row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: SPACING_TOKENS.md,
            paddingHorizontal: SPACING_TOKENS.SCREEN_PADDING,
          },
          undoWrap: {
            position: 'relative',
          },
          badge: {
            position: 'absolute',
            top: 0,
            right: 0,
            minWidth: SPACING_TOKENS.sm * SPACING_TOKENS.LAYOUT_DOUBLE,
            paddingHorizontal: SPACING_TOKENS.xs,
            borderRadius: SPACING_TOKENS.sm,
            backgroundColor: theme.ACCENT,
            alignItems: 'center',
          },
          badgeText: {
            ...TYPOGRAPHY.body,
            fontSize: TYPE_SCALE.caption,
            color: theme.BUTTON_TEXT,
          },
          newGame: {
            flex: 1,
          },
        }),
      [theme],
    );

    const showBadge =
      undoRemaining !== undefined && undoRemaining > 0 && !undoDisabled;

    return (
      <View style={styles.row}>
        <View style={styles.newGame}>
          <PrimaryButton
            label={STRINGS.NEW_GAME}
            onPress={onNewGame}
            accessibilityLabel={STRINGS.A11Y_NEW_GAME}
          />
        </View>
        <View style={styles.undoWrap}>
          <IconButton
            name="undo"
            onPress={onUndo}
            disabled={undoDisabled}
            accessibilityLabel={STRINGS.A11Y_UNDO}
          />
          {showBadge ? (
            <View style={styles.badge} importantForAccessibility="no">
              <Text style={styles.badgeText} allowFontScaling={false}>
                {undoRemaining}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  },
);

ControlBar.displayName = 'ControlBar';

export { ControlBar };
