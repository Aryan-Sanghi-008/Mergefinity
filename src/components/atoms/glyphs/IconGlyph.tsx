/**
 * @file IconGlyph.tsx
 * @layer components/atoms
 * @description Geometric icon marks for IconName (no emoji, no external icon set).
 */

import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { SPACING_TOKENS } from '@/styles';
import type { IconName } from '@/types';

export interface IconGlyphProps {
  /** Glyph to render. */
  name: IconName;
  /** Override color (defaults to theme primary text). */
  color?: string;
  /** Glyph box edge length. */
  size?: number;
}

/**
 * Renders a simple geometric mark for the given `IconName`.
 */
const IconGlyph = memo(
  ({
    name,
    color,
    size = SPACING_TOKENS.ICON_GLYPH_SIZE,
  }: IconGlyphProps) => {
    const { theme } = useTheme();
    const stroke = color ?? theme.TEXT_PRIMARY;
    const styles = useMemo(() => createStyles(size, stroke), [size, stroke]);

    return <View style={styles.box}>{renderGlyph(name, styles)}</View>;
  },
);

IconGlyph.displayName = 'IconGlyph';

function renderGlyph(name: IconName, styles: ReturnType<typeof createStyles>) {
  switch (name) {
    case 'settings':
    case 'restart':
      return <View style={styles.ring} />;
    case 'undo':
      return (
        <View style={styles.row}>
          <View style={styles.chevronArm} />
          <View style={styles.barHorizontal} />
        </View>
      );
    case 'back':
      return <View style={styles.chevronArm} />;
    case 'check':
      return <View style={styles.checkArm} />;
    case 'lock':
      return (
        <View style={styles.column}>
          <View style={styles.lockShackle} />
          <View style={styles.lockBody} />
        </View>
      );
    case 'stats':
      return (
        <View style={styles.rowEnd}>
          <View style={styles.barShort} />
          <View style={styles.barTall} />
          <View style={styles.barMid} />
        </View>
      );
    case 'achievements':
      return <View style={styles.dot} />;
    case 'theme':
      return (
        <View style={styles.grid}>
          <View style={styles.gridCell} />
          <View style={styles.gridCell} />
          <View style={styles.gridCell} />
          <View style={styles.gridCell} />
        </View>
      );
    default: {
      const _exhaustive: never = name;
      return _exhaustive;
    }
  }
}

function createStyles(size: number, stroke: string) {
  const {
    ICON_MIN_THICKNESS,
    ICON_THICKNESS_DIVISOR,
    ICON_RING_RATIO,
    ICON_CHEVRON_RATIO,
    ICON_CHECK_W,
    ICON_CHECK_H,
    ICON_LOCK_BODY_W,
    ICON_LOCK_BODY_H,
    ICON_LOCK_SHACKLE_W,
    ICON_LOCK_SHACKLE_H,
    ICON_DOT_RATIO,
    ICON_GRID_RATIO,
    ICON_GRID_CELL_RATIO,
    ICON_BAR_SHORT_RATIO,
    ICON_BAR_MID_RATIO,
  } = SPACING_TOKENS;

  const thickness = Math.max(ICON_MIN_THICKNESS, Math.round(size / ICON_THICKNESS_DIVISOR));
  const half = size / SPACING_TOKENS.LAYOUT_DOUBLE;

  return StyleSheet.create({
    box: {
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowEnd: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: half,
      gap: ICON_MIN_THICKNESS,
    },
    column: {
      alignItems: 'center',
    },
    barHorizontal: {
      width: half,
      height: thickness,
      backgroundColor: stroke,
      borderRadius: 1,
      marginLeft: ICON_MIN_THICKNESS,
    },
    barShort: {
      width: thickness,
      height: half * ICON_BAR_SHORT_RATIO,
      backgroundColor: stroke,
      borderRadius: 1,
    },
    barMid: {
      width: thickness,
      height: half * ICON_BAR_MID_RATIO,
      backgroundColor: stroke,
      borderRadius: 1,
    },
    barTall: {
      width: thickness,
      height: half,
      backgroundColor: stroke,
      borderRadius: 1,
    },
    ring: {
      width: size * ICON_RING_RATIO,
      height: size * ICON_RING_RATIO,
      borderRadius: (size * ICON_RING_RATIO) / SPACING_TOKENS.LAYOUT_DOUBLE,
      borderWidth: thickness,
      borderColor: stroke,
    },
    chevronArm: {
      width: size * ICON_CHEVRON_RATIO,
      height: size * ICON_CHEVRON_RATIO,
      borderLeftWidth: thickness,
      borderBottomWidth: thickness,
      borderColor: stroke,
      transform: [{ rotate: '45deg' }],
    },
    checkArm: {
      width: size * ICON_CHECK_W,
      height: size * ICON_CHECK_H,
      borderLeftWidth: thickness,
      borderBottomWidth: thickness,
      borderColor: stroke,
      transform: [{ rotate: '-45deg' }],
    },
    lockBody: {
      width: size * ICON_LOCK_BODY_W,
      height: size * ICON_LOCK_BODY_H,
      borderRadius: ICON_MIN_THICKNESS,
      backgroundColor: stroke,
      marginTop: ICON_MIN_THICKNESS,
    },
    lockShackle: {
      width: size * ICON_LOCK_SHACKLE_W,
      height: size * ICON_LOCK_SHACKLE_H,
      borderTopLeftRadius: size * ICON_CHEVRON_RATIO,
      borderTopRightRadius: size * ICON_CHEVRON_RATIO,
      borderWidth: thickness,
      borderBottomWidth: 0,
      borderColor: stroke,
    },
    dot: {
      width: size * ICON_DOT_RATIO,
      height: size * ICON_DOT_RATIO,
      borderRadius: (size * ICON_DOT_RATIO) / SPACING_TOKENS.LAYOUT_DOUBLE,
      backgroundColor: stroke,
    },
    grid: {
      width: size * ICON_GRID_RATIO,
      height: size * ICON_GRID_RATIO,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: ICON_MIN_THICKNESS,
    },
    gridCell: {
      width: size * ICON_GRID_CELL_RATIO,
      height: size * ICON_GRID_CELL_RATIO,
      borderRadius: ICON_MIN_THICKNESS,
      backgroundColor: stroke,
      opacity: SPACING_TOKENS.OPACITY_MUTED,
    },
  });
}

export { IconGlyph };
