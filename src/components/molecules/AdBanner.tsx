/**
 * @file AdBanner.tsx
 * @layer components/molecules
 * @description Stub banner placeholder for Stats / Achievements (P-16).
 */

import { memo, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { STRINGS } from '@/constants';
import { useHasRemovedAds } from '@/hooks/usePurchase';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';
import { isBannerAllowed } from '@/utils/ads.utils';

/**
 * Self-gated stub banner — never mount on the game screen.
 */
const AdBanner = memo(() => {
  const { theme } = useTheme();
  const hasRemovedAds = useHasRemovedAds();
  const [visible, setVisible] = useState(false);
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    let cancelled = false;
    if (hasRemovedAds) {
      queueMicrotask(() => {
        if (!cancelled) {
          setVisible(false);
        }
      });
      return () => {
        cancelled = true;
      };
    }
    void isBannerAllowed().then((ok) => {
      if (!cancelled) {
        setVisible(ok);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [hasRemovedAds]);

  if (!visible) {
    return null;
  }

  return (
    <View
      style={styles.banner}
      accessibilityRole="text"
      accessibilityLabel={STRINGS.ADS_BANNER_LABEL}
    >
      <Text style={styles.label} allowFontScaling={false}>
        {STRINGS.ADS_BANNER_LABEL}
      </Text>
    </View>
  );
});

AdBanner.displayName = 'AdBanner';

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    banner: {
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      marginTop: SPACING_TOKENS.md,
      marginBottom: SPACING_TOKENS.sm,
      borderRadius: SPACING_TOKENS.BUTTON_RADIUS,
      borderWidth: SPACING_TOKENS.DIVIDER_THICKNESS,
      borderColor: theme.DIVIDER,
      backgroundColor: theme.BOARD_BG,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: SPACING_TOKENS.md,
    },
    label: {
      ...TYPOGRAPHY.scoreLabel,
      color: theme.TEXT_MUTED,
      textTransform: 'uppercase',
    },
  });
}

export { AdBanner };
