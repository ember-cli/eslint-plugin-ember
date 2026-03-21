//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-triple-curlies');
const RuleTester = require('eslint').RuleTester;

const validHbs = [
  '{{foo}}',
  '{{! template-lint-disable no-bare-strings }}',
  '{{! template-lint-disable }}',
  // Upstream also treats `{{! template-lint-disable no-triple-curlies}}{{{lol}}}` as valid,
  // but this RuleTester does not honor template-lint disable directives.
];

const invalidHbs = [
  {
    code: '\n {{{foo}}}',
    output: null,
    errors: [{ message: 'Usage of triple curly brackets is unsafe' }],
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
    errors: entry.errors.map(() => ({ messageId: 'unsafe' })),
  };
}

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

gjsRuleTester.run('template-no-triple-curlies', rule, {
  valid: validHbs.map(wrapTemplate),
  invalid: invalidHbs.map(wrapTemplate),
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-triple-curlies', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
