//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-positive-tabindex');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-positive-tabindex', rule, {
  valid: [
    `<template>
      <div tabindex="0">Content</div>
    </template>`,
    `<template>
      <div tabindex="-1">Content</div>
    </template>`,
    `<template>
      <button>Click</button>
    </template>`,
    `<template>
      <div>No tabindex</div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <div tabindex="1">Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Avoid positive integer values for tabindex.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <div tabindex="5">Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Avoid positive integer values for tabindex.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <button tabindex="2">Click</button>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Avoid positive integer values for tabindex.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
