const rule = require('../../../lib/rules/template-no-valueless-arguments');
const RuleTester = require('eslint').RuleTester;

const validHbs = [
  '<SomeComponent @emptyString="" data-test-some-component />',
  '<button type="submit" disabled {{on "click" this.submit}}></button>',
];

const invalidHbs = [
  {
    code: '<SomeComponent @valueless />',
    output: null,
    errors: [{ messageId: 'valueless' }],
  },
  {
    code: '<SomeComponent @valuelessByAccident{{this.canBeAModifier}} />',
    output: null,
    errors: [{ messageId: 'valueless' }],
  },
  {
    code: '<SomeComponent @valuelessByAccident{{@canBeAModifier}} />',
    output: null,
    errors: [{ messageId: 'valueless' }],
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

gjsRuleTester.run('template-no-valueless-arguments', rule, {
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

hbsRuleTester.run('template-no-valueless-arguments', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
