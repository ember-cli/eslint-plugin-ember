const rule = require('../../../lib/rules/template-no-unbound');
const RuleTester = require('eslint').RuleTester;

const validHbs = ['{{foo}}', '{{button}}'];

const invalidHbs = [
  {
    code: '{{unbound foo}}',
    output: null,
    errors: [{ message: 'Unexpected {{unbound}} usage.' }],
  },
  {
    code: '{{my-thing foo=(unbound foo)}}',
    output: null,
    errors: [{ message: 'Unexpected {{unbound}} usage.' }],
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
    errors: entry.errors.map(() => ({ messageId: 'unexpected' })),
  };
}

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

gjsRuleTester.run('template-no-unbound', rule, {
  valid: [
    ...validHbs.map(wrapTemplate),
    // JS-scope shadowing: a user-imported `unbound` is not the Glimmer keyword.
    {
      filename: 'test.gjs',
      code: "import unbound from './my-unbound-helper';\n<template>{{unbound foo}}</template>",
    },
    {
      filename: 'test.gts',
      code: "import unbound from '@some/addon';\n<template>{{my-thing foo=(unbound foo)}}</template>",
    },
    // Local block-param shadowing.
    {
      filename: 'test.gjs',
      code: '<template>{{#let (component "foo") as |unbound|}}{{unbound}}{{/let}}</template>',
    },
  ],
  invalid: [
    ...invalidHbs.map(wrapTemplate),
    // `unbound` is an ambient Glimmer keyword in strict mode — flag bare uses
    // without a shadowing import or block param.
    {
      filename: 'test.gjs',
      code: '<template>{{unbound foo}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      filename: 'test.gts',
      code: '<template>{{my-thing foo=(unbound foo)}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
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

hbsRuleTester.run('template-no-unbound', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
