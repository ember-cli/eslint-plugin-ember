const rule = require('../../../lib/rules/template-no-splattributes-with-class');
const RuleTester = require('eslint').RuleTester;

const ERROR_MESSAGE =
  'Using `...attributes` with `class` attribute is not allowed. Use `...attributes` alone to allow class merging.';

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-splattributes-with-class', rule, {
  valid: [
    '<template><div ...attributes>content</div></template>',
    '<template><div class="foo">content</div></template>',
    '<template><div class="foo bar">content</div></template>',
    '<template><div class={{foo}}>content</div></template>',
    '<template><div class="foo {{bar}}">content</div></template>',
  ],
  invalid: [
    {
      code: '<template><div ...attributes class="foo">content</div></template>',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: '<template><div class="foo" ...attributes>content</div></template>',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: '<template><div ...attributes class={{foo}}>content</div></template>',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><div class="foo" ...attributes class="bar">content</div></template>',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
  ],
});
