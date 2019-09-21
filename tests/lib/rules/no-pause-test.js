'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-pause-test');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const TEST_FILE_NAME = 'some-test.js';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

ruleTester.run('no-pause-test', rule, {
  valid: [
    {
      filename: TEST_FILE_NAME,
      code: "run(() => { console.log('Hello World.'); });",
    },
    {
      filename: TEST_FILE_NAME,
      code: 'myCustomClass.pauseTest(myFunction);',
    },
    {
      filename: TEST_FILE_NAME,
      code: 'pauseTest.otherFunction(myFunction);',
    },
    {
      filename: 'not-a-test-file.js',
      code: 'async () => { await this.pauseTest(); }',
    },
  ],
  invalid: [
    {
      filename: TEST_FILE_NAME,
      code: 'async () => { await this.pauseTest(); }',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME,
      code: 'async () => { await pauseTest(); }',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME,
      code: `
        test('foo', async function(assert) {
          await this.pauseTest();
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME,
      code: `
        test('bar', async function(assert) {
          await pauseTest();
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME,
      code: `
        test('baz', function(assert) {
          this.pauseTest();
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
  ],
});
