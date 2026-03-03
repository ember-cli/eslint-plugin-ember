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

    {
      code: '<template><FooBar @x="{{index}}X{{(someHelper foo)}}" /></template>',
      output: '<template><FooBar @x="{{index}}X{{someHelper foo}}" /></template>',
      errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
    },
    {
      code: '<template><FooBar @x="{{index}}XY{{(someHelper foo)}}" /></template>',
      output: '<template><FooBar @x="{{index}}XY{{someHelper foo}}" /></template>',
      errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
    },
    {
      code: '<template><FooBar @x="{{index}}--{{(someHelper foo)}}" /></template>',
      output: '<template><FooBar @x="{{index}}--{{someHelper foo}}" /></template>',
      errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
    },
    {
      code: '<template>{{(helper a="b")}}</template>',
      output: '<template>{{helper a="b"}}</template>',
      errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-unnecessary-curly-parens', rule, {
  valid: [
    '{{foo}}',
    '{{this.foo}}',
    '{{(helper)}}',
    '{{(this.helper)}}',
    '{{concat "a" "b"}}',
    '{{concat (capitalize "foo") "-bar"}}',
  ],
  invalid: [
    {
      code: '<FooBar @x="{{index}}X{{(someHelper foo)}}" />',
      output: '<FooBar @x="{{index}}X{{someHelper foo}}" />',
      errors: [{ message: 'Unnecessary parentheses enclosing statement.' }],
    },
    {
      code: '<FooBar @x="{{index}}XY{{(someHelper foo)}}" />',
      output: '<FooBar @x="{{index}}XY{{someHelper foo}}" />',
      errors: [{ message: 'Unnecessary parentheses enclosing statement.' }],
    },
    {
      code: '<FooBar @x="{{index}}--{{(someHelper foo)}}" />',
      output: '<FooBar @x="{{index}}--{{someHelper foo}}" />',
      errors: [{ message: 'Unnecessary parentheses enclosing statement.' }],
    },
    {
      code: '{{(concat "a" "b")}}',
      output: '{{concat "a" "b"}}',
      errors: [{ message: 'Unnecessary parentheses enclosing statement.' }],
    },
    {
      code: '{{(helper a="b")}}',
      output: '{{helper a="b"}}',
      errors: [{ message: 'Unnecessary parentheses enclosing statement.' }],
    },
  ],
});
