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
      <MyComponent @submit={{this.handleSubmit}} />
    </template>`,
    `<template>
      <button {{on "click" this.handleClick}}>Click</button>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <MyComponent @onClick={{this.handleClick}} />
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Avoid passing event handlers like @onClick directly. Use the (on) modifier on the element instead.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <MyComponent @onSubmit={{this.handleSubmit}} />
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Avoid passing event handlers like @onSubmit directly. Use the (on) modifier on the element instead.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <CustomButton @onHover={{this.handleHover}} />
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Avoid passing event handlers like @onHover directly. Use the (on) modifier on the element instead.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
