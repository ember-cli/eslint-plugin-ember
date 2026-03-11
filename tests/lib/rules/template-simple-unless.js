//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-simple-unless');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-simple-unless', rule, {
  valid: [
    '<template>{{#unless isHidden}}Show{{/unless}}</template>',
    '<template>{{#unless @disabled}}Enabled{{/unless}}</template>',

    "<template>{{#unless isRed}}I'm blue, da ba dee da ba daa{{/unless}}</template>",
    '<template><div class="{{unless foo \'no-foo\'}}"></div></template>',
    '<template><div class="{{if foo \'foo\'}}"></div></template>',
    '<template>{{unrelated-mustache-without-params}}</template>',
    '<template>{{#if foo}}{{else}}{{/if}}</template>',
    '<template>{{#if foo}}{{else}}{{#unless bar}}{{/unless}}{{/if}}</template>',
    '<template>{{#if foo}}{{else}}{{unless bar someProperty}}{{/if}}</template>',
    '<template>{{#unless (or foo bar)}}order whiskey{{/unless}}</template>',
    {
      code: '<template>{{#unless (eq (or foo bar) baz)}}order whiskey{{/unless}}</template>',
      options: [{ maxHelpers: 2 }],
    },
    '<template>{{#unless hamburger}}\\n  HOT DOG!\\n{{/unless}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{#unless (eq value 1)}}Not one{{/unless}}</template>',
      output: null,
      options: [{ maxHelpers: 0 }],
      errors: [{ messageId: 'withHelper' }],
    },
    {
      code: '<template>{{#unless (or a b)}}Neither{{/unless}}</template>',
      output: null,
      options: [{ maxHelpers: 0 }],
      errors: [{ messageId: 'withHelper' }],
    },

    {
      code: "<template>{{unless (if true)  'Please no'}}</template>",
      output: null,
      options: [{ maxHelpers: 0 }],
      errors: [{ messageId: 'withHelper' }],
    },
    {
      code: "<template>{{unless (and isBad isAwful)  'notBadAndAwful'}}</template>",
      output: null,
      options: [{ maxHelpers: 0 }],
      errors: [{ messageId: 'withHelper' }],
    },
    {
      code: '<template><img class={{unless (not condition) "some-class"}}></template>',
      output: null,
      options: [{ maxHelpers: 0 }],
      errors: [{ messageId: 'withHelper' }],
    },
    {
      code: '<template><img class={{unless (one condition) "some-class" "other-class"}}></template>',
      output: null,
      options: [{ maxHelpers: 0 }],
      errors: [{ messageId: 'withHelper' }],
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

hbsRuleTester.run('template-simple-unless', rule, {
  valid: [
    "{{#unless isRed}}I'm blue, da ba dee da ba daa{{/unless}}",
    '<div class="{{unless foo \'no-foo\'}}"></div>',
    '<div class="{{if foo \'foo\'}}"></div>',
    '{{unrelated-mustache-without-params}}',
    '{{#if foo}}{{else}}{{/if}}',
    '{{#if foo}}{{else}}{{#unless bar}}{{/unless}}{{/if}}',
    '{{#if foo}}{{else}}{{unless bar someProperty}}{{/if}}',
    '{{#unless (or foo bar)}}order whiskey{{/unless}}',
    {
      code: '{{#unless (eq (or foo bar) baz)}}order whiskey{{/unless}}',
      options: [{ maxHelpers: 2 }],
    },
    '{{unless foo bar}}',
    '{{unless (eq foo bar) baz}}',
    '{{unless (and isBad isAwful) "notBadAndAwful"}}',
    '<img class={{unless (not condition) "some-class"}}>',
    '<img class={{unless (one condition) "some-class" "other-class"}}>',
    ['{{#unless hamburger}}', '  HOT DOG!', '{{/unless}}'].join('\n'),
    // allowlist + maxHelpers
    {
      code: '{{unless (eq foo bar) baz}}',
      options: [{ allowlist: ['or', 'eq', 'not-eq'], maxHelpers: 2 }],
    },
    {
      code: '{{#unless (eq foo bar)}}baz{{/unless}}',
      options: [{ allowlist: ['or', 'eq', 'not-eq'], maxHelpers: 2 }],
    },
    {
      code: '{{unless (eq (not foo) bar) baz}}',
      options: [{ allowlist: [], maxHelpers: 2 }],
    },
    {
      code: '{{#unless (eq (not foo) bar)}}baz{{/unless}}',
      options: [{ allowlist: [], maxHelpers: 2 }],
    },
    {
      code: '{{#unless (eq (not foo) bar)}}baz{{/unless}}',
      options: [{ maxHelpers: 2 }],
    },
    {
      code: '{{#unless (eq (not foo) bar)}}baz{{/unless}}',
      options: [{ maxHelpers: -1 }],
    },
    {
      code: '{{#unless (eq (not foo) bar)}}baz{{/unless}}',
      options: [{ maxHelpers: -1, denylist: [] }],
    },
    {
      code: '{{#unless (eq (not foo) bar)}}baz{{/unless}}',
      options: [{ maxHelpers: -1, denylist: ['or'] }],
    },
    // valid with ETL-style allowlist config: helpers in allowlist, count within maxHelpers
    {
      code: '{{#unless (or foo bar)}}order whiskey{{/unless}}',
      options: [{ allowlist: ['or', 'eq', 'not-eq'], maxHelpers: 2 }],
    },
    {
      code: '{{#unless (eq (or foo bar) baz)}}order whiskey{{/unless}}',
      options: [{ allowlist: ['or', 'eq', 'not-eq'], maxHelpers: 2 }],
    },
  ],
  invalid: [
    // inline unless with nested helpers (exceeds default maxHelpers=1)
    {
      code: "{{unless (if (or true))  'Please no'}}",
      output: null,
      errors: [{ messageId: 'withHelper' }],
    },
    // inline unless with helper — maxHelpers: 0
    {
      code: "{{unless (if true)  'Please no'}}",
      output: null,
      options: [{ maxHelpers: 0 }],
      errors: [{ messageId: 'withHelper' }],
    },
    {
      code: "{{unless (and isBad isAwful)  'notBadAndAwful'}}",
      output: null,
      options: [{ maxHelpers: 0 }],
      errors: [{ messageId: 'withHelper' }],
    },
    {
      code: '<img class={{unless (not condition) "some-class"}}>',
      output: null,
      options: [{ maxHelpers: 0 }],
      errors: [{ messageId: 'withHelper' }],
    },
    {
      code: '<img class={{unless (one condition) "some-class" "other-class"}}>',
      output: null,
      options: [{ maxHelpers: 0 }],
      errors: [{ messageId: 'withHelper' }],
    },
    // {{else}} block with {{unless}}
    {
      code: [
        '{{#unless bandwagoner}}',
        '  Go Niners!',
        '{{else}}',
        '  Go Seahawks!',
        '{{/unless}}',
      ].join('\n'),
      output: null,
      errors: [{ messageId: 'followingElseBlock' }],
    },
    {
      code: ['{{#unless bandwagoner}}', 'Test1', '{{else}}', 'Test2', '{{/unless}}'].join('\n'),
      output: null,
      errors: [{ messageId: 'followingElseBlock' }],
    },
    {
      code: [
        '{{#unless bandwagoner}}',
        '{{else}}',
        '  {{#my-component}}',
        '  {{/my-component}}',
        '{{/unless}}',
      ].join('\n'),
      output: null,
      errors: [{ messageId: 'followingElseBlock' }],
    },
    // {{else if}} with {{unless}}
    {
      code: [
        '{{#unless bandwagoner}}',
        '  Go Niners!',
        '{{else if goHawks}}',
        '  Go Seahawks!',
        '{{/unless}}',
      ].join('\n'),
      output: null,
      errors: [{ messageId: 'followingElseBlock' }],
    },
    {
      code: [
        '{{#unless bandwagoner}}',
        '  Go Niners!',
        '{{else if goPats}}',
        '  Tom Brady is GOAT',
        '{{else if goHawks}}',
        '  Go Seahawks!',
        '{{/unless}}',
      ].join('\n'),
      output: null,
      errors: [{ messageId: 'followingElseBlock' }],
    },
    {
      code: [
        '{{#unless bandwagoner}}',
        '  Go Niners!',
        '{{else if goBengals}}',
        '  Ouch, sorry',
        '{{else}}',
        '  Go Seahawks!',
        '{{/unless}}',
      ].join('\n'),
      output: null,
      errors: [{ messageId: 'followingElseBlock' }],
    },
    // {{else unless}}
    {
      code: ['{{#if dog}}', '  Ruff Ruff!', '{{else unless cat}}', '  not cat', '{{/if}}'].join(
        '\n'
      ),
      output: null,
      errors: [{ messageId: 'asElseUnlessBlock' }],
    },
    // block unless with disallowed helper (via allowlist)
    {
      code: ['{{#unless (and isFruit isYellow)}}', '  I am a green celery!', '{{/unless}}'].join(
        '\n'
      ),
      output: null,
      options: [{ allowlist: ['or', 'eq', 'not-eq'], maxHelpers: 2 }],
      errors: [{ messageId: 'withHelper' }],
    },
    {
      code: [
        '{{#unless (not isBrown isSticky)}}',
        '  I think I am a brown stick',
        '{{/unless}}',
      ].join('\n'),
      output: null,
      options: [{ allowlist: ['or', 'eq', 'not-eq'], maxHelpers: 2 }],
      errors: [{ messageId: 'withHelper' }],
    },
    {
      code: ['{{#unless (not isBrown)}}', '  I think I am a brown', '{{/unless}}'].join('\n'),
      output: null,
      options: [{ allowlist: ['or', 'eq', 'not-eq'], maxHelpers: 2 }],
      errors: [{ messageId: 'withHelper' }],
    },
    {
      code: [
        '{{#unless isSticky}}',
        '  I think I am a brown stick',
        '{{else}}',
        '  Not a brown stick',
        '{{/unless}}',
      ].join('\n'),
      output: null,
      errors: [{ messageId: 'followingElseBlock' }],
    },
    // maxHelpers exceeded (top-level params only)
    {
      code: [
        '{{#unless (or foo bar) (eq baz beer) (not-eq x y)}}',
        '  MUCH HELPERS, VERY BAD',
        '{{/unless}}',
      ].join('\n'),
      output: null,
      options: [{ allowlist: ['or', 'eq', 'not-eq'], maxHelpers: 2 }],
      errors: [{ messageId: 'withHelper' }],
    },
    // maxHelpers: 0
    {
      code: [
        '{{#unless (concat "blue" "red")}}',
        '  I think I am a brown stick',
        '{{/unless}}',
      ].join('\n'),
      output: null,
      options: [{ maxHelpers: 0 }],
      errors: [{ messageId: 'withHelper' }],
    },
    // allowlist — helper not in allowlist
    {
      code: ['{{#unless (one foo bar)}}', '  I think I am a brown stick', '{{/unless}}'].join('\n'),
      output: null,
      options: [{ allowlist: ['test'], maxHelpers: 1 }],
      errors: [{ messageId: 'withHelper' }],
    },
    // maxHelpers exceeded with multiple top-level subexpressions
    {
      code: [
        '{{#unless (one foo) (two bar) (three baz)}}',
        '  I think I am a brown stick',
        '{{/unless}}',
      ].join('\n'),
      output: null,
      options: [{ maxHelpers: 2 }],
      errors: [{ messageId: 'withHelper' }],
    },
    // denylist — helper in denylist
    {
      code: ['{{#unless (two three)}}', '  I think I am a brown stick', '{{/unless}}'].join('\n'),
      output: null,
      options: [{ denylist: ['two'], maxHelpers: -1 }],
      errors: [{ messageId: 'withHelper' }],
    },
    {
      code: ['{{#unless (two three)}}', '  I think I am a brown stick', '{{/unless}}'].join('\n'),
      output: null,
      options: [{ denylist: ['two', 'four'], maxHelpers: -1 }],
      errors: [{ messageId: 'withHelper' }],
    },
    // --- ETL-equivalent invalid cases with allowlist config ---
    // allowlist violation: `if` not in allowlist (ETL bad case: {{unless (if (or true)) ...}})
    {
      code: "{{unless (if (or true))  'Please no'}}",
      output: null,
      options: [{ allowlist: ['or', 'eq', 'not-eq'], maxHelpers: 2 }],
      errors: [{ messageId: 'withHelper' }],
    },
    // allowlist violation: `if` not in allowlist (ETL bad case: {{unless (if true) ...}})
    {
      code: "{{unless (if true)  'Please no'}}",
      output: null,
      options: [{ allowlist: ['or', 'eq', 'not-eq'], maxHelpers: 2 }],
      errors: [{ messageId: 'withHelper' }],
    },
    // allowlist violation: `and` not in allowlist (ETL bad case: {{unless (and isBad isAwful) ...}})
    {
      code: "{{unless (and isBad isAwful)  'notBadAndAwful'}}",
      output: null,
      options: [{ allowlist: ['or', 'eq', 'not-eq'], maxHelpers: 2 }],
      errors: [{ messageId: 'withHelper' }],
    },
    // allowlist violation: `not` not in allowlist (ETL bad case: inline unless with not)
    {
      code: '<img class={{unless (not condition) "some-class"}}>',
      output: null,
      options: [{ allowlist: ['or', 'eq', 'not-eq'], maxHelpers: 2 }],
      errors: [{ messageId: 'withHelper' }],
    },
    // allowlist violation: `one` not in allowlist (ETL bad case: inline unless with one)
    {
      code: '<img class={{unless (one condition) "some-class" "other-class"}}>',
      output: null,
      options: [{ allowlist: ['or', 'eq', 'not-eq'], maxHelpers: 2 }],
      errors: [{ messageId: 'withHelper' }],
    },
    // maxHelpers exceeded with nested allowed helpers (ETL bad case: 3 helpers > maxHelpers 2)
    {
      code: [
        '{{#unless (or (eq foo bar) (not-eq baz "beer"))}}',
        '  MUCH HELPERS, VERY BAD',
        '{{/unless}}',
      ].join('\n'),
      output: null,
      options: [{ allowlist: ['or', 'eq', 'not-eq'], maxHelpers: 2 }],
      errors: [{ messageId: 'withHelper' }],
    },
    // allowlist violation with nested helpers (ETL bad case: allowlist=['test'], one not in allowlist)
    {
      code: [
        '{{#unless (one (test power) two)}}',
        '  I think I am a brown stick',
        '{{/unless}}',
      ].join('\n'),
      output: null,
      options: [{ allowlist: ['test'], maxHelpers: 1 }],
      errors: [{ messageId: 'withHelper' }],
    },
    // maxHelpers exceeded with empty allowlist and nested helpers (ETL bad case: 3 helpers > maxHelpers 2)
    {
      code: [
        '{{#unless (one (two three) (four five))}}',
        '  I think I am a brown stick',
        '{{/unless}}',
      ].join('\n'),
      output: null,
      options: [{ allowlist: [], maxHelpers: 2 }],
      errors: [{ messageId: 'withHelper' }],
    },
    // denylist with nested helpers (ETL bad case: denylist=['two'], two is in nested position)
    {
      code: [
        '{{#unless (one (two three) (four five))}}',
        '  I think I am a brown stick',
        '{{/unless}}',
      ].join('\n'),
      output: null,
      options: [{ denylist: ['two'], maxHelpers: -1 }],
      errors: [{ messageId: 'withHelper' }],
    },
    // multi-item denylist with nested helpers (ETL bad case: denylist=['two','four'])
    {
      code: [
        '{{#unless (one (two three) (four five))}}',
        '  I think I am a brown stick',
        '{{/unless}}',
      ].join('\n'),
      output: null,
      options: [{ denylist: ['two', 'four'], maxHelpers: -1 }],
      errors: [{ messageId: 'withHelper' }],
    },
    // denylist violation: `one` in denylist (ETL-style with denylist=['one'])
    {
      code: [
        '{{#unless (one (two three) (four five))}}',
        '  I think I am a brown stick',
        '{{/unless}}',
      ].join('\n'),
      output: null,
      options: [{ denylist: ['one'], maxHelpers: -1 }],
      errors: [{ messageId: 'withHelper' }],
    },
  ],
});
