const rule = require('../../../lib/rules/template-require-valid-alt-text');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-valid-alt-text', rule, {
  valid: [
    '<template><img alt="A cat" src="/cat.jpg" /></template>',
    '<template><img alt="Company branding" src="/logo.png" /></template>',
    '<template><img alt="" src="/decorative.png" /></template>',
    '<template><img hidden alt="" /></template>',
  ],
  invalid: [
    {
      code: '<template><img src="/test.jpg" /></template>',
      output: null,
      errors: [{ messageId: 'imgMissing' }],
    },
    {
      code: '<template><img alt="image of a cat" src="/cat.jpg" /></template>',
      output: null,
      errors: [{ messageId: 'imgRedundant' }],
    },
    {
      code: '<template><img alt="photo of sunset" src="/sunset.jpg" /></template>',
      output: null,
      errors: [{ messageId: 'imgRedundant' }],
    },
  ],
});
