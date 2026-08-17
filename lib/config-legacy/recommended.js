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
    // Template rules only report on strict-mode templates, so they are scoped to
    // gjs/gts. `.hbs` linting stays opt-in via the template-lint-migration config.
    { files: ['**/*.gjs'], rules: gjsRules },
    { files: ['**/*.gts'], rules: { ...gtsRules, ...tsEslintRecommended } },
  ],
};
