//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-autofocus-attribute');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-autofocus-attribute', rule, {
  valid: [
    `<template>
      <input type="text" />
    </template>`,
    `<template>
      <button>Click me</button>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <input type="text" autofocus />
      </template>`,
      output: `<template>
        <input type="text"/>
      </template>`,
      errors: [
        {
          message:
            'Avoid using autofocus attribute. Autofocusing elements can cause usability issues for sighted and non-sighted users.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <textarea autofocus></textarea>
      </template>`,
      output: `<template>
        <textarea></textarea>
      </template>`,
      errors: [
        {
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        {{input type="text" autofocus=true}}
      </template>`,
      errors: [
        {
          messageId: 'noAutofocus',
          type: 'GlimmerHashPair',
        },
      ],
    },
    {
      code: `<template>
        {{component "input" type="text" autofocus=true}}
      </template>`,
      errors: [
        {
          messageId: 'noAutofocus',
          type: 'GlimmerHashPair',
        },
      ],
    },
    {
      code: `<template>
        <div autofocus>
        </div>
      </template>`,
      output: `<template>
        <div>
        </div>
      </template>`,
      errors: [
        {
          messageId: 'noAutofocus',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <h1 autofocus>
        </h1>
      </template>`,
      output: `<template>
        <h1>
        </h1>
      </template>`,
      errors: [
        {
          messageId: 'noAutofocus',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <input autofocus="autofocus" />
      </template>`,
      output: `<template>
        <input />
      </template>`,
      errors: [
        {
          messageId: 'noAutofocus',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
