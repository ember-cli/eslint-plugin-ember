const rule = require('../../../lib/rules/template-no-action-modifiers');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-action-modifiers', rule, {
  valid: [
    '<template><button {{on "click" this.handleClick}}>Click</button></template>',
    '<template><div {{on "mouseenter" this.onHover}}>Hover</div></template>',
    '<template><form {{on "submit" this.handleSubmit}}>Submit</form></template>',
    '<template>{{action "myAction"}}</template>',
    '<template>{{this.action}}</template>',
    '<template>{{@action}}</template>',

    '<template><button onclick={{action "foo"}}></button></template>',
    '<template><a href="#" onclick={{action "foo"}}></a></template>',
    '<template><div action></div></template>',
    '<template>{{foo-bar (action "foo")}}</template>',
    '<template>{{foo-bar action}}</template>',
  ],

  invalid: [
    {
      // String literal first param — no autofix
      code: '<template><button {{action "save"}}>Save</button></template>',
      output: null,
      errors: [{ messageId: 'noActionModifier' }],
    },
    {
      code: '<template><div {{action "onClick"}}>Click me</div></template>',
      output: null,
      errors: [{ messageId: 'noActionModifier' }],
    },
    {
      code: '<template><form {{action "submit" on="submit"}}>Submit</form></template>',
      output: null,
      errors: [{ messageId: 'noActionModifier' }],
    },
    {
      // Path expression — autofix: {{action this.handleClick}} → {{on "click" this.handleClick}}
      code: '<template><button {{action this.handleClick}}>Save</button></template>',
      output: '<template><button {{on "click" this.handleClick}}>Save</button></template>',
      errors: [{ messageId: 'noActionModifier' }],
    },
    {
      // Path with args — autofix wraps in (fn ...)
      code: '<template><button {{action this.handleClick "arg1"}}>Save</button></template>',
      output:
        '<template><button {{on "click" (fn this.handleClick "arg1")}}>Save</button></template>',
      errors: [{ messageId: 'noActionModifier' }],
    },
    {
      // Path with multiple args
      code: '<template><button {{action this.handleClick "arg1" "arg2"}}>Save</button></template>',
      output:
        '<template><button {{on "click" (fn this.handleClick "arg1" "arg2")}}>Save</button></template>',
      errors: [{ messageId: 'noActionModifier' }],
    },

    {
      code: '<template><div {{action this.foo}}></div></template>',
      output: '<template><div {{on "click" this.foo}}></div></template>',
      errors: [
        { message: 'Do not use action modifiers. Use on modifier with a function instead.' },
      ],
    },
    {
      code: '<template><div {{action this.foo bar baz}}></div></template>',
      output: '<template><div {{on "click" (fn this.foo bar baz)}}></div></template>',
      errors: [
        { message: 'Do not use action modifiers. Use on modifier with a function instead.' },
      ],
    },
    {
      code: '<template><button {{action "foo"}}></button></template>',
      output: null,
      errors: [
        { message: 'Do not use action modifiers. Use on modifier with a function instead.' },
      ],
    },
    {
      code: '<template><a href="#" {{action "foo"}}></a></template>',
      output: null,
      errors: [
        { message: 'Do not use action modifiers. Use on modifier with a function instead.' },
      ],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-action-modifiers (hbs)', rule, {
  valid: [
    '<button onclick={{action "foo"}}></button>',
    '<a href="#" onclick={{action "foo"}}></a>',
    '<div action></div>',
    '{{foo-bar (action "foo")}}',
    '{{foo-bar action}}',
    // allowlist config
    {
      code: '<button {{action "foo"}}></button>',
      options: [{ allowlist: ['button'] }],
    },
  ],
  invalid: [
    {
      code: '<div {{action this.foo}}></div>',
      output: '<div {{on "click" this.foo}}></div>',
      errors: [
        { message: 'Do not use action modifiers. Use on modifier with a function instead.' },
      ],
    },
    {
      code: '<div {{action this.foo bar baz}}></div>',
      output: '<div {{on "click" (fn this.foo bar baz)}}></div>',
      errors: [
        { message: 'Do not use action modifiers. Use on modifier with a function instead.' },
      ],
    },
    {
      code: '<button {{action "foo"}}></button>',
      output: null,
      errors: [
        { message: 'Do not use action modifiers. Use on modifier with a function instead.' },
      ],
    },
    {
      code: '<a href="#" {{action "foo"}}></a>',
      output: null,
      errors: [
        { message: 'Do not use action modifiers. Use on modifier with a function instead.' },
      ],
    },
    // allowlist config
    {
      code: '<a href="#" {{action "foo"}}></a>',
      output: null,
      options: [{ allowlist: ['button'] }],
      errors: [
        { message: 'Do not use action modifiers. Use on modifier with a function instead.' },
      ],
    },
  ],
});
