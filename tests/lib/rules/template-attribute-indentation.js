//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-attribute-indentation');
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

hbsRuleTester.run('template-attribute-indentation', rule, {
  valid: [
    // Short invocations on a single line are fine (< 80 chars)
    '{{employee-details firstName=firstName}}',
    '<input disabled>',
    // Mustache non-block with proper indentation and new-line close
    {
      code: ['{{contact-details', '  firstName=firstName', '  lastName=lastName', '}}'].join('\n'),
      options: [{ 'mustache-open-end': 'new-line' }],
    },
    // Mustache non-block with last-attribute close
    {
      code: ['{{contact-details', '  firstName=firstName', '  lastName=lastName}}'].join('\n'),
      options: [{ 'mustache-open-end': 'last-attribute' }],
    },
    // Block form with proper indentation
    {
      code: [
        '{{#employee-details',
        '  firstName=firstName',
        '  lastName=lastName',
        'as |employee|',
        '}}',
        '  {{employee.fullName}}',
        '{{/employee-details}}',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'new-line' }],
    },
    // Block form with as-indentation attribute
    {
      code: ['{{#foo', '  attribute=this.mine', '  as |let|', '}}', '{{/foo}}'].join('\n'),
      options: [
        {
          'mustache-open-end': 'new-line',
          'element-open-end': 'new-line',
          'as-indentation': 'attribute',
        },
      ],
    },
    // Block form with as-indentation closing-brace
    {
      code: ['{{#foo', '  attribute=this.mine', 'as |let|', '}}', '{{/foo}}'].join('\n'),
      options: [
        {
          'mustache-open-end': 'new-line',
          'element-open-end': 'new-line',
          'as-indentation': 'closing-brace',
        },
      ],
    },
    // HTML element with new-line close
    {
      code: '<div\n  foo=bar\n  baz=qux\n/>',
      options: [{ 'element-open-end': 'new-line' }],
    },
    // HTML element with last-attribute close
    {
      code: '<div\n  foo=bar\n  baz=qux/>',
      options: [{ 'element-open-end': 'last-attribute' }],
    },
    // Input element with new-line close
    {
      code: '<input\n  foo=bar\n  baz=qux\n>',
      options: [{ 'element-open-end': 'new-line' }],
    },
    // Input element with last-attribute close
    {
      code: '<input\n  foo=bar\n  baz=qux>',
      options: [{ 'element-open-end': 'last-attribute' }],
    },
    // Mustache with sub-expression
    {
      code: [
        '{{my-component',
        '  foo=bar',
        '  baz=qux',
        '  my-attr=(component "my-other-component" data=(hash',
        '    foo=bar',
        '    foo=bar',
        '    baz=qux))',
        '}}',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'new-line' }],
    },
    // Mustache with sub-expression and last-attribute close
    {
      code: [
        '{{my-component',
        '  foo=bar',
        '  baz=qux',
        '  my-attr=(component "my-other-component" data=(hash',
        '    foo=bar',
        '    foo=bar',
        '    baz=qux))}}',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'last-attribute' }],
    },
    // Element with nested mustache value
    {
      code: ['<div', '  foo={{action', '    some', '    stuff}}', '  baz=qux', '/>'].join('\n'),
      options: [{ 'mustache-open-end': 'last-attribute', 'element-open-end': 'new-line' }],
    },
    // Element with nested mustache and new-line close
    {
      code: ['<div', '  foo={{action', '    some', '    stuff', '  }}', '  baz=qux', '/>'].join(
        '\n'
      ),
      options: [{ 'mustache-open-end': 'new-line', 'element-open-end': 'new-line' }],
    },
    // Element with nested mustache, last-attribute for both
    {
      code: ['<div', '  foo={{action', '    some', '    stuff}}', '  baz=qux/>'].join('\n'),
      options: [{ 'mustache-open-end': 'last-attribute', 'element-open-end': 'last-attribute' }],
    },
    // Angle bracket invocation
    {
      code: [
        '<SiteHeader',
        '  @selected={{this.user.country}} as |Option|',
        '>{{#each this.availableCountries as |country|}}',
        '<Option @value={{country}}>{{country.name}}</Option>',
        '{{/each}}',
        '</SiteHeader>',
      ].join('\n'),
      options: [{ 'process-elements': true }],
    },
    // Non-block HTML with wrong indentation but process-elements is off
    {
      code: '<input\ndisabled\n>',
      options: [{ 'process-elements': false }],
    },
    // Block HTML element
    {
      code: '<a\n  disabled\n>abc\n</a>',
      options: [{ 'process-elements': true }],
    },
    // Block HTML element with last-attribute
    {
      code: '<a\n  disabled>\nabc\n</a>',
      options: [{ 'process-elements': true, 'element-open-end': 'last-attribute' }],
    },
    // Nested elements
    {
      code: ['<a', '  disabled', '>', '<span', '  class="abc"', '>spam me', '</span>', '</a>'].join(
        '\n'
      ),
      options: [{ 'process-elements': true }],
    },
    // Element with nested each block
    {
      code: [
        '<a',
        '  disabled',
        '>',
        '{{#each',
        '  class="abc"',
        '}}spam me',
        '{{/each}}',
        '</a>',
      ].join('\n'),
      options: [{ 'process-elements': true }],
    },
    // Empty block form short
    '{{#employee-details as |employee|}}{{employee.fullName}}{{/employee-details}}',
    // Block with just positional params
    {
      code: [
        '{{#employee-details',
        '  firstName',
        '  lastName',
        '  age',
        'as |employee|',
        '}}',
        '  {{employee.fullName}}',
        '{{/employee-details}}',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'new-line' }],
    },
  ],

  invalid: [
    // Element with process-elements
    {
      code: '<input disabled\n>',
      output: null,
      options: [{ 'process-elements': true }],
      errors: [
        {
          messageId: 'incorrectParamIndentation',
        },
        {
          messageId: 'incorrectCloseBracket',
        },
      ],
    },
    // Element with element-open-end: last-attribute but close on new line
    {
      code: '<input\n  foo=bar\n  baz=bar\n>',
      output: null,
      options: [{ 'element-open-end': 'last-attribute' }],
      errors: [
        {
          messageId: 'incorrectCloseBracket',
        },
      ],
    },
    // Element with element-open-end: new-line but close on last attribute
    {
      code: '<input\n  foo=bar\n  baz=qux>',
      output: null,
      options: [{ 'element-open-end': 'new-line' }],
      errors: [
        {
          messageId: 'incorrectCloseBracket',
        },
      ],
    },
    // Mustache with mustache-open-end: last-attribute but close on new line
    {
      code: [
        '{{my-component',
        '  foo=bar',
        '  baz=qux',
        '  my-attr=(component "my-other-component" data=(hash',
        '    foo=bar',
        '    foo=bar',
        '    baz=qux))',
        '}}',
      ].join('\n'),
      output: null,
      options: [{ 'mustache-open-end': 'last-attribute' }],
      errors: [
        {
          messageId: 'incorrectCloseBrace',
        },
      ],
    },
    // Mustache with mustache-open-end: new-line but close on last attribute
    {
      code: [
        '{{my-component',
        '  foo=bar',
        '  baz=qux',
        '  my-attr=(component "my-other-component" data=(hash',
        '    foo=bar',
        '    foo=bar',
        '    baz=qux))}}',
      ].join('\n'),
      output: null,
      options: [{ 'mustache-open-end': 'new-line' }],
      errors: [
        {
          messageId: 'incorrectCloseBrace',
        },
      ],
    },
    // Element close brace: mixed mustache-open-end + element-open-end
    {
      code: ['<div', '  foo={{action', '    some', '    stuff}}', '  baz=qux/>'].join('\n'),
      output: null,
      options: [{ 'mustache-open-end': 'new-line', 'element-open-end': 'new-line' }],
      errors: [
        {
          messageId: 'incorrectCloseBrace',
        },
        {
          messageId: 'incorrectCloseBracket',
        },
      ],
    },
    // Element close brace: element-open-end: last-attribute but close on new line
    {
      code: ['<div', '  foo={{action', '    some', '    stuff', '  }}', '  baz=qux', '/>'].join(
        '\n'
      ),
      output: null,
      options: [{ 'mustache-open-end': 'last-attribute', 'element-open-end': 'last-attribute' }],
      errors: [
        {
          messageId: 'incorrectCloseBrace',
        },
        {
          messageId: 'incorrectCloseBracket',
        },
      ],
    },
    // Incorrect attribute indentation on mustache
    {
      code: ['{{contact-details', 'firstName=firstName', '  lastName=lastName', '}}'].join('\n'),
      output: null,
      options: [{ 'mustache-open-end': 'new-line' }],
      errors: [
        {
          messageId: 'incorrectParamIndentation',
        },
      ],
    },
    // Incorrect attribute indentation on element
    {
      code: '<div\nfoo=bar\n  baz=qux\n/>',
      output: null,
      options: [{ 'element-open-end': 'new-line' }],
      errors: [
        {
          messageId: 'incorrectParamIndentation',
        },
      ],
    },
  ],
});

// ---- GJS tests ----

gjsRuleTester.run('template-attribute-indentation', rule, {
  valid: [
    // Short invocation
    '<template>{{foo bar=baz}}</template>',
    // Multi-line with proper indentation
    {
      code: [
        '<template>',
        '{{contact-details',
        '  firstName=firstName',
        '  lastName=lastName',
        '}}',
        '</template>',
      ].join('\n'),
      options: [{ 'mustache-open-end': 'new-line' }],
    },
    // Element with proper indentation
    {
      code: ['<template>', '<div', '  foo=bar', '  baz=qux', '/>', '</template>'].join('\n'),
      options: [{ 'element-open-end': 'new-line' }],
    },
  ],
  invalid: [
    // Incorrect indentation in GJS
    {
      code: [
        '<template>',
        '{{contact-details',
        'firstName=firstName',
        '  lastName=lastName',
        '}}',
        '</template>',
      ].join('\n'),
      output: null,
      options: [{ 'mustache-open-end': 'new-line' }],
      errors: [
        {
          messageId: 'incorrectParamIndentation',
        },
      ],
    },
  ],
});
