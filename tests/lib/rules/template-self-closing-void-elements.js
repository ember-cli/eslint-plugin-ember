//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-self-closing-void-elements');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-self-closing-void-elements', rule, {
  valid: [
    `<template>
      <img src="foo.jpg" />
    </template>`,
    `<template>
      <br />
    </template>`,
    `<template>
      <div></div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <img src="foo.jpg">
      </template>`,
      output: null,
      errors: [
        {
          message: 'Void element should be self-closing.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <br>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Void element should be self-closing.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <input type="text">
      </template>`,
      output: null,
      errors: [
        {
          message: 'Void element should be self-closing.',
          type: 'GlimmerElementNode',
        },
      ],
    },
  ],
});
