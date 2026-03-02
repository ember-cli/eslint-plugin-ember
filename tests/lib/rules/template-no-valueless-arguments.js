const rule = require('../../../lib/rules/template-no-valueless-arguments');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-valueless-arguments', rule, {
  valid: [
    '<template><Foo @bar={{true}} /></template>',
    '<template><SomeComponent @emptyString="" data-test-some-component /></template>',
    '<template><button type="submit" disabled {{on "click" this.submit}}></button></template>',
  ],
  invalid: [
    {
      code: '<template><Foo @bar /></template>',
      output: null,
      errors: [{ messageId: 'valueless' }],
    },

    {
      code: '<template><SomeComponent @valueless /></template>',
      output: null,
      errors: [{ messageId: 'valueless' }],
    },
    {
      code: '<template><SomeComponent @valuelessByAccident{{this.canBeAModifier}} /></template>',
      output: null,
      errors: [{ messageId: 'valueless' }],
    },
    {
      code: '<template><SomeComponent @valuelessByAccident{{@canBeAModifier}} /></template>',
      output: null,
      errors: [{ messageId: 'valueless' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-valueless-arguments', rule, {
  valid: [
    '<SomeComponent @emptyString="" data-test-some-component />',
    '<button type="submit" disabled {{on "click" this.submit}}></button>',
  ],
  invalid: [
    {
      code: '<SomeComponent @valueless />',
      output: null,
      errors: [
        { message: 'Named arguments should have an explicitly assigned value.' },
      ],
    },
    {
      code: '<SomeComponent @valuelessByAccident{{this.canBeAModifier}} />',
      output: null,
      errors: [
        { message: 'Named arguments should have an explicitly assigned value.' },
      ],
    },
    {
      code: '<SomeComponent @valuelessByAccident{{@canBeAModifier}} />',
      output: null,
      errors: [
        { message: 'Named arguments should have an explicitly assigned value.' },
      ],
    },
  ],
});
