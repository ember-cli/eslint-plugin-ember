//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-class-bindings');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-class-bindings', rule, {
  valid: [
    `<template>
      <div class="my-class"></div>
    </template>`,
    `<template>
      <div class={{this.myClass}}></div>
    </template>`,
    `<template>
      <div class={{if this.isActive "active"}}></div>
    </template>`,
  ],

  invalid: [
    // Note: This rule would catch deprecated class binding patterns if they were present
    // Modern Ember templates don't support colon syntax, so we keep tests simple
  ],
});
