'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-test-this-render');
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

ruleTester.run('no-this-render', rule, {
  valid: [
    {
      filename: TEST_FILE_NAME,
      code: "run(() => { console.log('Hello World.'); });",
    },
    {
      filename: TEST_FILE_NAME,
      code: 'myCustomClass.render(myFunction);',
    },
    {
      filename: TEST_FILE_NAME,
      code: 'myCustomClass.clearRender(myFunction);',
    },
    {
      filename: TEST_FILE_NAME,
      code: 'render.otherFunction(myFunction);',
    },
    {
      filename: TEST_FILE_NAME,
      code: 'clearRender.otherFunction(myFunction);',
    },
    {
      filename: 'not-a-test-file.js',
      code: 'async () => { await this.render(); }',
    },
    {
      filename: 'not-a-test-file.js',
      code: 'async () => { await this.clearRender(); }',
    },
  ],
  invalid: [
    {
      filename: TEST_FILE_NAME,
      code: 'async () => { await this.render(); }',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME,
      code: `
        test('foo', async function(assert) {
          await this.render();
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME,
      code: 'async () => { await this.clearRender(); }',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME,
      code: `
        test('foo', async function(assert) {
          await this.clearRender();
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
  ],
});
