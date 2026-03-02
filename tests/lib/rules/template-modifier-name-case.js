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
      errors: [
        {
          message:
            'Use dasherized names for modifier invocation. Please replace `didInsert` with `did-insert`.',
        },
      ],
    },
    {
      code: '<template><div {{doSomething}}></div></template>',
      output: '<template><div {{do-something}}></div></template>',
      errors: [
        {
          message:
            'Use dasherized names for modifier invocation. Please replace `doSomething` with `do-something`.',
        },
      ],
    },
    {
      code: '<template><div {{fooBar}}></div></template>',
      output: '<template><div {{foo-bar}}></div></template>',
      errors: [
        {
          message:
            'Use dasherized names for modifier invocation. Please replace `fooBar` with `foo-bar`.',
        },
      ],
    },
    {
      code: '<template><div {{(modifier "didInsert")}}></div></template>',
      output: '<template><div {{(modifier "did-insert")}}></div></template>',
      errors: [
        {
          message:
            'Use dasherized names for modifier invocation. Please replace `didInsert` with `did-insert`.',
        },
      ],
    },

    {
      code: '<template><div class="monkey" {{didInsert "something" with="somethingElse"}}></div></template>',
      output:
        '<template><div class="monkey" {{did-insert "something" with="somethingElse"}}></div></template>',
      errors: [
        {
          message:
            'Use dasherized names for modifier invocation. Please replace `didInsert` with `did-insert`.',
        },
      ],
    },
    {
      code: '<template><a href="#" onclick={{amazingActionThing "foo"}} {{doSomething}}></a></template>',
      output:
        '<template><a href="#" onclick={{amazingActionThing "foo"}} {{do-something}}></a></template>',
      errors: [
        {
          message:
            'Use dasherized names for modifier invocation. Please replace `doSomething` with `do-something`.',
        },
      ],
    },
    {
      code: '<template><div {{(modifier "fooBar")}}></div></template>',
      output: '<template><div {{(modifier "foo-bar")}}></div></template>',
      errors: [
        {
          message:
            'Use dasherized names for modifier invocation. Please replace `fooBar` with `foo-bar`.',
        },
      ],
    },
    {
      code: '<template><div {{(if this.foo (modifier "fooBar"))}}></div></template>',
      output: '<template><div {{(if this.foo (modifier "foo-bar"))}}></div></template>',
      errors: [
        {
          message:
            'Use dasherized names for modifier invocation. Please replace `fooBar` with `foo-bar`.',
        },
      ],
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
      errors: [
        { message: 'Use dasherized names for modifier invocation. Please replace `didInsert` with `did-insert`.' },
      ],
    },
    {
      code: '<div class="monkey" {{didInsert "something" with="somethingElse"}}></div>',
      output: '<div class="monkey" {{did-insert "something" with="somethingElse"}}></div>',
      errors: [
        { message: 'Use dasherized names for modifier invocation. Please replace `didInsert` with `did-insert`.' },
      ],
    },
    {
      code: '<a href="#" onclick={{amazingActionThing "foo"}} {{doSomething}}></a>',
      output: '<a href="#" onclick={{amazingActionThing "foo"}} {{do-something}}></a>',
      errors: [
        { message: 'Use dasherized names for modifier invocation. Please replace `doSomething` with `do-something`.' },
      ],
    },
    {
      code: '<div {{(modifier "fooBar")}}></div>',
      output: '<div {{(modifier "foo-bar")}}></div>',
      errors: [
        { message: 'Use dasherized names for modifier invocation. Please replace `fooBar` with `foo-bar`.' },
      ],
    },
    {
      code: '<div {{(if this.foo (modifier "fooBar"))}}></div>',
      output: '<div {{(if this.foo (modifier "foo-bar"))}}></div>',
      errors: [
        { message: 'Use dasherized names for modifier invocation. Please replace `fooBar` with `foo-bar`.' },
      ],
    },
  ],
});
