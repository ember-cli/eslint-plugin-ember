//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-positional-data-test-selectors');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-positional-data-test-selectors', rule, {
  valid: [
    `<template>
      <div data-test-user-card></div>
    </template>`,
    `<template>
      <div data-test-item="my-item"></div>
    </template>`,
    `<template>
      <button data-test-button></button>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <div data-test-item="0"></div>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use named data-test attributes instead of positional data-test-* attributes.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <div data-test-card="1"></div>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use named data-test attributes instead of positional data-test-* attributes.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <button data-test-button="123"></button>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use named data-test attributes instead of positional data-test-* attributes.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
