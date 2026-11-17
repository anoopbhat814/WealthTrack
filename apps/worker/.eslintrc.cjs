module.exports = {
  extends: ['../../.eslintrc.cjs'],
  parserOptions: { sourceType: 'script' },
  env: { node: true, browser: false },
  rules: { '@typescript-eslint/no-var-requires': 'off', 'no-console': ['warn', { allow: ['info', 'warn', 'error'] }] },
};
