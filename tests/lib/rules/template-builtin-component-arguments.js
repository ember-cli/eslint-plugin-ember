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
    // In GJS/GTS: custom Input/Textarea components (not imported from @ember/component) are fine
    // https://github.com/ember-template-lint/ember-template-lint/issues/2786
    {
      filename: 'test.gjs',
      code: 'import { Input } from "my-custom-lib"; <template><Input type="text" /></template>',
    },
    {
      filename: 'test.gjs',
      code: '<template><Input type="text" /></template>',
    },
    {
      filename: 'test.gts',
      code: '<template><Textarea value="text" /></template>',
    },
  ],
  invalid: [
    // In GJS/GTS: only flag when imported from @ember/component
    {
      filename: 'test.gjs',
      code: 'import { Input } from "@ember/component"; <template><Input type="text" size="10" /></template>',
      output: null,
      errors: [
        {
          message:
            'Setting the `type` attribute on the builtin <Input> component is not allowed. Did you mean `@type`?',
        },
      ],
    },
    {
      filename: 'test.gjs',
      code: 'import { Input as MyInput } from "@ember/component"; <template><MyInput type="text" /></template>',
      output: null,
      errors: [
        {
          message:
            'Setting the `type` attribute on the builtin <Input> component is not allowed. Did you mean `@type`?',
        },
      ],
    },
    {
      filename: 'test.gjs',
      code: 'import { Textarea } from "@ember/component"; <template><Textarea value="Tomster" /></template>',
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

// HBS tests — loose mode, always checks by tag name
const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-builtin-component-arguments (hbs)', rule, {
  valid: [
    '<input type="text" size="10" />',
    '<Input @type="text" size="10" />',
    '<Input @type="checkbox" @checked={{true}} />',
    '<Textarea @value="Tomster" />',
  ],
  invalid: [
    {
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
