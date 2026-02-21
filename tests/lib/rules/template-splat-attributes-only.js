const rule = require('../../../lib/rules/template-splat-attributes-only');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-splat-attributes-only', rule, {
  valid: [
    '<template><div ...attributes></div></template>',
    '<template><MyComponent ...attributes /></template>',
  
    // Test cases ported from ember-template-lint
    '<template><div attributes></div></template>',
    '<template><div arguments></div></template>',
    '<template><div><div ...attributes></div></div></template>',
  ],
  invalid: [
    {
      code: '<template><div ...props></div></template>',
      output: null,
      errors: [{ messageId: 'onlyAttributes' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><div ...arguments></div></template>',
      output: null,
      errors: [{ messageId: 'onlyAttributes' }],
    },
  ],
});
