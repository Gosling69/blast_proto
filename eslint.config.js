const js = require('@eslint/js')
const tseslint = require('typescript-eslint')
const prettier = require('eslint-plugin-prettier')
const prettierConfig = require('eslint-config-prettier')

module.exports = tseslint.config(
  {
    ignores: [
      'library/**',
      'local/**',
      'temp/**',
      'build/**',
      'settings/**',
      'packages/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  prettierConfig,

  {
    files: ['assets/**/*.ts'],

    plugins: {
      prettier,
    },

    rules: {
      'prettier/prettier': 'warn',

      '@typescript-eslint/no-explicit-any': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
)