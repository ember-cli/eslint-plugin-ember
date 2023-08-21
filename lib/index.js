'use strict';

const requireIndex = require('requireindex');

module.exports = {
  rules: requireIndex(`${__dirname}/rules`),
  configs: requireIndex(`${__dirname}/config`),
  utils: {
    ember: require('./utils/ember'),
  },
};
