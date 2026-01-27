const rule = require('../../../lib/rules/template-require-splattributes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-splattributes', rule, {
  valid: [
    '<template><div ...attributes></div></template>',
    '<template><Foo ...attributes></Foo></template>',
    '<template><div ...attributes /></template>',
    '<template><div><Foo ...attributes /></div></template>',
    '<template><div ...attributes></div><div></div></template>',
  ],
  invalid: [
    {
      code: '<template><div></div></template>',
      output: null,
      errors: [
        {
          message: 'The root element in this template should use `...attributes`',
        },
      ],
    },
    {
      code: '<template><Foo></Foo></template>',
      output: null,
      errors: [
        {
          message: 'The root element in this template should use `...attributes`',
        },
      ],
    },
  ],
});
