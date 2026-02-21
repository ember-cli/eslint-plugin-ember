//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-unnecessary-curly-parens');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-unnecessary-curly-parens', rule, {
  valid: [
    '<template>{{helper param}}</template>',
    '<template>{{#if condition}}text{{/if}}</template>',
    '<template>{{this.property}}</template>',
  
    // Test cases ported from ember-template-lint
    '<template>{{foo}}</template>',
    '<template>{{this.foo}}</template>',
    '<template>{{(helper)}}</template>',
    '<template>{{(this.helper)}}</template>',
    '<template>{{concat "a" "b"}}</template>',
    '<template>{{concat (capitalize "foo") "-bar"}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{(helper value)}}</template>',
      output: '<template>{{helper value}}</template>',
      errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
    },
    {
      code: '<template>{{(concat "a" "b")}}</template>',
      output: '<template>{{concat "a" "b"}}</template>',
      errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
    },
    {
      code: '<template>{{(if condition "yes" "no")}}</template>',
      output: '<template>{{if condition "yes" "no"}}</template>',
      errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><FooBar @x="{{index}}X{{(someHelper foo)}}" /></template>',
      output: null,
      errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
    },
    {
      code: '<template><FooBar @x="{{index}}XY{{(someHelper foo)}}" /></template>',
      output: null,
      errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
    },
    {
      code: '<template><FooBar @x="{{index}}--{{(someHelper foo)}}" /></template>',
      output: null,
      errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
    },
    {
      code: '<template>{{(helper a="b")}}</template>',
      output: null,
      errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
    },
  ],
});
