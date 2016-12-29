'use strict';

var fs = require('fs');
var resolve = require('path').resolve;
var requireIndex = require('requireindex');

var rules = {};
var ruleDir = resolve(__dirname, 'rules');

fs.readdirSync(ruleDir).forEach(function(name) {
  var match = name.match(/(.+)\.js$/);
  if (match) {
    rules[match[1]] = require(resolve(ruleDir, name));
  }
});

var configs = requireIndex(resolve(__dirname, 'config'));

var ember = require(resolve(ruleDir, 'utils/ember'));
var utils = require(resolve(ruleDir, 'utils/utils'));

module.exports = {
  rules: rules,
  configs: configs,
  utils: {
    ember: ember,
    utils: utils
  }
};
