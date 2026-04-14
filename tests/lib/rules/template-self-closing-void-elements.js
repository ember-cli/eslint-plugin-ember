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
    {
      code: `<template>
        <img src="foo.jpg" />
      </template>`,
      options: [false],
    },
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

    // 'require' config — self-closing void elements are valid.
    { code: '<template><area/></template>', options: ['require'] },
    { code: '<template><base/></template>', options: ['require'] },
    { code: '<template><br/></template>', options: ['require'] },
    { code: '<template><col/></template>', options: ['require'] },
    { code: '<template><command/></template>', options: ['require'] },
    { code: '<template><embed/></template>', options: ['require'] },
    { code: '<template><hr/></template>', options: ['require'] },
    { code: '<template><img/></template>', options: ['require'] },
    { code: '<template><input/></template>', options: ['require'] },
    { code: '<template><keygen/></template>', options: ['require'] },
    { code: '<template><link/></template>', options: ['require'] },
    { code: '<template><meta/></template>', options: ['require'] },
    { code: '<template><param/></template>', options: ['require'] },
    { code: '<template><source/></template>', options: ['require'] },
    { code: '<template><track/></template>', options: ['require'] },
    { code: '<template><wbr/></template>', options: ['require'] },
  ],

  invalid: [
    {
      code: `<template>
        <img src="foo.jpg" />
      </template>`,
      output: `<template>
        <img src="foo.jpg">
      </template>`,
      errors: [
        {
          message: 'Self-closing a void element is redundant',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <br />
      </template>`,
      output: `<template>
        <br>
      </template>`,
      errors: [
        {
          message: 'Self-closing a void element is redundant',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <input type="text" />
      </template>`,
      output: `<template>
        <input type="text">
      </template>`,
      errors: [
        {
          message: 'Self-closing a void element is redundant',
          type: 'GlimmerElementNode',
        },
      ],
    },

    {
      code: '<template><area/></template>',
      output: '<template><area></template>',
      errors: [{ message: 'Self-closing a void element is redundant' }],
    },
    {
      code: '<template><base/></template>',
      output: '<template><base></template>',
      errors: [{ message: 'Self-closing a void element is redundant' }],
    },
    {
      code: '<template><br/></template>',
      output: '<template><br></template>',
      errors: [{ message: 'Self-closing a void element is redundant' }],
    },
    {
      code: '<template><col/></template>',
      output: '<template><col></template>',
      errors: [{ message: 'Self-closing a void element is redundant' }],
    },
    {
      code: '<template><command/></template>',
      output: '<template><command></template>',
      errors: [{ message: 'Self-closing a void element is redundant' }],
    },
    {
      code: '<template><embed/></template>',
      output: '<template><embed></template>',
      errors: [{ message: 'Self-closing a void element is redundant' }],
    },
    {
      code: '<template><hr/></template>',
      output: '<template><hr></template>',
      errors: [{ message: 'Self-closing a void element is redundant' }],
    },
    {
      code: '<template><img/></template>',
      output: '<template><img></template>',
      errors: [{ message: 'Self-closing a void element is redundant' }],
    },
    {
      code: '<template><input/></template>',
      output: '<template><input></template>',
      errors: [{ message: 'Self-closing a void element is redundant' }],
    },
    {
      code: '<template><keygen/></template>',
      output: '<template><keygen></template>',
      errors: [{ message: 'Self-closing a void element is redundant' }],
    },
    {
      code: '<template><link/></template>',
      output: '<template><link></template>',
      errors: [{ message: 'Self-closing a void element is redundant' }],
    },
    {
      code: '<template><meta/></template>',
      output: '<template><meta></template>',
      errors: [{ message: 'Self-closing a void element is redundant' }],
    },
    {
      code: '<template><param/></template>',
      output: '<template><param></template>',
      errors: [{ message: 'Self-closing a void element is redundant' }],
    },
    {
      code: '<template><source/></template>',
      output: '<template><source></template>',
      errors: [{ message: 'Self-closing a void element is redundant' }],
    },
    {
      code: '<template><track/></template>',
      output: '<template><track></template>',
      errors: [{ message: 'Self-closing a void element is redundant' }],
    },
    {
      code: '<template><wbr/></template>',
      output: '<template><wbr></template>',
      errors: [{ message: 'Self-closing a void element is redundant' }],
    },

    // 'require' config — non-self-closing void elements are invalid.
    {
      code: '<template><area></template>',
      output: '<template><area/></template>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<template><base></template>',
      output: '<template><base/></template>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<template><br></template>',
      output: '<template><br/></template>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<template><col></template>',
      output: '<template><col/></template>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<template><command></template>',
      output: '<template><command/></template>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<template><embed></template>',
      output: '<template><embed/></template>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<template><hr></template>',
      output: '<template><hr/></template>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<template><img></template>',
      output: '<template><img/></template>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<template><input></template>',
      output: '<template><input/></template>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<template><keygen></template>',
      output: '<template><keygen/></template>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<template><link></template>',
      output: '<template><link/></template>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<template><meta></template>',
      output: '<template><meta/></template>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<template><param></template>',
      output: '<template><param/></template>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<template><source></template>',
      output: '<template><source/></template>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<template><track></template>',
      output: '<template><track/></template>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<template><wbr></template>',
      output: '<template><wbr/></template>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
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
    { code: '<br/>', options: [false] },
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
    { code: '<base/>', options: ['require'] },
    { code: '<br/>', options: ['require'] },
    { code: '<col/>', options: ['require'] },
    { code: '<command/>', options: ['require'] },
    { code: '<embed/>', options: ['require'] },
    { code: '<hr/>', options: ['require'] },
    { code: '<img/>', options: ['require'] },
    { code: '<input/>', options: ['require'] },
    { code: '<keygen/>', options: ['require'] },
    { code: '<link/>', options: ['require'] },
    { code: '<meta/>', options: ['require'] },
    { code: '<param/>', options: ['require'] },
    { code: '<source/>', options: ['require'] },
    { code: '<track/>', options: ['require'] },
    { code: '<wbr/>', options: ['require'] },
    // Complex void element with attributes, modifiers, comments, and block params
    'foo<wbr data-custom="50" {{my-modifier true "baz"}} {{!comment}} as |paramA paramB| >bar',
    {
      code: 'foo<wbr data-custom="50" {{my-modifier true "baz"}} {{!comment}} as |paramA paramB| />bar',
      options: ['require'],
    },
  ],
  invalid: [
    { code: '<area/>', output: '<area>', errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<base/>', output: '<base>', errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<br/>', output: '<br>', errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<col/>', output: '<col>', errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<command/>', output: '<command>', errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<embed/>', output: '<embed>', errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<hr/>', output: '<hr>', errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<img/>', output: '<img>', errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<input/>', output: '<input>', errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<keygen/>', output: '<keygen>', errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<link/>', output: '<link>', errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<meta/>', output: '<meta>', errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<param/>', output: '<param>', errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<source/>', output: '<source>', errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<track/>', output: '<track>', errors: [{ messageId: 'redundantSelfClosing' }] },
    { code: '<wbr/>', output: '<wbr>', errors: [{ messageId: 'redundantSelfClosing' }] },
    // 'require' config — non-self-closing void elements are invalid.
    {
      code: '<area>',
      output: '<area/>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<base>',
      output: '<base/>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<br>',
      output: '<br/>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<col>',
      output: '<col/>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<command>',
      output: '<command/>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<embed>',
      output: '<embed/>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<hr>',
      output: '<hr/>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<img>',
      output: '<img/>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<input>',
      output: '<input/>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<keygen>',
      output: '<keygen/>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<link>',
      output: '<link/>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<meta>',
      output: '<meta/>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<param>',
      output: '<param/>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<source>',
      output: '<source/>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<track>',
      output: '<track/>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    {
      code: '<wbr>',
      output: '<wbr/>',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
    // Complex void element with attributes, modifiers, comments, and block params
    {
      code: 'foo<wbr data-custom="50" {{my-modifier true "baz"}} {{!comment}} as |paramA paramB| />bar',
      output:
        'foo<wbr data-custom="50" {{my-modifier true "baz"}} {{!comment}} as |paramA paramB| >bar',
      errors: [{ messageId: 'redundantSelfClosing' }],
    },
    {
      code: 'foo<wbr data-custom="50" {{my-modifier true "baz"}} {{!comment}} as |paramA paramB| >bar',
      output:
        'foo<wbr data-custom="50" {{my-modifier true "baz"}} {{!comment}} as |paramA paramB| />bar',
      options: ['require'],
      errors: [{ messageId: 'requireSelfClosing' }],
    },
  ],
});
