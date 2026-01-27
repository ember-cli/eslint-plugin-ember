//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-nested-interactive');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-nested-interactive', rule, {
  valid: [
    `<template>
      <button>Click me</button>
    </template>`,
    `<template>
      <a href="#test">Link</a>
    </template>`,
    `<template>
      <div>
        <button>Button 1</button>
        <button>Button 2</button>
      </div>
    </template>`,
    `<template>
      <div>
        <input type="text" />
      </div>
    </template>`,
    `<template>
      <label>
        <input type="hidden" />
        Text
      </label>
    </template>`,
    `<template>
      <div role="presentation">
        <button>Click</button>
      </div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <button>
          <a href="#">Link</a>
        </button>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use <a> inside <button>. Nested interactive elements are not accessible.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <a href="#">
          <button>Click</button>
        </a>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use <button> inside <a>. Nested interactive elements are not accessible.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <button>
          <input type="text" />
        </button>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use <input> inside <button>. Nested interactive elements are not accessible.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <label>
          <button>Click</button>
        </label>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use <button> inside <label>. Nested interactive elements are not accessible.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <div role="button">
          <a href="#">Link</a>
        </div>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Do not use <a> inside <div>. Nested interactive elements are not accessible.',
          type: 'GlimmerElementNode',
        },
      ],
    },
  ],
});
