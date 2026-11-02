const base = require('./base');
const rules = require('../recommended-rules-v13');

module.exports = [...base, { name: 'ember:recommended-v13', rules }];
