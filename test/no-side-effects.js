'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../rules/no-side-effects');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
eslintTester.run('no-side-effects', rule, {
  valid: [
    {
      code: 'testAmount: alias("test.length")',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    }
  ],
  invalid: [
    {
      code: 'prop: computed("test", function() {this.set("testAmount", test.length); return "";})',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Don\'t introduce side-effects in computed properties',
      }],
    }
  ]
});
