/**
 * @file OnboardingOverlay.tsx
 * @layer components/molecules
 * @description First-launch swipe demo — visual only; gestures pass through (P-19).
 */

import { memo, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { STRINGS } from '@/constants';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';

export interface OnboardingOverlayProps {
  /** Whether the demo is visible. */
  visible: boolean;
}

const DEMO_CELL = 4;
const ARROW_TRAVEL = 18;
/** Demo cell edge as a fraction of tap-target min. */
const DEMO_CELL_SCALE = 0.55;
const ARROW_PULSE_MS = 520;
const CARD_MAX_WIDTH = 360;
const DEMO_TILE_FONT_SIZE = 16;
const ARROW_FONT_SIZE = 22;

/**
 * Non-interactive overlay: static mini-board + pulsing swipe arrows.
 */
const OnboardingOverlay = memo(({ visible }: OnboardingOverlayProps) => {
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const offset = useSharedValue(0);

  useEffect(() => {
    if (!visible || reducedMotion) {
      offset.value = 0;
      return;
    }
    offset.value = withRepeat(
      withSequence(
        withTiming(ARROW_TRAVEL, {
          duration: ARROW_PULSE_MS,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(0, {
          duration: ARROW_PULSE_MS,
          easing: Easing.inOut(Easing.quad),
        }),
      ),
      -1,
      false,
    );
  }, [visible, reducedMotion, offset]);

  const leftArrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -offset.value }],
  }));
  const rightArrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));
  const upArrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -offset.value }],
  }));
  const downArrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  if (!visible) {
    return null;
  }

  return (
    <View
      style={styles.root}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.card}>
        <Text style={styles.title} allowFontScaling={false}>
          {STRINGS.ONBOARDING_TITLE}
        </Text>
        <Text style={styles.body} allowFontScaling={false}>
          {STRINGS.ONBOARDING_BODY}
        </Text>
        <View style={styles.board}>
          {Array.from({ length: DEMO_CELL * DEMO_CELL }, (_, index) => (
            <View key={`demo-${index}`} style={styles.cell} />
          ))}
          <View style={styles.demoTileA}>
            <Text style={styles.demoTileText} allowFontScaling={false}>
              2
            </Text>
          </View>
          <View style={styles.demoTileB}>
            <Text style={styles.demoTileText} allowFontScaling={false}>
              2
            </Text>
          </View>
        </View>
        <View style={styles.arrows}>
          <Animated.Text style={[styles.arrow, upArrowStyle]} allowFontScaling={false}>
            ↑
          </Animated.Text>
          <View style={styles.arrowRow}>
            <Animated.Text
              style={[styles.arrow, leftArrowStyle]}
              allowFontScaling={false}
            >
              ←
            </Animated.Text>
            <Animated.Text
              style={[styles.arrow, rightArrowStyle]}
              allowFontScaling={false}
            >
              →
            </Animated.Text>
          </View>
          <Animated.Text
            style={[styles.arrow, downArrowStyle]}
            allowFontScaling={false}
          >
            ↓
          </Animated.Text>
        </View>
        <Text style={styles.hint} allowFontScaling={false}>
          {STRINGS.ONBOARDING_HINT}
        </Text>
      </View>
    </View>
  );
});

OnboardingOverlay.displayName = 'OnboardingOverlay';

function createStyles(theme: ThemeTokens) {
  const cell = SPACING_TOKENS.TAP_TARGET_MIN * DEMO_CELL_SCALE;
  const gap = SPACING_TOKENS.xs;
  const halfTileRadius = SPACING_TOKENS.TILE_RADIUS / SPACING_TOKENS.LAYOUT_DOUBLE;
  const board = cell * DEMO_CELL + gap * (DEMO_CELL - 1);
  return StyleSheet.create({
    root: {
      ...StyleSheet.absoluteFill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.OVERLAY,
      zIndex: 20,
      paddingHorizontal: SPACING_TOKENS.SCREEN_PADDING,
    },
    card: {
      backgroundColor: theme.SURFACE,
      borderRadius: SPACING_TOKENS.BUTTON_RADIUS,
      padding: SPACING_TOKENS.lg,
      alignItems: 'center',
      maxWidth: CARD_MAX_WIDTH,
      width: '100%',
      gap: SPACING_TOKENS.sm,
    },
    title: {
      ...TYPOGRAPHY.title,
      color: theme.TEXT_PRIMARY,
      textAlign: 'center',
    },
    body: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_MUTED,
      textAlign: 'center',
    },
    board: {
      width: board,
      height: board,
      backgroundColor: theme.BOARD_BG,
      borderRadius: SPACING_TOKENS.TILE_RADIUS,
      padding: gap,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap,
      position: 'relative',
      marginVertical: SPACING_TOKENS.sm,
    },
    cell: {
      width: cell,
      height: cell,
      borderRadius: halfTileRadius,
      backgroundColor: theme.CELL_EMPTY,
    },
    demoTileA: {
      position: 'absolute',
      left: gap + cell + gap,
      top: gap + cell + gap,
      width: cell,
      height: cell,
      borderRadius: halfTileRadius,
      backgroundColor: theme.TILE_BG[2],
      alignItems: 'center',
      justifyContent: 'center',
    },
    demoTileB: {
      position: 'absolute',
      left: gap + (cell + gap) * SPACING_TOKENS.LAYOUT_DOUBLE,
      top: gap + cell + gap,
      width: cell,
      height: cell,
      borderRadius: halfTileRadius,
      backgroundColor: theme.TILE_BG[2],
      alignItems: 'center',
      justifyContent: 'center',
    },
    demoTileText: {
      ...TYPOGRAPHY.tileValue,
      color: theme.TILE_TEXT[2],
      fontSize: DEMO_TILE_FONT_SIZE,
    },
    arrows: {
      alignItems: 'center',
      gap: SPACING_TOKENS.xs,
    },
    arrowRow: {
      flexDirection: 'row',
      gap: SPACING_TOKENS.xl,
    },
    arrow: {
      ...TYPOGRAPHY.title,
      color: theme.ACCENT,
      fontSize: ARROW_FONT_SIZE,
    },
    hint: {
      ...TYPOGRAPHY.scoreLabel,
      color: theme.TEXT_MUTED,
      textAlign: 'center',
    },
  });
}

export { OnboardingOverlay };
