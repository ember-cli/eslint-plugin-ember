//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-input-placeholder');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-input-placeholder', rule, {
  valid: [
    `<template>
      <label>
        Username
        <input type="text" />
      </label>
    </template>`,
    `<template>
      <input type="text" aria-label="Username" />
    </template>`,
    `<template>
      <div></div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <input placeholder="Enter username" />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Do not use placeholder attribute. Use a label instead for better accessibility.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <input type="text" placeholder="Username" />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Do not use placeholder attribute. Use a label instead for better accessibility.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <input type="email" placeholder="Email" />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Do not use placeholder attribute. Use a label instead for better accessibility.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
