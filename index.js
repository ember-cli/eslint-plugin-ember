'use strict';

const resolve = require('path').resolve;
const requireIndex = require('requireindex');

const rules = requireIndex(resolve(__dirname, 'lib/rules'));
const configs = requireIndex(resolve(__dirname, 'config'));

/* eslint-disable import/no-dynamic-require */
const ember = require(resolve(__dirname, 'lib/utils/ember'));
const utils = require(resolve(__dirname, 'lib/utils/utils'));

module.exports = {
  rules,
  configs,
  utils: {
    ember,
    utils,
  },
};
