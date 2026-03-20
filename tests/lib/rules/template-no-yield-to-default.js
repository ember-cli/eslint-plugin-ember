const rule = require('../../../lib/rules/template-no-yield-to-default');
const RuleTester = require('eslint').RuleTester;

const ERROR_MESSAGE = 'A block named "default" is not valid';

const validHbs = [
  '{{yield}}',
  '{{yield to="title"}}',
  '{{has-block}}',
  '{{has-block "title"}}',
  '{{has-block-params}}',
  '{{has-block-params "title"}}',
  '{{hasBlock}}',
  '{{hasBlock "title"}}',
  '{{hasBlockParams}}',
  '{{hasBlockParams "title"}}',
];

const invalidHbs = [
  {
    code: '{{yield to="default"}}',
    output: null,
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '{{has-block "default"}}',
    output: null,
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '{{has-block-params "default"}}',
    output: null,
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '{{hasBlock "default"}}',
    output: null,
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '{{hasBlockParams "default"}}',
    output: null,
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '{{if (has-block "default")}}',
    output: null,
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '{{#if (has-block "default")}}{{/if}}',
    output: null,
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '{{if (has-block-params "default")}}',
    output: null,
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '{{#if (has-block-params "default")}}{{/if}}',
    output: null,
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '{{if (hasBlock "default")}}',
    output: null,
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '{{#if (hasBlock "default")}}{{/if}}',
    output: null,
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '{{if (hasBlockParams "default")}}',
    output: null,
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '{{#if (hasBlockParams "default")}}{{/if}}',
    output: null,
    errors: [{ message: ERROR_MESSAGE }],
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

gjsRuleTester.run('template-no-yield-to-default', rule, {
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

hbsRuleTester.run('template-no-yield-to-default', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
