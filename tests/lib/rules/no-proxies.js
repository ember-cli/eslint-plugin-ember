//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-proxies');
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

ruleTester.run('no-proxies', rule, {
  valid: [
    "import ANYTHING from '@ember/object';",
    "import { ANYTHING } from '@ember/object';",

    "import ObjectProxy from 'something/else';",
    "import { ObjectProxy } from 'something/else';",
  ],
  invalid: [
    {
      code: "import ObjectProxy from '@ember/object/proxy';",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
    {
      code: "import ArrayProxy from '@ember/array/proxy';",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
  ],
});
