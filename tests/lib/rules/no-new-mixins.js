// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-new-mixins');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const { ERROR_MESSAGE } = rule;
const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});
eslintTester.run('no-new-mixins', rule, {
  valid: [
    `
        import mixin from "some/addon";
        export default mixin;
      `,
    'export default mixin.create({actions: {},});',
  ],
  invalid: [
    {
      code: `
        import Ember from "ember";

        export default Ember.Mixin.create({});
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
    {
      code: `
        import Mixin from "@ember/object/mixin";

        export default Mixin.create({});
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
  ],
});
