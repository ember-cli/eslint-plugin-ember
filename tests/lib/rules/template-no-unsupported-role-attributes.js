const rule = require('../../../lib/rules/template-no-unsupported-role-attributes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-unsupported-role-attributes', rule, {
  valid: [
    '<template><div role="button" aria-pressed="true">Toggle</div></template>',
    '<template><div role="checkbox" aria-checked="false">Check</div></template>',
    '<template><div role="slider" aria-valuenow="50">Slider</div></template>',
  ],

  invalid: [
    {
      code: '<template><div role="button" aria-checked="true">Button</div></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template><div role="checkbox" aria-pressed="false">Check</div></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template><div role="tab" aria-valuenow="1">Tab</div></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
  ],
});
