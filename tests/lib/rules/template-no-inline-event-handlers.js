//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-inline-event-handlers');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-inline-event-handlers', rule, {
  valid: [
    `<template>
      <button {{on "click" this.handleClick}}>Click</button>
    </template>`,
    `<template>
      <input {{on "input" this.handleInput}} />
    </template>`,
    `<template>
      <div>No handlers</div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <button onclick="alert('test')">Click</button>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use inline event handlers like "onclick". Use the (on) modifier instead.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <div onmousedown="handleEvent()">Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use inline event handlers like "onmousedown". Use the (on) modifier instead.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <form onsubmit="return false;">Form</form>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use inline event handlers like "onsubmit". Use the (on) modifier instead.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
