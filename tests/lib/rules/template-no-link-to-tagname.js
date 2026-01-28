const rule = require('../../../lib/rules/template-no-link-to-tagname');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-link-to-tagname', rule, {
  valid: [
    {
      filename: 'test.gjs',
      code: '<template><LinkTo @route="index">Home</LinkTo></template>',
      output: null,
    },
    {
      filename: 'test.gjs',
      code: '<template><link-to @route="about">About</link-to></template>',
      output: null,
    },
    {
      filename: 'test.gjs',
      code: '<template><a href="/home">Home</a></template>',
      output: null,
    },
  ],

  invalid: [
    {
      filename: 'test.gjs',
      code: '<template><LinkTo @route="index" tagName="button">Home</LinkTo></template>',
      output: null,
      errors: [{ messageId: 'noLinkToTagname' }],
    },
    {
      filename: 'test.gjs',
      code: '<template><LinkTo @route="about" @tagName="span">About</LinkTo></template>',
      output: null,
      errors: [{ messageId: 'noLinkToTagname' }],
    },
    {
      filename: 'test.gjs',
      code: '<template><link-to @route="contact" tagName="div">Contact</link-to></template>',
      output: null,
      errors: [{ messageId: 'noLinkToTagname' }],
    },
  ],
});
