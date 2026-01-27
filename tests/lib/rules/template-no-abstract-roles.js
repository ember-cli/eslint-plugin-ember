const rule = require('../../../lib/rules/template-no-abstract-roles');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-abstract-roles', rule, {
  valid: [
    '<template><div role="button"></div></template>',
    '<template><div></div></template>',
  ],
  invalid: [
    {
      code: '<template><div role="command"></div></template>',
      errors: [{ messageId: 'abstractRole' }],
    },
    {
      code: '<template><div role="widget"></div></template>',
      errors: [{ messageId: 'abstractRole' }],
    },
  ],
});
