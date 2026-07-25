/**
 * @file statistics.tsx
 * @layer app
 * @description Statistics tab — per-mode metrics, history, merge histogram (P-11).
 */

import { memo, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  MergeBar,
  ModeSelector,
  SessionCard,
  StatRow,
} from '@/components/molecules';
import { STRINGS } from '@/constants';
import { useStats } from '@/hooks/useStats';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';

/**
 * Statistics screen — thin composition of molecules + useStats.
 */
const StatisticsScreen = memo(() => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {
    selectedMode,
    setSelectedMode,
    modeStats,
    lifetime,
    sessionHistory,
    mergeRows,
    isModeEmpty,
  } = useStats();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      accessibilityLabel={STRINGS.STATS_TITLE}
    >
      <Text style={styles.title} allowFontScaling={false}>
        {STRINGS.STATS_TITLE}
      </Text>

      <View style={styles.headerBlock}>
        <StatRow
          label={STRINGS.STATS_ALL_TIME_BEST}
          value={String(lifetime.allTimeBestScore)}
        />
        <StatRow
          label={STRINGS.STATS_TOTAL_GAMES}
          value={String(lifetime.totalGames)}
        />
      </View>

      <ModeSelector selected={selectedMode} onSelect={setSelectedMode} />

      <View style={styles.section}>
        {isModeEmpty ? (
          <Text style={styles.empty} allowFontScaling={false}>
            {STRINGS.STATS_EMPTY}
          </Text>
        ) : (
          <>
            <StatRow
              label={STRINGS.STATS_GAMES_PLAYED}
              value={String(modeStats.stats.gamesPlayed)}
            />
            <StatRow
              label={STRINGS.STATS_WINS}
              value={String(modeStats.stats.wins)}
            />
            <StatRow
              label={STRINGS.STATS_LOSSES}
              value={String(modeStats.stats.losses)}
            />
            <StatRow
              label={STRINGS.STATS_WIN_RATE}
              value={`${modeStats.winRate}${STRINGS.STATS_WIN_RATE_SUFFIX}`}
            />
            <StatRow
              label={STRINGS.STATS_BEST_SCORE}
              value={String(modeStats.stats.bestScore)}
            />
            <StatRow
              label={STRINGS.STATS_BEST_TILE}
              value={String(modeStats.stats.bestTile)}
            />
            <StatRow
              label={STRINGS.STATS_TOTAL_MERGES}
              value={String(modeStats.stats.totalMerges)}
            />
            <StatRow
              label={STRINGS.STATS_AVERAGE_SCORE}
              value={String(modeStats.average)}
            />
          </>
        )}
      </View>

      <Text style={styles.sectionTitle} allowFontScaling={false}>
        {STRINGS.STATS_LIFETIME_SECTION}
      </Text>
      <View style={styles.section}>
        <StatRow
          label={STRINGS.STATS_PLAY_TIME}
          value={String(lifetime.totalPlayMinutes)}
        />
        <StatRow
          label={STRINGS.STATS_CURRENT_WIN_STREAK}
          value={String(lifetime.currentWinStreak)}
        />
        <StatRow
          label={STRINGS.STATS_LONGEST_WIN_STREAK}
          value={String(lifetime.longestWinStreak)}
        />
        <StatRow
          label={STRINGS.STATS_CURRENT_PLAY_STREAK}
          value={String(lifetime.currentPlayStreakDays)}
        />
        <StatRow
          label={STRINGS.STATS_LONGEST_PLAY_STREAK}
          value={String(lifetime.longestPlayStreakDays)}
        />
        <StatRow
          label={STRINGS.STATS_BEST_TILE}
          value={String(lifetime.allTimeBestTile)}
        />
      </View>

      {sessionHistory.length > 0 ? (
        <>
          <Text style={styles.sectionTitle} allowFontScaling={false}>
            {STRINGS.STATS_SESSION_HISTORY}
          </Text>
          <View style={styles.section}>
            {sessionHistory.map((session) => (
              <SessionCard
                key={`${session.endedAt}-${session.mode}-${session.score}`}
                session={session}
              />
            ))}
          </View>
        </>
      ) : null}

      {mergeRows.length > 0 ? (
        <>
          <Text style={styles.sectionTitle} allowFontScaling={false}>
            {STRINGS.STATS_MERGE_HISTOGRAM}
          </Text>
          <View style={styles.section}>
            {mergeRows.map((row) => (
              <MergeBar
                key={row.value}
                value={row.value}
                count={row.count}
                fraction={row.fraction}
              />
            ))}
          </View>
        </>
      ) : null}
    </ScrollView>
  );
});

StatisticsScreen.displayName = 'StatisticsScreen';

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.SURFACE,
    },
    content: {
      padding: SPACING_TOKENS.SCREEN_PADDING,
      paddingBottom: SPACING_TOKENS.xl * SPACING_TOKENS.LAYOUT_DOUBLE,
      gap: SPACING_TOKENS.md,
    },
    title: {
      ...TYPOGRAPHY.title,
      color: theme.TEXT_PRIMARY,
    },
    headerBlock: {
      marginBottom: SPACING_TOKENS.sm,
    },
    section: {
      marginBottom: SPACING_TOKENS.md,
    },
    sectionTitle: {
      ...TYPOGRAPHY.scoreLabel,
      color: theme.TEXT_MUTED,
      textTransform: 'uppercase',
      marginTop: SPACING_TOKENS.sm,
    },
    empty: {
      ...TYPOGRAPHY.body,
      color: theme.TEXT_MUTED,
      paddingVertical: SPACING_TOKENS.md,
    },
  });
}

export default StatisticsScreen;
