//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-at-ember-render-modifiers');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});
ruleTester.run('no-at-ember-render-modifiers', rule, {
  valid: [
    'import x from "x"',
    '',
    "import { x } from 'foo';",
    "import x from '@ember/foo';",
    "import x from '@ember/render-modifiers-foo';",
  ],
  invalid: [
    {
      code: 'import "@ember/render-modifiers";',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
    {
      code: 'import x from "@ember/render-modifiers";',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
    {
      code: 'import { x } from "@ember/render-modifiers";',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
    {
      code: 'import didInsert from "@ember/render-modifiers/modifiers/did-insert";',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
    {
      code: 'import didUpdate from "@ember/render-modifiers/modifiers/did-update";',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
    {
      code: 'import willDestroy from "@ember/render-modifiers/modifiers/will-destroy";',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'ImportDeclaration' }],
    },
  ],
});
