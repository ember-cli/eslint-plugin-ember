const rule = require('../../../lib/rules/template-no-unsupported-role-attributes');
const RuleTester = require('eslint').RuleTester;

const validHbs = [
  '<div role="button" aria-disabled="true"></div>',
  '<div role="heading" aria-level="1" />',
  '<span role="checkbox" aria-checked={{this.checked}}></span>',
  '<CustomComponent role="banner" />',
  '<div role="textbox" aria-required={{this.required}} aria-errormessage={{this.error}}></div>',
  '<div role="heading" foo="true" />',
  '<dialog />',
  '<a href="#" aria-describedby=""></a>',
  '<menu type="toolbar" aria-hidden="true" />',
  '<a role="menuitem" aria-labelledby={{this.label}} />',
  '<input type="image" aria-atomic />',
  '<input type="submit" aria-disabled="true" />',
  '<select aria-expanded="false" aria-controls="ctrlID" />',
  '<div type="button" foo="true" />',
  '{{some-component role="heading" aria-level="2"}}',
  '{{other-component role=this.role aria-bogus="true"}}',
  '<ItemCheckbox @model={{@model}} @checkable={{@checkable}} />',
  '<some-custom-element />',
  '<input type="password">',
];

const invalidHbs = [
  {
    code: '<div role="link" href="#" aria-checked />',
    output: '<div role="link" href="#" />',
    errors: [{ message: 'The attribute aria-checked is not supported by the role link' }],
  },
  {
    code: '<CustomComponent role="listbox" aria-level="2" />',
    output: '<CustomComponent role="listbox" />',
    errors: [{ message: 'The attribute aria-level is not supported by the role listbox' }],
  },
  {
    code: '<div role="option" aria-notreal="bogus" aria-selected="false" />',
    output: '<div role="option" aria-selected="false" />',
    errors: [{ message: 'The attribute aria-notreal is not supported by the role option' }],
  },
  {
    code: '<div role="combobox" aria-multiline="true" aria-expanded="false" aria-controls="someId" />',
    output: '<div role="combobox" aria-expanded="false" aria-controls="someId" />',
    errors: [{ message: 'The attribute aria-multiline is not supported by the role combobox' }],
  },
  {
    code: '<button type="submit" aria-valuetext="woosh"></button>',
    output: '<button type="submit"></button>',
    errors: [
      {
        message:
          'The attribute aria-valuetext is not supported by the element button with the implicit role of button',
      },
    ],
  },
  {
    code: '<menu type="toolbar" aria-expanded="true" />',
    output: '<menu type="toolbar" />',
    errors: [
      {
        message:
          'The attribute aria-expanded is not supported by the element menu with the implicit role of list',
      },
    ],
  },
  {
    code: '<a role="menuitem" aria-checked={{this.checked}} />',
    output: '<a role="menuitem" />',
    errors: [{ message: 'The attribute aria-checked is not supported by the role menuitem' }],
  },
  {
    code: '<input type="button" aria-invalid="grammar" />',
    output: '<input type="button" />',
    errors: [
      {
        message:
          'The attribute aria-invalid is not supported by the element input with the implicit role of button',
      },
    ],
  },
  {
    code: '<input type="email" aria-level={{this.level}} />',
    output: '<input type="email" />',
    errors: [
      {
        message:
          'The attribute aria-level is not supported by the element input with the implicit role of combobox',
      },
    ],
  },
  {
    code: '{{foo-component role="button" aria-valuetext="blahblahblah"}}',
    output: '{{foo-component role="button"}}',
    errors: [{ message: 'The attribute aria-valuetext is not supported by the role button' }],
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
  };
}

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

gjsRuleTester.run('template-no-unsupported-role-attributes', rule, {
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

hbsRuleTester.run('template-no-unsupported-role-attributes', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
