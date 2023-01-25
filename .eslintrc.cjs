module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:json/recommended',
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/extensions': 0,
    'no-else-return': 0,
    'no-plusplus': 0,
    'no-restricted-syntax': 0,
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: {
        paths: ['src'],
        extensions: ['.js', '.ts'],
      },
    },
  },
  root: true,
};
