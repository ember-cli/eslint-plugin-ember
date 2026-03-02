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
      errors: [
        { messageId: 'missingAttribute' },
        { messageId: 'missingAttribute' },
        { messageId: 'missingAttribute' },
      ],
    },
    {
      code: '<template>{{some-component role="heading"}}</template>',
      output: null,
      errors: [{ messageId: 'missingAttribute' }],
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

hbsRuleTester.run('template-require-mandatory-role-attributes', rule, {
  valid: [
    '<div />',
    '<div aria-disabled="true" />',
    '<div role="complementary" />',
    '<div role="combobox" aria-expanded="false" aria-controls="ctrlId" />',
    '<div role="option" aria-selected={{false}} />',
    '<FakeComponent />',
    '<FakeComponent role="fakerole" />',
    '<CustomComponent role="checkbox" aria-checked="false" />',
    '<SomeComponent role={{this.role}} aria-notreal="bar" />',
    '<OtherComponent @role={{@role}} aria-required={{this.required}} />',
    '<FakeElement aria-disabled="true" />',
    '{{some-component}}',
    '{{some-component foo="true"}}',
    '{{some-component role="heading" aria-level="2"}}',
    '{{foo-component role="button"}}',
    '{{foo-component role="unknown"}}',
    '{{foo-component role=role}}',
  ],
  invalid: [
    {
      code: '<div role="combobox" aria-controls="someId" />',
      output: null,
      errors: [
        { message: 'Role "combobox" requires ARIA attribute "aria-expanded" to be present.' },
      ],
    },
    {
      code: '<div role="option"  />',
      output: null,
      errors: [
        { message: 'Role "option" requires ARIA attribute "aria-selected" to be present.' },
      ],
    },
    {
      code: '<CustomComponent role="checkbox" aria-required="true" />',
      output: null,
      errors: [
        { message: 'Role "checkbox" requires ARIA attribute "aria-checked" to be present.' },
      ],
    },
    {
      code: '<SomeComponent role="scrollbar" @aria-now={{this.valuenow}} aria-controls={{some-id}} />',
      output: null,
      errors: [
        { message: 'Role "scrollbar" requires ARIA attribute "aria-valuenow" to be present.' },
        { message: 'Role "scrollbar" requires ARIA attribute "aria-valuemin" to be present.' },
        { message: 'Role "scrollbar" requires ARIA attribute "aria-valuemax" to be present.' },
      ],
    },
    {
      code: '{{some-component role="heading"}}',
      output: null,
      errors: [
        { message: 'Role "heading" requires ARIA attribute "aria-level" to be present.' },
      ],
    },
  ],
});
