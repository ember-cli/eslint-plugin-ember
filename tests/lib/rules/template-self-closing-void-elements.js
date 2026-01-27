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
          message: 'Self-closing a void element is redundant.',
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
          message: 'Self-closing a void element is redundant.',
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
          message: 'Self-closing a void element is redundant.',
          type: 'GlimmerElementNode',
        },
      ],
    },

    {
      code: '<template><area/></template>',
      output: null,
      errors: [{ message: 'Self-closing a void element is redundant.' }],
    },
    {
      code: '<template><base/></template>',
      output: null,
      errors: [{ message: 'Self-closing a void element is redundant.' }],
    },
    {
      code: '<template><br/></template>',
      output: null,
      errors: [{ message: 'Self-closing a void element is redundant.' }],
    },
    {
      code: '<template><col/></template>',
      output: null,
      errors: [{ message: 'Self-closing a void element is redundant.' }],
    },
    {
      code: '<template><command/></template>',
      output: null,
      errors: [{ message: 'Self-closing a void element is redundant.' }],
    },
    {
      code: '<template><embed/></template>',
      output: null,
      errors: [{ message: 'Self-closing a void element is redundant.' }],
    },
    {
      code: '<template><hr/></template>',
      output: null,
      errors: [{ message: 'Self-closing a void element is redundant.' }],
    },
    {
      code: '<template><img/></template>',
      output: null,
      errors: [{ message: 'Self-closing a void element is redundant.' }],
    },
    {
      code: '<template><input/></template>',
      output: null,
      errors: [{ message: 'Self-closing a void element is redundant.' }],
    },
    {
      code: '<template><keygen/></template>',
      output: null,
      errors: [{ message: 'Self-closing a void element is redundant.' }],
    },
    {
      code: '<template><link/></template>',
      output: null,
      errors: [{ message: 'Self-closing a void element is redundant.' }],
    },
    {
      code: '<template><meta/></template>',
      output: null,
      errors: [{ message: 'Self-closing a void element is redundant.' }],
    },
    {
      code: '<template><param/></template>',
      output: null,
      errors: [{ message: 'Self-closing a void element is redundant.' }],
    },
    {
      code: '<template><source/></template>',
      output: null,
      errors: [{ message: 'Self-closing a void element is redundant.' }],
    },
    {
      code: '<template><track/></template>',
      output: null,
      errors: [{ message: 'Self-closing a void element is redundant.' }],
    },
    {
      code: '<template><wbr/></template>',
      output: null,
      errors: [{ message: 'Self-closing a void element is redundant.' }],
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

hbsRuleTester.run('template-self-closing-void-elements', rule, {
  valid: [
    '<area>',
    '<base>',
    '<br>',
    '<col>',
    '<command>',
    '<embed>',
    '<hr>',
    '<img>',
    '<input>',
    '<keygen>',
    '<link>',
    '<meta>',
    '<param>',
    '<source>',
    '<track>',
    '<wbr>',
    // 'require' config — self-closing void elements are valid.
    { code: '<area/>', options: ['require'] },
    { code: '<br/>', options: ['require'] },
    { code: '<hr/>', options: ['require'] },
    { code: '<img/>', options: ['require'] },
    { code: '<input/>', options: ['require'] },
  ],
  invalid: [
    { code: '<area/>', output: null, errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<base/>', output: null, errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<br/>', output: null, errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<col/>', output: null, errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<command/>', output: null, errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<embed/>', output: null, errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<hr/>', output: null, errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<img/>', output: null, errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<input/>', output: null, errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<keygen/>', output: null, errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<link/>', output: null, errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<meta/>', output: null, errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<param/>', output: null, errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<source/>', output: null, errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<track/>', output: null, errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<wbr/>', output: null, errors: [{ messageId: 'redundantSelfClosing' }] },
    // 'require' config — non-self-closing void elements are invalid.
    {
      code: '<area>',
      output: null,
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<base>',
      output: null,
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<br>',
      output: null,
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<col>',
      output: null,
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<command>',
      output: null,
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<embed>',
      output: null,
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<hr>',
      output: null,
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<img>',
      output: null,
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<input>',
      output: null,
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<keygen>',
      output: null,
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<link>',
      output: null,
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<meta>',
      output: null,
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<param>',
      output: null,
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<source>',
      output: null,
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<track>',
      output: null,
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<wbr>',
      output: null,
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
  ],
});
