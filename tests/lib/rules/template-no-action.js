//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-action');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-action', rule, {
  valid: [
    `<template>
      <button {{on "click" this.handleClick}}>Click</button>
    </template>`,
    `<template>
      <button {{on "click" (fn this.save "arg")}}>Save</button>
    </template>`,
    `<template>
      {{this.action}}
    </template>`,
    `<template>
      {{@action}}
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <button {{on "click" (action "save")}}>Save</button>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use `action` as (action ...). Instead, use the `on` modifier and `fn` helper.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: `<template>
        {{action "doSomething"}}
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use `action` in templates. Instead, use the `on` modifier and `fn` helper.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
  ],
});
