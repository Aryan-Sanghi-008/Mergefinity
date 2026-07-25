/**
 * @file ScoreValue.tsx
 * @layer components/atoms
 * @description Large score numeral; supports Reanimated SharedValue or static number.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Text, TextInput, type TextInputProps } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/useTheme';
import { TYPOGRAPHY } from '@/styles';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export interface ScoreValueProps {
  /** Static score or shared value for counter animation. */
  value: number | SharedValue<number>;
  /** Accessibility label prefix. */
  accessibilityLabel?: string;
}

/**
 * Displays a score. When given a SharedValue, updates on the UI thread via animated props.
 */
const ScoreValue = memo(({ value, accessibilityLabel }: ScoreValueProps) => {
  const { theme } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        text: {
          ...TYPOGRAPHY.score,
          color: theme.TEXT_PRIMARY,
          padding: 0,
          margin: 0,
        },
      }),
    [theme.TEXT_PRIMARY],
  );

  const isShared = typeof value !== 'number';

  const animatedProps = useAnimatedProps(() => {
    if (!isShared) {
      return { text: '0' } as Partial<TextInputProps>;
    }
    return {
      text: `${Math.round(value.value)}`,
    } as Partial<TextInputProps>;
  }, [isShared, value]);

  if (!isShared) {
    return (
      <Text
        style={styles.text}
        allowFontScaling={false}
        accessibilityLabel={accessibilityLabel ?? `${value}`}
      >
        {value}
      </Text>
    );
  }

  return (
    <AnimatedTextInput
      underlineColorAndroid="transparent"
      editable={false}
      caretHidden
      style={styles.text}
      animatedProps={animatedProps}
      accessibilityLabel={accessibilityLabel}
    />
  );
});

ScoreValue.displayName = 'ScoreValue';

export { ScoreValue };
