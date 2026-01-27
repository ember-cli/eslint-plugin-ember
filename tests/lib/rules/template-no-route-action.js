//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-route-action');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-route-action', rule, {
  valid: [
    `<template>
      <button {{on "click" (fn this.action arg)}}>Click</button>
    </template>`,
    `<template>
      <button {{on "click" this.handleClick}}>Click</button>
    </template>`,
    `<template>
      {{this.routeAction}}
    </template>`,
    `<template>
      <Component @action={{this.handleAction}} />
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        {{route-action "save"}}
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use the (route-action) helper. Use the (fn) helper or closure actions instead.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
    {
      code: `<template>
        <button {{on "click" (route-action "save")}}>Save</button>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use the (route-action) helper. Use the (fn) helper or closure actions instead.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: `<template>
        <Component @action={{route-action "update"}} />
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use the (route-action) helper. Use the (fn) helper or closure actions instead.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
  ],
});
