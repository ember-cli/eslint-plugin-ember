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

    // GJS/GTS: a JS-scope binding shadows the ambient `action` keyword. The
    // user has imported (or declared) their own `action`, so flagging would
    // corrupt their reference.
    {
      filename: 'test.gjs',
      code: "import action from './my-action';\n<template>{{action this.handleClick}}</template>",
    },
    {
      filename: 'test.gjs',
      code: "import action from './my-action';\n<template>{{(action this.handleClick)}}</template>",
    },
    {
      filename: 'test.gjs',
      code: "import action from './my-action';\n<template><button {{action this.handleClick}}>x</button></template>",
    },
    {
      filename: 'test.gts',
      code: "import action from './my-action';\n<template>{{action this.handleClick}}</template>",
    },
    {
      filename: 'test.gjs',
      code: 'const action = (h) => () => h();\n<template>{{action this.handleClick}}</template>',
    },

    // Template block-param shadowing — `action` is the iterator/let-bound
    // value, not the ambient keyword.
    '<template>{{#each items as |action|}}{{action this.x}}{{/each}}</template>',
    '<template>{{#let (component "x") as |action|}}{{action this.x}}{{/let}}</template>',
    '<template>{{#each items as |action|}}<button {{action this.x}}>x</button>{{/each}}</template>',
    '<template><Foo as |action|>{{action this.x}}</Foo></template>',
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
            'Do not use `action` as (action ...) — deprecated in Ember 5.9, removed in 6.0. Use the `fn` helper instead.',
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
            'Do not use `action` in templates — deprecated in Ember 5.9, removed in 6.0. Use the `on` modifier and `fn` helper instead.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },
    {
      code: `<template>
        <button {{action "submit"}}>Submit</button>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use `action` as an element modifier — deprecated in Ember 5.9, removed in 6.0. Use the `on` modifier instead.',
          type: 'GlimmerElementModifierStatement',
        },
      ],
    },
    {
      code: `<template>
        <input onclick={{action "foo"}}>
      </template>`,
      output: null,
      errors: [
        {
          message:
            'Do not use `action` in templates — deprecated in Ember 5.9, removed in 6.0. Use the `on` modifier and `fn` helper instead.',
          type: 'GlimmerMustacheStatement',
        },
      ],
    },

    // GJS/GTS: ambient `action` keyword usage with no shadowing import or
    // block param. Still flagged.
    {
      filename: 'test.gjs',
      code: '<template>{{action "save"}}</template>',
      output: null,
      errors: [{ messageId: 'mustache', type: 'GlimmerMustacheStatement' }],
    },
    {
      filename: 'test.gjs',
      code: '<template><button {{on "click" (action "save")}}>x</button></template>',
      output: null,
      errors: [{ messageId: 'subExpression', type: 'GlimmerSubExpression' }],
    },
    {
      filename: 'test.gts',
      code: '<template><button {{action "submit"}}>x</button></template>',
      output: null,
      errors: [{ messageId: 'modifier', type: 'GlimmerElementModifierStatement' }],
    },

    // Unrelated JS bindings do NOT mask the rule. Only a binding named
    // `action` should be respected.
    {
      filename: 'test.gjs',
      code: "import handler from './handler';\n<template>{{action this.x}}</template>",
      output: null,
      errors: [{ messageId: 'mustache' }],
    },

    // Ambient `action` outside a block-param scope is still flagged, even
    // when an inner block legitimately shadows it.
    {
      filename: 'test.gjs',
      code: '<template>{{#each items as |action|}}{{action this.x}}{{/each}}{{action this.y}}</template>',
      output: null,
      errors: [{ messageId: 'mustache' }],
    },
  ],
});
