import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

const fileGlob = '*.{ts,tsx,js,jsx,mjs,cjs}';

export default defineConfig([
  globalIgnores(['dist/**', 'coverage/**', 'node_modules/**', 'scripts/**', 'eslint.config.mjs']),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: [`**/${fileGlob}`],
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'prefer-arrow-callback': ['error', { allowNamedFunctions: false, allowUnboundThis: true }],
      'no-inner-declarations': ['error', 'functions'],
      'no-fallthrough': 'off',
      curly: ['error', 'all'],
      '@stylistic/curly-newline': ['error', 'always'],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: ['case', 'default'], next: '*' },
        { blankLine: 'any', prev: ['case', 'default'], next: ['case', 'default'] },
        { blankLine: 'always', prev: '*', next: 'if' },
        { blankLine: 'always', prev: 'if', next: '*' },
        { blankLine: 'always', prev: '*', next: 'try' },
        { blankLine: 'always', prev: 'try', next: '*' },
      ],
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      // TypeScript resolves symbols; Biome reports unused imports/vars.
      'no-undef': 'off',
      'no-unused-vars': 'off',
      // Allows TypeScript overload signatures.
      'no-redeclare': 'off',
    },
  },
]);
