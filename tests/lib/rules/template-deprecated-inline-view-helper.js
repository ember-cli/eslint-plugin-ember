const rule = require('../../../lib/rules/template-deprecated-inline-view-helper');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-deprecated-inline-view-helper', rule, {
  valid: [
    '<template><MyComponent /></template>',
    '<template>{{view}}</template>',
    '<template>{{great-fishsticks}}</template>',
    '<template>{{input placeholder=(t "email") value=email}}</template>',
    '<template>{{title "CrossCheck Web" prepend=true separator=" | "}}</template>',
    '<template>{{false}}</template>',
    '<template>{{"foo"}}</template>',
    '<template>{{42}}</template>',
    '<template>{{null}}</template>',
    '<template>{{undefined}}</template>',
    '<template>{{has-block "view"}}</template>',
    '<template>{{yield to="view"}}</template>',
    '<template>{{#if (has-block "view")}}{{yield to="view"}}{{/if}}</template>',
    '<template>{{this.view}}</template>',
    '<template>{{@view}}</template>',
    '<template>{{#let this.prop as |view|}} {{view}} {{/let}}</template>',
    // isLocal: view is a block param, view.name should not be flagged
    '<template>{{#each items as |view|}} {{view.name}} {{/each}}</template>',
    // yield with view hash pair should not be flagged
    '<template>{{yield hash=view.foo}}</template>',
    // hash pair with key "to" should not be flagged
    '<template>{{some-component to=view.foo}}</template>',
    // Rule is HBS-only: `view` in GJS/GTS may be a legitimate imported JS binding
    {
      filename: 'test.gjs',
      code: "<template>{{view 'awful-fishsticks'}}</template>",
    },
    {
      filename: 'test.gts',
      code: '<template>{{view.bad-fishsticks}}</template>',
    },
  ],
  invalid: [
    {
      code: '<template>{{view class="foo"}}</template>',
      output: null,
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: "<template>{{view 'awful-fishsticks'}}</template>",
      output: '<template>{{awful-fishsticks}}</template>',
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<template>{{view.bad-fishsticks}}</template>',
      output: '<template>{{bad-fishsticks}}</template>',
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<template>{{view.terrible.fishsticks}}</template>',
      output: '<template>{{terrible.fishsticks}}</template>',
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<template>{{foo-bar bab=good baz=view.qux.qaz boo=okay}}</template>',
      output: '<template>{{foo-bar bab=good baz=qux.qaz boo=okay}}</template>',
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<template><div class={{view.something}}></div></template>',
      output: '<template><div class={{something}}></div></template>',
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<template><div class="whatever-class" data-foo={{view.hallo}} sure=thing></div></template>',
      output:
        '<template><div class="whatever-class" data-foo={{hallo}} sure=thing></div></template>',
      errors: [{ messageId: 'deprecated' }],
    },
    {
      code: '<template>{{#foo-bar derp=view.whoops thing=whatever}}{{/foo-bar}}</template>',
      output: '<template>{{#foo-bar derp=whoops thing=whatever}}{{/foo-bar}}</template>',
      errors: [{ messageId: 'deprecated' }],
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

hbsRuleTester.run('template-deprecated-inline-view-helper', rule, {
  valid: [
    '{{great-fishsticks}}',
    '{{input placeholder=(t "email") value=email}}',
    '{{title "CrossCheck Web" prepend=true separator=" | "}}',
    '{{false}}',
    '{{"foo"}}',
    '{{42}}',
    '{{null}}',
    '{{undefined}}',
    '{{has-block "view"}}',
    '{{yield to="view"}}',
    '{{#if (has-block "view")}}{{yield to="view"}}{{/if}}',
    '{{this.view}}',
    '{{@view}}',
    '{{#let this.prop as |view|}} {{view}} {{/let}}',
    // isLocal: view is a block param, view.name should not be flagged
    '{{#each items as |view|}} {{view.name}} {{/each}}',
    // yield with view hash pair should not be flagged
    '{{yield hash=view.foo}}',
    // hash pair with key "to" should not be flagged
    '{{some-component to=view.foo}}',
  ],
  invalid: [
    {
      code: "{{view 'awful-fishsticks'}}",
      output: '{{awful-fishsticks}}',
      errors: [
        {
          message:
            'The inline form of `view` is deprecated. Please use `Ember.Component` instead. See http://emberjs.com/deprecations/v1.x/#toc_ember-view',
        },
      ],
    },
    {
      code: '{{view.bad-fishsticks}}',
      output: '{{bad-fishsticks}}',
      errors: [
        {
          message:
            'The inline form of `view` is deprecated. Please use `Ember.Component` instead. See http://emberjs.com/deprecations/v1.x/#toc_ember-view',
        },
      ],
    },
    {
      code: '{{view.terrible.fishsticks}}',
      output: '{{terrible.fishsticks}}',
      errors: [
        {
          message:
            'The inline form of `view` is deprecated. Please use `Ember.Component` instead. See http://emberjs.com/deprecations/v1.x/#toc_ember-view',
        },
      ],
    },
    {
      code: '{{foo-bar bab=good baz=view.qux.qaz boo=okay}}',
      output: '{{foo-bar bab=good baz=qux.qaz boo=okay}}',
      errors: [
        {
          message:
            'The inline form of `view` is deprecated. Please use `Ember.Component` instead. See http://emberjs.com/deprecations/v1.x/#toc_ember-view',
        },
      ],
    },
    {
      code: '<div class={{view.something}}></div>',
      output: '<div class={{something}}></div>',
      errors: [
        {
          message:
            'The inline form of `view` is deprecated. Please use `Ember.Component` instead. See http://emberjs.com/deprecations/v1.x/#toc_ember-view',
        },
      ],
    },
    {
      code: '<div class="whatever-class" data-foo={{view.hallo}} sure=thing></div>',
      output: '<div class="whatever-class" data-foo={{hallo}} sure=thing></div>',
      errors: [
        {
          message:
            'The inline form of `view` is deprecated. Please use `Ember.Component` instead. See http://emberjs.com/deprecations/v1.x/#toc_ember-view',
        },
      ],
    },
    {
      code: '{{#foo-bar derp=view.whoops thing=whatever}}{{/foo-bar}}',
      output: '{{#foo-bar derp=whoops thing=whatever}}{{/foo-bar}}',
      errors: [
        {
          message:
            'The inline form of `view` is deprecated. Please use `Ember.Component` instead. See http://emberjs.com/deprecations/v1.x/#toc_ember-view',
        },
      ],
    },
  ],
});
