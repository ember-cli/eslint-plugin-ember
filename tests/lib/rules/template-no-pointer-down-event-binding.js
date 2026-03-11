//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-pointer-down-event-binding');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-pointer-down-event-binding', rule, {
  valid: [
    `<template>
      <button {{on "click" this.handleClick}}>Click</button>
    </template>`,
    `<template>
      <button {{on "keydown" this.handleKeyDown}}>Press</button>
    </template>`,

    "<template><div {{on 'mouseup' this.doSomething}}></div></template>",
    "<template><div {{action this.doSomething on='mouseup'}}></div></template>",
    '<template><input type="text" onmouseup="myFunction()"></template>',
    '<template>{{my-component mouseDown=this.doSomething}}</template>',
    '<template><MyComponent @mouseDown={{this.doSomething}} /></template>',
  ],

  invalid: [
    {
      code: `<template>
        <button {{on "pointerdown" this.handlePointerDown}}>Click</button>
      </template>`,
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: `<template>
        <div onpointerdown={{this.handlePointerDown}}>Content</div>
      </template>`,
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template><div {{on "mousedown" this.doSomething}}></div></template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template><div {{action this.doSomething on="mousedown"}}></div></template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template><div {{action this.doSomething preventDefault=true on="mousedown"}}></div></template>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<template><input type="text" onmousedown="myFunction()"></template>',
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

hbsRuleTester.run('template-no-pointer-down-event-binding', rule, {
  valid: [
    "<div {{on 'mouseup' this.doSomething}}></div>",
    "<div {{action this.doSomething on='mouseup'}}></div>",
    '<input type="text" onmouseup="myFunction()">',
    '{{my-component mouseDown=this.doSomething}}',
    '<MyComponent @mouseDown={{this.doSomething}} />',
  ],
  invalid: [
    {
      code: '<div {{on "mousedown" this.doSomething}}></div>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<div {{action this.doSomething on="mousedown"}}></div>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<div {{action this.doSomething preventDefault=true on="mousedown"}}></div>',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
    {
      code: '<input type="text" onmousedown="myFunction()">',
      output: null,
      errors: [{ messageId: 'unexpected' }],
    },
  ],
});
