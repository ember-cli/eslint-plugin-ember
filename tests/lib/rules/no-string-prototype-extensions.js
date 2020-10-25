'use strict';

const rule = require('../../../lib/rules/no-string-prototype-extensions');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

const ruleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

ruleTester.run('no-string-prototype-extensions', rule, {
  valid: [
    "dasherize('myString')",
    'capitalize(someString)',
    "htmlSafe('<b>foo</b>')",
    "someString['foo']()",
    'something.foo()',
    'dasherize.foo()',
    'this.dasherize()',
  ],

  invalid: [
    {
      code: "'myString'.dasherize()",
      output: null,
      errors: [{ message: ERROR_MESSAGE, column: 12, endColumn: 21 }],
    },
    {
      code: 'someString.capitalize()',
      output: null,
      errors: [{ message: ERROR_MESSAGE, column: 12, endColumn: 22 }],
    },
    {
      code: 'getSomeString().dasherize()',
      output: null,
      errors: [{ message: ERROR_MESSAGE, column: 17, endColumn: 26 }],
    },
    {
      code: "'<b>foo</b>'.htmlSafe()",
      output: null,
      errors: [{ message: ERROR_MESSAGE, column: 14, endColumn: 22 }],
    },
  ],
});
