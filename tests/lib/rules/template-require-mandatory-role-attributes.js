const rule = require('../../../lib/rules/template-require-mandatory-role-attributes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-mandatory-role-attributes', rule, {
  valid: [
    '<template><div role="checkbox" aria-checked="false">Checkbox</div></template>',
    '<template><div role="slider" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">Slider</div></template>',
    '<template><div role="switch" aria-checked="true">Switch</div></template>',
  
    // Test cases ported from ember-template-lint
    '<template><div /></template>',
    '<template><div aria-disabled="true" /></template>',
    '<template><div role="complementary" /></template>',
    '<template><div role="combobox" aria-expanded="false" aria-controls="ctrlId" /></template>',
    '<template><div role="option" aria-selected={{false}} /></template>',
    '<template><FakeComponent /></template>',
    '<template><FakeComponent role="fakerole" /></template>',
    '<template><CustomComponent role="checkbox" aria-checked="false" /></template>',
    '<template><SomeComponent role={{this.role}} aria-notreal="bar" /></template>',
    '<template><OtherComponent @role={{@role}} aria-required={{this.required}} /></template>',
    '<template><FakeElement aria-disabled="true" /></template>',
    '<template>{{some-component}}</template>',
    '<template>{{some-component foo="true"}}</template>',
    '<template>{{some-component role="heading" aria-level="2"}}</template>',
    '<template>{{foo-component role="button"}}</template>',
    '<template>{{foo-component role="unknown"}}</template>',
    '<template>{{foo-component role=role}}</template>',
  ],

  invalid: [
    {
      code: '<template><div role="checkbox">Checkbox</div></template>',
      output: null,
      errors: [{ messageId: 'missingAttribute' }],
    },
    {
      code: '<template><div role="slider">Slider</div></template>',
      output: null,
      errors: [
        { messageId: 'missingAttribute' },
        { messageId: 'missingAttribute' },
        { messageId: 'missingAttribute' },
      ],
    },
    {
      code: '<template><div role="switch">Switch</div></template>',
      output: null,
      errors: [{ messageId: 'missingAttribute' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><div role="combobox" aria-controls="someId" /></template>',
      output: null,
      errors: [{ messageId: 'missingAttribute' }],
    },
    {
      code: '<template><div role="option"  /></template>',
      output: null,
      errors: [{ messageId: 'missingAttribute' }],
    },
    {
      code: '<template><CustomComponent role="checkbox" aria-required="true" /></template>',
      output: null,
      errors: [{ messageId: 'missingAttribute' }],
    },
    {
      code: '<template><SomeComponent role="scrollbar" @aria-now={{this.valuenow}} aria-controls={{some-id}} /></template>',
      output: null,
      errors: [{ messageId: 'missingAttribute' }],
    },
    {
      code: '<template>{{some-component role="heading"}}</template>',
      output: null,
      errors: [{ messageId: 'missingAttribute' }],
    },
  ],
});
