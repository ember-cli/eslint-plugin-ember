//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-bare-yield');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-bare-yield', rule, {
  valid: [
    '<template>{{yield this}}</template>',
    '<template>{{yield @model}}</template>',
    '<template><div>Content</div></template>',
  ],
  invalid: [
    {
      code: '<template>{{yield}}</template>',
      output: null,
      errors: [{ messageId: 'noBareYield' }],
    },
  ],
});
