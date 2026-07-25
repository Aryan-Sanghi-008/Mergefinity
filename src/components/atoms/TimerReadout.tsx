/**
 * @file TimerReadout.tsx
 * @layer components/atoms
 * @description Time Attack remaining-seconds display from a SharedValue.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';

import { MS_PER_SECOND, SECONDS_PER_MINUTE, STRINGS, TIMER_SECONDS_PAD } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY } from '@/styles';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export interface TimerReadoutProps {
  /** Remaining milliseconds (UI thread). */
  remainingMs: SharedValue<number>;
}

/**
 * Shows `Mm:Ss` countdown without JS re-renders per tick.
 */
const TimerReadout = memo(({ remainingMs }: TimerReadoutProps) => {
  const { theme } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: SPACING_TOKENS.xs,
          minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
        },
        label: {
          ...TYPOGRAPHY.scoreLabel,
          color: theme.TEXT_MUTED,
        },
        text: {
          ...TYPOGRAPHY.score,
          color: theme.ACCENT,
          padding: 0,
          margin: 0,
          minWidth: SPACING_TOKENS.TAP_TARGET_MIN,
        },
      }),
    [theme],
  );

  const animatedProps = useAnimatedProps(() => {
    const totalSec = Math.max(0, Math.ceil(remainingMs.value / MS_PER_SECOND));
    const minutes = Math.floor(totalSec / SECONDS_PER_MINUTE);
    const seconds = totalSec % SECONDS_PER_MINUTE;
    const padded = seconds < TIMER_SECONDS_PAD ? `0${seconds}` : `${seconds}`;
    return {
      text: `${minutes}:${padded}`,
    } as Partial<TextInputProps>;
  }, [remainingMs]);

  return (
    <View style={styles.row} accessibilityLabel={STRINGS.TIMER_LABEL}>
      <Text style={styles.label} allowFontScaling={false}>
        {STRINGS.TIMER_LABEL}
      </Text>
      <AnimatedTextInput
        underlineColorAndroid="transparent"
        editable={false}
        caretHidden
        style={styles.text}
        animatedProps={animatedProps}
      />
    </View>
  );
});

TimerReadout.displayName = 'TimerReadout';

export { TimerReadout };
