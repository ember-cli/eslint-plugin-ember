//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-test-and-then');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

const TEST_FILE_NAME = 'some-test.js';

ruleTester.run('no-test-and-then', rule, {
  valid: [
    {
      filename: TEST_FILE_NAME,
      code: "run(() => { console.log('Hello World.'); });",
    },
    {
      filename: TEST_FILE_NAME,
      code: 'myCustomClass.andThen(myFunction);',
    },
    {
      filename: TEST_FILE_NAME,
      code: 'andThen.otherFunction(myFunction);',
    },
    {
      filename: 'not-a-test-file.js',
      code: 'andThen(() => { assert.ok(myBool); });',
    },
  ],
  invalid: [
    {
      filename: TEST_FILE_NAME,
      code: 'andThen(() => { assert.ok(myBool); });',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
  ],
});
