//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-negated-condition');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-negated-condition', rule, {
  valid: [
    '<template>{{#if isValid}}Yes{{/if}}</template>',
    '<template>{{#unless isInvalid}}Yes{{/unless}}</template>',
    '<template>{{#if (eq value 1)}}Yes{{/if}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{#if (not isValid)}}No{{/if}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template>{{#if (not condition)}}<img>{{/if}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template>{{#if (not (not c1 c2))}}<img>{{/if}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template>{{#if (not condition)}}<img>{{else}}<input>{{/if}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template>{{#unless (not condition)}}<img>{{/unless}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template>{{#unless (not (not condition))}}<img>{{/unless}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template>{{#unless (not condition)}}<img>{{else}}<input>{{/unless}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template>{{#unless (not condition)}}<img>{{else if (not condition)}}<input>{{/unless}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template>{{#unless (not condition)}}<img>{{else if (not condition)}}<input>{{else}}<hr>{{/unless}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template>{{#if condition}}{{else}}{{! some comment }}{{#if (not condition)}}<img>{{/if}}{{/if}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template>{{#if condition}}{{else}}{{#if (not condition)}}<img>{{/if}}{{/if}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template><img class={{if (not condition) "some-class"}}></template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template><img class={{if (not condition) "some-class" "other-class"}}></template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template><img class={{unless (not condition) "some-class"}}></template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template><img class={{unless (not condition) "some-class" "other-class"}}></template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template><img class={{unless (not (not condition)) "some-class" "other-class"}}></template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template>{{input class=(if (not condition) "some-class")}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template>{{input class=(if (not condition) "some-class" "other-class")}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template>{{input class=(unless (not condition) "some-class")}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template>{{input class=(unless (not condition) "some-class" "other-class")}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template>{{input class=(unless (not (not condition)) "some-class" "other-class")}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
  ],
});
