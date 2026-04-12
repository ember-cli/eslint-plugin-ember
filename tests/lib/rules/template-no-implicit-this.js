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

    // Named-argument control-flow helpers not flagged
    '<template>{{if @condition "yes" "no"}}</template>',
    '<template>{{each @items}}</template>',

    // SubExpression, modifier, block callees not flagged
    '<template>{{echo (my-helper @arg)}}</template>',
    '<template><div {{my-modifier @arg}}></div></template>',
    '<template>{{#my-component}}{{/my-component}}</template>',

    // Bare {{this}} is not ambiguous
    '<template>{{this}}</template>',

    // Block params in nested scopes
    '<template>{{#each @items as |item|}}{{item.name}}{{/each}}</template>',

    // JS scope bindings (imports, const, let, params) are valid references in GJS/GTS
    `const condition = false;
     export default <template>{{if condition "yes" "no"}}</template>;`,
    `import helper from './my-helper';
     export default <template>{{helper}}</template>;`,
    `const items = [1, 2, 3];
     export default <template>{{#each items as |item|}}{{item}}{{/each}}</template>;`,

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
    // Control-flow helper args with no JS binding are still ambiguous
    {
      code: '<template>{{if condition "yes" "no"}}</template>',
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
    '{{this}}',
    '{{this.book}}',
    '{{this.book.author}}',

    // Helpers invoked with arguments
    '{{helper argument=true}}',
    '{{some-helper argument=true}}',

    // Helpers invoked with positional arguments (callee is not flagged)
    '<MyComponent @prop={{can "edit" @model}} />',

    // SubExpression callees should not be flagged
    '{{echo (my-helper @arg)}}',
    '{{echo (some-util "value")}}',

    // ElementModifierStatement callees should not be flagged
    '<div {{my-modifier @arg}}></div>',
    '<div {{some-modifier "value"}}></div>',

    // BlockStatement callees should not be flagged
    '{{#my-component}}{{/my-component}}',
    '{{#some-layout title="Hi"}}content{{/some-layout}}',

    // Block params should be recognized in nested scopes
    '{{#each @items as |item|}}{{item.name}}{{/each}}',
    '{{#each @items as |item|}}{{item}}{{/each}}',
    '{{#let @foo as |bar|}}{{bar.baz}}{{/let}}',
    '{{#each @items as |item|}}{{#each item.children as |child|}}{{child.name}}{{/each}}{{/each}}',

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
