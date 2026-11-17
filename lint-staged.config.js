module.exports = {
  '*.{ts,tsx,js}': ['eslint --fix', 'prettier --write'],
  '*.go': () => 'gofmt -l services/marketdata',
  '*.py': ['ruff check --fix'],
};
