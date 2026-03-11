//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-triple-curlies');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-triple-curlies', rule, {
  valid: [
    `<template>
      {{this.content}}
    </template>`,
    `<template>
      <div>{{@text}}</div>
    </template>`,
    `<template>
      {{htmlSafe this.content}}
    </template>`,

    '<template>{{foo}}</template>',
  ],

  invalid: [
    {
      code: `<template>
        {{{this.content}}}
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Usage of triple curly brackets is unsafe. Use htmlSafe helper if absolutely necessary.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
    {
      code: `<template>
        <div>
          {{{@htmlContent}}}
        </div>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Usage of triple curly brackets is unsafe. Use htmlSafe helper if absolutely necessary.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },

    {
      code: `<template>
 {{{foo}}}</template>`,
      output: null,
      errors: [
        {
          message:
            'Usage of triple curly brackets is unsafe. Use htmlSafe helper if absolutely necessary.',
        },
      ],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-triple-curlies (hbs)', rule, {
  valid: [
    '{{foo}}',
    '{{! template-lint-disable no-bare-strings }}',
    '{{! template-lint-disable }}',
  ],
  invalid: [
    {
      code: '\n {{{foo}}}',
      output: null,
      errors: [
        {
          message:
            'Usage of triple curly brackets is unsafe. Use htmlSafe helper if absolutely necessary.',
        },
      ],
    },
  ],
});
