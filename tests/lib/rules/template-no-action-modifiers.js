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
  ],

  invalid: [
    {
      code: '<template><button {{action "save"}}>Save</button></template>',
      output: null,
      errors: [
        {
          message: 'Do not use action modifiers. Use on modifier with a function instead.',
          type: 'GlimmerElementModifierStatement',
        },
      ],
    },
    {
      code: '<template><div {{action "onClick"}}>Click me</div></template>',
      output: null,
      errors: [
        {
          message: 'Do not use action modifiers. Use on modifier with a function instead.',
          type: 'GlimmerElementModifierStatement',
        },
      ],
    },
    {
      code: '<template><form {{action "submit" on="submit"}}>Submit</form></template>',
      output: null,
      errors: [
        {
          message: 'Do not use action modifiers. Use on modifier with a function instead.',
          type: 'GlimmerElementModifierStatement',
        },
      ],
    },
  ],
});
