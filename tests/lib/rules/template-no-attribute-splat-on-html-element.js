//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-attribute-splat-on-html-element');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-attribute-splat-on-html-element', rule, {
  valid: [
    `<template>
      <MyComponent ...attributes />
    </template>`,
    `<template>
      <div class="foo"></div>
    </template>`,
    `<template>
      <CustomComponent ...attributes />
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <div ...attributes></div>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Do not use ...attributes on HTML elements. Use it only on component elements.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <span ...attributes></span>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Do not use ...attributes on HTML elements. Use it only on component elements.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <input ...attributes />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Do not use ...attributes on HTML elements. Use it only on component elements.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
