//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-negated-comparison');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-negated-comparison', rule, {
  valid: [
    `<template>
      {{#if (eq this.value 5)}}
        Equal
      {{/if}}
    </template>`,
    `<template>
      {{#unless (eq this.value 5)}}
        Not equal
      {{/unless}}
    </template>`,
    `<template>
      <div></div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        {{#if (not-eq this.value 5)}}
          Not equal
        {{/if}}
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use positive comparison operators instead of negated ones.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: `<template>
        {{#if (ne this.a this.b)}}
          Not equal
        {{/if}}
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use positive comparison operators instead of negated ones.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: `<template>
        <div class={{if (not-eq this.state "active") "inactive"}}></div>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use positive comparison operators instead of negated ones.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
  ],
});
