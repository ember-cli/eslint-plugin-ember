const rule = require('../../../lib/rules/template-no-unnecessary-curly-strings');
const RuleTester = require('eslint').RuleTester;

const validHbs = [
  '<FooBar class="btn" />',
  '{{foo}}',
  '{{(foo)}}',
  '{{this.calculate 1 2 op="add"}}',
  '{{get address part}}',
  'foo',
  '"foo"',
  '<FooBar value=12345 />',
  '<FooBar value=null />',
  '<FooBar value=true />',
  '<FooBar value=undefined />',
  '<FooBar value={{12345}} />',
  '<FooBar value={{null}} />',
  '<FooBar value={{true}} />',
  '<FooBar value={{undefined}} />',
];

const invalidHbs = [
  {
    code: '<FooBar class={{"btn"}} @fooArg={{\'barbaz\'}} />',
    output: '<FooBar class="btn" @fooArg=\'barbaz\' />',
    errors: [{ messageId: 'unnecessary' }, { messageId: 'unnecessary' }],
  },
  {
    code: '<FooBar class="btn">{{"Foo"}}</FooBar>',
    output: '<FooBar class="btn">Foo</FooBar>',
    errors: [{ messageId: 'unnecessary' }],
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

gjsRuleTester.run('template-no-unnecessary-curly-strings', rule, {
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

hbsRuleTester.run('template-no-unnecessary-curly-strings', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
