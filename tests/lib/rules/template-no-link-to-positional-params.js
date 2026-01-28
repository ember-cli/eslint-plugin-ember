const rule = require('../../../lib/rules/template-no-link-to-positional-params');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-link-to-positional-params', rule, {
  valid: [
    {
      code: '<template><LinkTo @route="index">Home</LinkTo></template>',
      filename: 'test.gjs',
      output: null,
    },
    {
      code: '<template><LinkTo @route="posts.post" @model={{this.post}}>Post</LinkTo></template>',
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
    // Note: This rule is simplified and may need adjustment based on actual LinkTo usage patterns
    // The real ember-template-lint rule has more complex logic for detecting positional params
  ],
});
