//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-arrow-function-computed-properties');
const RuleTester = require('eslint').RuleTester;

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
      code: `computed('prop', function() { return this.prop; });`,
      options: [{ onlyThisContexts: true }],
    },
    {
      code: `computed('prop', function() { return this.prop; }).volatile();`,
      options: [{ onlyThisContexts: true }],
    },
    {
      code: `computed(() => { return 123; });`,
      options: [{ onlyThisContexts: true }],
    },
    {
      code: `computed(() => { return "string stuff"; });`,
      options: [{ onlyThisContexts: true }],
    },
    {
      code: `computed(() => []);`,
      options: [{ onlyThisContexts: true }],
    },
    {
      code: `computed.map('products', product => { return someFunction(product); });`,
      options: [{ onlyThisContexts: true }],
    },
  ],
  invalid: [
    {
      code: 'computed(() => { return 123; })',
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
    },
    {
      code: "computed('prop', () => { return this.prop; })",
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
    },

    {
      code: "computed('prop', () => { return this.prop; }).volatile()",
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
    },
    {
      code: "computed.map('products', product => { return someFunction(product); })",
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
    },
    {
      code: 'computed(() => { return 123; })',
      errors: [],
      options: [{ onlyThisContexts: true }],
    },
    {
      code: "computed('prop', () => { return this.prop; })",
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
      options: [{ onlyThisContexts: true }],
    },
    {
      code: "computed('prop', () => { return this.prop; }).volatile()",
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
      options: [{ onlyThisContexts: true }],
    },
  ],
});
