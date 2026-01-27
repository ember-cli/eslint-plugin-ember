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

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-negated-condition', rule, {
  valid: [
    '{{#if condition}}<img>{{/if}}',
    '{{#if (or c1 c2)}}{{/if}}',
    '{{#if (not (or c1 c2))}}{{/if}}',
    '{{#if (not c1 c2)}}{{/if}}',
    '{{#if (not (not c1) c2)}}<img>{{/if}}',
    '{{#if (not c1 (not c2))}}<img>{{/if}}',
    '{{#if condition}}<img>{{else}}<img>{{/if}}',
    '{{#if (or c1 c2)}}<img>{{else}}<img>{{/if}}',
    '{{#if condition}}<img>{{else if condition}}<img>{{/if}}',
    '{{#if condition}}<img>{{else if (not condition2)}}<img>{{/if}}',
    '{{#if (not condition)}}<img>{{else if (not condition2)}}<img>{{/if}}',
    '{{#if condition}}<img>{{else if condition}}<img>{{else}}<img>{{/if}}',
    '{{#if (not condition)}}<img>{{else if (not condition2)}}<img>{{else}}<img>{{/if}}',
    '{{#unless condition}}<img>{{/unless}}',
    '{{#unless (or c1 c2)}}<img>{{/unless}}',
    '{{#unless (not c1 c2)}}<img>{{/unless}}',
    '{{#unless condition}}<img>{{else}}<img>{{/unless}}',
    '{{#unless (or c1 c2)}}<img>{{else}}<img>{{/unless}}',
    '{{#unless condition}}<img>{{else if condition}}<img>{{/unless}}',
    '{{#unless (or c1 c2)}}<img>{{else if (or c1 c2)}}<img>{{/unless}}',
    '{{#unless condition}}<img>{{else if condition}}<img>{{else}}<img>{{/unless}}',
    '{{#unless (or c1 c2)}}<img>{{else if (or c1 c2)}}<img>{{else}}<img>{{/unless}}',
    '<img class={{if condition "some-class"}}>',
    '<img class={{if (or c1 c2) "some-class"}}>',
    '<img class={{if (not (or c1 c2)) "some-class"}}>',
    '<img class={{if (not c1 c2) "some-class"}}>',
    '<img class={{if condition "some-class" "other-class"}}>',
    '<img class={{if (or c1 c2) "some-class" "other-class"}}>',
    '<img class={{unless condition "some-class"}}>',
    '<img class={{unless (or c1 c2) "some-class"}}>',
    '<img class={{unless (not c1 c2) "some-class"}}>',
    '<img class={{unless condition "some-class" "other-class"}}>',
    '<img class={{unless (or c1 c2) "some-class" "other-class"}}>',
    '{{input class=(if condition "some-class")}}',
    '{{input class=(if (or c1 c2) "some-class")}}',
    '{{input class=(if (not (or c1 c2)) "some-class")}}',
    '{{input class=(if (not c1 c2) "some-class")}}',
    '{{input class=(if condition "some-class" "other-class")}}',
    '{{input class=(if (or c1 c2) "some-class" "other-class")}}',
    '{{input class=(unless condition "some-class")}}',
    '{{input class=(unless (or c1 c2) "some-class")}}',
    '{{input class=(unless condition "some-class" "other-class")}}',
    '{{input class=(unless (or c1 c2) "some-class" "other-class")}}',
    // simplifyHelpers: false allows nested not/eq helpers without error.
    {
      code: '{{#if (not (not c2))}}<img>{{/if}}',
      options: [{ simplifyHelpers: false }],
    },
    {
      code: '{{#if (not (eq c2))}}<img>{{/if}}',
      options: [{ simplifyHelpers: false }],
    },
  ],
  invalid: [
    {
      code: '{{#if (not condition)}}<img>{{/if}}',
      output: null,
      errors: [{ message: 'Change `if (not condition)` to `unless condition`.' }],
    },
    {
      code: '{{#if (not (not condition))}}<img>{{/if}}',
      output: null,
      errors: [{ message: 'Change `if (not condition)` to `unless condition`.' }],
    },
    {
      code: '{{#if (not (not c1 c2))}}<img>{{/if}}',
      output: null,
      errors: [{ message: 'Change `if (not condition)` to `unless condition`.' }],
    },
    {
      code: '{{#if (not (eq c1 c2))}}<img>{{/if}}',
      output: null,
      errors: [{ message: 'Change `if (not condition)` to `unless condition`.' }],
    },
    {
      code: '{{#if (not condition)}}<img>{{else}}<input>{{/if}}',
      output: null,
      errors: [
        {
          message:
            'Change `{{if (not condition)}} ... {{else}} ... {{/if}}` to `{{if condition}} ... {{else}} ... {{/if}}`.',
        },
      ],
    },
    {
      code: '{{#unless (not condition)}}<img>{{/unless}}',
      output: null,
      errors: [{ message: 'Change `unless (not condition)` to `if condition`.' }],
    },
    {
      code: '{{#unless (not (not condition))}}<img>{{/unless}}',
      output: null,
      errors: [{ message: 'Change `unless (not condition)` to `if condition`.' }],
    },
    {
      code: '{{#unless (not condition)}}<img>{{else}}<input>{{/unless}}',
      output: null,
      errors: [{ message: 'Change `unless (not condition)` to `if condition`.' }],
    },
    {
      code: '{{#unless (not (not-eq c1 c2))}}<img>{{else}}<input>{{/unless}}',
      output: null,
      errors: [{ message: 'Change `unless (not condition)` to `if condition`.' }],
    },
    {
      code: '{{#unless (not condition)}}<img>{{else if (not condition)}}<input>{{/unless}}',
      output: null,
      errors: [{ message: 'Change `unless (not condition)` to `if condition`.' }],
    },
    {
      code: '{{#unless (not (not condition))}}<img>{{else if (not (not condition))}}<input>{{/unless}}',
      output: null,
      errors: [
        { message: 'Change `unless (not condition)` to `if condition`.' },
        { message: 'Simplify unnecessary negation of helper.' },
      ],
    },
    {
      code: '{{#unless (not (gt c 10))}}<img>{{else if (not (lt c 5))}}<input>{{/unless}}',
      output: null,
      errors: [
        { message: 'Change `unless (not condition)` to `if condition`.' },
        { message: 'Simplify unnecessary negation of helper.' },
      ],
    },
    {
      code: '{{#unless (not condition)}}<img>{{else if (not condition)}}<input>{{else}}<hr>{{/unless}}',
      output: null,
      errors: [{ message: 'Change `unless (not condition)` to `if condition`.' }],
    },
    {
      code: '{{#unless (not condition)}}<img>{{else if (not (not c1 c2))}}<input>{{else}}<hr>{{/unless}}',
      output: null,
      errors: [
        { message: 'Change `unless (not condition)` to `if condition`.' },
        { message: 'Simplify unnecessary negation of helper.' },
      ],
    },
    {
      code: '{{#if condition}}{{else}}{{! some comment }}{{#if (not condition)}}<img>{{/if}}{{/if}}',
      output: null,
      errors: [{ message: 'Change `if (not condition)` to `unless condition`.' }],
    },
    {
      code: '{{#if condition}}{{else}}{{#if (not condition)}}<img>{{/if}}{{/if}}',
      output: null,
      errors: [{ message: 'Change `if (not condition)` to `unless condition`.' }],
    },
    {
      code: '<img class={{if (not condition) "some-class"}}>',
      output: null,
      errors: [{ message: 'Change `if (not condition)` to `unless condition`.' }],
    },
    {
      code: '<img class={{if (not (gte c 10)) "some-class"}}>',
      output: null,
      errors: [{ message: 'Change `if (not condition)` to `unless condition`.' }],
    },
    {
      code: '<img class={{if (not condition) "some-class" "other-class"}}>',
      output: null,
      errors: [
        {
          message:
            'Change `{{if (not condition)}} ... {{else}} ... {{/if}}` to `{{if condition}} ... {{else}} ... {{/if}}`.',
        },
      ],
    },
    {
      code: '<img class={{if (not (not condition)) "some-class" "other-class"}}>',
      output: null,
      errors: [
        {
          message:
            'Change `{{if (not condition)}} ... {{else}} ... {{/if}}` to `{{if condition}} ... {{else}} ... {{/if}}`.',
        },
      ],
    },
    {
      code: '<img class={{unless (not condition) "some-class"}}>',
      output: null,
      errors: [{ message: 'Change `unless (not condition)` to `if condition`.' }],
    },
    {
      code: '<img class={{unless (not condition) "some-class" "other-class"}}>',
      output: null,
      errors: [{ message: 'Change `unless (not condition)` to `if condition`.' }],
    },
    {
      code: '<img class={{unless (not (not condition)) "some-class" "other-class"}}>',
      output: null,
      errors: [{ message: 'Change `unless (not condition)` to `if condition`.' }],
    },
    {
      code: '{{input class=(if (not condition) "some-class")}}',
      output: null,
      errors: [{ message: 'Change `if (not condition)` to `unless condition`.' }],
    },
    {
      code: '{{input class=(if (not condition) "some-class" "other-class")}}',
      output: null,
      errors: [
        {
          message:
            'Change `{{if (not condition)}} ... {{else}} ... {{/if}}` to `{{if condition}} ... {{else}} ... {{/if}}`.',
        },
      ],
    },
    {
      code: '{{input class=(if (not (lte c 10)) "some-class" "other-class")}}',
      output: null,
      errors: [
        {
          message:
            'Change `{{if (not condition)}} ... {{else}} ... {{/if}}` to `{{if condition}} ... {{else}} ... {{/if}}`.',
        },
      ],
    },
    {
      code: '{{input class=(unless (not condition) "some-class")}}',
      output: null,
      errors: [{ message: 'Change `unless (not condition)` to `if condition`.' }],
    },
    {
      code: '{{input class=(unless (not condition) "some-class" "other-class")}}',
      output: null,
      errors: [{ message: 'Change `unless (not condition)` to `if condition`.' }],
    },
    {
      code: '{{input class=(unless (not (not condition)) "some-class" "other-class")}}',
      output: null,
      errors: [{ message: 'Change `unless (not condition)` to `if condition`.' }],
    },
  ],
});
