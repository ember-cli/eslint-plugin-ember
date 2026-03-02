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

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-yield-to-default', rule, {
  valid: [
    '{{yield}}',
    '{{yield to="title"}}',
    '{{has-block}}',
    '{{has-block "title"}}',
    '{{has-block-params}}',
    '{{has-block-params "title"}}',
    '{{hasBlock}}',
    '{{hasBlock "title"}}',
    '{{hasBlockParams}}',
    '{{hasBlockParams "title"}}',
  ],
  invalid: [
    {
      code: '{{yield to="default"}}',
      output: null,
      errors: [
        { message: 'Do not use (yield to="default"). Use (yield) without the "to" argument instead.' },
      ],
    },
    {
      code: '{{has-block "default"}}',
      output: null,
      errors: [
        { message: 'Do not pass "default" explicitly. The default block is used when no name is specified.' },
      ],
    },
    {
      code: '{{has-block-params "default"}}',
      output: null,
      errors: [
        { message: 'Do not pass "default" explicitly. The default block is used when no name is specified.' },
      ],
    },
    {
      code: '{{hasBlock "default"}}',
      output: null,
      errors: [
        { message: 'Do not pass "default" explicitly. The default block is used when no name is specified.' },
      ],
    },
    {
      code: '{{hasBlockParams "default"}}',
      output: null,
      errors: [
        { message: 'Do not pass "default" explicitly. The default block is used when no name is specified.' },
      ],
    },
    {
      code: '{{if (has-block "default")}}',
      output: null,
      errors: [
        { message: 'Do not pass "default" explicitly. The default block is used when no name is specified.' },
      ],
    },
    {
      code: '{{#if (has-block "default")}}{{/if}}',
      output: null,
      errors: [
        { message: 'Do not pass "default" explicitly. The default block is used when no name is specified.' },
      ],
    },
    {
      code: '{{if (has-block-params "default")}}',
      output: null,
      errors: [
        { message: 'Do not pass "default" explicitly. The default block is used when no name is specified.' },
      ],
    },
    {
      code: '{{#if (has-block-params "default")}}{{/if}}',
      output: null,
      errors: [
        { message: 'Do not pass "default" explicitly. The default block is used when no name is specified.' },
      ],
    },
    {
      code: '{{if (hasBlock "default")}}',
      output: null,
      errors: [
        { message: 'Do not pass "default" explicitly. The default block is used when no name is specified.' },
      ],
    },
    {
      code: '{{#if (hasBlock "default")}}{{/if}}',
      output: null,
      errors: [
        { message: 'Do not pass "default" explicitly. The default block is used when no name is specified.' },
      ],
    },
    {
      code: '{{if (hasBlockParams "default")}}',
      output: null,
      errors: [
        { message: 'Do not pass "default" explicitly. The default block is used when no name is specified.' },
      ],
    },
    {
      code: '{{#if (hasBlockParams "default")}}{{/if}}',
      output: null,
      errors: [
        { message: 'Do not pass "default" explicitly. The default block is used when no name is specified.' },
      ],
    },
  ],
});
