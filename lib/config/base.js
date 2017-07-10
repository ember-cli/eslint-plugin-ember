const rules = require('../recommended-rules.js');

module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },

  env: {
    browser: true,
    jquery: true,
  },

  plugins: [
    'ember',
  ],

  rules,
};
