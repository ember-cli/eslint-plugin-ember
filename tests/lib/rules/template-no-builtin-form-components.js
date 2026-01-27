const rule = require('../../../lib/rules/template-no-builtin-form-components');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-builtin-form-components', rule, {
  valid: [
    '<template><input type="text" /></template>',
    '<template><input type="checkbox" /></template>',
    '<template><input type="radio" /></template>',
    '<template><textarea></textarea></template>',
    '<template><div></div></template>',
  ],
  invalid: [
    {
      code: '<template><Input /></template>',
      output: null,
      errors: [
        {
          messageId: 'noInput',
        },
      ],
    },
    {
      code: '<template><Input type="text" /></template>',
      output: null,
      errors: [
        {
          messageId: 'noInput',
        },
      ],
    },
    {
      code: '<template><Textarea></Textarea></template>',
      output: null,
      errors: [
        {
          messageId: 'noTextarea',
        },
      ],
    },
    {
      code: '<template><Textarea @value={{this.body}}></Textarea></template>',
      output: null,
      errors: [
        {
          messageId: 'noTextarea',
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

hbsRuleTester.run('template-no-builtin-form-components', rule, {
  valid: [
    '<input type="text" />',
    '<input type="checkbox" />',
    '<input type="radio" />',
    '<textarea></textarea>',
  ],
  invalid: [
    {
      code: '<Input />',
      output: null,
      errors: [
        {
          message:
            'Do not use the `Input` component. Built-in form components use two-way binding to mutate values. Instead, refactor to use a native HTML element.',
        },
      ],
    },
    {
      code: '<Textarea></Textarea>',
      output: null,
      errors: [
        {
          message:
            'Do not use the `Textarea` component. Built-in form components use two-way binding to mutate values. Instead, refactor to use a native HTML element.',
        },
      ],
    },
  ],
});
