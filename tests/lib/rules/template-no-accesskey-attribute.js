//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-accesskey-attribute');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-accesskey-attribute', rule, {
  valid: [
    `<template>
      <button>Click me</button>
    </template>`,
    `<template>
      <div class="button">Content</div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <button accesskey="s">Save</button>
      </template>`,
      output: `<template>
        <button>Save</button>
      </template>`,
      errors: [{
        message: 'No access key attribute allowed. Inconsistencies between keyboard shortcuts and keyboard commands used by screenreader and keyboard only users create accessibility complications.',
        type: 'GlimmerAttrNode',
      }],
    },
    {
      code: `<template>
        <a href="#" accesskey="h">Home</a>
      </template>`,
      output: `<template>
        <a href="#">Home</a>
      </template>`,
      errors: [{
        type: 'GlimmerAttrNode',
      }],
    },
  ],
});
