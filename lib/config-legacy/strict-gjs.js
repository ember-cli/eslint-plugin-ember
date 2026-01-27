const base = require('./base');
const gjsRules = require('../strict-rules-gjs');

module.exports = {
  ...base,
  rules: gjsRules,
};
