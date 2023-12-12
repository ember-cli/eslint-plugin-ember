//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-html-safe');
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

ruleTester.run('no-html-safe', rule, {
  valid: [
    // Wrong function:
    "import { ANYTHING } from '@ember/string'; ANYTHING('foo');",
    "import { ANYTHING } from '@ember/template'; ANYTHING('foo');",

    // Wrong import path:
    "import { htmlSafe } from 'something/else'; htmlSafe('foo');",

    // No import:
    "htmlSafe('foo');",
    "import EmberString from '@ember/string'; htmlSafe('foo');",

    // Wrong object:
    "import { htmlSafe } from '@ember/string'; foo.htmlSafe('foo');",
    "import { htmlSafe } from '@ember/string'; htmlSafe.foo('foo');",
  ],
  invalid: [
    {
      code: "import { htmlSafe } from '@ember/string'; htmlSafe('foo');",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: "import { htmlSafe } from '@ember/template'; htmlSafe('foo');",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: "import { htmlSafe as myCustomNameForHtmlSafe } from '@ember/template'; myCustomNameForHtmlSafe();",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
  ],
});
