const rule = require('../../../lib/rules/template-require-has-block-helper');
const RuleTester = require('eslint').RuleTester;

const validHbs = [
  '{{has-block}}',
  '{{has-block-params}}',
  '{{something-else}}',
  '{{component test=(if (has-block) "true")}}',
  '{{component test=(if (has-block-params) "true")}}',
  '<SomeComponent someProp={{has-block}}',
  '<SomeComponent someProp={{has-block-params}}',
  '{{#if (has-block)}}{{/if}}',
  '{{#if (has-block-params)}}{{/if}}',
];

const invalidHbs = [
  {
    code: '{{hasBlock}}',
    output: '{{has-block}}',
    errors: [{ message: '`hasBlock` is deprecated. Use the `has-block` helper instead.' }],
  },
  {
    code: '{{hasBlockParams}}',
    output: '{{has-block-params}}',
    errors: [
      { message: '`hasBlockParams` is deprecated. Use the `has-block-params` helper instead.' },
    ],
  },
  {
    code: '{{if hasBlock "true" "false"}}',
    output: '{{if (has-block) "true" "false"}}',
    errors: [{ message: '`hasBlock` is deprecated. Use the `has-block` helper instead.' }],
  },
  {
    code: '{{if hasBlockParams "true" "false"}}',
    output: '{{if (has-block-params) "true" "false"}}',
    errors: [
      { message: '`hasBlockParams` is deprecated. Use the `has-block-params` helper instead.' },
    ],
  },
  {
    code: '{{if (hasBlock) "true" "false"}}',
    output: '{{if (has-block) "true" "false"}}',
    errors: [{ message: '`hasBlock` is deprecated. Use the `has-block` helper instead.' }],
  },
  {
    code: '{{if (hasBlockParams) "true" "false"}}',
    output: '{{if (has-block-params) "true" "false"}}',
    errors: [
      { message: '`hasBlockParams` is deprecated. Use the `has-block-params` helper instead.' },
    ],
  },
  {
    code: '{{if (hasBlock "inverse") "true" "false"}}',
    output: '{{if (has-block "inverse") "true" "false"}}',
    errors: [{ message: '`hasBlock` is deprecated. Use the `has-block` helper instead.' }],
  },
  {
    code: '{{if (hasBlockParams "inverse") "true" "false"}}',
    output: '{{if (has-block-params "inverse") "true" "false"}}',
    errors: [
      { message: '`hasBlockParams` is deprecated. Use the `has-block-params` helper instead.' },
    ],
  },
  {
    code: '{{component test=(if hasBlock "true")}}',
    output: '{{component test=(if (has-block) "true")}}',
    errors: [{ message: '`hasBlock` is deprecated. Use the `has-block` helper instead.' }],
  },
  {
    code: '{{component test=(if hasBlockParams "true")}}',
    output: '{{component test=(if (has-block-params) "true")}}',
    errors: [
      { message: '`hasBlockParams` is deprecated. Use the `has-block-params` helper instead.' },
    ],
  },
  {
    code: '{{#if hasBlock}}{{/if}}',
    output: '{{#if (has-block)}}{{/if}}',
    errors: [{ message: '`hasBlock` is deprecated. Use the `has-block` helper instead.' }],
  },
  {
    code: '{{#if hasBlockParams}}{{/if}}',
    output: '{{#if (has-block-params)}}{{/if}}',
    errors: [
      { message: '`hasBlockParams` is deprecated. Use the `has-block-params` helper instead.' },
    ],
  },
  {
    code: '{{#if (hasBlock)}}{{/if}}',
    output: '{{#if (has-block)}}{{/if}}',
    errors: [{ message: '`hasBlock` is deprecated. Use the `has-block` helper instead.' }],
  },
  {
    code: '{{#if (hasBlockParams)}}{{/if}}',
    output: '{{#if (has-block-params)}}{{/if}}',
    errors: [
      { message: '`hasBlockParams` is deprecated. Use the `has-block-params` helper instead.' },
    ],
  },
  {
    code: '{{#if (hasBlock "inverse")}}{{/if}}',
    output: '{{#if (has-block "inverse")}}{{/if}}',
    errors: [{ message: '`hasBlock` is deprecated. Use the `has-block` helper instead.' }],
  },
  {
    code: '{{#if (hasBlockParams "inverse")}}{{/if}}',
    output: '{{#if (has-block-params "inverse")}}{{/if}}',
    errors: [
      { message: '`hasBlockParams` is deprecated. Use the `has-block-params` helper instead.' },
    ],
  },
  {
    code: '<button name={{hasBlock}}></button>',
    output: '<button name={{has-block}}></button>',
    errors: [{ message: '`hasBlock` is deprecated. Use the `has-block` helper instead.' }],
  },
  {
    code: '<button name={{hasBlockParams}}></button>',
    output: '<button name={{has-block-params}}></button>',
    errors: [
      { message: '`hasBlockParams` is deprecated. Use the `has-block-params` helper instead.' },
    ],
  },
  {
    code: '<button name={{hasBlock "inverse"}}></button>',
    output: '<button name={{has-block "inverse"}}></button>',
    errors: [{ message: '`hasBlock` is deprecated. Use the `has-block` helper instead.' }],
  },
  {
    code: '<button name={{hasBlockParams "inverse"}}></button>',
    output: '<button name={{has-block-params "inverse"}}></button>',
    errors: [
      { message: '`hasBlockParams` is deprecated. Use the `has-block-params` helper instead.' },
    ],
  },
  {
    code: '{{#if (or isLoading hasLoadFailed hasBlock)}}...{{/if}}',
    output: '{{#if (or isLoading hasLoadFailed (has-block))}}...{{/if}}',
    errors: [{ message: '`hasBlock` is deprecated. Use the `has-block` helper instead.' }],
  },
  {
    code: '{{#if (or isLoading hasLoadFailed hasBlockParams)}}...{{/if}}',
    output: '{{#if (or isLoading hasLoadFailed (has-block-params))}}...{{/if}}',
    errors: [
      { message: '`hasBlockParams` is deprecated. Use the `has-block-params` helper instead.' },
    ],
  },
];

function wrapTemplate(template) {
  if (template === '<SomeComponent someProp={{has-block}}') {
    return '<template><SomeComponent someProp={{has-block}} /></template>';
  }

  if (template === '<SomeComponent someProp={{has-block-params}}') {
    return '<template><SomeComponent someProp={{has-block-params}} /></template>';
  }

  return `<template>${template}</template>`;
}

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

gjsRuleTester.run('template-require-has-block-helper', rule, {
  valid: [
    ...validHbs.map(wrapTemplate),
    // GJS/GTS: an imported/local hasBlock binding is a user's own reference,
    // not the Glimmer built-in — rewriting to `has-block` would change semantics.
    `import hasBlock from './my-has-block';
     export default <template>{{hasBlock}}</template>;`,
    `const hasBlockParams = () => true;
     export default <template>{{hasBlockParams}}</template>;`,
  ],
  invalid: invalidHbs.map((test) => ({
    code: wrapTemplate(test.code),
    output: wrapTemplate(test.output),
    errors: test.errors,
  })),
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-require-has-block-helper', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
