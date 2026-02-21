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
  
    // Test cases ported from ember-template-lint
    '<template>{{yield to="title"}}</template>',
    '<template>{{has-block}}</template>',
    '<template>{{has-block "title"}}</template>',
    '<template>{{has-block-params}}</template>',
    '<template>{{has-block-params "title"}}</template>',
    '<template>{{hasBlock}}</template>',
    '<template>{{hasBlock "title"}}</template>',
    '<template>{{hasBlockParams}}</template>',
    '<template>{{hasBlockParams "title"}}</template>',
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
  
    // Test cases ported from ember-template-lint
    {
      code: '<template>{{has-block "default"}}</template>',
      output: null,
      errors: [{ messageId: 'noExplicitDefaultBlock' }],
    },
    {
      code: '<template>{{has-block-params "default"}}</template>',
      output: null,
      errors: [{ messageId: 'noExplicitDefaultBlock' }],
    },
    {
      code: '<template>{{hasBlock "default"}}</template>',
      output: null,
      errors: [{ messageId: 'noExplicitDefaultBlock' }],
    },
    {
      code: '<template>{{hasBlockParams "default"}}</template>',
      output: null,
      errors: [{ messageId: 'noExplicitDefaultBlock' }],
    },
    {
      code: '<template>{{if (has-block "default")}}</template>',
      output: null,
      errors: [{ messageId: 'noExplicitDefaultBlock' }],
    },
    {
      code: '<template>{{#if (has-block "default")}}{{/if}}</template>',
      output: null,
      errors: [{ messageId: 'noExplicitDefaultBlock' }],
    },
    {
      code: '<template>{{if (has-block-params "default")}}</template>',
      output: null,
      errors: [{ messageId: 'noExplicitDefaultBlock' }],
    },
    {
      code: '<template>{{#if (has-block-params "default")}}{{/if}}</template>',
      output: null,
      errors: [{ messageId: 'noExplicitDefaultBlock' }],
    },
    {
      code: '<template>{{if (hasBlock "default")}}</template>',
      output: null,
      errors: [{ messageId: 'noExplicitDefaultBlock' }],
    },
    {
      code: '<template>{{#if (hasBlock "default")}}{{/if}}</template>',
      output: null,
      errors: [{ messageId: 'noExplicitDefaultBlock' }],
    },
    {
      code: '<template>{{if (hasBlockParams "default")}}</template>',
      output: null,
      errors: [{ messageId: 'noExplicitDefaultBlock' }],
    },
    {
      code: '<template>{{#if (hasBlockParams "default")}}{{/if}}</template>',
      output: null,
      errors: [{ messageId: 'noExplicitDefaultBlock' }],
    },
  ],
});
