/**
 * @file game.tsx
 * @layer app
 * @description Deep-link alias — mergefinity://game → Game tab (P-14).
 */
import { Redirect } from 'expo-router';

/**
 * Redirects `mergefinity://game` to the Game tab.
 */
export default function GameDeepLink() {
  return <Redirect href="/(tabs)" />;
}
