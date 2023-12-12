'use strict';

const requireIndex = require('requireindex');
const noop = require('./preprocessors/noop');

module.exports = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: requireIndex(`${__dirname}/rules`),
  configs: requireIndex(`${__dirname}/config-legacy`),
  utils: {
    ember: require('./utils/ember'),
  },
  processors: {
    // https://eslint.org/docs/developer-guide/working-with-plugins#file-extension-named-processor
    '<noop>': noop,
  },
};
