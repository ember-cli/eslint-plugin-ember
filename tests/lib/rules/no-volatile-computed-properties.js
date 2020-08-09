//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-volatile-computed-properties');
const RuleTester = require('eslint').RuleTester;
const { addComputedImport } = require('../../helpers/test-case');

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2018, sourceType: 'module' } });
ruleTester.run('no-volatile-computed-properties', rule, {
  valid: [
    'computed()',
    "computed('prop', function() { return this.prop; })",
    'computed().other()',
    'volatile()',
    'other().volatile()',
    'volatile().computed()',

    {
      // Decorator:
      code: "class Test { @computed('prop') get someProp() {} }",
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },
  ].map(addComputedImport),
  invalid: [
    {
      code: 'computed().volatile()',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },

    {
      code: "import Ember from 'ember'; Ember.computed().volatile()",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },

    {
      code: "computed('prop', function() { return this.prop; }).volatile()",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },

    {
      // Decorator:
      code: "class Test { @computed('prop').volatile() get someProp() {} }",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },
  ].map(addComputedImport),
});
