const rule = require('../../../lib/rules/template-no-unnecessary-concat');
const RuleTester = require('eslint').RuleTester;

const validHbs = [
  '<div class={{clazz}}></div>',
  '<div class="first {{second}}"></div>',
  '"{{foo}}"',
];

const invalidHbs = [
  {
    code: '<div class="{{clazz}}"></div>',
    output: '<div class={{clazz}}></div>',
    errors: [
      { message: 'Unnecessary string concatenation. Use {{clazz}} instead of "{{clazz}}".' },
    ],
  },
  {
    code: '<img src="{{url}}" alt="{{t "alternate-text"}}">',
    output: '<img src={{url}} alt={{t "alternate-text"}}>',
    errors: [
      { message: 'Unnecessary string concatenation. Use {{url}} instead of "{{url}}".' },
      {
        message:
          'Unnecessary string concatenation. Use {{t "alternate-text"}} instead of "{{t "alternate-text"}}".',
      },
    ],
  },
];

function wrapTemplate(entry) {
  if (typeof entry === 'string') {
    return `<template>${entry}</template>`;
  }

  return {
    ...entry,
    code: `<template>${entry.code}</template>`,
    output: entry.output ? `<template>${entry.output}</template>` : entry.output,
    errors: entry.errors.map(() => ({ messageId: 'unnecessary' })),
  };
}

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

gjsRuleTester.run('template-no-unnecessary-concat', rule, {
  valid: validHbs.map(wrapTemplate),
  invalid: invalidHbs.map(wrapTemplate),
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-unnecessary-concat', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
