const rule = require('../../../lib/rules/template-no-yield-only');
const RuleTester = require('eslint').RuleTester;

const validHbs = [
  '{{yield (hash someProp=someValue)}}',
  '{{field}}',
  '{{#yield}}{{/yield}}',
  '<Yield/>',
  '<yield/>',
];

const invalidHbs = [
  {
    code: '{{yield}}',
    output: null,
    errors: [{ messageId: 'noYieldOnly' }],
  },
  {
    code: '     {{yield}}',
    output: null,
    errors: [{ messageId: 'noYieldOnly' }],
  },
  {
    code: '\n  {{yield}}\n     ',
    output: null,
    errors: [{ messageId: 'noYieldOnly' }],
  },
  {
    code: '\n{{! some comment }}  {{yield}}\n     ',
    output: null,
    errors: [{ messageId: 'noYieldOnly' }],
  },
  {
    code: '{{!-- long-form comment --}}{{yield}}',
    output: null,
    errors: [{ messageId: 'noYieldOnly' }],
  },
  {
    code: '<!-- html comment -->{{yield}}',
    output: null,
    errors: [{ messageId: 'noYieldOnly' }],
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

gjsRuleTester.run('template-no-yield-only', rule, {
  valid: validHbs.filter((entry) => !entry.includes('template-lint-disable')).map(wrapTemplate),
  invalid: invalidHbs.map(wrapTemplate),
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-yield-only', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
