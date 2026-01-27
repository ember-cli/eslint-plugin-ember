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

    // Multiple empty lines in JS code outside <template> must NOT be flagged
    'const foo = 1;\n\n\nconst bar = 2;\n\n<template><div>ok</div></template>',
  ],

  invalid: [
    {
      code: `<template>
      <div>Hello</div>


      <div>World</div>
    </template>`,
      output: `<template>
      <div>Hello</div>

      <div>World</div>
    </template>`,
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
      output: `<template>
      <div>First</div>

      <div>Second</div>
    </template>`,
      errors: [
        {
          message: 'More than 1 blank line not allowed.',
        },
      ],
    },

    {
      code: `<template><div>foo</div>


<div>bar</div></template>`,
      output: `<template><div>foo</div>

<div>bar</div></template>`,
      errors: [{ message: 'More than 1 blank line not allowed.' }],
    },
    {
      code: `<template><div>foo</div>




<div>bar</div></template>`,
      output: `<template><div>foo</div>

<div>bar</div></template>`,
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
    '<div>foo</div>\r\n<div>bar</div>',
    '<div>foo</div>\r\n\r\n<div>bar</div>',
    {
      code: '<div>foo</div>\n\n\n<div>bar</div>',
      options: [{ max: 2 }],
    },
    {
      code: '<div>foo</div>\r\n\r\n\r\n<div>bar</div>',
      options: [{ max: 2 }],
    },
  ],
  invalid: [
    {
      code: `<div>foo</div>


<div>bar</div>`,
      output: `<div>foo</div>

<div>bar</div>`,
      errors: [{ message: 'More than 1 blank line not allowed.' }],
    },
    {
      code: `<div>foo</div>




<div>bar</div>`,
      output: `<div>foo</div>

<div>bar</div>`,
      errors: [{ message: 'More than 1 blank line not allowed.' }],
    },
    {
      code: '<div>foo</div>\n\n\n\n\n<div>bar</div>',
      output: '<div>foo</div>\n\n\n\n<div>bar</div>',
      options: [{ max: 3 }],
      errors: [{ message: 'More than 3 blank lines not allowed.' }],
    },
  ],
});
