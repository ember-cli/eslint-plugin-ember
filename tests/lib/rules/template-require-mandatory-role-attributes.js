const rule = require('../../../lib/rules/template-require-mandatory-role-attributes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-mandatory-role-attributes', rule, {
  valid: [
    '<template><div role="checkbox" aria-checked="false">Checkbox</div></template>',
    '<template><div role="slider" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">Slider</div></template>',
    '<template><div role="switch" aria-checked="true">Switch</div></template>',
  ],

  invalid: [
    {
      code: '<template><div role="checkbox">Checkbox</div></template>',
      output: null,
      errors: [{ messageId: 'missingAttribute' }],
    },
    {
      code: '<template><div role="slider">Slider</div></template>',
      output: null,
      errors: [
        { messageId: 'missingAttribute' },
        { messageId: 'missingAttribute' },
        { messageId: 'missingAttribute' },
      ],
    },
    {
      code: '<template><div role="switch">Switch</div></template>',
      output: null,
      errors: [{ messageId: 'missingAttribute' }],
    },
  ],
});
