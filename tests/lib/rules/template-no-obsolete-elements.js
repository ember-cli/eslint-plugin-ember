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
      code: '<big></big>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'big' } }],
    },
    {
      code: '<center></center>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'center' } }],
    },
    {
      code: '<marquee></marquee>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 'marquee' } }],
    },
    {
      code: '<s></s>',
      output: null,
      errors: [{ messageId: 'obsolete', data: { element: 's' } }],
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
