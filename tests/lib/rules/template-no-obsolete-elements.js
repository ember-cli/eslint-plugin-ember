const rule = require('../../../lib/rules/template-no-obsolete-elements');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-obsolete-elements', rule, {
  valid: [
    '<template><div></div></template>',
    `<template>{{#let (component 'whatever-here') as |plaintext|}}
      <plaintext />
    {{/let}}</template>`,
  ],
  invalid: [
    {
      code: '<template><marquee></marquee></template>',
      output: null,
      errors: [{ messageId: 'obsolete' }],
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

hbsRuleTester.run('template-no-obsolete-elements', rule, {
  valid: [
    '<div></div>',
    `{{#let (component 'whatever-here') as |plaintext|}}
      <plaintext />
    {{/let}}`,
  ],
  invalid: [
    {
      code: '<acronym></acronym>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'acronym' } }],
    },
    {
      code: '<applet></applet>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'applet' } }],
    },
    {
      code: '<basefont></basefont>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'basefont' } }],
    },
    {
      code: '<bgsound></bgsound>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'bgsound' } }],
    },
    {
      code: '<big></big>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'big' } }],
    },
    {
      code: '<blink></blink>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'blink' } }],
    },
    {
      code: '<center></center>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'center' } }],
    },
    {
      code: '<dir></dir>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'dir' } }],
    },
    {
      code: '<font></font>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'font' } }],
    },
    {
      code: '<frame></frame>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'frame' } }],
    },
    {
      code: '<frameset></frameset>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'frameset' } }],
    },
    {
      code: '<isindex></isindex>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'isindex' } }],
    },
    {
      code: '<keygen>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'keygen' } }],
    },
    {
      code: '<listing></listing>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'listing' } }],
    },
    {
      code: '<marquee></marquee>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'marquee' } }],
    },
    {
      code: '<menuitem></menuitem>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'menuitem' } }],
    },
    {
      code: '<multicol></multicol>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'multicol' } }],
    },
    {
      code: '<nextid></nextid>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'nextid' } }],
    },
    {
      code: '<nobr></nobr>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'nobr' } }],
    },
    {
      code: '<noembed></noembed>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'noembed' } }],
    },
    {
      code: '<noframes></noframes>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'noframes' } }],
    },
    {
      code: '<param>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'param' } }],
    },
    {
      code: '<plaintext></plaintext>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'plaintext' } }],
    },
    {
      code: '<rb></rb>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'rb' } }],
    },
    {
      code: '<rtc></rtc>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'rtc' } }],
    },
    {
      code: '<spacer></spacer>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'spacer' } }],
    },
    {
      code: '<strike></strike>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'strike' } }],
    },
    {
      code: '<tt></tt>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'tt' } }],
    },
    {
      code: '<xmp></xmp>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'xmp' } }],
    },
  ],
});
