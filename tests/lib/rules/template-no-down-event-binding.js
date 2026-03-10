//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-down-event-binding');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-down-event-binding', rule, {
  valid: [
    `<template>
      <button {{on "click" this.handleClick}}>Click</button>
    </template>`,
    `<template>
      <button {{on "keydown" this.handleKeyDown}}>Press</button>
    </template>`,
    `<template>
      <div {{on "mouseup" this.handleMouseUp}}>Content</div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <button {{on "mousedown" this.handleMouseDown}}>Click</button>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Avoid mousedown/touchstart events. Use click or keydown events instead for better accessibility.',
          type: 'GlimmerElementModifierStatement',
        },
      ],
    },
    {
      code: `<template>
        <div {{on "touchstart" this.handleTouchStart}}>Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Avoid mousedown/touchstart events. Use click or keydown events instead for better accessibility.',
          type: 'GlimmerElementModifierStatement',
        },
      ],
    },
    {
      code: `<template>
        <div onmousedown={{this.handleMouseDown}}>Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Avoid mousedown/touchstart events. Use click or keydown events instead for better accessibility.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
