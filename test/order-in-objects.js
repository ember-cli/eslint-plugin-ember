'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../rules/order-in-objects');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
eslintTester.run('order-in-objects', rule, {
  valid: [
    {
      code: 'export default Component.extend({role: "sloth", vehicle: alias("car"), levelOfHappiness: computed("attitude", "health", () => {\n}), actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({role: "sloth", levelOfHappiness: computed("attitude", "health", () => {\n}), actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({levelOfHappiness: computed("attitude", "health", () => {\n}), actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    }
  ],
  invalid: [
    {
      code: 'export default Component.extend({actions: {}, role: "sloth", vehicle: alias("car"), levelOfHappiness: computed("attitude", "health", () => {\n})});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Component.extend({vehicle: alias("car"), role: "sloth", levelOfHappiness: computed("attitude", "health", () => {\n}), actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Component.extend({levelOfHappiness: computed("attitude", "health", () => {\n}), vehicle: alias("car"), role: "sloth", actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    }
  ]
});
