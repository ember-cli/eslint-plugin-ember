//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-inline-linkto');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-inline-linkto', rule, {
  valid: [
    `<template>
      <LinkTo @route="index">Home</LinkTo>
    </template>`,
    `<template>
      <LinkTo @route="about">
        About
      </LinkTo>
    </template>`,
    `<template>
      <div></div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <LinkTo @route="index" />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use block form of LinkTo component instead of inline form.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <LinkTo @route="about" />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use block form of LinkTo component instead of inline form.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <LinkTo @route="contact"></LinkTo>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use block form of LinkTo component instead of inline form.',
          type: 'GlimmerElementNode',
        },
      ],
    },
  ],
});
