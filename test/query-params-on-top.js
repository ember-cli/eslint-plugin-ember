'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../rules/query-params-on-top');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
eslintTester.run('query-params-on-top', rule, {
  valid: [
    {
      code: 'export default Controller.extend({queryParams: ["status"], status: []});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Ember.Controller.extend({queryParams: ["status"], status: []});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Controller.extend({queryParams: ["status"], status: [], actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Controller.extend({});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Controller.extend({status: [], actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Component.extend({status: attr("string"), queryParams: attr("string")});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Controller.extend(TestMixin, {status: [], actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Controller.extend(TestMixin, TestMixin2, {status: [], actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
    {
      code: 'export default Controller.extend({status: [], queryParams: ["status"]});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    },
  ],
  invalid: [
    {
      code: 'export default Controller.extend({status: [], queryParams: ["status"]});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Query params should always be on top',
      }],
    },
    {
      code: 'export default Ember.Controller.extend({status: [], queryParams: ["status"]});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Query params should always be on top',
      }],
    },
    {
      code: 'export default Controller.extend({status: [], queryParams: ["status"], actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Query params should always be on top',
      }],
    },
    {
      code: 'export default Controller.extend(TestMixin, {status: [], queryParams: ["status"], actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Query params should always be on top',
      }],
    },
    {
      code: 'export default Controller.extend(TestMixin, TestMixin2, {status: [], queryParams: ["status"], actions: {}});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Query params should always be on top',
      }],
    }
  ]
});
