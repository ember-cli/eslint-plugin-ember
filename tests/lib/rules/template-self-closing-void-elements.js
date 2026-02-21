//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-self-closing-void-elements');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-self-closing-void-elements', rule, {
  valid: [
    `<template>
      <div></div>
    </template>`,
    `<template>
      <img src="foo.jpg">
    </template>`,
    `<template>
      <br>
    </template>`,
    `<template>
      <input type="text">
    </template>`,
  
    // Test cases ported from ember-template-lint
    '<template><area></template>',
    '<template><base></template>',
    '<template><br></template>',
    '<template><col></template>',
    '<template><command></template>',
    '<template><embed></template>',
    '<template><hr></template>',
    '<template><img></template>',
    '<template><input></template>',
    '<template><keygen></template>',
    '<template><link></template>',
    '<template><meta></template>',
    '<template><param></template>',
    '<template><source></template>',
    '<template><track></template>',
    '<template><wbr></template>',
  ],

  invalid: [
    {
      code: `<template>
        <img src="foo.jpg" />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Void element should be self-closing.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <br />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Void element should be self-closing.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <input type="text" />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Void element should be self-closing.',
          type: 'GlimmerElementNode',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><area/></template>',
      output: null,
      errors: [{ message: 'Void element should be self-closing.' }],
    },
    {
      code: '<template><base/></template>',
      output: null,
      errors: [{ message: 'Void element should be self-closing.' }],
    },
    {
      code: '<template><br/></template>',
      output: null,
      errors: [{ message: 'Void element should be self-closing.' }],
    },
    {
      code: '<template><col/></template>',
      output: null,
      errors: [{ message: 'Void element should be self-closing.' }],
    },
    {
      code: '<template><command/></template>',
      output: null,
      errors: [{ message: 'Void element should be self-closing.' }],
    },
    {
      code: '<template><embed/></template>',
      output: null,
      errors: [{ message: 'Void element should be self-closing.' }],
    },
    {
      code: '<template><hr/></template>',
      output: null,
      errors: [{ message: 'Void element should be self-closing.' }],
    },
    {
      code: '<template><img/></template>',
      output: null,
      errors: [{ message: 'Void element should be self-closing.' }],
    },
    {
      code: '<template><input/></template>',
      output: null,
      errors: [{ message: 'Void element should be self-closing.' }],
    },
    {
      code: '<template><keygen/></template>',
      output: null,
      errors: [{ message: 'Void element should be self-closing.' }],
    },
    {
      code: '<template><link/></template>',
      output: null,
      errors: [{ message: 'Void element should be self-closing.' }],
    },
    {
      code: '<template><meta/></template>',
      output: null,
      errors: [{ message: 'Void element should be self-closing.' }],
    },
    {
      code: '<template><param/></template>',
      output: null,
      errors: [{ message: 'Void element should be self-closing.' }],
    },
    {
      code: '<template><source/></template>',
      output: null,
      errors: [{ message: 'Void element should be self-closing.' }],
    },
    {
      code: '<template><track/></template>',
      output: null,
      errors: [{ message: 'Void element should be self-closing.' }],
    },
  ],
});
