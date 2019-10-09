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
    "computed('prop', function() { return this.prop; })",
    "computed('prop', function() { return this.prop; }).volatile()",
    "computed.map('products', function(product) { return someFunction(product); })",
    'other(() => {})',
    'other.computed(() => {})',
    'computed(() => { return 123; })',
    'computed(() => { return "string stuff"; })',
    'computed(() => [])',
    "computed.map('products', product => { return someFunction(product); })",
  ],
  invalid: [
    {
      code: "computed('prop', () => { return this.prop; })",
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
    },

    {
      code: "computed('prop', () => { return this.prop; }).volatile()",
      errors: [{ message: ERROR_MESSAGE, type: 'ArrowFunctionExpression' }],
    },
  ],
});
