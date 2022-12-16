//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-tracked-properties-from-args');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('no-tracked-properties-from-args', rule, {
  valid: [
    `class Test {
        @someDecorator test = this.args.test
      }`,
    `class Test {
        @tracked test = this.someValue
      }`,
    `class Test {
        @tracked test = 7
      }`,
    `class Test {
        test = 7
      }`,
    `class Test {
        test = "test"
      }`,
  ],
  invalid: [
    {
      code: `class Test {
        @tracked test = this.args.test;
      }`,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'PropertyDefinition',
        },
      ],
    },
    {
      code: `class Test {
        @tracked 
        test = this.args.test;
      }`,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'PropertyDefinition',
        },
      ],
    },
  ],
});
