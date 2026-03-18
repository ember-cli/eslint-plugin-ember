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
      <Form>Content</Form>
    </template>`,
    `<template>
      <Input @type="text" />
    </template>`,
    `<template>
      <Select @options={{this.options}} />
    </template>`,
    `<template>
      <Textarea @value={{this.text}} />
    </template>`,
    `<template>
      <div>Content</div>
    </template>`,

    '<template>{{#foo-bar as |Baz|}}<Baz />{{/foo-bar}}</template>',
    '<template><FooBar as |Baz|><Baz /></FooBar></template>',
    '<template>{{#with foo=(component "blah-zorz") as |Div|}}<Div></Div>{{/with}}</template>',
    '<template><Foo as |bar|><bar.baz /></Foo></template>',
  ],

  invalid: [
    {
      code: '<template><FooBar as |div|><div></div></FooBar></template>',
      output: null,
      errors: [
        {
          message: 'Component name "div" shadows HTML element <div>. Use a different name.',
          type: 'GlimmerElementNode',
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

hbsRuleTester.run('template-no-shadowed-elements', rule, {
  valid: [
    '{{#foo-bar as |Baz|}}<Baz />{{/foo-bar}}',
    '<FooBar as |Baz|><Baz /></FooBar>',
    '{{#with foo=(component "blah-zorz") as |Div|}}<Div></Div>{{/with}}',
    '<Foo as |bar|><bar.baz /></Foo>',
  ],
  invalid: [
    {
      code: '<FooBar as |div|><div></div></FooBar>',
      output: null,
      errors: [
        { message: 'Component name "div" shadows HTML element <div>. Use a different name.' },
      ],
    },
  ],
});
