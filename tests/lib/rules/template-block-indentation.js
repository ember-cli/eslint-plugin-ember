//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-block-indentation');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

// ---- HBS tests ----

hbsRuleTester.run('template-block-indentation', rule, {
  valid: [
    // Single line - no indentation issues
    '{{#if foo}}bar{{/if}}',
    '<div></div>',
    '<div>foo</div>',

    // Properly indented block
    ['{{#if foo}}', '  bar', '{{/if}}'].join('\n'),

    // Properly indented element
    ['<div>', '  <p>{{t "greeting"}}</p>', '</div>'].join('\n'),

    // Nested blocks
    ['{{#if foo}}', '  {{#if bar}}', '    baz', '  {{/if}}', '{{/if}}'].join('\n'),

    // Properly indented with else
    ['{{#if foo}}', '  bar', '{{else}}', '  baz', '{{/if}}'].join('\n'),

    // Properly indented with else if
    ['{{#if foo}}', '  bar', '{{else if baz}}', '  qux', '{{/if}}'].join('\n'),

    // Void elements (no children to check)
    '<br>',
    '<input>',
    '<img>',
    '<hr>',

    // Content on same line as open/close
    ['<div>', '  foo bar baz', '</div>'].join('\n'),

    // Leading content on the same line
    ['{{#if foo}}', '  <span>bar</span> baz', '{{/if}}'].join('\n'),

    // 4-space indentation config
    {
      code: ['<div>', '    <p>Hello</p>', '</div>'].join('\n'),
      options: [4],
    },

    // Tab config (1-space indent)
    {
      code: ['<div>', ' <p>Hello</p>', '</div>'].join('\n'),
      options: ['tab'],
    },

    // Object config
    {
      code: ['<div>', '    <p>Hello</p>', '</div>'].join('\n'),
      options: [{ indentation: 4 }],
    },

    // Ignored elements - pre
    ['<pre>', 'no indentation needed', '  or checked', '</pre>'].join('\n'),

    // Ignored elements - textarea
    ['<textarea>', 'no indentation needed', '</textarea>'].join('\n'),

    // Empty block
    ['<div>', '</div>'].join('\n'),

    // Component invocation
    ['<MyComponent>', '  <span>content</span>', '</MyComponent>'].join('\n'),

    // Block with inline else
    ['{{#each items as |item|}}', '  {{item.name}}', '{{/each}}'].join('\n'),
  ],

  invalid: [
    // Incorrect end indentation
    {
      code: ['{{#if foo}}', '  bar', '  {{/if}}'].join('\n'),
      output: null,
      errors: [
        {
          messageId: 'incorrectEnd',
        },
      ],
    },

    // Incorrect child indentation
    {
      code: ['<div>', '<p>{{t "greeting"}}</p>', '</div>'].join('\n'),
      output: null,
      errors: [
        {
          messageId: 'incorrectChild',
        },
      ],
    },

    // Incorrect child indentation - too much
    {
      code: ['<div>', '    <p>{{t "greeting"}}</p>', '</div>'].join('\n'),
      output: null,
      errors: [
        {
          messageId: 'incorrectChild',
        },
      ],
    },

    // Incorrect end indentation for element
    {
      code: ['<div>', '  <p>content</p>', '  </div>'].join('\n'),
      output: null,
      errors: [
        {
          messageId: 'incorrectEnd',
        },
      ],
    },

    // Incorrect else indentation
    {
      code: ['{{#if foo}}', '  bar', '  {{else}}', '  baz', '{{/if}}'].join('\n'),
      output: null,
      errors: [
        {
          messageId: 'incorrectElse',
        },
      ],
    },

    // Incorrect indentation with 4-space config
    {
      code: ['<div>', '  <p>Hello</p>', '</div>'].join('\n'),
      output: null,
      options: [4],
      errors: [
        {
          messageId: 'incorrectChild',
        },
      ],
    },

    // Multiple errors - wrong children and end
    {
      code: ['<div>', 'foo', '  </div>'].join('\n'),
      output: null,
      errors: [
        {
          messageId: 'incorrectChild',
        },
        {
          messageId: 'incorrectEnd',
        },
      ],
    },

    // Nested indentation error
    {
      code: ['{{#if foo}}', '  {{#if bar}}', '  baz', '  {{/if}}', '{{/if}}'].join('\n'),
      output: null,
      errors: [
        {
          messageId: 'incorrectChild',
        },
      ],
    },
  ],
});

// ---- GJS tests ----

gjsRuleTester.run('template-block-indentation', rule, {
  valid: [
    // Single line inside template
    '<template>{{#if foo}}bar{{/if}}</template>',

    // Properly indented
    ['<template>', '{{#if foo}}', '  bar', '{{/if}}', '</template>'].join('\n'),
  ],
  invalid: [
    // Incorrect child indentation in GJS
    {
      code: ['<template>', '<div>', '<p>Hello</p>', '</div>', '</template>'].join('\n'),
      output: null,
      errors: [
        {
          messageId: 'incorrectChild',
        },
      ],
    },
  ],
});
