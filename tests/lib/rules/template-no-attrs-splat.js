const rule = require('../../../lib/rules/template-no-attrs-splat');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-attrs-splat', rule, {
  valid: [
    {
      filename: 'test.gjs',
      code: '<template><div ...attributes>Content</div></template>',
      output: null,
    },
    {
      filename: 'test.gjs',
      code: '<template><MyComponent ...attributes /></template>',
      output: null,
    },
  ],

  invalid: [
    {
      filename: 'test.gjs',
      code: '<template><div {{...attrs}}>Content</div></template>',
      output: null,
      errors: [{ messageId: 'noAttrsSplat' }],
    },
  ],
});
