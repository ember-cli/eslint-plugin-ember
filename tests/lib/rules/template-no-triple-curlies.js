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
  
    // Test cases ported from ember-template-lint
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
  
    // Test cases ported from ember-template-lint
    {
      code: `<template>
 {{{foo}}}</template>`,
      output: null,
      errors: [{ message: 'Usage of triple curly brackets is unsafe. Use htmlSafe helper if absolutely necessary.' }],
    },
  ],
});
