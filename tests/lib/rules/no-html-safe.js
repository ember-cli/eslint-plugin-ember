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
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

ruleTester.run('no-html-safe', rule, {
  valid: [
    "import { ANYTHING } from '@ember/string';",
    "import { ANYTHING } from '@ember/template';",
    "import { htmlSafe } from 'something/else';",
    "import EmberString from '@ember/string';",
  ],
  invalid: [
    {
      code: "import { htmlSafe } from '@ember/string';",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportSpecifier' }],
    },
    {
      code: "import { htmlSafe } from '@ember/template';",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportSpecifier' }],
    },
    {
      code: "import { htmlSafe as myCustomNameForHtmlSafe } from '@ember/template';",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportSpecifier' }],
    },
  ],
});
