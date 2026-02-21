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
  
    // Test cases ported from ember-template-lint
    '<template><button {{on "click" this.handleClick}}>Click Me</button></template>',
    '<template><button {{on "click" (fn this.handleClick "foo")}}>Click Me</button></template>',
    '<template><SomeComponent @onClick={{this.handleClick}} /></template>',
    '<template><SomeComponent @onClick={{fn this.handleClick "foo"}} /></template>',
    '<template>{{foo bar=this.handleClick}}></template>',
    '<template>{{foo bar=(fn this.handleClick "foo")}}></template>',
  ],

  invalid: [
    {
      code: `<template>
        <button {{on "click" (fn this.handleClick)}}>Click</button>
      </template>`,
      output: null,
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
      output: null,
      errors: [
        {
          message: 'Unnecessary use of (fn) helper. Pass the function directly instead: this.save',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><button {{on "click" (fn this.handleClick)}}>Click Me</button></template>',
      output: null,
      errors: [{ message: 'Unnecessary use of (fn) helper. Pass the function directly instead: this.handleClick' }],
    },
    {
      code: '<template><SomeComponent @onClick={{fn this.handleClick}} /></template>',
      output: null,
      errors: [{ message: 'Unnecessary use of (fn) helper. Pass the function directly instead: this.handleClick' }],
    },
    {
      code: '<template>{{foo bar=(fn this.handleClick)}}></template>',
      output: null,
      errors: [{ message: 'Unnecessary use of (fn) helper. Pass the function directly instead: this.handleClick' }],
    },
  ],
});
