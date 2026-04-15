const rule = require('../../../lib/rules/template-require-aria-activedescendant-tabindex');
const RuleTester = require('eslint').RuleTester;

const ERROR_MESSAGE =
  'A generic element using the aria-activedescendant attribute must have a tabindex';

const validHbs = [
  '<div tabindex="-1"></div>',
  '<div aria-activedescendant="some-id" tabindex=0></div>',
  '<input aria-activedescendant="some-id" />',
  '<input aria-activedescendant={{foo}} tabindex={{0}} />',
  '<div aria-activedescendant="option0" tabindex="0"></div>',
  '<CustomComponent aria-activedescendant="choice1" />',
  '<CustomComponent aria-activedescendant="option1" tabIndex="-1" />',
  '<CustomComponent aria-activedescendant={{foo}} tabindex={{bar}} />',
];

const invalidHbs = [
  {
    code: '<input aria-activedescendant="option0" tabindex="-2" />',
    output: '<input aria-activedescendant="option0" tabindex="0" />',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '<div aria-activedescendant={{bar}} />',
    output: '<div aria-activedescendant={{bar}} tabindex="0" />',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '<div aria-activedescendant={{foo}} tabindex={{-1}}></div>',
    output: '<div aria-activedescendant={{foo}} tabindex="0"></div>',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '<div aria-activedescendant="fixme" tabindex=-100></div>',
    output: '<div aria-activedescendant="fixme" tabindex="0"></div>',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '<a aria-activedescendant="x"></a>',
    output: '<a aria-activedescendant="x" tabindex="0"></a>',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '<button aria-activedescendant="x" tabindex="-1"></button>',
    output: '<button aria-activedescendant="x" tabindex="0"></button>',
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

gjsRuleTester.run('template-require-aria-activedescendant-tabindex', rule, {
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

hbsRuleTester.run('template-require-aria-activedescendant-tabindex', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
