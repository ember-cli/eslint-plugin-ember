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

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-passed-in-event-handlers', rule, {
  valid: [
    '<Foo />',
    '<Foo @onClick={{this.handleClick}} />',
    '<Foo @onclick={{this.handleClick}} />',
    '<Foo @Click={{this.handleClick}} />',
    '<Foo @touch={{this.handleClick}} />',
    '<Foo @random="foo" />',
    '<Foo @random={{true}} />',
    '<Input @click={{this.handleClick}} />',
    '<Textarea @click={{this.handleClick}} />',
    '{{foo}}',
    '{{foo onClick=this.handleClick}}',
    '{{foo onclick=this.handleClick}}',
    '{{foo Click=this.handleClick}}',
    '{{foo touch=this.handleClick}}',
    '{{foo random="foo"}}',
    '{{foo random=true}}',
    '{{input click=this.handleClick}}',
    '{{textarea click=this.handleClick}}',
  ],
  invalid: [
    {
      code: '<Foo @keyPress={{this.handleClick}} />',
      output: null,
      errors: [
        { message: 'Event handler "@keyPress" should not be passed as a component argument. Use the `on` modifier instead.' },
      ],
    },
    {
      code: '{{foo keyPress=this.handleClick}}',
      output: null,
      errors: [
        { message: 'Event handler "@keyPress" should not be passed as a component argument. Use the `on` modifier instead.' },
      ],
    },
  ],
});
