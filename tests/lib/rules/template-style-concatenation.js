//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-style-concatenation');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-style-concatenation', rule, {
  valid: [
    `<template>
      <div style="color: red;">Content</div>
    </template>`,
    `<template>
      <div style={{this.computedStyle}}>Content</div>
    </template>`,
    `<template>
      <div style={{html-safe this.styleString}}>Content</div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <div style="color: {{this.color}};">Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Avoid string concatenation in style attributes. Use a computed property with htmlSafe instead.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <div style={{concat "width: " this.width "px;"}}>Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Avoid string concatenation in style attributes. Use a computed property with htmlSafe instead.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
