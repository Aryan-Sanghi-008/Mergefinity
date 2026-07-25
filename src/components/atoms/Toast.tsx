/**
 * @file Toast.tsx
 * @layer components/atoms
 * @description Slide-up achievement toast; auto-dismisses after TOAST_DURATION_MS.
 */

import { memo, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { IconGlyph } from '@/components/atoms/glyphs';
import { TOAST_DURATION_MS, TOAST_TRAVEL_DP } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { OVERLAY_ANIMATION, SPACING_TOKENS, TYPOGRAPHY } from '@/styles';
import type { IconName } from '@/types';

export interface ToastProps {
  /** Whether the toast is shown. */
  visible: boolean;
  /** Title line. */
  title: string;
  /** Description line. */
  description: string;
  /** Optional geometric icon. */
  iconName?: IconName;
  /** Called after dismiss animation / timeout. */
  onDismiss: () => void;
  /** Auto-dismiss delay in ms (defaults to TOAST_DURATION_MS). */
  durationMs?: number;
}

/**
 * Bottom slide-up toast for achievement unlocks.
 */
const Toast = memo(
  ({
    visible,
    title,
    description,
    iconName = 'achievements',
    onDismiss,
    durationMs = TOAST_DURATION_MS,
  }: ToastProps) => {
    const { theme } = useTheme();
    const translateY = useSharedValue(TOAST_TRAVEL_DP);
    const opacity = useSharedValue(0);

    const styles = useMemo(
      () =>
        createStyles(
          theme.SURFACE,
          theme.TEXT_PRIMARY,
          theme.TEXT_MUTED,
          theme.DIVIDER,
          theme.elevation.BOARD_ELEVATION,
        ),
      [theme],
    );

    useEffect(() => {
      if (!visible) {
        return;
      }

      translateY.set(withTiming(0, { duration: OVERLAY_ANIMATION.durationMs }));
      opacity.set(withTiming(1, { duration: OVERLAY_ANIMATION.durationMs }));

      const timer = setTimeout(() => {
        opacity.set(
          withTiming(0, { duration: OVERLAY_ANIMATION.durationMs }, (finished) => {
            if (finished) {
              runOnJS(onDismiss)();
            }
          }),
        );
        translateY.set(
          withTiming(TOAST_TRAVEL_DP, {
            duration: OVERLAY_ANIMATION.durationMs,
          }),
        );
      }, durationMs);

      return () => {
        clearTimeout(timer);
      };
    }, [visible, onDismiss, opacity, translateY, durationMs]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.get() }],
      opacity: opacity.get(),
    }));

    if (!visible) {
      return null;
    }

    return (
      <Animated.View
        style={[styles.toast, animatedStyle]}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
      >
        <IconGlyph name={iconName} color={theme.ACCENT} />
        <View style={styles.copy}>
          <Text style={styles.title} allowFontScaling={false}>
            {title}
          </Text>
          <Text style={styles.description} allowFontScaling={false}>
            {description}
          </Text>
        </View>
      </Animated.View>
    );
  },
);

Toast.displayName = 'Toast';

function createStyles(
  backgroundColor: string,
  titleColor: string,
  mutedColor: string,
  borderColor: string,
  elevation: number,
) {
  return StyleSheet.create({
    toast: {
      position: 'absolute',
      left: SPACING_TOKENS.SCREEN_PADDING,
      right: SPACING_TOKENS.SCREEN_PADDING,
      bottom: SPACING_TOKENS.xl,
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING_TOKENS.sm,
      padding: SPACING_TOKENS.md,
      borderRadius: SPACING_TOKENS.CARD_RADIUS,
      backgroundColor,
      borderWidth: SPACING_TOKENS.DIVIDER_THICKNESS,
      borderColor,
      elevation,
    },
    copy: {
      flex: 1,
      gap: SPACING_TOKENS.xs,
    },
    title: {
      ...TYPOGRAPHY.body,
      fontFamily: TYPOGRAPHY.score.fontFamily,
      color: titleColor,
    },
    description: {
      ...TYPOGRAPHY.body,
      fontSize: TYPOGRAPHY.scoreLabel.fontSize,
      color: mutedColor,
    },
  });
}

export { Toast };
