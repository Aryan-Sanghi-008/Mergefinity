/**
 * @file StatusBadge.tsx
 * @layer components/atoms
 * @description Win / loss / streak indicator badge.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPE_SCALE, TYPOGRAPHY } from '@/styles';

export type StatusBadgeVariant = 'win' | 'loss' | 'streak';

export interface StatusBadgeProps {
  /** Badge semantic variant. */
  variant: StatusBadgeVariant;
  /** Optional extra detail (e.g. streak count). */
  detail?: string;
}

/**
 * Sentence-case status chip — no emoji.
 */
const StatusBadge = memo(({ variant, detail }: StatusBadgeProps) => {
  const { theme } = useTheme();
  const label =
    variant === 'win'
      ? STRINGS.STATUS_WIN
      : variant === 'loss'
        ? STRINGS.STATUS_LOSS
        : STRINGS.STATUS_STREAK;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        badge: {
          paddingHorizontal: SPACING_TOKENS.sm,
          paddingVertical: SPACING_TOKENS.xs,
          borderRadius: SPACING_TOKENS.BUTTON_RADIUS,
          backgroundColor: theme.SCORE_BG,
          alignSelf: 'flex-start',
        },
        text: {
          ...TYPOGRAPHY.body,
          fontSize: TYPE_SCALE.caption,
          color: theme.SCORE_TEXT,
        },
      }),
    [theme],
  );

  const content = detail ? `${label} ${detail}` : label;

  return (
    <View style={styles.badge} accessibilityRole="text" accessibilityLabel={content}>
      <Text style={styles.text} allowFontScaling={false}>
        {content}
      </Text>
    </View>
  );
});

StatusBadge.displayName = 'StatusBadge';

export { StatusBadge };
