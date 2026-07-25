/**
 * @file SessionCard.tsx
 * @layer components/molecules
 * @description Session history row for the statistics screen.
 */

import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { STRINGS } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPE_SCALE, TYPOGRAPHY, type ThemeTokens } from '@/styles';
import type { GameMode, SessionRecord } from '@/types';

const MODE_LABELS: Record<GameMode, string> = {
  classic: STRINGS.MODE_CLASSIC,
  endless: STRINGS.MODE_ENDLESS,
  challenge: STRINGS.MODE_CHALLENGE,
  'time-attack': STRINGS.MODE_TIME_ATTACK,
};

export interface SessionCardProps {
  /** Session to display. */
  session: SessionRecord;
}

/**
 * Formats an endedAt epoch as a short local date.
 */
function formatSessionDate(endedAt: number): string {
  const date = new Date(endedAt);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Compact session history row.
 */
const SessionCard = memo(({ session }: SessionCardProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const modeLabel = MODE_LABELS[session.mode];
  const dateLabel = formatSessionDate(session.endedAt);
  const a11y = `${dateLabel}, ${modeLabel}, ${STRINGS.STATS_SESSION_SCORE} ${session.score}, ${STRINGS.STATS_SESSION_TILE} ${session.bestTile}`;

  return (
    <View style={styles.row} accessibilityLabel={a11y}>
      <View style={styles.left}>
        <Text style={styles.date} allowFontScaling={false}>
          {dateLabel}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText} allowFontScaling={false}>
            {modeLabel}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.score} allowFontScaling={false}>
          {session.score}
        </Text>
        <Text style={styles.tile} allowFontScaling={false}>
          {session.bestTile}
        </Text>
      </View>
    </View>
  );
});

SessionCard.displayName = 'SessionCard';

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: SPACING_TOKENS.TAP_TARGET_MIN,
      paddingVertical: SPACING_TOKENS.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.DIVIDER,
    },
    left: {
      flex: 1,
      paddingRight: SPACING_TOKENS.sm,
      gap: SPACING_TOKENS.xs,
    },
    date: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_PRIMARY,
    },
    badge: {
      alignSelf: 'flex-start',
      paddingHorizontal: SPACING_TOKENS.sm,
      paddingVertical: SPACING_TOKENS.xs,
      borderRadius: SPACING_TOKENS.BUTTON_RADIUS,
      backgroundColor: theme.SCORE_BG,
    },
    badgeText: {
      ...TYPOGRAPHY.body,
      fontSize: TYPE_SCALE.caption,
      color: theme.SCORE_TEXT,
    },
    right: {
      alignItems: 'flex-end',
      gap: SPACING_TOKENS.xs,
    },
    score: {
      ...TYPOGRAPHY.body,
      fontFamily: TYPOGRAPHY.score.fontFamily,
      color: theme.TEXT_PRIMARY,
    },
    tile: {
      ...TYPOGRAPHY.body,
      fontSize: TYPE_SCALE.caption,
      color: theme.TEXT_MUTED,
    },
  });
}

export { SessionCard };
