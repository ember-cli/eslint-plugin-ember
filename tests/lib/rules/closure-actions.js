// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/closure-actions');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

eslintTester.run('closure-actions', rule, {
  valid: [
    'export default Component.extend();',
    'export default Component.extend({actions: {pushLever() {this.attr.boom();}}});',
  ],
  invalid: [
    {
      code: 'export default Component.extend({actions: {pushLever() {this.sendAction("detonate");}}});',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
  ],
});
