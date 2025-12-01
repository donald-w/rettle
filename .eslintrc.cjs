module.exports = {
  root: true,
  ignorePatterns: ['**/*.js', '**/dist/**', '**/node_modules/**'],
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module'
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates'
      ],
      rules: {
        '@angular-eslint/prefer-inject': 'off',
        '@angular-eslint/no-empty-lifecycle-method': 'warn',
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_'
          }
        ],
        '@typescript-eslint/no-deprecated': 'error',
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'prefer-const': 'warn'
      }
    },
    {
      files: ['**/*.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off'
      }
    },
    {
      files: ['**/*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {}
    }
  ]
};
