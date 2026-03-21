const rule = require('../../../lib/rules/template-no-with');
const RuleTester = require('eslint').RuleTester;

const validHbs = [
  '{{@with}}',
  '{{this.with}}',
  '{{with "foo" bar="baz"}}',
  '{{#if @model.posts}}{{@model.posts}}{{/if}}',
  '{{#let @model.posts as |blogPosts|}}{{blogPosts}}{{/let}}',
];

const invalidHbs = [
  {
    code: '{{#with this.foo as |bar|}}{{bar}}{{/with}}',
    output: null,
    errors: [{ messageId: 'deprecated' }],
  },
  {
    code: '{{#with (hash firstName="John" lastName="Doe") as |user|}}{{user.firstName}} {{user.lastName}}{{/with}}',
    output: null,
    errors: [{ messageId: 'deprecated' }],
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

gjsRuleTester.run('template-no-with', rule, {
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

hbsRuleTester.run('template-no-with', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
