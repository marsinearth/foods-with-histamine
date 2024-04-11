module.exports = {
  root: true,
  extends: [
    'universe',
    'universe/native',
    'universe/web',
    'universe/shared/typescript-analysis'
  ],
  overrides: [{
    files: ['*.ts', '*.tsx', '*.d.ts'],
    parserOptions: {
      project: './tsconfig.json'
    }
  }],
  plugins: ['react-hooks', '@ianvs/prettier-plugin-sort-imports'],
  env: {
    node: true,
  },
  rules: {
    // Ensures props and state inside functions are always up-to-date
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-throw-literal': 'off',
    'prettier/prettier': ['error', { bracketSameLine: false }],
    '@typescript-eslint/prefer-optional-chain': 'off'
  },
};