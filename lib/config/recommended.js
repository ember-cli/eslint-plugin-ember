const base = require('./base');
const rules = require('../recommended-rules');
const gjsRules = require('../recommended-rules-gjs');
const gtsRules = require('../recommended-rules-gts');

module.exports = [
  ...base,
  { name: 'ember:recommended', rules },
  // Template rules only report on strict-mode templates, so they are scoped to
  // gjs/gts. `.hbs` linting stays opt-in via the template-lint-migration config.
  { name: 'ember:recommended/gjs', files: ['**/*.gjs'], rules: gjsRules },
  { name: 'ember:recommended/gts', files: ['**/*.gts'], rules: gtsRules },
];
