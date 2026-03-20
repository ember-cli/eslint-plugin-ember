const rule = require('../../../lib/rules/template-no-yield-block-params-to-else-inverse');
const RuleTester = require('eslint').RuleTester;

const validHbs = [
  '{{yield}}',
  '{{yield "some" "param"}}',
  '{{yield to="whatever"}}',
  '{{yield to=this.someValue}}',
  '{{yield to=(get some this.map)}}',
  '{{yield to="else"}}',
  '{{yield to="inverse"}}',
  '{{not-yield "some" "param" to="else"}}',
];

const invalidHbs = [
  {
    code: '{{yield "some" "param" to="else"}}',
    output: null,
    errors: [{ message: 'Yielding block params to else/inverse block is not allowed' }],
  },
  {
    code: '{{yield "some" "param" to="inverse"}}',
    output: null,
    errors: [{ message: 'Yielding block params to else/inverse block is not allowed' }],
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

gjsRuleTester.run('template-no-yield-block-params-to-else-inverse', rule, {
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

hbsRuleTester.run('template-no-yield-block-params-to-else-inverse', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
