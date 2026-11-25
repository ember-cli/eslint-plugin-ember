//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-redundant-fn');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-redundant-fn', rule, {
  valid: [
    `<template>
      <button {{on "click" this.handleClick}}>Click</button>
    </template>`,
    `<template>
      <button {{on "click" (fn this.handleClick arg)}}>Click</button>
    </template>`,
    `<template>
      <button {{on "click" (fn this.handleClick arg1 arg2)}}>Click</button>
    </template>`,
    `<template>
      <Component @action={{this.myAction}} />
    </template>`,

    '<template><button {{on "click" this.handleClick}}>Click Me</button></template>',
    '<template><button {{on "click" (fn this.handleClick "foo")}}>Click Me</button></template>',
    '<template><SomeComponent @onClick={{this.handleClick}} /></template>',
    '<template><SomeComponent @onClick={{fn this.handleClick "foo"}} /></template>',
    '<template>{{foo bar=this.handleClick}}></template>',
    '<template>{{foo bar=(fn this.handleClick "foo")}}></template>',

    // `(mut @value)` without `fn` is the value itself.
    '<template><SomeComponent @onChange={{fn (mut @value)}} /></template>',
    '<template><input {{on "input" (pick "target.value" (fn (mut this.value)))}} /></template>',

    // `fn` is imported from a local module — not Ember's built-in helper.
    // Should NOT be flagged even with a single argument.
    `
      import { fn } from './my-utils';
      <template>
        <button {{on "click" (fn this.handleClick)}}>Click</button>
      </template>
    `,
  ],

  invalid: [
    {
      code: `<template>
        <button {{on "click" (fn this.handleClick)}}>Click</button>
      </template>`,
      output: `<template>
        <button {{on "click" this.handleClick}}>Click</button>
      </template>`,
      errors: [
        {
          message:
            'Unnecessary use of (fn) helper. Pass the function directly instead: this.handleClick',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: `<template>
        <Component @action={{fn this.save}} />
      </template>`,
      output: `<template>
        <Component @action={{this.save}} />
      </template>`,
      errors: [
        {
          message: 'Unnecessary use of (fn) helper. Pass the function directly instead: this.save',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },

    {
      code: '<template><button {{on "click" (fn this.handleClick)}}>Click Me</button></template>',
      output: '<template><button {{on "click" this.handleClick}}>Click Me</button></template>',
      errors: [
        {
          message:
            'Unnecessary use of (fn) helper. Pass the function directly instead: this.handleClick',
        },
      ],
    },
    {
      code: '<template><SomeComponent @onClick={{fn this.handleClick}} /></template>',
      output: '<template><SomeComponent @onClick={{this.handleClick}} /></template>',
      errors: [
        {
          message:
            'Unnecessary use of (fn) helper. Pass the function directly instead: this.handleClick',
        },
      ],
    },
    // Other sub-expressions are redundant.
    {
      code: '<template><button {{on "click" (fn (perform this.task))}}>Click Me</button></template>',
      output: '<template><button {{on "click" (perform this.task)}}>Click Me</button></template>',
      errors: [
        {
          message:
            'Unnecessary use of (fn) helper. Pass the function directly instead: (perform this.task)',
        },
      ],
    },
    {
      code: '<template>{{foo bar=(fn this.handleClick)}}></template>',
      output: '<template>{{foo bar=this.handleClick}}></template>',
      errors: [
        {
          message:
            'Unnecessary use of (fn) helper. Pass the function directly instead: this.handleClick',
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

hbsRuleTester.run('template-no-redundant-fn', rule, {
  valid: [
    '<SomeComponent @onChange={{fn (mut @value)}} />',
    '<button {{on "click" this.handleClick}}>Click Me</button>',
    '<button {{on "click" (fn this.handleClick "foo")}}>Click Me</button>',
    '<SomeComponent @onClick={{this.handleClick}} />',
    '<SomeComponent @onClick={{fn this.handleClick "foo"}} />',
    '{{foo bar=this.handleClick}}>',
    '{{foo bar=(fn this.handleClick "foo")}}>',
  ],
  invalid: [
    {
      code: '<button {{on "click" (fn this.handleClick)}}>Click Me</button>',
      output: '<button {{on "click" this.handleClick}}>Click Me</button>',
      errors: [
        {
          message:
            'Unnecessary use of (fn) helper. Pass the function directly instead: this.handleClick',
        },
      ],
    },
    {
      code: '<SomeComponent @onClick={{fn this.handleClick}} />',
      output: '<SomeComponent @onClick={{this.handleClick}} />',
      errors: [
        {
          message:
            'Unnecessary use of (fn) helper. Pass the function directly instead: this.handleClick',
        },
      ],
    },
    {
      code: '{{foo bar=(fn this.handleClick)}}>',
      output: '{{foo bar=this.handleClick}}>',
      errors: [
        {
          message:
            'Unnecessary use of (fn) helper. Pass the function directly instead: this.handleClick',
        },
      ],
    },
  ],
});
