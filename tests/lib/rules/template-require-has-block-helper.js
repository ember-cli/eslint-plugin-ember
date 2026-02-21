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
  
    // Test cases ported from ember-template-lint
    '<template>{{has-block}}</template>',
    '<template>{{has-block-params}}</template>',
    '<template>{{something-else}}</template>',
    '<template>{{component test=(if (has-block) "true")}}</template>',
    '<template>{{component test=(if (has-block-params) "true")}}</template>',
    '<template><SomeComponent someProp={{has-block}} /></template>',
    '<template><SomeComponent someProp={{has-block-params}} /></template>',
    '<template>{{#if (has-block)}}{{/if}}</template>',
    '<template>{{#if (has-block-params)}}{{/if}}</template>',
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
  
    // Test cases ported from ember-template-lint
    {
      code: '<template>{{hasBlockParams}}</template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template>{{if hasBlock "true" "false"}}</template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template>{{if hasBlockParams "true" "false"}}</template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template>{{if (hasBlock) "true" "false"}}</template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template>{{if (hasBlockParams) "true" "false"}}</template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template>{{if (hasBlock "inverse") "true" "false"}}</template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template>{{if (hasBlockParams "inverse") "true" "false"}}</template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template>{{component test=(if hasBlock "true")}}</template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template>{{component test=(if hasBlockParams "true")}}</template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template>{{#if hasBlock}}{{/if}}</template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template>{{#if hasBlockParams}}{{/if}}</template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template>{{#if (hasBlock)}}{{/if}}</template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template>{{#if (hasBlockParams)}}{{/if}}</template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template>{{#if (hasBlock "inverse")}}{{/if}}</template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template>{{#if (hasBlockParams "inverse")}}{{/if}}</template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template><button name={{hasBlock}}></button></template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template><button name={{hasBlockParams}}></button></template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template><button name={{hasBlock "inverse"}}></button></template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template><button name={{hasBlockParams "inverse"}}></button></template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template>{{#if (or isLoading hasLoadFailed hasBlock)}}...{{/if}}</template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
    {
      code: '<template>{{#if (or isLoading hasLoadFailed hasBlockParams)}}...{{/if}}</template>',
      output: null,
      errors: [{ message: 'Use (has-block) helper instead of hasBlock property.' }],
    },
  ],
});
