const base = require('./base');
const rules = require('../recommended-rules');
const gjsRules = require('../recommended-rules-gjs');
const gtsRules = require('../recommended-rules-gts');
const tsEslintRecommended = require('../ts-eslint-recommended');

module.exports = {
  ...base,
  rules,
  overrides: [
    ...base.overrides,
    { files: ['**/*.gjs'], rules: gjsRules },
    { files: ['**/*.gts'], rules: { ...gtsRules, ...tsEslintRecommended } },
  ],
};
