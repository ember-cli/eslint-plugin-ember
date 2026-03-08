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

    '<template>{{!-- comment here --}}</template>',
    '<template>{{!--comment here--}}</template>',
  ],
  invalid: [
    {
      code: '<template><!-- HTML comment --></template>',
      output: '<template>{{! HTML comment }}</template>',
      errors: [{ messageId: 'noHtmlComments' }],
    },

    {
      code: '<template><!-- comment here --></template>',
      output: '<template>{{! comment here }}</template>',
      errors: [{ messageId: 'noHtmlComments' }],
    },
    {
      code: '<template><!--comment here--></template>',
      output: '<template>{{!comment here}}</template>',
      errors: [{ messageId: 'noHtmlComments' }],
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

hbsRuleTester.run('template-no-html-comments', rule, {
  valid: [
    '{{!-- comment here --}}',
    '{{!--comment here--}}',
    '{{! template-lint-disable no-bare-strings }}',
    '{{! template-lint-disable }}',
  ],
  invalid: [
    {
      code: '<!-- comment here -->',
      output: '{{! comment here }}',
      errors: [{ messageId: 'noHtmlComments' }],
    },
    {
      code: '<!--comment here-->',
      output: '{{!comment here}}',
      errors: [{ messageId: 'noHtmlComments' }],
    },
  ],
});
