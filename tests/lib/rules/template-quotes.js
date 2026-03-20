const rule = require('../../../lib/rules/template-quotes');
const RuleTester = require('eslint').RuleTester;

const validHbs = [
  { code: '{{component "test"}}', options: ['double'] },
  { code: '{{hello x="test"}}', options: ['double'] },
  { code: '<input type="checkbox">', options: ['double'] },
  { code: "{{component 'test'}}", options: ['single'] },
  { code: "{{hello x='test'}}", options: ['single'] },
  { code: "<input type='checkbox'>", options: ['single'] },
  {
    code: '{{component "test"}} {{hello x=\'test\'}} <input type=\'checkbox\'> <input type="checkbox">',
    options: [{ curlies: false, html: false }],
  },
  {
    code: "{{component \"test\"}} {{hello x='test'}} <input type='checkbox'>",
    options: [{ curlies: false, html: 'single' }],
  },
  {
    code: '{{component "test"}} <input type=\'checkbox\'> <input type="checkbox">',
    options: [{ curlies: 'double', html: false }],
  },
  {
    code: "<input type=\"checkbox\"> {{hello 'test' x='test'}}",
    options: [{ curlies: 'single', html: 'double' }],
  },
  {
    code: '<input type=\'checkbox\'> {{hello "test" x="test"}}',
    options: [{ curlies: 'double', html: 'single' }],
  },
];

const invalidHbs = [
  {
    code: "{{component 'one {{thing}} two'}}",
    output: '{{component "one {{thing}} two"}}',
    options: ['double'],
    errors: [{ message: 'you must use double quotes in templates' }],
  },
  {
    code: "{{component 'test'}}",
    output: '{{component "test"}}',
    options: ['double'],
    errors: [{ message: 'you must use double quotes in templates' }],
  },
  {
    code: "{{hello x='test'}}",
    output: '{{hello x="test"}}',
    options: ['double'],
    errors: [{ message: 'you must use double quotes in templates' }],
  },
  {
    code: "<input type='checkbox'>",
    output: '<input type="checkbox">',
    options: ['double'],
    errors: [{ message: 'you must use double quotes in templates' }],
  },
  {
    code: '<img class=\'a "so-called" btn {{this.otherClass}}\'>',
    output: null,
    options: ['double'],
    errors: [{ message: 'you must use double quotes in templates' }],
  },
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
];

function wrapTemplate(entry) {
  return {
    ...entry,
    code: `<template>${entry.code}</template>`,
    output: entry.output ? `<template>${entry.output}</template>` : entry.output,
  };
}

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

gjsRuleTester.run('template-quotes', rule, {
  valid: validHbs
    .filter(
      (entry) =>
        !entry.code.includes('<input type="checkbox"> {{') &&
        !entry.code.includes("<input type='checkbox'> {{")
    )
    .map(wrapTemplate),
  invalid: invalidHbs
    .filter(
      (entry) =>
        !entry.code.includes('<input type="checkbox"> {{') &&
        !entry.code.includes("<input type='checkbox'> {{")
    )
    .map(wrapTemplate),
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-quotes', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
