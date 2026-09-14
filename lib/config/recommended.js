const base = require('./base');
const rules = require('../recommended-rules');
const gjsRules = require('../recommended-rules-gjs');
const gtsRules = require('../recommended-rules-gts');
const tsEslintRecommended = require('../ts-eslint-recommended');

module.exports = [
  ...base,
  { name: 'ember:recommended', rules },
  { name: 'ember:recommended-gjs', files: ['**/*.gjs'], rules: gjsRules },
  {
    name: 'ember:recommended-gts',
    files: ['**/*.gts'],
    rules: { ...gtsRules, ...tsEslintRecommended },
  },
];
