const rule = require('../../../lib/rules/template-no-unsupported-role-attributes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-unsupported-role-attributes', rule, {
  valid: [
    '<template><div role="button" aria-pressed="true">Toggle</div></template>',
    '<template><div role="checkbox" aria-checked="false">Check</div></template>',
    '<template><div role="slider" aria-valuenow="50">Slider</div></template>',

    '<template><div role="button" aria-disabled="true"></div></template>',
    '<template><div role="heading" aria-level="1" /></template>',
    '<template><span role="checkbox" aria-checked={{this.checked}}></span></template>',
    '<template><CustomComponent role="banner" /></template>',
    '<template><div role="textbox" aria-required={{this.required}} aria-errormessage={{this.error}}></div></template>',
    '<template><div role="heading" foo="true" /></template>',
    '<template><dialog /></template>',
    '<template><a href="#" aria-describedby=""></a></template>',
    '<template><menu type="toolbar" aria-hidden="true" /></template>',
    '<template><a role="menuitem" aria-labelledby={{this.label}} /></template>',
    '<template><input type="image" aria-atomic /></template>',
    '<template><input type="submit" aria-disabled="true" /></template>',
    '<template><select aria-expanded="false" aria-controls="ctrlID" /></template>',
    '<template><div type="button" foo="true" /></template>',
    '<template>{{some-component role="heading" aria-level="2"}}</template>',
    '<template>{{other-component role=this.role aria-bogus="true"}}</template>',
    '<template><ItemCheckbox @model={{@model}} @checkable={{@checkable}} /></template>',
    '<template><some-custom-element /></template>',
    '<template><input type="password"></template>',
  ],

  invalid: [
    {
      code: '<template><div role="button" aria-checked="true">Button</div></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template><div role="checkbox" aria-pressed="false">Check</div></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template><div role="tab" aria-valuenow="1">Tab</div></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },

    {
      code: '<template><div role="link" href="#" aria-checked /></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template><CustomComponent role="listbox" aria-level="2" /></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template><div role="option" aria-notreal="bogus" aria-selected="false" /></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template><div role="combobox" aria-multiline="true" aria-expanded="false" aria-controls="someId" /></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template><button type="submit" aria-valuetext="woosh"></button></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template><menu type="toolbar" aria-expanded="true" /></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template><a role="menuitem" aria-checked={{this.checked}} /></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template><input type="button" aria-invalid="grammar" /></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template><input type="email" aria-level={{this.level}} /></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template>{{foo-component role="button" aria-valuetext="blahblahblah"}}</template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
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

hbsRuleTester.run('template-no-unsupported-role-attributes', rule, {
  valid: [
    '<div role="button" aria-disabled="true"></div>',
    '<div role="heading" aria-level="1" />',
    '<span role="checkbox" aria-checked={{this.checked}}></span>',
    '<CustomComponent role="banner" />',
    '<div role="textbox" aria-required={{this.required}} aria-errormessage={{this.error}}></div>',
    '<div role="heading" foo="true" />',
    '<dialog />',
    '<a href="#" aria-describedby=""></a>',
    '<menu type="toolbar" aria-hidden="true" />',
    '<a role="menuitem" aria-labelledby={{this.label}} />',
    '<input type="image" aria-atomic />',
    '<input type="submit" aria-disabled="true" />',
    '<select aria-expanded="false" aria-controls="ctrlID" />',
    '<div type="button" foo="true" />',
    '{{some-component role="heading" aria-level="2"}}',
    '{{other-component role=this.role aria-bogus="true"}}',
    '<ItemCheckbox @model={{@model}} @checkable={{@checkable}} />',
    '<some-custom-element />',
    '<input type="password">',
  ],
  invalid: [
    {
      code: '<div role="link" href="#" aria-checked />',
      output: null,
      errors: [
        { message: 'ARIA attribute "aria-checked" is not supported for role "link". Remove the attribute or change the role.' },
      ],
    },
    {
      code: '<CustomComponent role="listbox" aria-level="2" />',
      output: null,
      errors: [
        { message: 'ARIA attribute "aria-level" is not supported for role "listbox". Remove the attribute or change the role.' },
      ],
    },
    {
      code: '<div role="option" aria-notreal="bogus" aria-selected="false" />',
      output: null,
      errors: [
        { message: 'ARIA attribute "aria-notreal" is not supported for role "option". Remove the attribute or change the role.' },
      ],
    },
    {
      code: '<div role="combobox" aria-multiline="true" aria-expanded="false" aria-controls="someId" />',
      output: null,
      errors: [
        { message: 'ARIA attribute "aria-multiline" is not supported for role "combobox". Remove the attribute or change the role.' },
      ],
    },
    {
      code: '<button type="submit" aria-valuetext="woosh"></button>',
      output: null,
      errors: [
        { message: 'ARIA attribute "aria-valuetext" is not supported for role "button". Remove the attribute or change the role.' },
      ],
    },
    {
      code: '<menu type="toolbar" aria-expanded="true" />',
      output: null,
      errors: [
        { message: 'ARIA attribute "aria-expanded" is not supported for role "list". Remove the attribute or change the role.' },
      ],
    },
    {
      code: '<a role="menuitem" aria-checked={{this.checked}} />',
      output: null,
      errors: [
        { message: 'ARIA attribute "aria-checked" is not supported for role "menuitem". Remove the attribute or change the role.' },
      ],
    },
    {
      code: '<input type="button" aria-invalid="grammar" />',
      output: null,
      errors: [
        { message: 'ARIA attribute "aria-invalid" is not supported for role "button". Remove the attribute or change the role.' },
      ],
    },
    {
      code: '<input type="email" aria-level={{this.level}} />',
      output: null,
      errors: [
        { message: 'ARIA attribute "aria-level" is not supported for role "combobox". Remove the attribute or change the role.' },
      ],
    },
    {
      code: '{{foo-component role="button" aria-valuetext="blahblahblah"}}',
      output: null,
      errors: [
        { message: 'ARIA attribute "aria-valuetext" is not supported for role "button". Remove the attribute or change the role.' },
      ],
    },
  ],
});
