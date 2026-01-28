//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-form-action');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-form-action', rule, {
  valid: [
    `<template>
      <form {{on "submit" this.handleSubmit}}>
        <input type="text" />
      </form>
    </template>`,
    `<template>
      <form>
        <button type="submit">Submit</button>
      </form>
    </template>`,
    `<template>
      <div action="some-action">Not a form</div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <form action="/submit">
          <input type="text" />
        </form>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use the action attribute on <form> elements. Use the (on) modifier with the "submit" event instead.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <form action="">
          <button>Submit</button>
        </form>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use the action attribute on <form> elements. Use the (on) modifier with the "submit" event instead.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
