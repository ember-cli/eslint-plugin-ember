const rule = require('../../../lib/rules/template-modifier-name-case');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-modifier-name-case', rule, {
  valid: [
    '<template><div {{did-insert}}></div></template>',
    '<template><div {{did-update}}></div></template>',
    '<template><div {{on-click}}></div></template>',
    '<template><div {{(modifier "did-insert")}}></div></template>',
    '<template><div {{(modifier "on-click")}}></div></template>',

    '<template><div {{did-insert "something"}}></div></template>',
    '<template><div {{did-insert action=something}}></div></template>',
    '<template><button {{on "click" somethingAmazing}}></button></template>',
    '<template><button onclick={{do-a-thing "foo"}}></button></template>',
    '<template><button onclick={{doAThing "foo"}}></button></template>',
    '<template><a href="#" onclick={{amazingActionThing "foo"}} {{did-insert}}></a></template>',
    '<template><div didInsert></div></template>',
    '<template><div {{(modifier "foo-bar")}}></div></template>',
    '<template><div {{(if this.foo (modifier "foo-bar"))}}></div></template>',
    '<template><div {{(modifier this.fooBar)}}></div></template>',
  ],
  invalid: [
    {
      code: '<template><div {{didInsert}}></div></template>',
      output: '<template><div {{did-insert}}></div></template>',
      errors: [{ messageId: 'dasherized' }],
    },
    {
      code: '<template><div {{doSomething}}></div></template>',
      output: '<template><div {{do-something}}></div></template>',
      errors: [{ messageId: 'dasherized' }],
    },
    {
      code: '<template><div {{fooBar}}></div></template>',
      output: '<template><div {{foo-bar}}></div></template>',
      errors: [{ messageId: 'dasherized' }],
    },
    // PascalCase: index-0 guard prevents leading dash
    {
      code: '<template><div {{FooBar}}></div></template>',
      output: '<template><div {{foo-bar}}></div></template>',
      errors: [{ messageId: 'dasherized' }],
    },
    {
      code: '<template><div {{XFoo}}></div></template>',
      output: '<template><div {{x-foo}}></div></template>',
      errors: [{ messageId: 'dasherized' }],
    },
    // Namespaced :: → /
    {
      code: '<template><div {{Foo::barBaz}}></div></template>',
      output: '<template><div {{foo/bar-baz}}></div></template>',
      errors: [{ messageId: 'dasherized' }],
    },
    {
      code: '<template><div {{(modifier "didInsert")}}></div></template>',
      output: '<template><div {{(modifier "did-insert")}}></div></template>',
      errors: [{ messageId: 'dasherized' }],
    },

    {
      code: '<template><div class="monkey" {{didInsert "something" with="somethingElse"}}></div></template>',
      output:
        '<template><div class="monkey" {{did-insert "something" with="somethingElse"}}></div></template>',
      errors: [{ messageId: 'dasherized' }],
    },
    {
      code: '<template><a href="#" onclick={{amazingActionThing "foo"}} {{doSomething}}></a></template>',
      output:
        '<template><a href="#" onclick={{amazingActionThing "foo"}} {{do-something}}></a></template>',
      errors: [{ messageId: 'dasherized' }],
    },
    {
      code: '<template><div {{(modifier "fooBar")}}></div></template>',
      output: '<template><div {{(modifier "foo-bar")}}></div></template>',
      errors: [{ messageId: 'dasherized' }],
    },
    {
      code: '<template><div {{(if this.foo (modifier "fooBar"))}}></div></template>',
      output: '<template><div {{(if this.foo (modifier "foo-bar"))}}></div></template>',
      errors: [{ messageId: 'dasherized' }],
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

hbsRuleTester.run('template-modifier-name-case', rule, {
  valid: [
    '<div {{did-insert}}></div>',
    '<div {{did-insert "something"}}></div>',
    '<div {{did-insert action=something}}></div>',
    '<button {{on "click" somethingAmazing}}></button>',
    '<button onclick={{do-a-thing "foo"}}></button>',
    '<button onclick={{doAThing "foo"}}></button>',
    '<a href="#" onclick={{amazingActionThing "foo"}} {{did-insert}}></a>',
    '<div didInsert></div>',
    '<div {{(modifier "foo-bar")}}></div>',
    '<div {{(if this.foo (modifier "foo-bar"))}}></div>',
    '<div {{(modifier this.fooBar)}}></div>',
  ],
  invalid: [
    {
      code: '<div {{didInsert}}></div>',
      output: '<div {{did-insert}}></div>',
      errors: [{ messageId: 'dasherized' }],
    },
    {
      code: '<div class="monkey" {{didInsert "something" with="somethingElse"}}></div>',
      output: '<div class="monkey" {{did-insert "something" with="somethingElse"}}></div>',
      errors: [{ messageId: 'dasherized' }],
    },
    // PascalCase: index-0 guard prevents leading dash
    {
      code: '<div {{FooBar}}></div>',
      output: '<div {{foo-bar}}></div>',
      errors: [{ messageId: 'dasherized' }],
    },
    {
      code: '<a href="#" onclick={{amazingActionThing "foo"}} {{doSomething}}></a>',
      output: '<a href="#" onclick={{amazingActionThing "foo"}} {{do-something}}></a>',
      errors: [{ messageId: 'dasherized' }],
    },
    {
      code: '<div {{(modifier "fooBar")}}></div>',
      output: '<div {{(modifier "foo-bar")}}></div>',
      errors: [{ messageId: 'dasherized' }],
    },
    {
      code: '<div {{(if this.foo (modifier "fooBar"))}}></div>',
      output: '<div {{(if this.foo (modifier "foo-bar"))}}></div>',
      errors: [{ messageId: 'dasherized' }],
    },
  ],
});
