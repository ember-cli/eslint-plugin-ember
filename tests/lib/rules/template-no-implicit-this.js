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
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-implicit-this', rule, {
  valid: [
    // Built-in helpers/keywords
    '{{yield}}',
    '{{outlet}}',
    '{{has-block}}',
    '{{has-block-params}}',
    '{{hasBlock}}',
    '{{hasBlockParams}}',
    '{{debugger}}',
    '{{array}}',
    '{{concat}}',
    '{{hash}}',
    '{{log}}',
    '{{input}}',
    '{{textarea}}',
    '{{query-params}}',
    '{{unique-id}}',

    // Named arguments
    '{{@book}}',
    '{{@book.author}}',

    // Explicit this
    '{{this.book}}',
    '{{this.book.author}}',

    // Helpers invoked with arguments
    '{{helper argument=true}}',
    '{{some-helper argument=true}}',

    // Helpers invoked with positional arguments (callee is not flagged)
    '<MyComponent @prop={{can "edit" @model}} />',

    // PascalCase components
    '<WelcomePage />',
    '<MyComponent @prop={{@value}} />',
    '{{MyComponent}}',

    // Named arguments in various positions
    '{{@book argument=true}}',
    '{{helper argument=@book}}',
    '{{#helper argument=@book}}{{/helper}}',

    // Explicit this in various positions
    '{{this.book argument=true}}',
    '{{helper argument=this.book}}',
    '{{#helper argument=this.book}}{{/helper}}',

    // Allow config option
    {
      code: '{{book-details}}',
      options: [{ allow: ['book-details'] }],
    },
  ],
  invalid: [
    {
      code: '{{book}}',
      output: null,
      errors: [
        {
          message:
            'Ambiguous path "book" is not allowed. Use "@book" if it is a named argument or "this.book" if it is a property on the component.',
        },
      ],
    },
    {
      code: '{{book-details}}',
      output: null,
      errors: [
        {
          message:
            'Ambiguous path "book-details" is not allowed. Use "@book-details" if it is a named argument or "this.book-details" if it is a property on the component.',
        },
      ],
    },
    {
      code: '{{book.author}}',
      output: null,
      errors: [
        {
          message:
            'Ambiguous path "book.author" is not allowed. Use "@book.author" if it is a named argument or "this.book.author" if it is a property on the component.',
        },
      ],
    },
    {
      code: '{{helper book}}',
      output: null,
      errors: [
        {
          message:
            'Ambiguous path "book" is not allowed. Use "@book" if it is a named argument or "this.book" if it is a property on the component.',
        },
      ],
    },
    {
      code: '{{#helper book}}{{/helper}}',
      output: null,
      errors: [
        {
          message:
            'Ambiguous path "book" is not allowed. Use "@book" if it is a named argument or "this.book" if it is a property on the component.',
        },
      ],
    },
    {
      code: '<MyComponent @prop={{can.do}} />',
      output: null,
      errors: [
        {
          message:
            'Ambiguous path "can.do" is not allowed. Use "@can.do" if it is a named argument or "this.can.do" if it is a property on the component.',
        },
      ],
    },
    // allow: ['can'] should NOT allow 'can.do' (exact match only)
    {
      code: '<MyComponent @prop={{can.do}} />',
      output: null,
      options: [{ allow: ['can'] }],
      errors: [
        {
          message:
            'Ambiguous path "can.do" is not allowed. Use "@can.do" if it is a named argument or "this.can.do" if it is a property on the component.',
        },
      ],
    },
    {
      code: '{{session.user.name}}',
      output: null,
      errors: [
        {
          message:
            'Ambiguous path "session.user.name" is not allowed. Use "@session.user.name" if it is a named argument or "this.session.user.name" if it is a property on the component.',
        },
      ],
    },
    {
      code: '<MyComponent @prop={{session.user.name}} />',
      output: null,
      errors: [
        {
          message:
            'Ambiguous path "session.user.name" is not allowed. Use "@session.user.name" if it is a named argument or "this.session.user.name" if it is a property on the component.',
        },
      ],
    },
    {
      code: `import { hbs } from 'ember-cli-htmlbars';
        import { setComponentTemplate } from '@ember/component';
        import templateOnly from '@ember/component/template-only';
        export const SomeComponent = setComponentTemplate(hbs\`{{book}}\`, templateOnly());`,
      output: null,
      errors: [
        {
          message:
            'Ambiguous path "book" is not allowed. Use "@book" if it is a named argument or "this.book" if it is a property on the component.',
        },
      ],
    },
  ],
});
