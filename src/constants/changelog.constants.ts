/**
 * @file changelog.constants.ts
 * @layer constants
 * @description In-app changelog entries mirroring CHANGELOG.md (P-19).
 */

/** One release block shown on the Changelog screen. */
export interface ChangelogEntry {
  /** Semver label. */
  version: string;
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  /** Paragraphs (no bullets in store long-desc; bullets OK in-app). */
  highlights: readonly string[];
}

/** Ordered newest-first. Keep in sync with root CHANGELOG.md. */
export const CHANGELOG_ENTRIES: readonly ChangelogEntry[] = [
  {
    version: '1.0.0',
    date: '2026-07-26',
    highlights: [
      'Classic, Endless, Challenge, and Time Attack modes.',
      'Five themes, twenty achievements, and local statistics.',
      'Haptics, sound, undo, and polished board motion.',
      'First-launch onboarding and store-ready brand assets.',
      'Launch analytics, Crashlytics hooks, and rating prompt after the third win.',
    ],
  },
] as const;
