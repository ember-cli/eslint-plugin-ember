//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-require-context-role');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-context-role', rule, {
  valid: [
    `<template>
      <ul role="list">
        <li role="listitem">Item</li>
      </ul>
    </template>`,
    `<template>
      <div role="tablist">
        <div role="tab">Tab 1</div>
      </div>
    </template>`,
    `<template>
      <div role="menu">
        <div role="menuitem">Item</div>
      </div>
    </template>`,
    `<template>
      <div role="button">No context needed</div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <div role="listitem">Item</div>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Role "listitem" must be contained in an element with one of these roles: list',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <div role="tab">Tab 1</div>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Role "tab" must be contained in an element with one of these roles: tablist',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <div>
          <div role="menuitem">Item</div>
        </div>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Role "menuitem" must be contained in an element with one of these roles: menu, menubar',
          type: 'GlimmerElementNode',
        },
      ],
    },
  ],
});
