'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../rules/closure-actions');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
eslintTester.run('closure-actions', rule, {
  valid: [
    {
      code: 'export default Component.extend({actions: {pushLever() {this.attr.boom();}}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    }
  ],
  invalid: [
    {
      code: 'export default Component.extend({actions: {pushLever() {this.sendAction("detonate");}}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Use closure actions, unless you need bubbling',
      }],
    }
  ]
});
