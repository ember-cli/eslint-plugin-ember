//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-redundant-fn');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-redundant-fn', rule, {
  valid: [
    `<template>
      <button {{on "click" this.handleClick}}>Click</button>
    </template>`,
    `<template>
      <button {{on "click" (fn this.handleClick arg)}}>Click</button>
    </template>`,
    `<template>
      <button {{on "click" (fn this.handleClick arg1 arg2)}}>Click</button>
    </template>`,
    `<template>
      <Component @action={{this.myAction}} />
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <button {{on "click" (fn this.handleClick)}}>Click</button>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Unnecessary use of (fn) helper. Pass the function directly instead: this.handleClick',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: `<template>
        <Component @action={{fn this.save}} />
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Unnecessary use of (fn) helper. Pass the function directly instead: this.save',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
  ],
});
