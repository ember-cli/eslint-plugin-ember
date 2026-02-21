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
  
    // Test cases ported from ember-template-lint
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
