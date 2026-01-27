const rule = require('../../../lib/rules/template-require-aria-activedescendant-tabindex');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-aria-activedescendant-tabindex', rule, {
  valid: [
    '<template><div aria-activedescendant="item-1" tabindex="0">List</div></template>',
    '<template><div aria-activedescendant="item-2" tabindex="-1">List</div></template>',
    '<template><div>Normal div</div></template>',
  ],

  invalid: [
    {
      code: '<template><div aria-activedescendant="item-1">List</div></template>',
      output: null,
      errors: [{ messageId: 'missingTabindex' }],
    },
    {
      code: '<template><ul aria-activedescendant="option-1">Options</ul></template>',
      output: null,
      errors: [{ messageId: 'missingTabindex' }],
    },
    {
      code: '<template><span aria-activedescendant="elem">Container</span></template>',
      output: null,
      errors: [{ messageId: 'missingTabindex' }],
    },
  ],
});
