const rule = require('../../../lib/rules/template-require-button-type');
const RuleTester = require('eslint').RuleTester;

const ERROR_MESSAGE = 'All `<button>` elements should have a valid `type` attribute';

const validHbs = [
  '<button type="button" />',
  '<button type="button">label</button>',
  '<button type="submit" />',
  '<button type="reset" />',
  '<button type="{{buttonType}}" />',
  '<button type={{buttonType}} />',
  '<div/>',
  '<div></div>',
  '<div type="randomType"></div>',
];

const invalidHbs = [
  {
    code: '<button/>',
    output: '<button type="button" />',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '<button>label</button>',
    output: '<button type="button">label</button>',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '<button type="" />',
    output: '<button type="button" />',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '<button type="foo" />',
    output: '<button type="button" />',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '<button type=42 />',
    output: '<button type="button" />',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '<form><button></button></form>',
    output: '<form><button type="submit"></button></form>',
    errors: [{ message: ERROR_MESSAGE }],
  },
];

const gjsValid = validHbs.map((code) => `<template>${code}</template>`);

const gjsInvalid = [
  {
    code: '<template><button/></template>',
    output: '<template><button type="button" /></template>',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '<template><button></button></template>',
    output: '<template><button type="button"></button></template>',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '<template><button>label</button></template>',
    output: '<template><button type="button">label</button></template>',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '<template><button type="" /></template>',
    output: '<template><button type="button" /></template>',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '<template><button type="foo" /></template>',
    output: '<template><button type="button" /></template>',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '<template><button type=42 /></template>',
    output: '<template><button type="button" /></template>',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '<template><form><button></button></form></template>',
    output: '<template><form><button type="submit"></button></form></template>',
    errors: [{ message: ERROR_MESSAGE }],
  },
  {
    code: '/** silly example <button> usage */ <template><button></button></template>',
    output:
      '/** silly example <button> usage */ <template><button type="button"></button></template>',
    errors: [{ message: ERROR_MESSAGE }],
  },
];

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

gjsRuleTester.run('template-require-button-type', rule, {
  valid: gjsValid,
  invalid: gjsInvalid,
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-require-button-type', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
