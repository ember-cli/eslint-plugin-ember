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

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-array-prototype-extensions (hbs)', rule, {
  valid: [
    "{{foo bar=(get this 'list.0' )}}",
    "<Foo @bar={{get this 'list.0'}} />",
    "{{get this 'list.0.foo'}}",
    "{{get this 'firstObject'}}",
    "{{get this 'lastObject.name'}}",
    '{{foo bar @list}}',
    '{{this.firstObject}}',
    '{{this.lastObject.name}}',
    '{{firstObject}}',
    '{{lastObject}}',
    '{{notfirstObject}}',
    '{{@firstObject}}',
    '{{@lastObject}}',
    '{{@lastObject.name}}',
    '{{foo bar this.firstObject}}',
    '{{foo bar this.lastObject.name}}',
    '{{foo bar @lastObject}}',
    '{{foo bar @firstObject}}',
    '{{foo bar @lastObject.name}}',
    '{{foo bar @list.notfirstObject}}',
    '{{foo bar @list.lastObjectV2}}',
    'Just a regular text in the template bar.firstObject bar.lastObject.foo',
    '<Foo foo="bar.firstObject.baz" />',
    '<Foo foo="lastObject" />',
    `<FooBar
     @subHeaderText={{if
      this.isFooBarV2Enabled
      "firstObject"
    }}
  />`,
    `<FooBar
     @subHeaderText={{if
      this.isFooBarV2Enabled
      "hi.lastObject.name"
    }}
  />`,
  ],
  invalid: [
    {
      code: '{{foo bar=@list.lastObject.test}}',
      output: null,
      errors: [{ messageId: 'lastObject' }],
    },
    {
      code: '{{this.list.lastObject}}',
      output: null,
      errors: [{ messageId: 'lastObject' }],
    },
    {
      code: "<Foo @bar={{get this 'list.lastObject'}} />",
      output: null,
      errors: [{ messageId: 'lastObject' }],
    },
    {
      code: '<div data-test={{eq this.list.firstObject.abc "def"}}>Hello</div>',
      output: null,
      errors: [{ messageId: 'firstObject' }],
    },
    {
      code: '{{foo bar=this.list.firstObject}}',
      output: null,
      errors: [{ messageId: 'firstObject' }],
    },
    {
      code: '{{this.list.firstObject}}',
      output: null,
      errors: [{ messageId: 'firstObject' }],
    },
    {
      code: '{{this.list.firstObject.name}}',
      output: null,
      errors: [{ messageId: 'firstObject' }],
    },
    {
      code: '<Foo @bar={{@list.firstObject}} />',
      output: null,
      errors: [{ messageId: 'firstObject' }],
    },
    {
      code: '<Foo @bar={{this.list.firstObject.name.foo}} />',
      output: null,
      errors: [{ messageId: 'firstObject' }],
    },
    {
      code: "<Foo @bar={{get this 'list.firstObject'}} />",
      output: null,
      errors: [{ messageId: 'firstObject' }],
    },
    {
      code: "<Foo @bar={{get @list 'firstObject.name'}} />",
      output: null,
      errors: [{ messageId: 'firstObject' }],
    },
  ],
});
