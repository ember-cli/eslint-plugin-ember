'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/order-in-routes');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
eslintTester.run('order-in-routes', rule, {
  valid: [
    {
      code: `export default Route.extend();`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Route.extend({
        currentUser: service(),
        queryParams: {},
        customProp: "test",
        model() {},
        beforeModel() {},
        actions: {},
        _customAction() {},
        _customAction2: function() {},
        tSomeTask: task(function* () {})
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Route.extend({
        model() {},
        actions: { 
          test() { return this._customAction() }
        },
        _customAction() {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Route.extend({
        model() {},
        render() {},
        init() {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Route.extend({
        mergedProperties: {},
        model() {},
        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: `export default Route.extend({
        mergedProperties: {},
        test: "asd",
        model() {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
  ],
  invalid: [
    {
      code: `export default Route.extend({
        queryParams: {},
        currentUser: service(),
        customProp: "test",
        model() {},
        beforeModel() {},
        actions: {},
        _customAction() {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'The service injection should be above the default property on line 2',
        line: 3,
      }],
    },
    {
      code: `export default Route.extend({
        customProp: "test",
        queryParams: {},
        model() {},
        beforeModel() {},
        actions: {},
        _customAction() {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'The default property should be above the property on line 2',
        line: 3,
      }],
    },
    {
      code: `export default Route.extend({
        customProp: "test",
        queryParams: {},
        beforeModel() {},
        model() {},
        actions: {},
        _customAction() {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'The default property should be above the property on line 2',
        line: 3,
      }, {
        message: 'The model hook should be above the lifecycle hook on line 4',
        line: 5,
      }],
    },
    {
      code: `export default Route.extend({
        queryParams: {},
        customProp: "test",
        model() {},
        _customAction() {},
        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'The actions hash should be above the custom method on line 5',
        line: 6,
      }],
    },
    {
      code: `export default Route.extend({
        model() {},
        customProp: "test",
        actions: {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'The property should be above the model hook on line 2',
        line: 3,
      }],
    },
    {
      code: `export default Route.extend({
        test: "asd",
        mergedProperties: {},
        model() {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'The default property should be above the property on line 2',
        line: 3,
      }],
    },
    {
      code: `export default Route.extend({
        test: "asd",
        _test2() {},
        model() {}
      });`,
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'The model hook should be above the custom method on line 3',
        line: 4,
      }],
    },
  ]
});
