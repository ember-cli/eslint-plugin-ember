//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-positive-tabindex');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-positive-tabindex', rule, {
  valid: [
    `<template>
      <div tabindex="0">Content</div>
    </template>`,
    `<template>
      <div tabindex="-1">Content</div>
    </template>`,
    `<template>
      <button>Click</button>
    </template>`,
    `<template>
      <div>No tabindex</div>
    </template>`,
  
    // Test cases ported from ember-template-lint
    '<template><button tabindex="0"></button></template>',
    '<template><button tabindex="-1"></button></template>',
    '<template><button tabindex={{-1}}>baz</button></template>',
    '<template><button tabindex={{"-1"}}>baz</button></template>',
    '<template><button tabindex="{{-1}}">baz</button></template>',
    '<template><button tabindex="{{"-1"}}">baz</button></template>',
    '<template><button tabindex="{{if this.show -1}}">baz</button></template>',
    '<template><button tabindex="{{if this.show "-1" "0"}}">baz</button></template>',
    '<template><button tabindex="{{if (not this.show) "-1" "0"}}">baz</button></template>',
    '<template><button tabindex={{if this.show -1}}>baz</button></template>',
    '<template><button tabindex={{if this.show "-1" "0"}}>baz</button></template>',
    '<template><button tabindex={{if (not this.show) "-1" "0"}}>baz</button></template>',
  ],

  invalid: [
    {
      code: `<template>
        <div tabindex="1">Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Avoid positive integer values for tabindex.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <div tabindex="5">Content</div>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Avoid positive integer values for tabindex.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: `<template>
        <button tabindex="2">Click</button>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Avoid positive integer values for tabindex.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><button tabindex={{someProperty}}></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex="1"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex="text"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex={{true}}></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex="{{false}}"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex="{{5}}"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex="{{if a 1 -1}}"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex="{{if a -1 1}}"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex="{{if a 1}}"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex="{{if (not a) 1}}"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex="{{unless a 1}}"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
    {
      code: '<template><button tabindex="{{unless a -1 1}}"></button></template>',
      output: null,
      errors: [{ message: 'Avoid positive integer values for tabindex.' }],
    },
  ],
});
