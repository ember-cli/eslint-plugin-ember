'use strict';

const rule = require('../../../lib/rules/no-string-prototype-extensions');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

const ruleTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
});

ruleTester.run('no-string-prototype-extensions', rule, {
  valid: [
    "import { dasherize } from '@ember/string'; dasherize('myString')",
    "import { capitalize } from '@ember/string'; capitalize(someString)",
    "import { htmlSafe } from '@ember/template'; htmlSafe('<b>foo</b>')",
    "someString['foo']()",
    'something.foo()',
    'dasherize.foo()',
    'this.dasherize()',

    // Still allowed to use directly from Ember:
    "import Ember from 'ember'; Ember.String.htmlSafe('foo');",
    "import Ember from 'ember'; Ember.String.dasherize('foo');",
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
