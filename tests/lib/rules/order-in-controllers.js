'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/order-in-controllers');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
eslintTester.run('order-in-controllers', rule, {
  valid: [
    {
      code: `export default Controller.extend();`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Controller.extend({
        currentUser: service(),
        queryParams: [],
        customProp: "test",
        actions: {},
        _customAction() {},
        _customAction2: function() {},
        tSomeTask: task(function* () {})
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Controller.extend({
        queryParams: [],
        customProp: "test",
        comp: computed("test", function() {}),
        obs: observer("asd", function() {}),
        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Controller.extend({
        customProp: "test",
        comp: computed("test", function() {}),
        comp2: computed("test", function() {
        }),
        actions: {},
        _customAction() {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
  ],
  invalid: [
    {
      code: `export default Controller.extend({
        queryParams: [],
        currentUser: service()
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: `export default Controller.extend({
        currentUser: service(),
        customProp: "test",
        queryParams: []
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: `export default Controller.extend({
        queryParams: [],
        actions: {},
        customProp: "test"
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: `export default Controller.extend({
        queryParams: [],
        _customAction() {},
        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: `export default Controller.extend({
        test: "asd",
        queryParams: [],
        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: `export default Controller.extend({
        test: "asd",
        obs: observer("asd", function() {}),
        comp: computed("asd", function() {}),
        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
  ]
});
