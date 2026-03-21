//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-unnecessary-curly-parens');
const RuleTester = require('eslint').RuleTester;

const validHbs = [
  '{{foo}}',
  '{{this.foo}}',
  '{{(helper)}}',
  '{{(this.helper)}}',
  '{{concat "a" "b"}}',
  '{{concat (capitalize "foo") "-bar"}}',
];

const invalidHbs = [
  {
    code: '<FooBar @x="{{index}}X{{(someHelper foo)}}" />',
    output: '<FooBar @x="{{index}}X{{someHelper foo}}" />',
    errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
  },
  {
    code: '<FooBar @x="{{index}}XY{{(someHelper foo)}}" />',
    output: '<FooBar @x="{{index}}XY{{someHelper foo}}" />',
    errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
  },
  {
    code: '<FooBar @x="{{index}}--{{(someHelper foo)}}" />',
    output: '<FooBar @x="{{index}}--{{someHelper foo}}" />',
    errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
  },
  {
    code: '{{(concat "a" "b")}}',
    output: '{{concat "a" "b"}}',
    errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
  },
  {
    code: '{{(helper a="b")}}',
    output: '{{helper a="b"}}',
    errors: [{ messageId: 'noUnnecessaryCurlyParens' }],
  },
];

function wrapTemplate(entry) {
  if (typeof entry === 'string') {
    return `<template>${entry}</template>`;
  }

  return {
    ...entry,
    code: `<template>${entry.code}</template>`,
    output: entry.output ? `<template>${entry.output}</template>` : entry.output,
  };
}

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

gjsRuleTester.run('template-no-unnecessary-curly-parens', rule, {
  valid: validHbs.map(wrapTemplate),
  invalid: invalidHbs.map(wrapTemplate),
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-unnecessary-curly-parens', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
