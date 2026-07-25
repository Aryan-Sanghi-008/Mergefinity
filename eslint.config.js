// ESLint 9 flat config. Extends Expo's shared flat config (includes
// typescript-eslint + eslint-plugin-import) and layers Mergefinity rules.
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: ['node_modules/**', '.expo/**', 'dist/**', 'coverage/**', 'scripts/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'import/no-default-export': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],
      'no-magic-numbers': [
        'error',
        { ignore: [0, 1, -1], ignoreArrayIndexes: true },
      ],
      'no-console': 'error',
    },
  },
  {
    // Expo Router screens, config, and ambient asset modules require default exports.
    files: [
      'src/app/**/*.{ts,tsx}',
      'src/types/assets.d.ts',
      '*.config.js',
      'babel.config.js',
      'eslint.config.js',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  {
    // Value/token/type layers are where literals are allowed to live.
    files: [
      'src/constants/**/*.{ts,tsx}',
      'src/types/**/*.{ts,tsx}',
      'src/styles/**/*.{ts,tsx}',
    ],
    rules: {
      'no-magic-numbers': 'off',
    },
  },
  {
    // Test files use jest globals and literal fixtures.
    files: ['**/*.test.{ts,tsx}'],
    rules: {
      'no-magic-numbers': 'off',
    },
  },
];
