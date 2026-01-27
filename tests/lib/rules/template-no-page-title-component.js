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
      {{page-title "My Page"}}
    </template>`,
    `<template>
      {{page-title this.dynamicTitle}}
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
          message: 'Use the (page-title) helper instead of <PageTitle> component.',
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
          message: 'Use the (page-title) helper instead of <PageTitle> component.',
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
          message: 'Use the (page-title) helper instead of <PageTitle> component.',
          type: 'GlimmerElementNode',
        },
      ],
    },
  ],
});
