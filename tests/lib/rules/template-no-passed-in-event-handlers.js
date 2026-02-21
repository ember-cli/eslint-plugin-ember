//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-passed-in-event-handlers');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-passed-in-event-handlers', rule, {
  valid: [
    `<template>
      <MyComponent @action={{this.handleAction}} />
    </template>`,
    `<template>
      <MyComponent @onSubmit={{this.handleSubmit}} />
    </template>`,
    `<template>
      <button {{on "click" this.handleClick}}>Click</button>
    </template>`,
  
    // Test cases ported from ember-template-lint
    '<template><Foo /></template>',
    '<template><Foo @onClick={{this.handleClick}} /></template>',
    '<template><Foo @onclick={{this.handleClick}} /></template>',
    '<template><Foo @Click={{this.handleClick}} /></template>',
    '<template><Foo @touch={{this.handleClick}} /></template>',
    '<template><Foo @random="foo" /></template>',
    '<template><Foo @random={{true}} /></template>',
    '<template><Input @click={{this.handleClick}} /></template>',
    '<template><Textarea @click={{this.handleClick}} /></template>',
    '<template>{{foo}}</template>',
    '<template>{{foo onClick=this.handleClick}}</template>',
    '<template>{{foo onclick=this.handleClick}}</template>',
    '<template>{{foo Click=this.handleClick}}</template>',
    '<template>{{foo touch=this.handleClick}}</template>',
    '<template>{{foo random="foo"}}</template>',
    '<template>{{foo random=true}}</template>',
    '<template>{{input click=this.handleClick}}</template>',
    '<template>{{textarea click=this.handleClick}}</template>',
  ],

  invalid: [
    {
      code: `<template>
        <MyComponent @click={{this.handleClick}} />
      </template>`,
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: `<template>
        <MyComponent @submit={{this.handleSubmit}} />
      </template>`,
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: `<template>
        <CustomButton @mouseEnter={{this.handleHover}} />
      </template>`,
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><Foo @click={{this.handleClick}} /></template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template><Foo @keyPress={{this.handleClick}} /></template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template><Foo @submit={{this.handleClick}} /></template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template>{{foo click=this.handleClick}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template>{{foo keyPress=this.handleClick}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template>{{foo submit=this.handleClick}}</template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
  ],
});
