//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-passed-in-event-handlers');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-passed-in-event-handlers', rule, {
  valid: [
    `<template>
      <MyComponent @action={{this.handleAction}} />
    </template>`,
    `<template>
      <MyComponent @onSubmit={{this.handleSubmit}} />
    </template>`,
    `<template>
      <button {{on "click" this.handleClick}}>Click</button>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <MyComponent @click={{this.handleClick}} />
      </template>`,
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: `<template>
        <MyComponent @submit={{this.handleSubmit}} />
      </template>`,
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: `<template>
        <CustomButton @mouseEnter={{this.handleHover}} />
      </template>`,
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
  ],
});
