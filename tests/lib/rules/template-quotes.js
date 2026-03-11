//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-quotes');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-quotes', rule, {
  valid: [
    `<template>
      <div class="foo"></div>
    </template>`,
    `<template>
      <MyComponent @arg="value" />
    </template>`,
    `<template>
      <div></div>
    </template>`,
  ],

  invalid: [],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-quotes', rule, {
  valid: [
    '{{component "test"}}',
    '{{hello x="test"}}',
    '<input type="checkbox">',
    // single config
    { code: "{{component 'test'}}", options: ['single'] },
    { code: "{{hello x='test'}}", options: ['single'] },
    { code: "<input type='checkbox'>", options: ['single'] },
    // object config: curlies false, html false
    {
      code: '{{component "test"}} {{hello x=\'test\'}} <input type=\'checkbox\'> <input type="checkbox">',
      options: [{ curlies: false, html: false }],
    },
    // object config: curlies false, html single
    {
      code: "{{component \"test\"}} {{hello x='test'}} <input type='checkbox'>",
      options: [{ curlies: false, html: 'single' }],
    },
    // object config: curlies double, html false
    {
      code: '{{component "test"}} <input type=\'checkbox\'> <input type="checkbox">',
      options: [{ curlies: 'double', html: false }],
    },
    // object config: curlies single, html double
    {
      code: "<input type=\"checkbox\"> {{hello 'test' x='test'}}",
      options: [{ curlies: 'single', html: 'double' }],
    },
    // object config: curlies double, html single
    {
      code: '<input type=\'checkbox\'> {{hello "test" x="test"}}',
      options: [{ curlies: 'double', html: 'single' }],
    },
  ],
  invalid: [
    // double config (default)
    {
      code: "{{component 'one {{thing}} two'}}",
      output: '{{component "one {{thing}} two"}}',
      errors: [{ message: 'you must use double quotes in templates' }],
    },
    {
      code: "{{component 'test'}}",
      output: '{{component "test"}}',
      errors: [{ message: 'you must use double quotes in templates' }],
    },
    {
      code: "{{hello x='test'}}",
      output: '{{hello x="test"}}',
      errors: [{ message: 'you must use double quotes in templates' }],
    },
    {
      code: "<input type='checkbox'>",
      output: '<input type="checkbox">',
      errors: [{ message: 'you must use double quotes in templates' }],
    },
    {
      code: '<img class=\'a "so-called" btn {{this.otherClass}}\'>',
      output: null,
      errors: [{ message: 'you must use double quotes in templates' }],
    },
    // single config
    {
      code: '{{component "test"}}',
      output: "{{component 'test'}}",
      options: ['single'],
      errors: [{ message: 'you must use single quotes in templates' }],
    },
    {
      code: '{{hello x="test"}}',
      output: "{{hello x='test'}}",
      options: ['single'],
      errors: [{ message: 'you must use single quotes in templates' }],
    },
    {
      code: '<input type="checkbox">',
      output: "<input type='checkbox'>",
      options: ['single'],
      errors: [{ message: 'you must use single quotes in templates' }],
    },
    {
      code: '<img alt="Abdul\'s house">',
      output: null,
      options: ['single'],
      errors: [{ message: 'you must use single quotes in templates' }],
    },
    {
      code: '{{helper "Priya\'s house"}}',
      output: null,
      options: ['single'],
      errors: [{ message: 'you must use single quotes in templates' }],
    },
    // object config: curlies double, html single
    {
      code: "<input type=\"checkbox\"> {{hello 'test' x='test'}}",
      output: '<input type=\'checkbox\'> {{hello "test" x="test"}}',
      options: [{ curlies: 'double', html: 'single' }],
      errors: [
        {
          message:
            'you must use double quotes for Handlebars syntax and single quotes for HTML attributes in templates',
        },
        {
          message:
            'you must use double quotes for Handlebars syntax and single quotes for HTML attributes in templates',
        },
        {
          message:
            'you must use double quotes for Handlebars syntax and single quotes for HTML attributes in templates',
        },
      ],
    },
    // object config: curlies single, html double
    {
      code: '<input type=\'checkbox\'> {{hello "test" x="test"}}',
      output: "<input type=\"checkbox\"> {{hello 'test' x='test'}}",
      options: [{ curlies: 'single', html: 'double' }],
      errors: [
        {
          message:
            'you must use double quotes for HTML attributes and single quotes for Handlebars syntax in templates',
        },
        {
          message:
            'you must use double quotes for HTML attributes and single quotes for Handlebars syntax in templates',
        },
        {
          message:
            'you must use double quotes for HTML attributes and single quotes for Handlebars syntax in templates',
        },
      ],
    },
  ],
});
