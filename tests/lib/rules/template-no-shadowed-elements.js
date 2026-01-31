//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-shadowed-elements');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-shadowed-elements', rule, {
  valid: [
    `<template>
      <MyButton>Click</MyButton>
    </template>`,
    `<template>
      <MyComponent />
    </template>`,
    `<template>
      <CustomForm />
    </template>`,
    `<template>
      <div>Content</div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <Form>Content</Form>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Component name "form" shadows HTML element <form>. Use a different name.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <Input @type="text" />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Component name "input" shadows HTML element <input>. Use a different name.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <Select @options={{this.options}} />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Component name "select" shadows HTML element <select>. Use a different name.',
          type: 'GlimmerElementNode',
        },
      ],
    },
  ],
});
