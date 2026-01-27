const base = require('./base');
const gtsRules = require('../strict-rules-gts');

module.exports = [...base, { rules: gtsRules }];
