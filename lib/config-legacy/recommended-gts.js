const base = require('./base');
const gtsRules = require('../recommended-rules-gts');

module.exports = {
  ...base,
  rules: gtsRules,
};
