//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-index-component-invocation');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-index-component-invocation', rule, {
  valid: [
    `<template>
      <MyComponent />
    </template>`,
    `<template>
      <Foo::Bar />
    </template>`,
    `<template>
      <div></div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <MyComponent::Index />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Do not invoke components with /index suffix. Use the parent directory name instead.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <Foo::Index />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Do not invoke components with /index suffix. Use the parent directory name instead.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <Foo::Bar::Index />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Do not invoke components with /index suffix. Use the parent directory name instead.',
          type: 'GlimmerElementNode',
        },
      ],
    },
  ],
});
