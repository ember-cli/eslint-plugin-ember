//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-arrow-function-computed-properties');
const RuleTester = require('eslint').RuleTester;
const { addComputedImport } = require('../../helpers/test-case');

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});
ruleTester.run('no-arrow-function-computed-properties', rule, {
  valid: [
    'computed()',
    'computed(function() { return 123; })',
    'computed("prop", function() { return this.prop; })',
    'computed("prop", function() { return this.prop; }).volatile()',
    'computed.map("products", function(product) { return someFunction(product); })',
    'other(() => {})',
    'other.computed(() => {})',
    {
      code: "computed('prop', function() { return this.prop; });",
      options: [{ onlyThisContexts: true }],
    },
    {
      code: "computed('prop', function() { return this.prop; }).volatile();",
      options: [{ onlyThisContexts: true }],
    },
    {
      code: 'computed(() => { return 123; });',
      options: [{ onlyThisContexts: true }],
    },
    {
      code: 'computed(() => { return "string stuff"; });',
      options: [{ onlyThisContexts: true }],
    },
    {
      code: 'computed(() => []);',
      options: [{ onlyThisContexts: true }],
    },
    {
      code: "computed.map('products', product => { return someFunction(product); });",
      options: [{ onlyThisContexts: true }],
    },
  ].map(addComputedImport),
  invalid: [
    {
      code: 'computed(() => { return 123; })',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
    },
    {
      code: "import Ember from 'ember'; Ember.computed(() => { return 123; })",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
    },
    {
      code: "computed('prop', () => { return this.prop; })",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
    },

    {
      code: "computed('prop', () => { return this.prop; }).volatile()",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
    },
    {
      code: "computed.map('products', product => { return someFunction(product); })",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
    },
    {
      code: "computed('prop', () => { return this.prop; })",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
      options: [{ onlyThisContexts: true }],
    },
    {
      code: "computed('prop', () => { return this.prop; }).volatile()",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
      options: [{ onlyThisContexts: true }],
    },
  ].map(addComputedImport),
});
