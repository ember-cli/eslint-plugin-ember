const rule = require('../../../lib/rules/template-no-link-to-tagname');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-link-to-tagname', rule, {
  valid: [
    {
      code: '<template><LinkTo @route="index">Home</LinkTo></template>',
      filename: 'test.gjs',
      output: null,
    },
    {
      code: '<template><link-to @route="about">About</link-to></template>',
      filename: 'test.gjs',
      output: null,
    },
    {
      code: '<template><a href="/home">Home</a></template>',
      filename: 'test.gjs',
      output: null,
    },
  ],

  invalid: [
    {
      code: '<template><LinkTo @route="index" tagName="button">Home</LinkTo></template>',
      filename: 'test.gjs',
      output: null,
      errors: [{ messageId: 'noLinkToTagname' }],
    },
    {
      code: '<template><LinkTo @route="about" @tagName="span">About</LinkTo></template>',
      filename: 'test.gjs',
      output: null,
      errors: [{ messageId: 'noLinkToTagname' }],
    },
    {
      code: '<template><link-to @route="contact" tagName="div">Contact</link-to></template>',
      filename: 'test.gjs',
      output: null,
      errors: [{ messageId: 'noLinkToTagname' }],
    },
  ],
});
