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

    // GJS/GTS: without an `@ember/routing` import, `<LinkTo>` is a
    // user-authored component — flagging it would corrupt the user's intent.
    {
      filename: 'test.gjs',
      code: '<template><LinkTo @route="index" /></template>',
    },
    {
      filename: 'test.gts',
      code: '<template><LinkTo /></template>',
    },

    // GJS/GTS with the canonical `@ember/routing` import: still allow when
    // the LinkTo has children (block form).
    {
      filename: 'test.gjs',
      code: 'import { LinkTo } from \'@ember/routing\';\n<template><LinkTo @route="index">Home</LinkTo></template>',
    },

    // Renamed import: also allowed when the renamed LinkTo has children.
    {
      filename: 'test.gjs',
      code: 'import { LinkTo as Link } from \'@ember/routing\';\n<template><Link @route="index">Home</Link></template>',
    },
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

    // GJS/GTS with `@ember/routing` import: childless LinkTo is flagged.
    {
      filename: 'test.gjs',
      code: 'import { LinkTo } from \'@ember/routing\';\n<template><LinkTo @route="index" /></template>',
      output: null,
      errors: [{ messageId: 'noInlineLinkTo', type: 'GlimmerElementNode' }],
    },
    {
      filename: 'test.gts',
      code: 'import { LinkTo } from \'@ember/routing\';\n<template><LinkTo @route="contact"></LinkTo></template>',
      output: null,
      errors: [{ messageId: 'noInlineLinkTo', type: 'GlimmerElementNode' }],
    },

    // Renamed import: childless `<Link>` is flagged because it resolves to
    // the framework `LinkTo`.
    {
      filename: 'test.gjs',
      code: 'import { LinkTo as Link } from \'@ember/routing\';\n<template><Link @route="index" /></template>',
      output: null,
      errors: [{ messageId: 'noInlineLinkTo', type: 'GlimmerElementNode' }],
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
      output: "{{#link-to 'routeName'}}Link text{{/link-to}}",
      errors: [{ messageId: 'noInlineLinkTo' }],
    },
    {
      code: "{{link-to 'Link text' 'routeName' one two}}",
      output: "{{#link-to 'routeName' one two}}Link text{{/link-to}}",
      errors: [{ messageId: 'noInlineLinkTo' }],
    },
    {
      code: "{{link-to (concat 'Hello' @username) 'routeName' one two}}",
      output: "{{#link-to 'routeName' one two}}{{concat 'Hello' @username}}{{/link-to}}",
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
