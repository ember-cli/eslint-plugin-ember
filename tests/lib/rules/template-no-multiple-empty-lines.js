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

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-multiple-empty-lines', rule, {
  valid: [
    '<div>foo</div><div>bar</div>',
    `<div>foo</div>
<div>bar</div>`,
    `<div>foo</div>

<div>bar</div>`,
    `
<div>foo</div>

<div>bar</div>
`,
  ],
  invalid: [
    {
      code: `<div>foo</div>




<div>bar</div>`,
      output: null,
      errors: [{ message: 'More than 1 blank line not allowed.' }],
    },
  ],
});
