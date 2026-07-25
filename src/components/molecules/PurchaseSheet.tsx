/**
 * @file PurchaseSheet.tsx
 * @layer components/molecules
 * @description Stub premium-themes purchase sheet (P-13; real IAP in P-16).
 */

import { memo } from 'react';

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { STRINGS } from '@/constants';

export interface PurchaseSheetProps {
  /** Whether the sheet is visible. */
  visible: boolean;
  /** Confirm stub unlock. */
  onConfirm: () => void;
  /** Dismiss without purchasing. */
  onCancel: () => void;
}

/**
 * Modal confirm that unlocks premium themes via purchaseStore stub.
 */
const PurchaseSheet = memo(({ visible, onConfirm, onCancel }: PurchaseSheetProps) => {
  return (
    <ConfirmDialog
      visible={visible}
      title={STRINGS.PURCHASE_THEMES_TITLE}
      message={STRINGS.PURCHASE_THEMES_BODY}
      confirmLabel={STRINGS.PURCHASE_THEMES_CONFIRM}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
});

PurchaseSheet.displayName = 'PurchaseSheet';

export { PurchaseSheet };
