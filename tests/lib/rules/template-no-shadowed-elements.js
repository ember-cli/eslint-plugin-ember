//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-shadowed-elements');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-shadowed-elements', rule, {
  valid: [
    `<template>
      <MyButton>Click</MyButton>
    </template>`,
    `<template>
      <MyComponent />
    </template>`,
    `<template>
      <CustomForm />
    </template>`,
    `<template>
      <div>Content</div>
    </template>`,
  
    // Test cases ported from ember-template-lint
    '<template>{{#foo-bar as |Baz|}}<Baz />{{/foo-bar}}</template>',
    '<template><FooBar as |Baz|><Baz /></FooBar></template>',
    '<template>{{#with foo=(component "blah-zorz") as |Div|}}<Div></Div>{{/with}}</template>',
    '<template><Foo as |bar|><bar.baz /></Foo></template>',
  ],

  invalid: [
    {
      code: `<template>
        <Form>Content</Form>
      </template>`,
      output: null,
      errors: [
        {
          message: 'Component name "form" shadows HTML element <form>. Use a different name.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <Input @type="text" />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Component name "input" shadows HTML element <input>. Use a different name.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: `<template>
        <Select @options={{this.options}} />
      </template>`,
      output: null,
      errors: [
        {
          message: 'Component name "select" shadows HTML element <select>. Use a different name.',
          type: 'GlimmerElementNode',
        },
      ],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><FooBar as |div|><div></div></FooBar></template>',
      output: null,
      errors: [{ message: 'Component name ' }],
    },
  ],
});
