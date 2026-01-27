const rule = require('../../../lib/rules/template-no-empty-headings');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-empty-headings', rule, {
  valid: [
    '<template><h1>Title</h1></template>',
    '<template><h2>{{this.title}}</h2></template>',
    '<template><h3><span>Text</span></h3></template>',
    '<template><h4 hidden></h4></template>',
  ],
  invalid: [
    {
      code: '<template><h1></h1></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
    {
      code: '<template><h2>   </h2></template>',
      output: null,
      errors: [{ messageId: 'emptyHeading' }],
    },
  ],
});
