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
    {
      code: '<template><button {{action "save"}}>Save</button></template>',
      options: [{ allowlist: ['button'] }],
    },
    {
      code: '<template><button {{action "save"}}>Save</button></template>',
      options: [['button']],
    },
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
      // Path expression with on="click" hash — autofix reads event from hash and drops it
      code: '<template><button {{action this.handleClick on="click"}}>Save</button></template>',
      output: '<template><button {{on "click" this.handleClick}}>Save</button></template>',
      errors: [{ messageId: 'noActionModifier' }],
    },
    {
      // Path expression with on="submit" hash — autofix reads event from hash and drops it
      code: '<template><form {{action this.handleSubmit on="submit"}}>Submit</form></template>',
      output: '<template><form {{on "submit" this.handleSubmit}}>Submit</form></template>',
      errors: [{ messageId: 'noActionModifier' }],
    },
    {
      // Non-`on` hash pair present — no autofix (can't safely translate other hash pairs)
      code: '<template><button {{action this.handleClick bubbles=false}}>Save</button></template>',
      output: null,
      errors: [{ messageId: 'noActionModifier' }],
    },
  ],
});
