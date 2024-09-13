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
    'react/function-component-definition': [
      'error',
      { unnamedComponents: 'arrow-function' },
    ],
    'sort-imports': ['error', { ignoreDeclarationSort: true, ignoreCase: true }],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      },
    ],
    'eqeqeq': ['error', 'always'],
    'no-else-return': ['error', { allowElseIf: false }],
    'yoda': ['error', 'never', { exceptRange: false }],
    'capitalized-comments': ['error', 'always', { ignoreConsecutiveComments: true }],
    'eol-last': ['error', 'always'],
    'unused-imports/no-unused-imports': 2,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
