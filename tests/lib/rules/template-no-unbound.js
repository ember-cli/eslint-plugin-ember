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

hbsRuleTester.run('template-no-unbound', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
