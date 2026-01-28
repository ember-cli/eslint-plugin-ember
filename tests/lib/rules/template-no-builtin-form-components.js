//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-builtin-form-components');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-builtin-form-components', rule, {
  valid: [
    `<template>
      <input type="text" />
    </template>`,
    `<template>
      <textarea></textarea>
    </template>`,
    `<template>
      <a href="/home">Home</a>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <Input @type="text" />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Do not use built-in form components. Use native HTML elements instead.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <Textarea @value={{this.text}} />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Do not use built-in form components. Use native HTML elements instead.',
          type: 'GlimmerElementNode',
        },
      ],
    },
  ],
});
