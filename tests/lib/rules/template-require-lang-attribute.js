const rule = require('../../../lib/rules/template-require-lang-attribute');
const RuleTester = require('eslint').RuleTester;

const ERROR_MESSAGE = 'The `<html>` element must have the `lang` attribute with a valid value';

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-lang-attribute', rule, {
  valid: [
    '<template><html lang="en"></html></template>',
    '<template><html lang="en-US"></html></template>',
    '<template><html lang="DE-BW"></html></template>',
    '<template><html lang="zh-Hant-HK"></html></template>',
    '<template><html lang={{lang}}></html></template>',
    {
      code: '<template><html lang="de"></html></template>',
      options: [true],
    },
    {
      code: '<template><html lang={{this.language}}></html></template>',
      options: [true],
    },
    {
      code: '<template><html lang="hurrah"></html></template>',
      options: [{ validateValues: false }],
    },
    {
      code: '<template><html lang={{this.blah}}></html></template>',
      options: [{ validateValues: false }],
    },
  ],

  invalid: [
    {
      code: '<template><html></html></template>',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: '<template><html lang=""></html></template>',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: '<template><html></html></template>',
      output: null,
      options: [true],
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: '<template><html lang=""></html></template>',
      output: null,
      options: [true],
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: '<template><html lang="gibberish"></html></template>',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: '<template><html lang="gibberish"></html></template>',
      output: null,
      options: [{ validateValues: true }],
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      // Invalid region subtag: "xx" is not a registered ISO 3166 / BCP 47
      // region code. Prior to the country-codes port, the rule only
      // validated the primary subtag and incorrectly accepted this value.
      code: '<template><html lang="en-XX"></html></template>',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: '<template><html></html></template>',
      output: null,
      options: [{ validateValues: false }],
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: '<template><html lang=""></html></template>',
      output: null,
      options: [{ validateValues: false }],
      errors: [{ message: ERROR_MESSAGE }],
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

hbsRuleTester.run('template-require-lang-attribute', rule, {
  valid: [
    '<html lang="en"></html>',
    '<html lang="en-US"></html>',
    '<html lang="DE-BW"></html>',
    '<html lang="zh-Hant-HK"></html>',
    '<html lang={{lang}}></html>',
    {
      code: '<html lang="de"></html>',
      options: [true],
    },
    {
      code: '<html lang={{this.language}}></html>',
      options: [true],
    },
    {
      code: '<html lang="hurrah"></html>',
      options: [{ validateValues: false }],
    },
    {
      code: '<html lang={{this.blah}}></html>',
      options: [{ validateValues: false }],
    },
  ],
  invalid: [
    {
      code: '<html></html>',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: '<html lang=""></html>',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: '<html></html>',
      output: null,
      options: [true],
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: '<html lang=""></html>',
      output: null,
      options: [true],
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: '<html lang="gibberish"></html>',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: '<html lang="gibberish"></html>',
      output: null,
      options: [{ validateValues: true }],
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      // Invalid region subtag: "xx" is not a registered ISO 3166 / BCP 47
      // region code. Prior to the country-codes port, the rule only
      // validated the primary subtag and incorrectly accepted this value.
      code: '<html lang="en-XX"></html>',
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: '<html></html>',
      output: null,
      options: [{ validateValues: false }],
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: '<html lang=""></html>',
      output: null,
      options: [{ validateValues: false }],
      errors: [{ message: ERROR_MESSAGE }],
    },
  ],
});
