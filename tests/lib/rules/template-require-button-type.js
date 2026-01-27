//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-require-button-type');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-button-type', rule, {
  valid: [
    `<template>
      <button type="button">Click me</button>
    </template>`,
    `<template>
      <button type="submit">Submit</button>
    </template>`,
    `<template>
      <button type="reset">Reset</button>
    </template>`,
    `<template>
      <div>Not a button</div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <button>Click me</button>
      </template>`,
      output: `<template>
        <button type="button">Click me</button>
      </template>`,
      errors: [{
        message: 'All `<button>` elements should have a valid `type` attribute',
        type: 'GlimmerElementNode',
      }],
    },
    {
      code: `<template>
        <form>
          <button>Submit</button>
        </form>
      </template>`,
      output: `<template>
        <form>
          <button type="submit">Submit</button>
        </form>
      </template>`,
      errors: [{
        message: 'All `<button>` elements should have a valid `type` attribute',
        type: 'GlimmerElementNode',
      }],
    },
    {
      code: `<template>
        <button type="invalid">Click</button>
      </template>`,
      output: `<template>
        <button type="button">Click</button>
      </template>`,
      errors: [{
        message: 'Button type must be "button", "submit", or "reset"',
        type: 'GlimmerAttrNode',
      }],
    },
    {
      code: `<template>
        <form>
          <button type="invalid">Submit</button>
        </form>
      </template>`,
      output: `<template>
        <form>
          <button type="submit">Submit</button>
        </form>
      </template>`,
      errors: [{
        message: 'Button type must be "button", "submit", or "reset"',
        type: 'GlimmerAttrNode',
      }],
    },
  ],
});
