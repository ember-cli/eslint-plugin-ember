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
      code: "import SortableMixin from 'ember-controllers/sortable';",
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message: 'Importing default from ember-controllers/sortable is deprecated.' }]
    },
    {
      code: "import destroy from 'ember-metal/destroy';",
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message: 'Importing default from ember-metal/destroy is deprecated.' }]
    },
    {
      code: "import OrderedSet from 'ember-set/ordered';",
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message: 'Importing default from ember-set/ordered is deprecated.' }]
    },
    {
      code: "import EmberTest from 'ember-test';",
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message: 'Importing default from ember-test is deprecated.' }]
    },
    {
      code: "import QUnitAdapter from 'ember-test/qunit-adapter';",
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message: 'Importing default from ember-test/qunit-adapter is deprecated.' }]
    },
    {
      code: "import { default as destroy } from 'ember-metal/destroy';",
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message: 'Importing default from ember-metal/destroy is deprecated.' }],
    },
    {
      code: "import EmberTest from 'ember-test';\nimport QUnitAdapter from 'ember-test/qunit-adapter';",
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        { message: 'Importing default from ember-test is deprecated.' },
        { message: 'Importing default from ember-test/qunit-adapter is deprecated.' }
      ],
    },
  ],
});
