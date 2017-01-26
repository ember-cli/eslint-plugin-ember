'use strict';

var resolve = require('path').resolve;
var requireIndex = require('requireindex');

var rules = requireIndex(resolve(__dirname, 'lib/rules'));
var configs = requireIndex(resolve(__dirname, 'config'));

var ember = require(resolve(__dirname, 'lib/utils/ember'));
var utils = require(resolve(__dirname, 'lib/utils/utils'));

module.exports = {
  rules: rules,
  configs: configs,
  utils: {
    ember: ember,
    utils: utils
  }
};
