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
    '<template><div>content</div></template>',
    '<template><form><input /></form></template>',
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
    // Upstream flags any lowercase local block-param invocation, not just
    // names present in a static html-tags list.
    {
      code: '<template><FooBar as |foo|><foo></foo></FooBar></template>',
      output: null,
      errors: [
        {
          message: 'Component name "foo" shadows HTML element <foo>. Use a different name.',
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
    '<div>content</div>',
    '<form><input /></form>',
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
    // Upstream flags any lowercase local block-param invocation, not just
    // names present in a static html-tags list.
    {
      code: '<FooBar as |foo|><foo></foo></FooBar>',
      output: null,
      errors: [
        { message: 'Component name "foo" shadows HTML element <foo>. Use a different name.' },
      ],
    },
  ],
});
