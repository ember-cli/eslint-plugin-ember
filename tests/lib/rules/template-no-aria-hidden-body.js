const rule = require('../../../lib/rules/template-no-aria-hidden-body');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-aria-hidden-body', rule, {
  valid: [
    '<template><body></body></template>',
    '<template><div aria-hidden="true"></div></template>',
  ],
  invalid: [
    {
      code: '<template><body aria-hidden="true"></body></template>',
      output: '<template><body></body></template>',
      errors: [{ messageId: 'noAriaHiddenBody' }],
    },
  ],
});
