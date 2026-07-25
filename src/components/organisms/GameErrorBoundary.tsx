/**
 * @file GameErrorBoundary.tsx
 * @layer components/organisms
 * @description Catches game-tree render errors; restart CTA instead of white screen (P-19).
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/atoms';
import { STRINGS } from '@/constants';
import { SPACING_TOKENS, TYPOGRAPHY } from '@/styles';
import { recordCrashlyticsError } from '@/utils/crashlytics.utils';

export interface GameErrorBoundaryProps {
  /** Game screen tree. */
  children: ReactNode;
  /** Surface / text colors from active theme (passed from parent to avoid hooks in class). */
  surfaceColor: string;
  textColor: string;
  mutedColor: string;
}

interface GameErrorBoundaryState {
  hasError: boolean;
}

/**
 * Class boundary around the game tab only.
 */
export class GameErrorBoundary extends Component<
  GameErrorBoundaryProps,
  GameErrorBoundaryState
> {
  public state: GameErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): GameErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    recordCrashlyticsError(error, {
      componentStack: info.componentStack ?? '',
    });
    if (__DEV__) {
      // eslint-disable-next-line no-console -- intentional boundary diagnostics
      console.error('[GameErrorBoundary]', error, info.componentStack);
    }
  }

  private handleRestart = (): void => {
    this.setState({ hasError: false });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      const { surfaceColor, textColor, mutedColor } = this.props;
      return (
        <View
          style={[styles.container, { backgroundColor: surfaceColor }]}
          accessibilityRole="alert"
        >
          <Text style={[styles.title, { color: textColor }]} allowFontScaling={false}>
            {STRINGS.ERROR_BOUNDARY_TITLE}
          </Text>
          <Text style={[styles.body, { color: mutedColor }]} allowFontScaling={false}>
            {STRINGS.ERROR_BOUNDARY_BODY}
          </Text>
          <PrimaryButton
            label={STRINGS.ERROR_BOUNDARY_RESTART}
            onPress={this.handleRestart}
            accessibilityLabel={STRINGS.ERROR_BOUNDARY_RESTART}
          />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING_TOKENS.SCREEN_PADDING,
    gap: SPACING_TOKENS.md,
  },
  title: {
    ...TYPOGRAPHY.title,
    textAlign: 'center',
  },
  body: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING_TOKENS.sm,
  },
});
