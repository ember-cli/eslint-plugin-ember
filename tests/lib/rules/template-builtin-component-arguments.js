const rule = require('../../../lib/rules/template-builtin-component-arguments');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-builtin-component-arguments', rule, {
  valid: [
    '<template><input type="text" size="10" /></template>',
    '<template><Input @type="text" size="10" /></template>',
    '<template><Input @type="checkbox" @checked={{true}} /></template>',
    '<template><Textarea @value="Tomster" /></template>',

    '<template><Input/></template>',
  ],
  invalid: [
    {
      code: '<template><Input type="text" size="10" /></template>',
      output: null,
      errors: [
        {
          message:
            'Setting the `type` attribute on the builtin <Input> component is not allowed. Did you mean `@type`?',
        },
      ],
    },
    {
      code: '<template><Input @type="checkbox" checked /></template>',
      output: null,
      errors: [
        {
          message:
            'Setting the `checked` attribute on the builtin <Input> component is not allowed. Did you mean `@checked`?',
        },
      ],
    },
    {
      code: '<template><Textarea value="Tomster" /></template>',
      output: null,
      errors: [
        {
          message:
            'Setting the `value` attribute on the builtin <Textarea> component is not allowed. Did you mean `@value`?',
        },
      ],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-builtin-component-arguments (hbs)', rule, {
  valid: [
    { filename: 'layout.hbs', code: '<Input/>' },
    { filename: 'layout.hbs', code: '<input type="text" size="10" />' },
    { filename: 'layout.hbs', code: '<Input @type="text" size="10" />' },
    { filename: 'layout.hbs', code: '<Input @type="checkbox" @checked={{true}} />' },
    { filename: 'layout.hbs', code: '<Textarea @value="Tomster" />' },
  ],
  invalid: [
    {
      filename: 'layout.hbs',
      code: '<Input type="text" size="10" />',
      output: null,
      errors: [
        {
          message:
            'Setting the `type` attribute on the builtin <Input> component is not allowed. Did you mean `@type`?',
        },
      ],
    },
    {
      filename: 'layout.hbs',
      code: '<Input @type="checkbox" checked />',
      output: null,
      errors: [
        {
          message:
            'Setting the `checked` attribute on the builtin <Input> component is not allowed. Did you mean `@checked`?',
        },
      ],
    },
    {
      filename: 'layout.hbs',
      code: '<Textarea value="Tomster" />',
      output: null,
      errors: [
        {
          message:
            'Setting the `value` attribute on the builtin <Textarea> component is not allowed. Did you mean `@value`?',
        },
      ],
    },
  ],
});
