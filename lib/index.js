'use strict';

const requireIndex = require('requireindex');

const gjs = require('./preprocessors/glimmer');

module.exports = {
  rules: requireIndex(`${__dirname}/rules`),
  configs: requireIndex(`${__dirname}/config`),
  utils: {
    ember: require('./utils/ember'),
  },
  processors: {
    // https://eslint.org/docs/developer-guide/working-with-plugins#file-extension-named-processor
    '.gjs': gjs,
    '.gts': gjs,
    '<template>': gjs,
  },
};
