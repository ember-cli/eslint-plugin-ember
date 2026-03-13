const rule = require('../../../lib/rules/template-modifier-name-case');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-modifier-name-case', rule, {
  // Rule is HBS-only: hyphenated identifiers are not valid JS, so camelCase
  // modifier names in .gjs/.gts files are intentional and must not be flagged.
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
    // camelCase modifiers in GJS are not flagged — hyphenated names are invalid JS identifiers
    '<template><div {{didInsert}}></div></template>',
    '<template><div {{doSomething}}></div></template>',
    '<template><div {{fooBar}}></div></template>',
    '<template><div {{FooBar}}></div></template>',
    '<template><div {{(modifier "fooBar")}}></div></template>',
  ],
  invalid: [],
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
    { filename: 'test.hbs', code: '<div {{did-insert}}></div>' },
    { filename: 'test.hbs', code: '<div {{did-insert "something"}}></div>' },
    { filename: 'test.hbs', code: '<div {{did-insert action=something}}></div>' },
    { filename: 'test.hbs', code: '<button {{on "click" somethingAmazing}}></button>' },
    { filename: 'test.hbs', code: '<button onclick={{do-a-thing "foo"}}></button>' },
    { filename: 'test.hbs', code: '<button onclick={{doAThing "foo"}}></button>' },
    {
      filename: 'test.hbs',
      code: '<a href="#" onclick={{amazingActionThing "foo"}} {{did-insert}}></a>',
    },
    { filename: 'test.hbs', code: '<div didInsert></div>' },
    { filename: 'test.hbs', code: '<div {{(modifier "foo-bar")}}></div>' },
    { filename: 'test.hbs', code: '<div {{(if this.foo (modifier "foo-bar"))}}></div>' },
    { filename: 'test.hbs', code: '<div {{(modifier this.fooBar)}}></div>' },
  ],
  invalid: [
    {
      filename: 'test.hbs',
      code: '<div {{didInsert}}></div>',
      output: '<div {{did-insert}}></div>',
      errors: [{ messageId: 'dasherized' }],
    },
    {
      filename: 'test.hbs',
      code: '<div class="monkey" {{didInsert "something" with="somethingElse"}}></div>',
      output: '<div class="monkey" {{did-insert "something" with="somethingElse"}}></div>',
      errors: [{ messageId: 'dasherized' }],
    },
    // PascalCase: index-0 guard prevents leading dash
    {
      filename: 'test.hbs',
      code: '<div {{FooBar}}></div>',
      output: '<div {{foo-bar}}></div>',
      errors: [{ messageId: 'dasherized' }],
    },
    {
      filename: 'test.hbs',
      code: '<a href="#" onclick={{amazingActionThing "foo"}} {{doSomething}}></a>',
      output: '<a href="#" onclick={{amazingActionThing "foo"}} {{do-something}}></a>',
      errors: [{ messageId: 'dasherized' }],
    },
    {
      filename: 'test.hbs',
      code: '<div {{(modifier "fooBar")}}></div>',
      output: '<div {{(modifier "foo-bar")}}></div>',
      errors: [{ messageId: 'dasherized' }],
    },
    {
      filename: 'test.hbs',
      code: '<div {{(if this.foo (modifier "fooBar"))}}></div>',
      output: '<div {{(if this.foo (modifier "foo-bar"))}}></div>',
      errors: [{ messageId: 'dasherized' }],
    },
  ],
});
