/**
 * @file GameControls.tsx
 * @layer components/organisms
 * @description ControlBar beneath the board (new game + undo).
 */

import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ControlBar } from '@/components/molecules';
import { SPACING_TOKENS } from '@/styles';

export interface GameControlsProps {
  /** Start a new game. */
  onNewGame: () => void;
  /** Undo last move. */
  onUndo: () => void;
  /** When true, undo is disabled. */
  undoDisabled: boolean;
  /** Remaining undos for the badge (omit / zero hides badge). */
  undoRemaining?: number;
}

/**
 * Fixed-height control strip below the board.
 */
const GameControls = memo(
  ({ onNewGame, onUndo, undoDisabled, undoRemaining }: GameControlsProps) => {
    const styles = useMemo(
      () =>
        StyleSheet.create({
          wrap: {
            width: '100%',
            minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
            justifyContent: 'center',
            paddingVertical: SPACING_TOKENS.sm,
          },
        }),
      [],
    );

    return (
      <View style={styles.wrap}>
        <ControlBar
          onNewGame={onNewGame}
          onUndo={onUndo}
          undoDisabled={undoDisabled}
          {...(undoRemaining !== undefined ? { undoRemaining } : {})}
        />
      </View>
    );
  },
);

GameControls.displayName = 'GameControls';

export { GameControls };
