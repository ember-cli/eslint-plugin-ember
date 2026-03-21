const eslint = require('eslint');
const rule = require('../../../lib/rules/template-no-whitespace-within-word');

const { RuleTester } = eslint;

const validHbs = [
  'Welcome',
  'Hey - I like this!',
  'Expected: 5-10 guests',
  'Expected: 5 - 10 guests',
  'It is possible to get some examples of in-word emph a sis past this rule.',
  'However, I do not want a rule that flags annoying false positives for correctly-used single-character words.',
  '<div>Welcome</div>',
  '<div enable-background="a b c d e f g h i j k l m">We want to ignore values of HTML attributes</div>',
  `<style>
  .my-custom-class > * {
    border: 2px dotted red;
  }
</style>`,
];

const invalidHbs = [
  {
    code: 'W e l c o m e',
    output: null,
    errors: [{ message: 'Excess whitespace in layout detected.' }],
  },
  {
    code: 'W&nbsp;e&nbsp;l&nbsp;c&nbsp;o&nbsp;m&nbsp;e',
    output: null,
    errors: [{ message: 'Excess whitespace in layout detected.' }],
  },
  {
    code: 'Wel c o me',
    output: null,
    errors: [{ message: 'Excess whitespace in layout detected.' }],
  },
  {
    code: 'Wel&nbsp;c&emsp;o&nbsp;me',
    output: null,
    errors: [{ message: 'Excess whitespace in layout detected.' }],
  },
  {
    code: '<div>W e l c o m e</div>',
    output: null,
    errors: [{ message: 'Excess whitespace in layout detected.' }],
  },
  {
    code: '<div>Wel c o me</div>',
    output: null,
    errors: [{ message: 'Excess whitespace in layout detected.' }],
  },
  {
    code: 'A  B&nbsp;&nbsp; C ',
    output: null,
    errors: [{ message: 'Excess whitespace in layout detected.' }],
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

gjsRuleTester.run('template-no-whitespace-within-word', rule, {
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

hbsRuleTester.run('template-no-whitespace-within-word', rule, {
  valid: validHbs,
  invalid: invalidHbs,
});
