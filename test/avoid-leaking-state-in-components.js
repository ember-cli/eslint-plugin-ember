'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../rules/avoid-leaking-state-in-components');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
eslintTester.run('avoid-leaking-state-in-components', rule, {
  valid: [
    {
      code: 'export default Component.extend({someProp: "example", init() { this.set("anotherProp", []) } });',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    }
  ],
  invalid: [
    {
      code: 'export default Component.extend({someProp: []});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Avoid using arrays as default properties',
      }],
    },
    {
      code: 'export default Component.extend({someProp: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Avoid using objects as default properties',
      }],
    },
  ]
});
