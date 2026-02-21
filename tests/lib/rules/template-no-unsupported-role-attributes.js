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
  
    // Test cases ported from ember-template-lint
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
  
    // Test cases ported from ember-template-lint
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
