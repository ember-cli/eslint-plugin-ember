//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-page-title-component');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-page-title-component', rule, {
  valid: [
    `<template>
      {{pageTitle "My Page"}}
    </template>`,
    `<template>
      {{pageTitle this.dynamicTitle}}
    </template>`,
    `<template>
      <div></div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <PageTitle>My Page</PageTitle>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use the `pageTitle` helper instead of the <PageTitle> component.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <PageTitle @title="My Page" />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use the `pageTitle` helper instead of the <PageTitle> component.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <PageTitle>{{this.title}}</PageTitle>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use the `pageTitle` helper instead of the <PageTitle> component.',
          type: 'GlimmerElementNode',
        },
      ],
    },
  ],
});
