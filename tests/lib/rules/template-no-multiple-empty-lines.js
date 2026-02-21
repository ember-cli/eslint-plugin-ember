//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-multiple-empty-lines');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-multiple-empty-lines', rule, {
  valid: [
    `<template>
      <div>Hello</div>

      <div>World</div>
    </template>`,
    {
      code: `<template>
      <div>Hello</div>


      <div>World</div>
    </template>`,
      options: [{ max: 2 }],
    },
    `<template>
      <div>Content</div>
    </template>`,
  
    // Test cases ported from ember-template-lint
    '<template><div>foo</div><div>bar</div></template>',
    `<template><div>foo</div>
<div>bar</div></template>`,
    `<template><div>foo</div>r
<div>bar</div></template>`,
    `<template><div>foo</div>

<div>bar</div></template>`,
    `<template><div>foo</div>r
r
<div>bar</div></template>`,
    `<template>
<div>foo</div>

<div>bar</div>
</template>`,
  ],

  invalid: [
    {
      code: `<template>
      <div>Hello</div>


      <div>World</div>
    </template>`,
      output: null,
      errors: [
        {
          message: 'More than 1 blank line not allowed.',
        },
      ],
    },
    {
      code: `<template>
      <div>First</div>



      <div>Second</div>
    </template>`,
      output: null,
      errors: [
        {
          message: 'More than 1 blank line not allowed.',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: `<template><div>foo</div>


<div>bar</div></template>`,
      output: null,
      errors: [{ message: 'More than 1 blank line not allowed.' }],
    },
    {
      code: `<template><div>foo</div>




<div>bar</div></template>`,
      output: null,
      errors: [{ message: 'More than 1 blank line not allowed.' }],
    },
  ],
});
