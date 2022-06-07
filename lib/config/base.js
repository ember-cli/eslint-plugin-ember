module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },

  env: {
    browser: true,
    es6: true,
  },

  plugins: ['ember'],
  processors: {
    'package.json': require('eslint-plugin-json').processors,
  },
};
