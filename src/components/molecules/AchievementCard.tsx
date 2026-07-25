/**
 * @file AchievementCard.tsx
 * @layer components/molecules
 * @description Achievement gallery card — locked / unlocked.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IconGlyph } from '@/components/atoms';
import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPE_SCALE, TYPOGRAPHY } from '@/styles';
import type { AchievementStatus, IconName } from '@/types';

export interface AchievementCardProps {
  /** Achievement title. */
  name: string;
  /** Short description (greyed when locked). */
  description: string;
  /** Locked or unlocked. */
  status: AchievementStatus;
  /** Optional unlock timestamp label. */
  unlockedLabel?: string;
  /** Optional progress text when locked (e.g. 47/100). */
  progressLabel?: string;
  /** Glyph for the card. */
  iconName?: IconName;
}

/**
 * Achievement grid card.
 */
const AchievementCard = memo(
  ({
    name,
    description,
    status,
    unlockedLabel,
    progressLabel,
    iconName = 'achievements',
  }: AchievementCardProps) => {
    const { theme } = useTheme();
    const locked = status === 'locked';
    const styles = useMemo(() => createStyles(theme, locked), [theme, locked]);

    const a11y = locked
      ? `${name}, ${STRINGS.ACHIEVEMENT_LOCKED}${progressLabel ? `, ${progressLabel}` : ''}`
      : `${name}, ${STRINGS.ACHIEVEMENT_UNLOCKED}${unlockedLabel ? `, ${unlockedLabel}` : ''}`;

    return (
      <View style={styles.card} accessibilityLabel={a11y}>
        <IconGlyph
          name={locked ? 'lock' : iconName}
          color={locked ? theme.TEXT_MUTED : theme.ACCENT}
        />
        <Text style={styles.name} allowFontScaling={false}>
          {name}
        </Text>
        <Text style={styles.description} allowFontScaling={false}>
          {description}
        </Text>
        {locked && progressLabel ? (
          <Text style={styles.meta} allowFontScaling={false}>
            {progressLabel}
          </Text>
        ) : null}
        {!locked && unlockedLabel ? (
          <Text style={styles.meta} allowFontScaling={false}>
            {unlockedLabel}
          </Text>
        ) : null}
      </View>
    );
  },
);

AchievementCard.displayName = 'AchievementCard';

function createStyles(
  theme: {
    SURFACE: string;
    DIVIDER: string;
    TEXT_PRIMARY: string;
    TEXT_MUTED: string;
    TEXT_SECONDARY: string;
  },
  locked: boolean,
) {
  return StyleSheet.create({
    card: {
      flex: 1,
      minWidth: SPACING_TOKENS.TAP_TARGET_MIN * SPACING_TOKENS.LAYOUT_TRIPLE,
      padding: SPACING_TOKENS.md,
      borderRadius: SPACING_TOKENS.CARD_RADIUS,
      borderWidth: SPACING_TOKENS.DIVIDER_THICKNESS,
      borderColor: theme.DIVIDER,
      backgroundColor: theme.SURFACE,
      gap: SPACING_TOKENS.xs,
    },
    name: {
      ...TYPOGRAPHY.body,
      fontFamily: TYPOGRAPHY.score.fontFamily,
      color: theme.TEXT_PRIMARY,
    },
    description: {
      ...TYPOGRAPHY.body,
      fontSize: TYPE_SCALE.caption,
      color: locked ? theme.TEXT_MUTED : theme.TEXT_SECONDARY,
    },
    meta: {
      ...TYPOGRAPHY.body,
      fontSize: TYPE_SCALE.caption,
      color: theme.TEXT_MUTED,
    },
  });
}

export { AchievementCard };
