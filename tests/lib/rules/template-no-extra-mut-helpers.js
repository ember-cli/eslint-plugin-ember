//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-extra-mut-helpers');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-extra-mut-helpers', rule, {
  valid: [
    `<template>
      <MyComponent @value={{this.value}} />
    </template>`,
    `<template>
      <input value={{this.text}} />
    </template>`,
    `<template>
      <div></div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        {{my-component onChange=(mut this.value)}}
      </template>`,
      output: null,
      errors: [
        {
          message: 'Unnecessary mut helper. Remove it.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: `<template>
        {{input value=(mut this.text)}}
      </template>`,
      output: null,
      errors: [
        {
          message: 'Unnecessary mut helper. Remove it.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: `<template>
        {{my-component value=(mut this.data)}}
      </template>`,
      output: null,
      errors: [
        {
          message: 'Unnecessary mut helper. Remove it.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
  ],
});
