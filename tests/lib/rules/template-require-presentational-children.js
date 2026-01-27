//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-require-presentational-children');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-presentational-children', rule, {
  valid: [
    `<template>
      <ul>
        <li>Item</li>
      </ul>
    </template>`,
    `<template>
      <ul role="presentation">
        <div>Content</div>
      </ul>
    </template>`,
    `<template>
      <table role="none">
        <div>Content</div>
      </table>
    </template>`,
    `<template>
      <ul role="list">
        <li>Item</li>
      </ul>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <ul role="presentation">
          <li>Item</li>
        </ul>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Element <ul> has role="presentation" but contains semantic child <li>. Presentational elements should only contain presentational children.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <table role="none">
          <tr><td>Data</td></tr>
        </table>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Element <table> has role="none" but contains semantic child <tr>. Presentational elements should only contain presentational children.',
          type: 'GlimmerElementNode',
        },
      ],
    },
  ],
});
