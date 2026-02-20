const rule = require('../../../lib/rules/template-no-invalid-meta');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-invalid-meta', rule, {
  valid: [
    '<template><meta charset="utf-8" /></template>',
    '<template><meta charset="UTF-8" /></template>',
    '<template><meta charset="utf8" /></template>',
    '<template><meta name="viewport" content="width=device-width" /></template>',
  ],

  invalid: [
    {
      code: '<template><meta charset="iso-8859-1" /></template>',
      output: null,
      errors: [
        {
          message: 'Meta charset should be "utf-8". Found: "iso-8859-1".',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: '<template><meta charset="latin1" /></template>',
      output: null,
      errors: [
        {
          message: 'Meta charset should be "utf-8". Found: "latin1".',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: '<template><meta charset="windows-1252" /></template>',
      output: null,
      errors: [
        {
          message: 'Meta charset should be "utf-8". Found: "windows-1252".',
          type: 'GlimmerElementNode',
        },
      ],
    },
  ],
});
