//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-inline-linkto');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-inline-linkto', rule, {
  valid: [
    `<template>
      <LinkTo @route="index">Home</LinkTo>
    </template>`,
    `<template>
      <LinkTo @route="about">
        About
      </LinkTo>
    </template>`,
    `<template>
      <div></div>
    </template>`,
  ],

  invalid: [
    {
      code: `<template>
        <LinkTo @route="index" />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use block form of LinkTo component instead of inline form.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <LinkTo @route="about" />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use block form of LinkTo component instead of inline form.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <LinkTo @route="contact"></LinkTo>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Use block form of LinkTo component instead of inline form.',
          type: 'GlimmerElementNode',
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

hbsRuleTester.run('template-no-inline-linkto', rule, {
  valid: [
    // Block form of curly link-to is OK
    "{{#link-to 'routeName' prop}}Link text{{/link-to}}",
    "{{#link-to 'routeName'}}Link text{{/link-to}}",
    // Angle bracket with content is OK
    '<LinkTo @route="index">Home</LinkTo>',
  ],
  invalid: [
    // Inline curly form is not allowed
    {
      code: "{{link-to 'Link text' 'routeName'}}",
      output: null,
      errors: [{ messageId: 'noInlineLinkTo' }],
    },
    {
      code: "{{link-to 'Link text' 'routeName' one two}}",
      output: null,
      errors: [{ messageId: 'noInlineLinkTo' }],
    },
    {
      code: "{{link-to (concat 'Hello' @username) 'routeName' one two}}",
      output: null,
      errors: [{ messageId: 'noInlineLinkTo' }],
    },
    {
      code: "{{link-to 1234 'routeName' one two}}",
      output: null,
      errors: [{ messageId: 'noInlineLinkTo' }],
    },
    // Angle bracket with no content
    {
      code: '<LinkTo @route="index" />',
      output: null,
      errors: [{ messageId: 'noInlineLinkTo' }],
    },
  ],
});
