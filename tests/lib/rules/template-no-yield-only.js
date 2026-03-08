//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-yield-only');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-yield-only', rule, {
  valid: [
    `<template>
      <div>
        {{yield}}
      </div>
    </template>`,
    `<template>
      {{this.something}}
      {{yield}}
    </template>`,
    `<template>
      <div></div>
    </template>`,

    '<template>{{yield (hash someProp=someValue)}}</template>',
    '<template>{{field}}</template>',
    '<template>{{#yield}}{{/yield}}</template>',
    '<template><Yield/></template>',
    '<template><yield/></template>',
  ],

  invalid: [
    {
      code: `<template>
        {{yield}}
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Component should not only yield. Add wrapper element or additional functionality.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
    {
      code: `<template>
  
        {{yield}}
  
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Component should not only yield. Add wrapper element or additional functionality.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
    {
      code: '<template>{{yield}}</template>',
      output: null,
      errors: [
        {
          message:
            'Component should not only yield. Add wrapper element or additional functionality.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },

    {
      code: '<template>     {{yield}}</template>',
      output: null,
      errors: [
        {
          message:
            'Component should not only yield. Add wrapper element or additional functionality.',
        },
      ],
    },
    {
      code: `<template>
  {{yield}}
     </template>`,
      output: null,
      errors: [
        {
          message:
            'Component should not only yield. Add wrapper element or additional functionality.',
        },
      ],
    },
    {
      code: `<template>
{{! some comment }}  {{yield}}
     </template>`,
      output: null,
      errors: [
        {
          message:
            'Component should not only yield. Add wrapper element or additional functionality.',
        },
      ],
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

hbsRuleTester.run('template-no-yield-only', rule, {
  valid: [
    '{{yield (hash someProp=someValue)}}',
    '{{field}}',
    '{{#yield}}{{/yield}}',
    '<Yield/>',
    '<yield/>',
  ],
  invalid: [
    {
      code: '{{yield}}',
      output: null,
      errors: [{ messageId: 'noYieldOnly' }],
    },
    {
      code: '     {{yield}}',
      output: null,
      errors: [{ messageId: 'noYieldOnly' }],
    },
    {
      code: '\n  {{yield}}\n     ',
      output: null,
      errors: [{ messageId: 'noYieldOnly' }],
    },
    {
      code: '\n{{! some comment }}  {{yield}}\n     ',
      output: null,
      errors: [{ messageId: 'noYieldOnly' }],
    },
  ],
});
