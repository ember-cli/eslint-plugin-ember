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
    '<div><p>Stuff</p></div>',
    '{{#link-to "foo.bar"}}Blah{{/link-to}}',
    '{{#if foo}}<p>Hi!</p>{{/if}}',
    '{{#if foo}}<p>Hi!</p>{{else}}<p>Bye!</p>{{/if}}',
    '{{#if foo}}<p>Hi!</p>{{else if bar}}<p>Hello!</p>{{else}}<p>Bye!</p>{{/if}}',

    // Properly indented block
    ['{{#if foo}}', '  bar', '{{/if}}'].join('\n'),

    // Properly indented element
    ['<div>', '  <p>{{t "greeting"}}</p>', '</div>'].join('\n'),
    ['<div>', '  <p>Stuff Here</p>', '</div>'].join('\n'),
    ['<div>', '  <p>Hi!</p>', '</div>'].join('\n'),

    // Nested blocks
    ['{{#if foo}}', '  {{#if bar}}', '    baz', '  {{/if}}', '{{/if}}'].join('\n'),

    // Properly indented with else
    ['{{#if foo}}', '  bar', '{{else}}', '  baz', '{{/if}}'].join('\n'),

    // Properly indented with else if
    ['{{#if foo}}', '  bar', '{{else if baz}}', '  qux', '{{/if}}'].join('\n'),

    // Complex if/else if/else
    [
      '{{#if isMorning}}',
      '  Good morning',
      '{{else foo-bar isAfternoon}}',
      '  Good afternoon',
      '{{else}}',
      '  Good night',
      '{{/if}}',
    ].join('\n'),

    // Nested if/else inside element
    [
      '<div>',
      '  {{#if isMorning}}',
      '    Good morning',
      '  {{else if isAfternoon}}',
      '    Good afternoon',
      '  {{else}}',
      '    Good night',
      '  {{/if}}',
      '</div>',
    ].join('\n'),

    // Void elements (no children to check)
    '<br>',
    '<input>',
    '<img>',
    '<hr>',

    // Multi-line input with attributes
    ['<input ', '  data-foo="blah"', '  data-bar="derp"', '  data-qux="blammo">'].join('\n'),

    // Content on same line as open/close
    ['<div>', '  foo bar baz', '</div>'].join('\n'),

    // Leading content on the same line
    ['{{#if foo}}', '  <span>bar</span> baz', '{{/if}}'].join('\n'),
    ['<div>', '  <span>Foo</span>{{#some-thing}}<p>lorum ipsum</p>{{/some-thing}}', '</div>'].join(
      '\n'
    ),

    // Escaped curlies
    ['<h1>Header</h1>', '<div>', '  \\{{example}}', '</div>'].join('\n'),
    ['<div>', '  \\{{example}}', '</div>'].join('\n'),

    // Comment with content
    ['<div>', '  {{! What a comment}}', '  {{foo-bar}}', '</div>'].join('\n'),

    // Raw blocks
    ['{{{{if isMorning}}}}', '  Good Morning', '{{{{/if}}}}'].join('\n'),

    // Each with newline
    '\n{{#each cats as |dog|}}\n{{/each}}',

    // Mustache expressions inside blocks
    ['{{#if foo}}', '  {{foo}}-{{bar}}', '{{/if}}'].join('\n'),
    ['{{#if foo}}', '  Foo-{{bar}}', '{{/if}}'].join('\n'),
    ['{{#if foo}}', '  Foo:', '  {{bar}}', '{{/if}}'].join('\n'),
    ['{{#if foo}}', '  {{foo}}:', '  {{bar}}', '{{/if}}'].join('\n'),

    // Tilde (whitespace control) variations
    ['{{#if foo}}', '  <div></div>', '{{~/if}}'].join('\n'),
    ['{{~#if foo}}', '  <div></div>', '{{/if}}'].join('\n'),
    ['{{#if foo~}}', '  <div></div>', '{{/if}}'].join('\n'),
    ['{{#if foo}}', '  <div></div>', '{{/if~}}'].join('\n'),
    ['{{#if foo}}', '  <div></div>', '{{~else}}', '  <div></div>', '{{/if}}'].join('\n'),
    ['{{#if foo}}', '  <div></div>', '{{else~}}', '  <div></div>', '{{/if}}'].join('\n'),
    ['{{#if foo}}', '  <div></div>', '{{~else~}}', '  <div></div>', '{{/if}}'].join('\n'),
    ['{{#if foo}}', '  <div></div>', '{{else}}', '  <div></div>', '{{~/if~}}'].join('\n'),
    ['{{#if foo~}}', '  -', '{{/if}}'].join('\n'),
    ['{{#if foo}}', '{{else if bar}}', '{{else}}', '  {{#if baz}}', '  {{/if~}}', '{{/if}}'].join(
      '\n'
    ),
    [
      '{{#if foo}}',
      '  <div>do foo</div>',
      '{{else if bar~}}',
      '  <div>do bar</div>',
      '{{/if}}',
    ].join('\n'),

    // Multi-line attribute element
    ['<div class="multi"', '     id="lines"></div>'].join('\n'),

    // HTML entities
    ['{{#if foo}}', '  &nbsp;Hello', '{{/if}}'].join('\n'),
    ['{{#if foo}}', '  &nbsp;<div></div>', '{{/if}}'].join('\n'),
    ['{{#if foo}}', '  &nbsp;bar', '{{/if}}'].join('\n'),

    // 4-space indentation config
    {
      code: ['<div>', '    <p>Hello</p>', '</div>'].join('\n'),
      options: [4],
    },
    {
      code: ['<div>', '    <p>LOLOL!</p>', '</div>'].join('\n'),
      options: [4],
    },

    // Tab config (1-space indent)
    {
      code: ['<div>', ' <p>Hello</p>', '</div>'].join('\n'),
      options: ['tab'],
    },
    {
      code: ['<div>', '\t<p>Hi!</p>', '</div>'].join('\n'),
      options: ['tab'],
    },

    // Object config
    {
      code: ['<div>', '    <p>Hello</p>', '</div>'].join('\n'),
      options: [{ indentation: 4 }],
    },

    // Ignored elements - pre, script, style, textarea
    ['<pre>', 'no indentation needed', '  or checked', '</pre>'].join('\n'),
    '<pre>\nsome text</pre>',
    '<script>\nsome text</script>',
    '<textarea>\nsome text</textarea>',
    '<style>\nsome text</style>',
    '<textarea> \n<div>\nsome text   \n \n </div></textarea>',
    '<pre>\n{{#foo}}\n {{#baz}}  hi!\n   {{derp}}{{/baz}}{{/foo}}\n </pre>',
    '<script>\n{{#foo}}\n {{#baz}}  hi!\n   {{derp}}{{/baz}}{{/foo}}\n </script>',
    '<style>\n{{#foo}}\n {{#baz}}  hi!\n   {{derp}}{{/baz}}{{/foo}}\n </style>',
    '<textarea>\n{{#foo}}\n {{#baz}}  hi!\n   {{derp}}{{/baz}}{{/foo}}\n </textarea>',

    // ignoreComments config
    {
      code: ['<div>', '<!-- Comment -->', '{{! Comment }}', '</div>'].join('\n'),
      options: [{ ignoreComments: true }],
    },
    {
      code: [
        '{{#if foo}}',
        '<!-- Comment -->',
        '  {{foo}}',
        '{{else}}',
        '  {{bar}}',
        '{{! Comment }}',
        '{{/if}}',
      ].join('\n'),
      options: [{ ignoreComments: true }],
    },
    {
      code: '  {{! Comment }}<div>foo</div>',
      options: [{ ignoreComments: true }],
    },
    {
      code: '<div>{{! Comment }}</div>',
      options: [{ ignoreComments: true }],
    },
    // Note: ignoreComments ignores comments but text after comment is still checked
    // '<div>\n{{! Comment }}foo\n</div>' is invalid even with ignoreComments: true
    {
      code: '<div>foo</div>{{! Comment }}',
      options: [{ ignoreComments: true }],
    },
    {
      code: '  <!-- Comment --><div>foo</div>',
      options: [{ ignoreComments: true }],
    },
    {
      code: '<div><!-- Comment --></div>',
      options: [{ ignoreComments: true }],
    },
    {
      code: '<div>foo</div><!-- Comment -->',
      options: [{ ignoreComments: true }],
    },
    {
      code: [
        '{{#if foo}}',
        '<!-- Comment -->',
        '  <!-- Comment -->',
        '  {{#each bar as |baz|}}',
        '{{! Comment }}',
        '    {{#each baz as |a|}}',
        '      {{! Comment }}',
        '      {{a}}',
        '<!-- Comment -->',
        '    {{/each}}',
        '{{! Comment }}',
        '  {{/each}}',
        '<!-- Comment -->',
        '{{! Comment }}',
        '{{else}}',
        ' {{! Comment }}',
        '{{/if}}',
      ].join('\n'),
      options: [{ ignoreComments: true }],
    },
    {
      code: ['<div>', '  <!-- Comment -->', '  {{! Comment }}', '</div>'].join('\n'),
      options: [{ ignoreComments: false }],
    },
    {
      code: [
        '{{#if foo}}',
        '  <!-- Comment -->',
        '  {{foo}}',
        '{{else}}',
        '  {{bar}}',
        '  {{! Comment }}',
        '{{/if}}',
      ].join('\n'),
      options: [{ ignoreComments: false }],
    },

    // Inline content with span
    'relativeDate <span class="my-apps-date-connected__absolute">(absoluteDate)</span>',

    // Title and path elements
    '<title></title>\n<path/><path/>',

    // Empty block
    ['<div>', '</div>'].join('\n'),

    // Component invocation
    ['<MyComponent>', '  <span>content</span>', '</MyComponent>'].join('\n'),

    // Nested component invocation with block params
    [
      '{{#foo-bar as |baz|}}',
      '  {{#baz.content}}',
      '    {{#component "foo-bar"}}',
      '      Content',
      '    {{/component}}',
      '  {{/baz.content}}',
      '{{/foo-bar}}',
    ].join('\n'),

    // Block with inline else
    ['{{#each items as |item|}}', '  {{item.name}}', '{{/each}}'].join('\n'),

    // Comment with proper indentation
    ['<div>', '  {{foo-bar baz="asdf"}}', '  <!-- foo bar baz -->', '</div>'].join('\n'),

    // String literal
    "{{'this works'}}",
  ],

  invalid: [
    // Incorrect end indentation
    {
      code: ['{{#if foo}}', '  bar', '  {{/if}}'].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectEnd' }],
    },

    // Incorrect child indentation - missing indent
    {
      code: ['<div>', '<p>{{t "greeting"}}</p>', '</div>'].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectChild' }],
    },

    // Incorrect child indentation - too much
    {
      code: ['<div>', '    <p>{{t "greeting"}}</p>', '</div>'].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectChild' }],
    },

    // Incorrect end indentation for element
    {
      code: ['<div>', '  <p>content</p>', '  </div>'].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectEnd' }],
    },

    // Incorrect else indentation
    {
      code: ['{{#if foo}}', '  bar', '  {{else}}', '  baz', '{{/if}}'].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectElse' }],
    },

    // Incorrect indentation with 4-space config
    {
      code: ['<div>', '  <p>Hello</p>', '</div>'].join('\n'),
      output: null,
      options: [4],
      errors: [{ messageId: 'incorrectChild' }],
    },
    {
      code: ['<div>', '  <p>Hi!</p>', '</div>'].join('\n'),
      output: null,
      options: [4],
      errors: [{ messageId: 'incorrectChild' }],
    },

    // Multiple errors - wrong children and end
    {
      code: ['<div>', 'foo', '  </div>'].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectChild' }, { messageId: 'incorrectEnd' }],
    },

    // Nested indentation error
    {
      code: ['{{#if foo}}', '  {{#if bar}}', '  baz', '  {{/if}}', '{{/if}}'].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectChild' }],
    },

    // Note: '<div>\n  </div>' is not caught by this rule (empty element)

    // Closing tag on same line as content but wrong indent
    {
      code: '<div>\n  <p>Stuff goes here</p></div>',
      output: null,
      errors: [{ messageId: 'incorrectEnd' }],
    },

    // Child not indented in element
    {
      code: '<div>\n<p>Stuff goes here</p>\n</div>',
      output: null,
      errors: [{ messageId: 'incorrectChild' }],
    },

    // Child not indented in block
    {
      code: '{{#if}}\n<p>Stuff goes here</p>\n{{/if}}',
      output: null,
      errors: [{ messageId: 'incorrectChild' }],
    },

    // Else in nested if with wrong end indent
    {
      code: [
        '{{#if isMorning}}',
        '{{else}}',
        '  {{#if something}}',
        '    Good night',
        '    {{/if}}',
        '{{/if}}',
      ].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectEnd' }],
    },

    // Mixed indent - some children correct, some not
    {
      code: '<div>\n  {{foo}}\n{{bar}}\n</div>',
      output: null,
      errors: [{ messageId: 'incorrectChild' }],
    },

    // Text child not indented
    {
      code: '<div>\n  Foo:\n{{bar}}\n</div>',
      output: null,
      errors: [{ messageId: 'incorrectChild' }],
    },

    // Closing block ends at wrong column when preceded by content on same line
    {
      code: '<div>\n  <span>Foo</span>{{#some-thing}}\n  {{/some-thing}}\n</div>',
      output: null,
      errors: [{ messageId: 'incorrectEnd' }],
    },

    // Element closing tag at wrong indent when preceded by content
    {
      code: '{{#if foo}}\n  {{foo}} <p>\n            Bar\n  </p>\n{{/if}}',
      output: null,
      errors: [{ messageId: 'incorrectEnd' }],
    },

    // Else block indentation error
    {
      code: ['{{#if foo}}', '  {{else}}', '{{/if}}'].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectElse' }],
    },

    // Tilde with wrong else/end
    {
      code: [
        '{{#if foo}}',
        '{{else if bar}}',
        '{{else}}',
        '  {{#if baz}}',
        '  {{/if~}}',
        '  {{/if}}',
      ].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectEnd' }],
    },

    // Each with wrong else indent
    {
      code: ['{{#each foo as |bar|}}', '  {{else}}', '{{/each}}'].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectElse' }],
    },

    // Note: comment with incorrect indentation is not flagged by this rule

    // Tilde with wrong child indent
    {
      code: [
        '{{#if isMorning}}',
        '  Good morning',
        '{{else if isAfternoon~}}',
        '    Good afternoon',
        '{{/if}}',
      ].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectChild' }],
    },

    // Inline else with wrong position
    {
      code: ['{{#if foo}}foo{{else}}', '  bar', '{{/if}}'].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectChild' }, { messageId: 'incorrectElse' }],
    },

    // Block params with wrong child indent
    {
      code: [
        '{{#foo bar as |foobar|}}',
        '   {{#foobar.baz}}{{/foobar.baz}}',
        '   {{foobar.baz}}',
        '{{/foo}}',
      ].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectChild' }, { messageId: 'incorrectChild' }],
    },

    // ignoreComments: true still catches non-comment child errors
    {
      code: ['<div>', 'test{{! Comment }}', '</div>'].join('\n'),
      output: null,
      options: [{ ignoreComments: true }],
      errors: [{ messageId: 'incorrectChild' }],
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

    // Element properly indented
    [
      '<template>',
      '  <div class="parent">',
      '    <div class="child"></div>',
      '  </div>',
      '</template>',
    ].join('\n'),

    // If/else in GJS template
    [
      '<template>',
      '  {{#if foo}}',
      '    {{foo}}',
      '  {{else}}',
      '    {{bar}}',
      '  {{/if}}',
      '</template>',
    ].join('\n'),

    // If/else if/else in GJS
    [
      '<template>',
      '  {{#if foo}}',
      '    {{foo}}',
      '  {{else if bar}}',
      '    {{bar}}',
      '  {{else}}',
      '    {{baz}}',
      '  {{/if}}',
      '</template>',
    ].join('\n'),
  ],
  invalid: [
    // Incorrect child indentation in GJS
    {
      code: ['<template>', '<div>', '<p>Hello</p>', '</div>', '</template>'].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectChild' }],
    },

    // Else block with wrong indent in GJS
    {
      code: [
        '<template>',
        '  {{#if foo}}',
        '    {{foo}}',
        '    {{else if bar}}',
        '    {{bar}}',
        '  {{/if}}',
        '</template>',
      ].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectElse' }, { messageId: 'incorrectChild' }],
    },

    // Nested else block with wrong indent in GJS
    {
      code: [
        '<template>',
        '  {{#if a}}',
        '    {{#if foo}}',
        '      {{foo}}',
        '      {{else if bar}}',
        '      {{bar}}',
        '    {{/if}}',
        '  {{/if}}',
        '</template>',
      ].join('\n'),
      output: null,
      errors: [{ messageId: 'incorrectElse' }, { messageId: 'incorrectChild' }],
    },
  ],
});
