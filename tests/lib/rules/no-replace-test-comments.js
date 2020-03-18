'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-replace-test-comments');

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('no-replace-test-comments', rule, {
  valid: [
    '// some harmless comment',
    'myCodeWithoutAComment = "fooBar"',
    {
      filename: 'app/some-app-file.js',
      code: '// Replace this with your real tests',
      output: null,
    },
  ],

  invalid: [
    {
      filename: 'test/some-app-file-test.js',
      code: '// Replace this with your real tests',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'Line',
        },
      ],
    },
  ],
});
