// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-return-from-computed');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: { legacyDecorators: true },
  },
});

eslintTester.run('require-return-from-computed', rule, {
  valid: [
    'let foo = computed("test", function() { return ""; })',
    'let foo = computed("test", { get() { return true; }, set() { return true; } })',
    'let foo = computed("test", function() { if (true) { return ""; } return ""; })',
    'let foo = computed("test", { get() { data.forEach(function() { }); return true; }, set() { return true; } })',
    'let foo = computed("test", function() { data.forEach(function() { }); return ""; })',
    'class Test { @computed() get someProp() { return 123; } }', // Decorator (with parenthesis).
    'class Test { @computed get someProp() { return 123; } }', // Decorator (without parenthesis).
    'class Test { @computed set someProp(val) { return true; } get someProp() { return 123; } }', // Decorator with getter and setter.
    'class Test { @computed get someProp() { return 123; } get otherProp() {} set otherProp(val) {} }', // Decorator plus other unrelated getter/setter properties.
  ],
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
    {
      // Decorator (with parenthesis):
      code: 'class Test { @computed() get someProp() {} }',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'FunctionExpression' }],
    },
    {
      // Decorator (without parenthesis):
      code: 'class Test { @computed get someProp() {} }',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'FunctionExpression' }],
    },
    {
      // Decorator with getter and setter:
      code: 'class Test { @computed set someProp(val) {} get someProp() {} }',
      output: null,
      errors: [
        { message: ERROR_MESSAGE, type: 'FunctionExpression' },
        { message: ERROR_MESSAGE, type: 'FunctionExpression' },
      ],
    },
  ],
});
