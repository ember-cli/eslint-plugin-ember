const rule = require('../../../lib/rules/template-require-form-method');
const RuleTester = require('eslint').RuleTester;

const DEFAULT_ERROR =
  'All `<form>` elements should have `method` attribute with value of `POST,GET,DIALOG`';

const validHbs = [
  {
    options: [{ allowedMethods: ['get'] }],
    code: '<form method="GET"></form>',
  },
  '<form method="POST"></form>',
  '<form method="post"></form>',
  '<form method="GET"></form>',
  '<form method="get"></form>',
  '<form method="DIALOG"></form>',
  '<form method="dialog"></form>',
  '<form method="{{formMethod}}"></form>',
  '<form method={{formMethod}}></form>',
  '<div/>',
  '<div></div>',
  '<div method="randomType"></div>',
];

const invalidHbs = [
  {
    options: [{ allowedMethods: ['get'] }],
    code: '<form method="POST"></form>',
    output: '<form method="GET"></form>',
    errors: [
      { message: 'All `<form>` elements should have `method` attribute with value of `GET`' },
    ],
  },
  {
    options: [{ allowedMethods: ['POST'] }],
    code: '<form method="GET"></form>',
    output: '<form method="POST"></form>',
    errors: [
      { message: 'All `<form>` elements should have `method` attribute with value of `POST`' },
    ],
  },
  {
    code: '<form></form>',
    output: '<form method="POST"></form>',
    errors: [{ message: DEFAULT_ERROR }],
  },
  {
    code: '<form method=""></form>',
    output: '<form method="POST"></form>',
    errors: [{ message: DEFAULT_ERROR }],
  },
  {
    code: '<form method=42></form>',
    output: '<form method="POST"></form>',
    errors: [{ message: DEFAULT_ERROR }],
  },
  {
    code: '<form method=" ge t "></form>',
    output: '<form method="POST"></form>',
    errors: [{ message: DEFAULT_ERROR }],
  },
  {
    code: '<form method=" pos t "></form>',
    output: '<form method="POST"></form>',
    errors: [{ message: DEFAULT_ERROR }],
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

gjsRuleTester.run('template-require-form-method', rule, {
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

hbsRuleTester.run('template-require-form-method', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
