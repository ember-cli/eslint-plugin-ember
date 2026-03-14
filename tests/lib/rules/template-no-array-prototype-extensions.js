const rule = require('../../../lib/rules/template-no-array-prototype-extensions');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-array-prototype-extensions', rule, {
  valid: [
    '<template>{{this.items.[0]}}</template>',
    '<template>{{get this.items 0}}</template>',
    '<template>{{this.users}}</template>',
    '<template>{{@items}}</template>',
    '<template>{{firstObject}}</template>',
    '<template>{{length}}</template>',
  ],

  invalid: [
    // firstObject — basic path in MustacheStatement
    {
      code: '<template>{{this.items.firstObject}}</template>',
      output: '<template>{{get this.items "0"}}</template>',
      errors: [{ messageId: 'firstObject' }],
    },
    // firstObject — path with trailing property
    {
      code: '<template>{{this.items.firstObject.name}}</template>',
      output: '<template>{{get this.items "0.name"}}</template>',
      errors: [{ messageId: 'firstObject' }],
    },
    // firstObject — deeper path
    {
      code: '<template>{{this.model.items.firstObject}}</template>',
      output: '<template>{{get this.model.items "0"}}</template>',
      errors: [{ messageId: 'firstObject' }],
    },
    // firstObject — in get helper string literal
    {
      code: '<template>{{get @model "items.firstObject"}}</template>',
      output: '<template>{{get @model "items.0"}}</template>',
      errors: [{ messageId: 'firstObject' }],
    },
    // firstObject — in get helper string literal with trailing property
    {
      code: '<template>{{get @model "items.firstObject.name"}}</template>',
      output: '<template>{{get @model "items.0.name"}}</template>',
      errors: [{ messageId: 'firstObject' }],
    },
    // firstObject — in hash argument context
    {
      code: '<template>{{foo bar=this.list.firstObject}}</template>',
      output: '<template>{{foo bar=(get this.list "0")}}</template>',
      errors: [{ messageId: 'firstObject' }],
    },
    // firstObject — @arg prefix path
    {
      code: '<template><Foo @bar={{@list.firstObject}} /></template>',
      output: '<template><Foo @bar={{get @list "0"}} /></template>',
      errors: [{ messageId: 'firstObject' }],
    },
    // firstObject — deeper path with trailing properties
    {
      code: '<template><Foo @bar={{this.list.firstObject.name.foo}} /></template>',
      output: '<template><Foo @bar={{get this.list "0.name.foo"}} /></template>',
      errors: [{ messageId: 'firstObject' }],
    },
    // firstObject — subexpression param context
    {
      code: '<template><div data-test={{eq this.list.firstObject.abc "def"}}>Hello</div></template>',
      output:
        '<template><div data-test={{eq (get this.list "0.abc") "def"}}>Hello</div></template>',
      errors: [{ messageId: 'firstObject' }],
    },
    // lastObject — no fix available
    {
      code: '<template>{{this.users.lastObject}}</template>',
      output: null,
      errors: [{ messageId: 'lastObject' }],
    },
    // lastObject — deeper path, no fix
    {
      code: '<template>{{this.users.lastObject.name}}</template>',
      output: null,
      errors: [{ messageId: 'lastObject' }],
    },
  ],
});
