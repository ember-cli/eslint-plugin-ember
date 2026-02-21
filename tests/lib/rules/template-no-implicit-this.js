const eslint = require('eslint');
const rule = require('../../../lib/rules/template-no-implicit-this');

const { RuleTester } = eslint;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-implicit-this', rule, {
  valid: [
    // Explicit this
    '<template>{{this.property}}</template>',
    '<template>{{this.method}}</template>',

    // Named arguments
    '<template>{{@arg}}</template>',
    '<template>{{@myArg}}</template>',

    // Built-in helpers
    '<template>{{yield}}</template>',
    '<template>{{outlet}}</template>',
    '<template>{{has-block}}</template>',

    // Helpers with params
    '<template>{{if condition "yes" "no"}}</template>',
    '<template>{{each items}}</template>',

    // Helpers with dashes
    '<template>{{my-helper}}</template>',

    // Components (PascalCase)
    '<template>{{MyComponent}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{property}}</template>',
      output: null,
      errors: [{ messageId: 'noImplicitThis' }],
    },
    {
      code: '<template>{{someValue}}</template>',
      output: null,
      errors: [{ messageId: 'noImplicitThis' }],
    },
    {
      code: '<template><div>{{property}}</div></template>',
      output: null,
      errors: [{ messageId: 'noImplicitThis' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template>{{book}}</template>',
      output: null,
      errors: [{ messageId: 'noImplicitThis' }],
    },
    {
      code: '<template>{{book-details}}</template>',
      output: null,
      errors: [{ messageId: 'noImplicitThis' }],
    },
    {
      code: '<template>{{book.author}}</template>',
      output: null,
      errors: [{ messageId: 'noImplicitThis' }],
    },
    {
      code: '<template>{{helper book}}</template>',
      output: null,
      errors: [{ messageId: 'noImplicitThis' }],
    },
    {
      code: '<template>{{#helper book}}{{/helper}}</template>',
      output: null,
      errors: [{ messageId: 'noImplicitThis' }],
    },
    {
      code: '<template><MyComponent @prop={{can.do}} /></template>',
      output: null,
      errors: [{ messageId: 'noImplicitThis' }],
    },
    {
      code: '<template>{{session.user.name}}</template>',
      output: null,
      errors: [{ messageId: 'noImplicitThis' }],
    },
    {
      code: '<template><MyComponent @prop={{session.user.name}} /></template>',
      output: null,
      errors: [{ messageId: 'noImplicitThis' }],
    },
    {
      code: `<template>import { hbs } from 'ember-cli-htmlbars';
        import { setComponentTemplate } from '@ember/component';
        import templateOnly from '@ember/component/template-only';
        export const SomeComponent = setComponentTemplate(hbs\`{{book}}\`, templateOnly());</template>`,
      output: null,
      errors: [{ messageId: 'noImplicitThis' }],
    },
    {
      code: `<template>import { hbs } from 'ember-cli-htmlbars';
        import { setComponentTemplate } from '@ember/component';
        import templateOnly from '@ember/component/template-only';
        export const SomeComponent = setComponentTemplate(hbs\`{{book}}\`, templateOnly());</template>`,
      output: null,
      errors: [{ messageId: 'noImplicitThis' }],
    },
  ],
});
