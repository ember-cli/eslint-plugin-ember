const rule = require('../../../lib/rules/template-require-form-method');
const RuleTester = require('eslint').RuleTester;

const DEFAULT_ERROR =
  'All `<form>` elements should have `method` attribute with value of `POST,GET,DIALOG`';

const validHbs = [
  {
    options: [{ allowedMethods: ['get'] }],
    code: '<form method="GET"></form>',
  },
  // Default behavior: when no options are provided, the rule is disabled.
  // A bare <form> should NOT error.
  '<form></form>',
  '<form method="NOT_A_VALID_METHOD"></form>',
  { options: [true], code: '<form method="POST"></form>' },
  { options: [true], code: '<form method="post"></form>' },
  { options: [true], code: '<form method="GET"></form>' },
  { options: [true], code: '<form method="get"></form>' },
  { options: [true], code: '<form method="DIALOG"></form>' },
  { options: [true], code: '<form method="dialog"></form>' },
  { options: [true], code: '<form method="{{formMethod}}"></form>' },
  { options: [true], code: '<form method={{formMethod}}></form>' },
  { options: [true], code: '<div/>' },
  { options: [true], code: '<div></div>' },
  { options: [true], code: '<div method="randomType"></div>' },
  { options: [false], code: '<form></form>' },
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
    options: [true],
    code: '<form></form>',
    output: '<form method="POST"></form>',
    errors: [{ message: DEFAULT_ERROR }],
  },
  {
    options: [true],
    code: '<form method=""></form>',
    output: '<form method="POST"></form>',
    errors: [{ message: DEFAULT_ERROR }],
  },
  {
    options: [true],
    code: '<form method=42></form>',
    output: '<form method="POST"></form>',
    errors: [{ message: DEFAULT_ERROR }],
  },
  {
    options: [true],
    code: '<form method=" ge t "></form>',
    output: '<form method="POST"></form>',
    errors: [{ message: DEFAULT_ERROR }],
  },
  {
    options: [true],
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

// parseConfig should throw on an invalid `allowedMethods` entry so that
// misconfiguration is surfaced immediately rather than silently ignored.
describe('template-require-form-method invalid configuration', () => {
  const { Linter } = require('eslint');

  function lintWith(options) {
    const linter = new Linter();
    linter.defineParser('ember-eslint-parser/hbs', require('ember-eslint-parser/hbs'));
    linter.defineRule('template-require-form-method', rule);
    return linter.verify('<form method="POST"></form>', {
      parser: 'ember-eslint-parser/hbs',
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
      rules: { 'template-require-form-method': ['error', options] },
    });
  }

  test('throws on unknown method in allowedMethods', () => {
    expect(() => lintWith({ allowedMethods: ['PATCH'] })).toThrow(/invalid configuration/);
  });

  test('throws on mixed valid/invalid method list', () => {
    expect(() => lintWith({ allowedMethods: ['GET', 'BOGUS'] })).toThrow(/invalid configuration/);
  });
});
