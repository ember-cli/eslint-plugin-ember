//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-yield-to-default');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-yield-to-default', rule, {
  valid: [
    `<template>
      {{yield}}
    </template>`,
    `<template>
      {{yield to="inverse"}}
    </template>`,
    `<template>
      {{yield to="header"}}
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        {{yield to="default"}}
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use (yield to="default"). Use (yield) without the "to" argument instead.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
    {
      code: `<template>
        <div>
          {{yield to="default"}}
        </div>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use (yield to="default"). Use (yield) without the "to" argument instead.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
    {
      code: `<template>
        {{#if condition}}
          {{yield to="default"}}
        {{/if}}
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use (yield to="default"). Use (yield) without the "to" argument instead.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
  ],
});
