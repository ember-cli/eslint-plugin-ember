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

    '<template>{{#if condition}}<img>{{/if}}</template>',
    '<template>{{#if (or c1 c2)}}{{/if}}</template>',
    '<template>{{#if (not (or c1 c2))}}{{/if}}</template>',
    '<template>{{#if (not c1 c2)}}{{/if}}</template>',
    '<template>{{#if (not (not c1) c2)}}<img>{{/if}}</template>',
    '<template>{{#if (not c1 (not c2))}}<img>{{/if}}</template>',

    // simplifyHelpers: false config
    {
      code: '<template>{{#if (not (not c2))}}<img>{{/if}}</template>',
      options: [{ simplifyHelpers: false }],
    },
    {
      code: '<template>{{#if (not (eq c2))}}<img>{{/if}}</template>',
      options: [{ simplifyHelpers: false }],
    },

    // if...else / if...else if patterns
    '<template>{{#if condition}}<img>{{else}}<img>{{/if}}</template>',
    '<template>{{#if (or c1 c2)}}<img>{{else}}<img>{{/if}}</template>',
    '<template>{{#if condition}}<img>{{else if condition}}<img>{{/if}}</template>',
    '<template>{{#if condition}}<img>{{else if (not condition2)}}<img>{{/if}}</template>',
    '<template>{{#if (not condition)}}<img>{{else if (not condition2)}}<img>{{/if}}</template>',
    '<template>{{#if condition}}<img>{{else if condition}}<img>{{else}}<img>{{/if}}</template>',
    '<template>{{#if (not condition)}}<img>{{else if (not condition2)}}<img>{{else}}<img>{{/if}}</template>',

    // unless variants
    '<template>{{#unless (or c1 c2)}}<img>{{/unless}}</template>',
    '<template>{{#unless condition}}<img>{{else}}<img>{{/unless}}</template>',
    '<template>{{#unless condition}}<img>{{else if condition}}<img>{{/unless}}</template>',
    '<template>{{#unless condition}}<img>{{else if condition}}<img>{{else}}<img>{{/unless}}</template>',

    // MustacheStatement context (inline)
    '<template><img class={{if condition "some-class"}}></template>',
    '<template><img class={{if condition "some-class" "other-class"}}></template>',
    '<template><img class={{unless condition "some-class"}}></template>',
    '<template><img class={{if (not (or c1 c2)) "some-class"}}></template>',

    // SubExpression context
    '<template>{{input class=(if condition "some-class")}}</template>',
    '<template>{{input class=(if condition "some-class" "other-class")}}</template>',
    '<template>{{input class=(unless condition "some-class")}}</template>',
    '<template>{{input class=(if (not (or c1 c2)) "some-class")}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{#if (not isValid)}}No{{/if}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },

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
      errors: [{ messageId: 'flipIf' }],
    },
    {
      code: '<template>{{#unless (not condition)}}<img>{{/unless}}</template>',
      output: null,
      errors: [{ messageId: 'useIf' }],
    },
    {
      code: '<template>{{#unless (not (not condition))}}<img>{{/unless}}</template>',
      output: null,
      errors: [{ messageId: 'useIf' }],
    },
    {
      code: '<template>{{#unless (not condition)}}<img>{{else}}<input>{{/unless}}</template>',
      output: null,
      errors: [{ messageId: 'useIf' }],
    },
    {
      code: '<template>{{#unless (not condition)}}<img>{{else if (not condition)}}<input>{{/unless}}</template>',
      output: null,
      errors: [{ messageId: 'useIf' }],
    },
    {
      code: '<template>{{#unless (not condition)}}<img>{{else if (not condition)}}<input>{{else}}<hr>{{/unless}}</template>',
      output: null,
      errors: [{ messageId: 'useIf' }],
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
      errors: [{ messageId: 'flipIf' }],
    },
    {
      code: '<template><img class={{unless (not condition) "some-class"}}></template>',
      output: null,
      errors: [{ messageId: 'useIf' }],
    },
    {
      code: '<template><img class={{unless (not condition) "some-class" "other-class"}}></template>',
      output: null,
      errors: [{ messageId: 'useIf' }],
    },
    {
      code: '<template><img class={{unless (not (not condition)) "some-class" "other-class"}}></template>',
      output: null,
      errors: [{ messageId: 'useIf' }],
    },
    {
      code: '<template>{{input class=(if (not condition) "some-class")}}</template>',
      output: null,
      errors: [{ messageId: 'useUnless' }],
    },
    {
      code: '<template>{{input class=(if (not condition) "some-class" "other-class")}}</template>',
      output: null,
      errors: [{ messageId: 'flipIf' }],
    },
    {
      code: '<template>{{input class=(unless (not condition) "some-class")}}</template>',
      output: null,
      errors: [{ messageId: 'useIf' }],
    },
    {
      code: '<template>{{input class=(unless (not condition) "some-class" "other-class")}}</template>',
      output: null,
      errors: [{ messageId: 'useIf' }],
    },
    {
      code: '<template>{{input class=(unless (not (not condition)) "some-class" "other-class")}}</template>',
      output: null,
      errors: [{ messageId: 'useIf' }],
    },
  ],
});
