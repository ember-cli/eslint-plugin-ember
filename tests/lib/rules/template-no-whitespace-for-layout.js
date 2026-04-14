//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-whitespace-for-layout');
const RuleTester = require('eslint').RuleTester;

const validHbs = [
  'Start to finish',
  'Start&nbsp;to&nbsp;finish',
  'Start<br>to<br>finish',
  `<div>
  example
</div>`,
  `<div
  foo="bar"
  baz="qux"
>
  example
</div>`,
  // Attribute values with consecutive spaces must not be flagged (false positive,
  // cf. ember-template-lint#2899) — the rule targets element body text only.
  '<div class="foo  bar"></div>',
  '<div style="margin: 0;  padding: 0"></div>',
];

const invalidHbs = [
  {
    code: 'START  FINISH',
    output: null,
    errors: [{ message: 'Excess whitespace detected.' }],
  },
  {
    code: 'START&nbsp;&nbsp;FINISH',
    output: null,
    errors: [{ message: 'Excess whitespace detected.' }],
  },
  {
    code: 'START&nbsp; FINISH',
    output: null,
    errors: [{ message: 'Excess whitespace detected.' }],
  },
  {
    code: 'START &nbsp;FINISH',
    output: null,
    errors: [{ message: 'Excess whitespace detected.' }],
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

gjsRuleTester.run('template-no-whitespace-for-layout', rule, {
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

hbsRuleTester.run('template-no-whitespace-for-layout', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
