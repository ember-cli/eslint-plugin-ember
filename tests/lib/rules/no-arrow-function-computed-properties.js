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
    {
      code: `
        computed('prop', function() { return this.prop; });
        computed('prop', function() { return this.prop; }).volatile();
        computed(() => { return 123; });
        computed(() => { return "string stuff"; });
        computed(() => []);
        computed.map('products', product => { return someFunction(product); });
      `,
      options: [{ onlyThisContexts: true }],
    },
    `
    computed();
    computed(function() { return 123; });
    computed('prop', function() { return this.prop; });
    computed('prop', function() { return this.prop; }).volatile();
    computed.map('products', function(product) { return someFunction(product); });
    other(() => {});
    other.computed(() => {});
    `,
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
  ],
});
