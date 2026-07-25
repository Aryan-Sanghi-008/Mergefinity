/**
 * @file achievements.tsx
 * @layer app
 * @description Achievements gallery tab (P-12).
 */

import { memo, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { AchievementCard } from '@/components/molecules';
import { STRINGS } from '@/constants';
import { useAchievements } from '@/hooks/useAchievements';
import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS, TYPOGRAPHY, type ThemeTokens } from '@/styles';

const COLUMN_COUNT = 2;

/**
 * Achievements screen — thin gallery composition.
 */
const AchievementsScreen = memo(() => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { items, unlockedCount, totalCount } = useAchievements();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} allowFontScaling={false}>
          {STRINGS.ACHIEVEMENTS_TITLE}
        </Text>
        <Text style={styles.progress} allowFontScaling={false}>
          {`${unlockedCount}${STRINGS.ACHIEVEMENT_PROGRESS_OF}${totalCount}`}
        </Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={COLUMN_COUNT}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.cardSlot}>
            <AchievementCard
              name={item.name}
              description={item.description}
              status={item.status}
              {...(item.unlockedLabel !== undefined
                ? { unlockedLabel: item.unlockedLabel }
                : {})}
              {...(item.progressLabel !== undefined
                ? { progressLabel: item.progressLabel }
                : {})}
            />
          </View>
        )}
      />
    </View>
  );
});

AchievementsScreen.displayName = 'AchievementsScreen';

function createStyles(theme: ThemeTokens) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.SURFACE,
      paddingHorizontal: SPACING_TOKENS.SCREEN_PADDING,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      paddingVertical: SPACING_TOKENS.md,
    },
    title: {
      ...TYPOGRAPHY.title,
      color: theme.TEXT_PRIMARY,
    },
    progress: {
      ...TYPOGRAPHY.body,
      fontFamily: TYPOGRAPHY.score.fontFamily,
      color: theme.TEXT_MUTED,
    },
    list: {
      paddingBottom: SPACING_TOKENS.xl * SPACING_TOKENS.LAYOUT_DOUBLE,
      gap: SPACING_TOKENS.sm,
    },
    row: {
      gap: SPACING_TOKENS.sm,
    },
    cardSlot: {
      flex: 1,
    },
  });
}

export default AchievementsScreen;
