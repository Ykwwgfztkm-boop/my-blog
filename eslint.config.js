// ESLint 规则 — 帮你写出规范、干净的代码
module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        console: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        window: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      semi: ['warn', 'always'],
      quotes: ['warn', 'single'],
      indent: ['warn', 2],
      'no-console': 'off',
    },
  },
];
