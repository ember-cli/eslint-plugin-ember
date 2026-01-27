//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-pointer-down-event-binding');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-pointer-down-event-binding', rule, {
  valid: [
    `<template>
      <button {{on "click" this.handleClick}}>Click</button>
    </template>`,
    `<template>
      <button {{on "keydown" this.handleKeyDown}}>Press</button>
    </template>`,
    `<template>
      <div {{on "mousedown" this.handleMouseDown}}>Content</div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <button {{on "pointerdown" this.handlePointerDown}}>Click</button>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Avoid pointer down events. Use click or keydown events instead for better accessibility.',
          type: 'GlimmerElementModifierStatement',
        },
      ],
    },
    {
      code: `<template>
        <div onpointerdown={{this.handlePointerDown}}>Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Avoid pointer down events. Use click or keydown events instead for better accessibility.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
