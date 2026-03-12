const rule = require('../../../lib/rules/template-no-link-to-tagname');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-link-to-tagname', rule, {
  valid: [
    {
      filename: 'test.gjs',
      code: '<template><LinkTo @route="index">Home</LinkTo></template>',
      output: null,
    },
    {
      filename: 'test.gjs',
      code: '<template><link-to @route="about">About</link-to></template>',
      output: null,
    },
    {
      filename: 'test.gjs',
      code: '<template><a href="/home">Home</a></template>',
      output: null,
    },

    '<template><Foo @route="routeName" @tagName="button">Link text</Foo></template>',
    '<template><LinkTo @route="routeName">Link text</LinkTo></template>',
    '<template>{{#link-to "routeName"}}Link text{{/link-to}}</template>',
    '<template>{{#foo "routeName" tagName="button"}}Link text{{/foo}}</template>',
    '<template>{{link-to "Link text" "routeName"}}</template>',
    '<template>{{foo "Link text" "routeName" tagName="button"}}</template>',
  ],

  invalid: [
    {
      filename: 'test.gjs',
      code: '<template><LinkTo @route="index" tagName="button">Home</LinkTo></template>',
      output: null,
      errors: [{ messageId: 'noLinkToTagname' }],
    },
    {
      filename: 'test.gjs',
      code: '<template><LinkTo @route="about" @tagName="span">About</LinkTo></template>',
      output: null,
      errors: [{ messageId: 'noLinkToTagname' }],
    },
    {
      filename: 'test.gjs',
      code: '<template><link-to @route="contact" tagName="div">Contact</link-to></template>',
      output: null,
      errors: [{ messageId: 'noLinkToTagname' }],
    },

    {
      code: '<template><LinkTo @route="routeName" @tagName="button">Link text</LinkTo></template>',
      output: null,
      errors: [{ messageId: 'noLinkToTagname' }],
    },
    {
      code: '<template>{{#link-to "routeName" tagName="button"}}Link text{{/link-to}}</template>',
      output: null,
      errors: [{ messageId: 'noLinkToTagname' }],
    },
    {
      code: '<template>{{link-to "Link text" "routeName" tagName="button"}}</template>',
      output: null,
      errors: [{ messageId: 'noLinkToTagname' }],
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

hbsRuleTester.run('template-no-link-to-tagname', rule, {
  valid: [
    '<Foo @route="routeName" @tagName="button">Link text</Foo>',
    '<LinkTo @route="routeName">Link text</LinkTo>',
    '{{#link-to "routeName"}}Link text{{/link-to}}',
    '{{#foo "routeName" tagName="button"}}Link text{{/foo}}',
    '{{link-to "Link text" "routeName"}}',
    '{{foo "Link text" "routeName" tagName="button"}}',
  ],
  invalid: [
    {
      code: '<LinkTo @route="routeName" @tagName="button">Link text</LinkTo>',
      output: null,
      errors: [{ message: 'tagName attribute on LinkTo is deprecated' }],
    },
    {
      code: '{{#link-to "routeName" tagName="button"}}Link text{{/link-to}}',
      output: null,
      errors: [{ message: 'tagName attribute on LinkTo is deprecated' }],
    },
    {
      code: '{{link-to "Link text" "routeName" tagName="button"}}',
      output: null,
      errors: [{ message: 'tagName attribute on LinkTo is deprecated' }],
    },
  ],
});
