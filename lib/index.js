'use strict';

const requireIndex = require('requireindex');
const noop = require('./preprocessors/noop');

module.exports = {
  rules: requireIndex(`${__dirname}/rules`),
  configs: requireIndex(`${__dirname}/config`),
  utils: {
    ember: require('./utils/ember'),
  },
  processors: {
    // https://eslint.org/docs/developer-guide/working-with-plugins#file-extension-named-processor
    '<noop>': noop,
  },
};
