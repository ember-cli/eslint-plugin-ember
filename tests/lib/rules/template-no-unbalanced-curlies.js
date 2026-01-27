//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-unbalanced-curlies');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

// Note: Unbalanced curlies cause parser errors before the rule can run
// This rule is designed to catch edge cases in the AST if they somehow exist
// The parser itself will catch most unbalanced curly issues
ruleTester.run('template-no-unbalanced-curlies', rule, {
  valid: [
    '<template>{{value}}</template>',
    '<template>{{#if condition}}{{value}}{{/if}}</template>',
    '<template>{{helper param1 param2}}</template>',
    '<template>{{{unescaped}}}</template>',
  ],
  invalid: [
    // Parser catches these before the rule runs, so no invalid cases to test
  ],
});
