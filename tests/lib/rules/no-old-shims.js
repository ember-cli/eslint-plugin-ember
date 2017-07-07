// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-old-shims');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('no-old-shims', rule, {
  valid: [
    {
      code: 'import Ember from \'ember\';',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import RSVP from \'rsvp\';',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
  ],
  invalid: [
    {
      code: 'import Component from \'ember-component\';',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message: 'Don\'t use import paths from ember-cli-shims' }],
    },
    {
      code: 'import { dasherize } from \'ember-string\';',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message: 'Don\'t use import paths from ember-cli-shims' }],
    },
    {
      code: 'import computed, { not } from \'ember-computed\';',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message: 'Don\'t use import paths from ember-cli-shims' }],
    },
  ],
});
