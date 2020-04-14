'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-this-render');
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
      code: 'render.otherFunction(myFunction);',
    },
    {
      filename: 'not-a-test-file.js',
      code: 'async () => { await this.render(); }',
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
  ],
});
