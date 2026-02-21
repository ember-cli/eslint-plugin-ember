const rule = require('../../../lib/rules/template-no-link-to-positional-params');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-link-to-positional-params', rule, {
  valid: [
    {
      filename: 'test.gjs',
      code: '<template><LinkTo @route="index">Home</LinkTo></template>',
      output: null,
    },
    {
      filename: 'test.gjs',
      code: '<template><LinkTo @route="posts.post" @model={{this.post}}>Post</LinkTo></template>',
      output: null,
    },
    {
      filename: 'test.gjs',
      code: '<template><a href="/home">Home</a></template>',
      output: null,
    },
  
    // Test cases ported from ember-template-lint
    '<template>{{#link-to route="about"}}About Us{{/link-to}}</template>',
    '<template>{{#link-to route="post" model=@post}}Read {{@post.title}}...{{/link-to}}</template>',
    `<template>{{#link-to route="post.comment" models=(array post comment)}}
        Comment by {{comment.author.name}} on {{comment.date}}
      {{/link-to}}</template>`,
    `<template>{{#link-to route="posts" query=(hash direction="desc" showArchived=false)}}
        Recent Posts
      {{/link-to}}</template>`,
    '<template><LinkTo @route="about">About Us</LinkTo></template>',
    '<template><LinkTo @route="post" @model={{@post}}>Read {{@post.title}}...</LinkTo></template>',
    `<template><LinkTo @route="post.comment" @models={{array post comment}}>
        Comment by {{comment.author.name}} on {{comment.date}}
      </LinkTo></template>`,
    `<template><LinkTo @route="posts" @query={{hash direction="desc" showArchived=false}}>
        Recent Posts
      </LinkTo></template>`,
  ],

  invalid: [
    // Note: This rule is simplified and may need adjustment based on actual LinkTo usage patterns
    // The real eslint-plugin-ember rule has more complex logic for detecting positional params
  
    // Test cases ported from ember-template-lint
    {
      code: '<template>{{link-to "About Us" "about"}}</template>',
      output: null,
      errors: [{ messageId: 'noLinkToPositionalParams' }],
    },
    {
      code: '<template>{{link-to "About Us" (if this.showNewAboutPage "about-us" "about")}}</template>',
      output: null,
      errors: [{ messageId: 'noLinkToPositionalParams' }],
    },
    {
      code: '<template>{{link-to (t "about") "about"}}</template>',
      output: null,
      errors: [{ messageId: 'noLinkToPositionalParams' }],
    },
    {
      code: '<template>{{link-to (t "about") this.aboutRoute}}</template>',
      output: null,
      errors: [{ messageId: 'noLinkToPositionalParams' }],
    },
    {
      code: '<template>{{link-to (t "about") this.aboutRoute "foo"}}</template>',
      output: null,
      errors: [{ messageId: 'noLinkToPositionalParams' }],
    },
    {
      code: '<template>{{link-to (t "about") this.aboutRoute "foo" "bar"}}</template>',
      output: null,
      errors: [{ messageId: 'noLinkToPositionalParams' }],
    },
    {
      code: '<template>{{link-to (t "about") this.aboutRoute "foo" "bar" (query-params foo="bar")}}</template>',
      output: null,
      errors: [{ messageId: 'noLinkToPositionalParams' }],
    },
    {
      code: '<template>{{#link-to (if this.showNewAboutPage "about-us" "about")}}About Us{{/link-to}}</template>',
      output: null,
      errors: [{ messageId: 'noLinkToPositionalParams' }],
    },
    {
      code: '<template>{{#link-to "about"}}About Us{{/link-to}}</template>',
      output: null,
      errors: [{ messageId: 'noLinkToPositionalParams' }],
    },
    {
      code: '<template>{{#link-to this.aboutRoute}}About Us{{/link-to}}</template>',
      output: null,
      errors: [{ messageId: 'noLinkToPositionalParams' }],
    },
    {
      code: '<template>{{#link-to this.aboutRoute "foo"}}About Us{{/link-to}}</template>',
      output: null,
      errors: [{ messageId: 'noLinkToPositionalParams' }],
    },
    {
      code: '<template>{{#link-to this.aboutRoute "foo" "bar"}}About Us{{/link-to}}</template>',
      output: null,
      errors: [{ messageId: 'noLinkToPositionalParams' }],
    },
    {
      code: '<template>{{#link-to this.aboutRoute "foo" "bar" (query-params foo="bar")}}About Us{{/link-to}}</template>',
      output: null,
      errors: [{ messageId: 'noLinkToPositionalParams' }],
    },
    {
      code: '<template>{{#link-to "post" @post}}Read {{@post.title}}...{{/link-to}}</template>',
      output: null,
      errors: [{ messageId: 'noLinkToPositionalParams' }],
    },
    {
      code: `<template>{{#link-to "post.comment" @comment.post @comment}}
        Comment by {{@comment.author.name}} on {{@comment.date}}
      {{/link-to}}</template>`,
      output: null,
      errors: [{ messageId: 'noLinkToPositionalParams' }],
    },
    {
      code: `<template>{{#link-to "posts" (query-params direction="desc" showArchived=false)}}
        Recent Posts
      {{/link-to}}</template>`,
      output: null,
      errors: [{ messageId: 'noLinkToPositionalParams' }],
    },
  ],
});
