/**
 * @file GameHeader.tsx
 * @layer components/organisms
 * @description Game title + scores + settings gear (P-14).
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { IconButton, ScoreDeltaFloat } from '@/components/atoms';
import { ScorePanel } from '@/components/molecules';
import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';

export interface GameHeaderProps {
  /** Current score (rolling shared value preferred). */
  score: number | SharedValue<number>;
  /** Best score (rolling shared value preferred). */
  bestScore: number | SharedValue<number>;
  /** Floating +N amount. */
  scoreDeltaAmount: number;
  /** Whether +N float is visible. */
  scoreDeltaVisible: boolean;
  /** +N float animated style. */
  scoreDeltaStyle: StyleProp<ViewStyle>;
  /** Opens Settings (gear). */
  onSettingsPress: () => void;
}

/**
 * Minimal chrome above the board — title + scores + settings gear.
 */
const GameHeader = memo(
  ({
    score,
    bestScore,
    scoreDeltaAmount,
    scoreDeltaVisible,
    scoreDeltaStyle,
    onSettingsPress,
  }: GameHeaderProps) => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
      <View style={styles.row}>
        <Text style={styles.title} allowFontScaling={false}>
          {STRINGS.GAME_TITLE}
        </Text>
        <View style={styles.trailing}>
          <View style={styles.scoreWrap}>
            <ScorePanel score={score} bestScore={bestScore} />
            <ScoreDeltaFloat
              amount={scoreDeltaAmount}
              visible={scoreDeltaVisible}
              animatedStyle={scoreDeltaStyle}
            />
          </View>
          <IconButton
            name="settings"
            onPress={onSettingsPress}
            accessibilityLabel={STRINGS.A11Y_SETTINGS}
          />
        </View>
      </View>
    );
  },
);

GameHeader.displayName = 'GameHeader';

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    row: {
      width: '100%',
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: SPACING_TOKENS.SCREEN_PADDING,
    },
    title: {
      ...TYPOGRAPHY.title,
      color: theme.TEXT_PRIMARY,
      flexShrink: 1,
      marginRight: SPACING_TOKENS.sm,
    },
    trailing: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING_TOKENS.sm,
      flexShrink: 0,
    },
    scoreWrap: {
      position: 'relative',
      overflow: 'visible',
    },
  });
}

export { GameHeader };
