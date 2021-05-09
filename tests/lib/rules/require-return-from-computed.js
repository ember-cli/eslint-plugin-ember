// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-return-from-computed');
const RuleTester = require('eslint').RuleTester;
const { addComputedImport } = require('../../helpers/test-case');

const { ERROR_MESSAGE } = rule;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

eslintTester.run('require-return-from-computed', rule, {
  valid: [
    'let foo = computed("test", function() { return ""; })',
    'let foo = computed("test", { get() { return true; }, set() { return true; } })',
    'let foo = computed("test", function() { if (true) { return ""; } return ""; })',
    'let foo = computed("test", { get() { data.forEach(function() { }); return true; }, set() { return true; } })',
    'let foo = computed("test", function() { data.forEach(function() { }); return ""; })',

    {
      // This rule intentionally does not apply to native classes / decorator usage.
      // ESLint already has its own recommended rules `getter-return` and `no-setter-return` for this.
      code: 'class Test { @computed() get someProp() {} set someProp(val) {} }',
      parser: require.resolve('@babel/eslint-parser'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },
  ].map(addComputedImport),
  invalid: [
    {
      code: 'let foo = computed("test", function() { })',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'FunctionExpression',
        },
      ],
    },
    {
      code: "import Ember from 'ember'; let foo = Ember.computed('test', function() { })",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'FunctionExpression',
        },
      ],
    },
    {
      code: 'let foo = computed("test", function() { if (true) { return ""; } })',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'FunctionExpression',
        },
      ],
    },
    {
      code: 'let foo = computed("test", { get() {}, set() {} })',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'FunctionExpression',
        },
        {
          message: ERROR_MESSAGE,
          type: 'FunctionExpression',
        },
      ],
    },
    {
      code: 'let foo = computed({ get() { return "foo"; }, set() { }})',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'FunctionExpression',
        },
      ],
    },
    {
      code: 'let foo = computed({ get() { }, set() { return "foo"; }})',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'FunctionExpression',
        },
      ],
    },
  ].map(addComputedImport),
});
