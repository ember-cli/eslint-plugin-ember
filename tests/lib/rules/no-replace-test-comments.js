/**
 * @fileoverview No &#39;Replace this with your real tests&#39; comments
 * @author Jay Gruber
 */

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
  valid: ['// some harmless comment', 'const myCodeWithoutAComment = "fooBar"'],

  invalid: [
    {
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
