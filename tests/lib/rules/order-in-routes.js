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
      code: 'export default Route.extend();',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Route.extend({currentUser: service(), queryParams: {}, customProp: "test", model() {}, beforeModel() {}, actions: {}, _customAction() {}, _customAction2: function() {}, tSomeTask: task(function* () {}) });',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Route.extend({model() {}, actions: { test() { return this._customAction() } }, _customAction() {} });',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Route.extend({model() {}, render() {}, init() {} });',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Route.extend({mergedProperties: {}, model() {}, actions: {} });',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Route.extend({mergedProperties: {}, test: "asd", model() {} });',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
  ],
  invalid: [
    {
      code: 'export default Route.extend({queryParams: {}, currentUser: service(), customProp: "test", model() {}, beforeModel() {}, actions: {}, _customAction() {} });',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Route.extend({customProp: "test", queryParams: {}, model() {}, beforeModel() {}, actions: {}, _customAction() {} });',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Route.extend({customProp: "test", queryParams: {}, beforeModel() {}, model() {}, actions: {}, _customAction() {} });',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Route.extend({queryParams: {}, customProp: "test", model() {}, _customAction() {}, actions: {} });',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Route.extend({model() {}, customProp: "test", actions: {} });',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Route.extend({test: "asd", mergedProperties: {}, model() {} });',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
    {
      code: 'export default Route.extend({test: "asd", _test2() {}, model() {} });',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Check order of properties',
      }],
    },
  ]
});
