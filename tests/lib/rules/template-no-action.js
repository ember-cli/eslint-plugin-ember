//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-action');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-action', rule, {
  valid: [
    `<template>
      <button {{on "click" this.handleClick}}>Click</button>
    </template>`,
    `<template>
      <button {{on "click" (fn this.save "arg")}}>Save</button>
    </template>`,
    `<template>
      {{this.action}}
    </template>`,
    `<template>
      {{@action}}
    </template>`,
  
    // Test cases ported from ember-template-lint
    '<template>{{#let (fn this.foo bar) as |action|}}<Component @baz={{action}} />{{/let}}</template>',
    '<template><MyScope as |action|><Component @baz={{action}} /></MyScope></template>',
    '<template><button {{on "submit" @action}}>Click Me</button></template>',
    '<template><button {{on "submit" this.action}}>Click Me</button></template>',
    '<template><PButton @naked={{42}} /></template>',
    '<template><PButton @naked={{true}} /></template>',
    '<template><PButton @naked={{undefined}} /></template>',
    '<template><PButton @naked={{null}} /></template>',
    '<template><PButton @naked={{this}} /></template>',
    '<template><PButton @naked={{"action"}} /></template>',
  ],

  invalid: [
    {
      code: `<template>
        <button {{on "click" (action "save")}}>Save</button>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use `action` as (action ...). Instead, use the `on` modifier and `fn` helper.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: `<template>
        {{action "doSomething"}}
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use `action` in templates. Instead, use the `on` modifier and `fn` helper.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><button onclick={{action "foo"}}></button></template>',
      output: null,
      errors: [{ message: 'Do not use `action` as (action ...). Instead, use the `on` modifier and `fn` helper.' }],
    },
    {
      code: '<template><button {{action "submit"}}>Submit</button></template>',
      output: null,
      errors: [{ message: 'Do not use `action` as (action ...). Instead, use the `on` modifier and `fn` helper.' }],
    },
    {
      code: '<template><FooBar @baz={{action "submit"}} /></template>',
      output: null,
      errors: [{ message: 'Do not use `action` as (action ...). Instead, use the `on` modifier and `fn` helper.' }],
    },
    {
      code: '<template>{{yield (action "foo")}}</template>',
      output: null,
      errors: [{ message: 'Do not use `action` as (action ...). Instead, use the `on` modifier and `fn` helper.' }],
    },
    {
      code: '<template>{{yield (action this.foo)}}</template>',
      output: null,
      errors: [{ message: 'Do not use `action` as (action ...). Instead, use the `on` modifier and `fn` helper.' }],
    },
  ],
});
