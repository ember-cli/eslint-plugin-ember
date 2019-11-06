// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-observers');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

eslintTester.run('no-observers', rule, {
  valid: [
    'export default Controller.extend();',
    'export default Controller.extend({actions: {},});',
  ],
  invalid: [
    {
      code: 'Ember.observer("text", function() {});',
      output: null,
      errors: [
        {
          message: "Don't use observers if possible",
        },
      ],
    },
  ],
});
