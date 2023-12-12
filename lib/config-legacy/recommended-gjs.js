const base = require('./base');
const gjsRules = require('../recommended-rules-gjs');

module.exports = {
  ...base,
  rules: gjsRules,
};
