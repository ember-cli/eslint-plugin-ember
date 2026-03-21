//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-unbalanced-curlies');
const RuleTester = require('eslint').RuleTester;

const validHbs = [
  '{foo}',
  '{{foo}}',
  '{{{foo}}}',
  `{{{foo
}}}`,
  '\\{{foo}}',
  '\\{{foo}}\\{{foo}}',
  '\\{{foo}}{{foo}}',
  `\\{{foo
}}`,
];

const invalidHbs = [
  {
    code: 'foo}}',
    output: null,
    errors: [{ message: 'Unbalanced curlies detected' }],
  },
  {
    code: '{foo}}',
    output: null,
    errors: [{ message: 'Unbalanced curlies detected' }],
  },
  {
    code: 'foo}}}',
    output: null,
    errors: [{ message: 'Unbalanced curlies detected' }],
  },
  {
    code: '{foo}}}',
    output: null,
    errors: [{ message: 'Unbalanced curlies detected' }],
  },
  {
    code: `{foo
}}}`,
    output: null,
    errors: [{ message: 'Unbalanced curlies detected' }],
  },
  {
    code: `{foo
}}}
bar`,
    output: null,
    errors: [{ message: 'Unbalanced curlies detected' }],
  },
  {
    code: '{foo\r\nbar\r\n\r\nbaz}}}',
    output: null,
    errors: [{ message: 'Unbalanced curlies detected' }],
  },
  {
    code: '{foo\rbar\r\rbaz}}}',
    output: null,
    errors: [{ message: 'Unbalanced curlies detected' }],
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
    errors: entry.errors.map(() => ({ messageId: 'noUnbalancedCurlies' })),
  };
}

const gjsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

gjsRuleTester.run('template-no-unbalanced-curlies', rule, {
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

hbsRuleTester.run('template-no-unbalanced-curlies', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
