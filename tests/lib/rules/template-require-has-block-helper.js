//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-require-has-block-helper');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-has-block-helper', rule, {
  valid: [
    `<template>
      {{#if (has-block)}}
        {{yield}}
      {{/if}}
    </template>`,
    `<template>
      {{#if (has-block "inverse")}}
        {{yield to="inverse"}}
      {{/if}}
    </template>`,
    `<template>
      <div>{{this.hasBlockData}}</div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        {{#if hasBlock}}
          {{yield}}
        {{/if}}
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use (has-block) helper instead of hasBlock property.',
          type: 'GlimmerPathExpression',
        },
      ],
    },
    {
      code: `<template>
        {{#if this.hasBlock}}
          {{yield}}
        {{/if}}
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use (has-block) helper instead of hasBlock property.',
          type: 'GlimmerPathExpression',
        },
      ],
    },
    {
      code: `<template>
        {{hasBlock}}
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use (has-block) helper instead of hasBlock property.',
          type: 'GlimmerPathExpression',
        },
      ],
    },
  ],
});
