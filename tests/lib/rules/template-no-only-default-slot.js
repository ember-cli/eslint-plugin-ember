const rule = require('../../../lib/rules/template-no-only-default-slot');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-only-default-slot', rule, {
  valid: [
    `<template><MyComponent>
      Hello!
    </MyComponent></template>`,
    `<template><MyComponent>
      <:header>header</:header>
      <:footer>footer</:footer>
    </MyComponent></template>`,
    `<template><MyComponent>
      <:default>header</:default>
      <:footer>footer</:footer>
    </MyComponent></template>`,
    `<template><MyComponent>
      <:footer>footer</:footer>
    </MyComponent></template>`,
  ],
  invalid: [
    {
      code: '<template><MyComponent><:default>what</:default></MyComponent></template>',
      output: '<template><MyComponent>what</MyComponent></template>',
      errors: [
        {
          message:
            'Only default slot used — prefer direct block content without <:default> for clarity and simplicity.',
        },
      ],
    },
    {
      code: '<template><MyComponent><:default></:default></MyComponent></template>',
      output: '<template><MyComponent></MyComponent></template>',
      errors: [
        {
          message:
            'Only default slot used — prefer direct block content without <:default> for clarity and simplicity.',
        },
      ],
    },
  ],
});
