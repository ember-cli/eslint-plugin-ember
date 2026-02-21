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
  
    // Test cases ported from ember-template-lint
    "<template>{{foo bar=(get this 'list.0' )}}</template>",
    "<template><Foo @bar={{get this 'list.0'}} /></template>",
    "<template>{{get this 'list.0.foo'}}</template>",
    "<template>{{get this 'firstObject'}}</template>",
    "<template>{{get this 'lastObject.name'}}</template>",
    '<template>{{foo bar @list}}</template>',
    '<template>{{this.firstObject}}</template>',
    '<template>{{this.lastObject.name}}</template>',
    '<template>{{lastObject}}</template>',
    '<template>{{notfirstObject}}</template>',
    '<template>{{@firstObject}}</template>',
    '<template>{{@lastObject}}</template>',
    '<template>{{@lastObject.name}}</template>',
    '<template>{{foo bar this.firstObject}}</template>',
    '<template>{{foo bar this.lastObject.name}}</template>',
    '<template>{{foo bar @lastObject}}</template>',
    '<template>{{foo bar @firstObject}}</template>',
    '<template>{{foo bar @lastObject.name}}</template>',
    '<template>{{foo bar @list.notfirstObject}}</template>',
    '<template>{{foo bar @list.lastObjectV2}}</template>',
    '<template>Just a regular text in the template bar.firstObject bar.lastObject.foo</template>',
    '<template><Foo foo="bar.firstObject.baz" /></template>',
    '<template><Foo foo="lastObject" /></template>',
    `<template><FooBar
     @subHeaderText={{if
      this.isFooBarV2Enabled
      "firstObject"
    }}
  /></template>`,
    `<template><FooBar
     @subHeaderText={{if
      this.isFooBarV2Enabled
      "hi.lastObject.name"
    }}
  /></template>`,
  ],

  invalid: [
    {
      code: '<template>{{this.items.firstObject}}</template>',
      output: null,
      errors: [{ messageId: 'firstObject' }],
    },
    {
      code: '<template>{{this.users.lastObject}}</template>',
      output: null,
      errors: [{ messageId: 'lastObject' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template>{{foo bar=@list.lastObject.test}}</template>',
      output: null,
      errors: [{ messageId: 'lastObject' }],
    },
    {
      code: '<template>{{this.list.lastObject}}</template>',
      output: null,
      errors: [{ messageId: 'lastObject' }],
    },
    {
      code: "<template><Foo @bar={{get this 'list.lastObject'}} /></template>",
      output: null,
      errors: [{ messageId: 'lastObject' }],
    },
    {
      code: '<template><div data-test={{eq this.list.firstObject.abc "def"}}>Hello</div></template>',
      output: null,
      errors: [{ messageId: 'firstObject' }],
    },
    {
      code: '<template>{{foo bar=this.list.firstObject}}</template>',
      output: null,
      errors: [{ messageId: 'firstObject' }],
    },
    {
      code: '<template>{{this.list.firstObject}}</template>',
      output: null,
      errors: [{ messageId: 'firstObject' }],
    },
    {
      code: '<template>{{this.list.firstObject.name}}</template>',
      output: null,
      errors: [{ messageId: 'firstObject' }],
    },
    {
      code: '<template><Foo @bar={{@list.firstObject}} /></template>',
      output: null,
      errors: [{ messageId: 'firstObject' }],
    },
    {
      code: '<template><Foo @bar={{this.list.firstObject.name.foo}} /></template>',
      output: null,
      errors: [{ messageId: 'firstObject' }],
    },
    {
      code: "<template><Foo @bar={{get this 'list.firstObject'}} /></template>",
      output: null,
      errors: [{ messageId: 'firstObject' }],
    },
    {
      code: "<template><Foo @bar={{get @list 'firstObject.name'}} /></template>",
      output: null,
      errors: [{ messageId: 'firstObject' }],
    },
  ],
});
