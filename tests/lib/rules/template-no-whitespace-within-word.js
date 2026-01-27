const eslint = require('eslint');
const rule = require('../../../lib/rules/template-no-whitespace-within-word');

const { RuleTester } = eslint;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-whitespace-within-word', rule, {
  valid: [
    // No whitespace
    '<template>{{value}}</template>',
    '<template>{{this.property}}</template>',
    '<template>{{@arg}}</template>',
    '<template>{{#if condition}}content{{/if}}</template>',
  ],
  invalid: [
    {
      code: '<template><div>W e l c o m e</div></template>',
      output: null,
      errors: [{ messageId: 'excessWhitespace' }],
    },
    {
      code: '<template><span>H e l l o</span></template>',
      output: null,
      errors: [{ messageId: 'excessWhitespace' }],
    },
    {
      code: '<template><p>C l i c k</p></template>',
      output: null,
      errors: [{ messageId: 'excessWhitespace' }],
    },
  ],
});
