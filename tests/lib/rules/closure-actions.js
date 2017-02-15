// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/closure-actions');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('closure-actions', rule, {
  valid: [
    {
      code: 'export default Component.extend();',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({actions: {pushLever() {this.attr.boom();}}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
  ],
  invalid: [
    {
      code: 'export default Component.extend({actions: {pushLever() {this.sendAction("detonate");}}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Use closure actions, unless you need bubbling',
      }],
    },
  ],
});
