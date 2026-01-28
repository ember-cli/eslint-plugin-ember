const rule = require('../../../lib/rules/template-no-attrs-splat');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-attrs-splat', rule, {
  valid: [
    {
      code: '<template><div ...attributes>Content</div></template>',
      filename: 'test.gjs',
      output: null,
    },
    {
      code: '<template><MyComponent ...attributes /></template>',
      filename: 'test.gjs',
      output: null,
    },
  ],

  invalid: [
    {
      code: '<template><div {{...attrs}}>Content</div></template>',
      filename: 'test.gjs',
      output: null,
      errors: [{ messageId: 'noAttrsSplat' }],
    },
  ],
});
