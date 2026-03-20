const rule = require('../../../lib/rules/template-require-each-key');
const RuleTester = require('eslint').RuleTester;

const ERROR_MESSAGE = '{{#each}} helper requires a valid key value to avoid performance issues';

const validHbs = [
  '{{#each this.items key="id" as |item|}} {{item.name}} {{/each}}',
  '{{#each this.items key="deeply.nested.id" as |item|}} {{item.name}} {{/each}}',
  '{{#each this.items key="@index" as |item|}} {{item.name}} {{/each}}',
  '{{#each this.items key="@identity" as |item|}} {{item.name}} {{/each}}',
  '{{#if foo}}{{/if}}',
];

const invalidHbs = [
  {
    code: '{{#each this.items as |item|}} {{item.name}} {{/each}}',
    output: '{{#each this.items key="@identity" as |item|}} {{item.name}} {{/each}}',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '{{#each this.items key="@invalid" as |item|}} {{item.name}} {{/each}}',
    output: '{{#each this.items key="@identity" as |item|}} {{item.name}} {{/each}}',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '{{#each this.items key="" as |item|}} {{item.name}} {{/each}}',
    output: '{{#each this.items key="@identity" as |item|}} {{item.name}} {{/each}}',
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

gjsRuleTester.run('template-require-each-key', rule, {
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

hbsRuleTester.run('template-require-each-key', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
