'use strict';

/* eslint-disable global-require */

var fs = require('fs');
var path = require('path');
var environments = require('./environments');

var rules = {};
var ruleDir = path.join(__dirname, 'rules');

fs.readdirSync(ruleDir).forEach(function(name) {
  var match = name.match(/(.+)\.js$/);
  if (match) {
    rules[match[1]] = require(path.join(ruleDir, name));
  }
});

var ember = require(path.join(ruleDir, 'utils/ember'));
var utils = require(path.join(ruleDir, 'utils/utils'));

module.exports = {
  rules: rules,
  environments: environments,
  utils: {
    ember: ember,
    utils: utils
  }
};
