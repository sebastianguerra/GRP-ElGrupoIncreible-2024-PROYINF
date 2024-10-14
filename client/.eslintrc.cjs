module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:@typescript-eslint/strict-type-checked',
    'airbnb-typescript',
    'plugin:prettier/recommended',
    'plugin:@dword-design/import-alias/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    '@typescript-eslint',
    'import',
    'react',
    'react-hooks',
    'prettier',
    'unused-imports',
  ],
  parserOptions: {
    project: ['./tsconfig.app.json'],
    tsconfigRootDir: __dirname,
  },
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/function-component-definition': ['error', { unnamedComponents: 'arrow-function' }],
    'sort-imports': ['error', { ignoreDeclarationSort: true, ignoreCase: true }],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
        ],
        distinctGroup: true,
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    eqeqeq: ['error', 'always'],
    'no-else-return': ['error', { allowElseIf: false }],
    yoda: ['error', 'never', { exceptRange: false }],
    'capitalized-comments': [
      'error',
      'always',
      { ignoreConsecutiveComments: true, ignoreInlineComments: true },
    ],
    'eol-last': ['error', 'always'],
    'unused-imports/no-unused-imports': 2,
    'import/no-unresolved': 'error',
    '@dword-design/import-alias/prefer-alias': [
      'error',
      {
        alias: {
          '@': './src',
        },
      },
    ],
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      {
        allowNumber: true,
        allowBoolean: false,
        allowNullish: false,
        allowAny: false,
      },
    ],
    'complexity': ['error', 3]
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.app.json',
      },
    },
  },
};
