/**
 * @file AchievementToast.tsx
 * @layer components/molecules
 * @description Queued achievement unlock toast (P-12).
 */

import { memo } from 'react';

import { Toast } from '@/components/atoms';
import { ACHIEVEMENT_TOAST_DURATION_MS } from '@/constants';
import type { AchievementId } from '@/types';
import { ACHIEVEMENTS_CONFIG } from '@/utils/achievementChecks';

export interface AchievementToastProps {
  /** Achievement to show, or null when hidden. */
  achievementId: AchievementId | null;
  /** Called after auto-dismiss. */
  onDismiss: () => void;
}

/**
 * Shows one achievement unlock using the shared Toast atom.
 */
const AchievementToast = memo(
  ({ achievementId, onDismiss }: AchievementToastProps) => {
    const definition =
      achievementId !== null ? ACHIEVEMENTS_CONFIG[achievementId] : null;

    return (
      <Toast
        visible={definition !== null}
        title={definition?.name ?? ''}
        description={definition?.description ?? ''}
        onDismiss={onDismiss}
        durationMs={ACHIEVEMENT_TOAST_DURATION_MS}
      />
    );
  },
);

AchievementToast.displayName = 'AchievementToast';

export { AchievementToast };
