//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-html-comments');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-html-comments', rule, {
  valid: [
    '<template>{{! This is a comment }}</template>',
    '<template>{{!-- This is a comment --}}</template>',
    '<template><div>Content</div></template>',
  
    // Test cases ported from ember-template-lint
    '<template>{{!-- comment here --}}</template>',
    '<template>{{!--comment here--}}</template>',
  ],
  invalid: [
    {
      code: '<template><!-- HTML comment --></template>',
      output: '<template>{{! HTML comment }}</template>',
      errors: [{ messageId: 'noHtmlComments' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><!-- comment here --></template>',
      output: null,
      errors: [{ messageId: 'noHtmlComments' }],
    },
    {
      code: '<template><!--comment here--></template>',
      output: null,
      errors: [{ messageId: 'noHtmlComments' }],
    },
  ],
});
