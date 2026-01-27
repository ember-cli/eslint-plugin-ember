const rule = require('../../../lib/rules/template-no-action-on-submit-button');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-action-on-submit-button', rule, {
  valid: [
    '<template><button {{on "click" this.handleClick}}>Click</button></template>',
    '<template><button type="button" action="doSomething">Click</button></template>',
    '<template><input type="text" action="search" /></template>',
    '<template><div action="whatever">Not a button</div></template>',
  ],

  invalid: [
    {
      code: '<template><button action="save">Save</button></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: '<template><button type="submit" action="submit">Submit</button></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: '<template><input type="submit" action="go" /></template>',
      output: null,
      errors: [
        {
          message:
            'Do not use action attribute on submit buttons. Use on modifier instead or handle form submission.',
          type: 'GlimmerElementNode',
        },
      ],
    },
  ],
});
