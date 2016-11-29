'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../rules/no-observers');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
eslintTester.run('no-observers', rule, {
  valid: [
    {
      code: 'export default Controller.extend();',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Controller.extend({actions: {},});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    }
  ],
  invalid: [
    {
      code: 'Ember.observer("text", function() {});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Don\'t use observers if possible',
      }],
    }
  ]
});
