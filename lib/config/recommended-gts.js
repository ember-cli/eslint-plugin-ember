const base = require('./base');
const gtsRules = require('../recommended-rules-gts');
const tsRecommended = require('../ts-recommended-rules');

module.exports = [...base, { rules: { ...gtsRules, ...tsRecommended } }];
