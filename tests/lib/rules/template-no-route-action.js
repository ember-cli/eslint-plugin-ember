//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-route-action');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-route-action', rule, {
  valid: [
    `<template>
      <button {{on "click" (fn this.action arg)}}>Click</button>
    </template>`,
    `<template>
      <button {{on "click" this.handleClick}}>Click</button>
    </template>`,
    `<template>
      {{this.routeAction}}
    </template>`,
    `<template>
      <Component @action={{this.handleAction}} />
    </template>`,
  
    // Test cases ported from ember-template-lint
    "<template>{{custom-component onUpdate=(action 'updateFoo')}}</template>",
    "<template>{{custom-component onUpdate=(fn this.updateFoo 'bar')}}</template>",
    '<template>{{custom-component onUpdate=this.updateFoo}}</template>',
    "<template><CustomComponent @onUpdate={{if true (action 'updateFoo')}} /></template>",
    "<template><CustomComponent @onUpdate={{if true (fn this.updateFoo 'bar')}} /></template>",
    '<template><CustomComponent @onUpdate={{if true (this.updateFoo)}} /></template>',
    `<template>{{yield (hash
      someProp="someVal"
      updateFoo=(fn this.updateFoo)
    )}}</template>`,
    "<template><CustomComponent @onUpdate={{action 'updateFoo'}} /></template>",
    "<template><CustomComponent @onUpdate={{fn this.updateFoo 'bar'}} /></template>",
    '<template><CustomComponent @onUpdate={{this.updateFoo}} /></template>',
    '<template><div></div></template>',
  ],

  invalid: [
    {
      code: `<template>
        {{route-action "save"}}
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use the (route-action) helper. Use the (fn) helper or closure actions instead.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
    {
      code: `<template>
        <button {{on "click" (route-action "save")}}>Save</button>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use the (route-action) helper. Use the (fn) helper or closure actions instead.',
          type: 'GlimmerSubExpression',
        },
      ],
    },
    {
      code: `<template>
        <Component @action={{route-action "update"}} />
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use the (route-action) helper. Use the (fn) helper or closure actions instead.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: "<template><CustomComponent @onUpdate={{if true (route-action 'updateFoo' 'bar')}} /></template>",
      output: null,
      errors: [{ message: 'Do not use the (route-action) helper. Use the (fn) helper or closure actions instead.' }],
    },
    {
      code: "<template>{{custom-component onUpdate=(route-action 'updateFoo' 'bar')}}</template>",
      output: null,
      errors: [{ message: 'Do not use the (route-action) helper. Use the (fn) helper or closure actions instead.' }],
    },
    {
      code: `<template>{{yield (hash
        someProp="someVal"
        updateFoo=(route-action 'updateFoo')
      )}}</template>`,
      output: null,
      errors: [{ message: 'Do not use the (route-action) helper. Use the (fn) helper or closure actions instead.' }],
    },
    {
      code: `<template><CustomComponent
        @onUpdate={{route-action 'updateFoo'}}
      /></template>`,
      output: null,
      errors: [{ message: 'Do not use the (route-action) helper. Use the (fn) helper or closure actions instead.' }],
    },
    {
      code: "<template><CustomComponent @onUpdate={{route-action 'updateBar' 'bar'}} /></template>",
      output: null,
      errors: [{ message: 'Do not use the (route-action) helper. Use the (fn) helper or closure actions instead.' }],
    },
  ],
});
