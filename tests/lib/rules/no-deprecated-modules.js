// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-deprecated-modules');
const RuleTester = require('eslint').RuleTester;

const message = 'Don\'t use deprecated import paths';

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
      output: 'import Component from \'@ember/component\';',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message }],
    },
    {
      code: 'import { capitalize, dasherize, foo } from \'ember-string\';',
      output: 'import { capitalize, dasherize } from \'@ember/string\';\nimport { foo } from \'ember-string\';',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message }],
    },
    {
      code: 'import computed, { not } from \'ember-computed\';',
      output: 'import { computed } from \'@ember/object\';\nimport { not } from \'@ember/object/computed\';',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message }],
    },
    {
      code: 'import { log } from \'ember-debug\';',
      output: 'import { debug as log } from \'@ember/debug\';',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message }],
    },
    {
      code: 'import { log as debug } from \'ember-debug\';',
      output: 'import { debug } from \'@ember/debug\';',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message }],
    },
    {
      code: 'import Service from \'ember-service\';\nimport inject from \'ember-service/inject\';',
      output: 'import Service from \'@ember/service\';\nimport { inject } from \'@ember/service\';',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        { message },
        { message },
      ],
    },
  ],
});
