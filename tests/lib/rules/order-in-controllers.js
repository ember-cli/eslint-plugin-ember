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
    {
      code: `export default Controller.extend({
        actions: {},
        comp: computed("test", function() {}),
        customProp: "test",
        comp2: computed("test", function() {
        }),
        _customAction() {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      options: [{
        order: [
          'actions',
          'single-line-function',
        ],
      }],
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
        message: 'The "currentUser" service injection should be above the "queryParams" default property on line 2',
        line: 3
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
        message: 'The "queryParams" default property should be above the "customProp" property on line 3',
        line: 4
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
        message: 'The "customProp" property should be above the actions hash on line 3',
        line: 4
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
        message: 'The actions hash should be above the "_customAction" method on line 3',
        line: 4
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
        message: 'The "queryParams" default property should be above the "test" property on line 2',
        line: 3
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
        message: 'The "comp" single-line function should be above the "obs" observer on line 3',
        line: 4
      }],
    },
  ]
});
