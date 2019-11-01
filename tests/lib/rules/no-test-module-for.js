//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-test-module-for');
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

const TEST_FILE_NAME = 'some-test.js';

ruleTester.run('no-test-module-for', rule, {
  valid: [
    {
      filename: TEST_FILE_NAME,
      code: 'module()',
    },
    {
      filename: 'not-a-test-file.js',
      code: 'moduleFor()',
    },
    {
      filename: 'tests/helpers/something.js',
      code: 'export default function dosomething() {}',
    },
  ],
  invalid: [
    {
      filename: TEST_FILE_NAME,
      code: 'moduleFor()',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME,
      code: 'moduleForComponent()',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME,
      code: 'moduleForAcceptance()',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME,
      code: 'moduleForBespoke()',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      filename: 'tests/helpers/module-for-acceptance',
      code: 'export default function moduleForAcceptance() {}',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
  ],
});
