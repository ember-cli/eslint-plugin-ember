const rule = require('../../../lib/rules/template-require-mandatory-role-attributes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-mandatory-role-attributes', rule, {
  valid: [
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

    // Semantic inputs supply required ARIA state natively. Exempt pairings
    // are looked up via axobject-query's elementAXObjects + AXObjectRoles.

    // checkbox/switch: aria-checked supplied via native `checked` state.
    '<template><input type="checkbox" role="switch" /></template>',
    '<template><input type="checkbox" role="checkbox" /></template>',
    '<template><input type="radio" role="radio" /></template>',
    '<template><input type="Checkbox" role="switch" /></template>',
    '<template><input type="CHECKBOX" role="switch" /></template>',

    // slider: aria-valuenow supplied via native `value` (axobject-query SliderRole).
    '<template><input type="range" role="slider" /></template>',

    // Classic Ember {{input type=... role=...}} helper renders a native
    // <input>; same axobject-query lookup applies.
    '<template>{{input type="checkbox" role="switch"}}</template>',
    '<template>{{input type="Checkbox" role="switch"}}</template>',
    '<template>{{input type="range" role="slider"}}</template>',

    // Case-insensitive role matching — ARIA role tokens compare as ASCII-case-insensitive.
    '<template><div role="COMBOBOX" aria-expanded="false" aria-controls="ctrl" /></template>',
    // Role fallback list — primary role's required attributes are satisfied.
    '<template><div role="combobox listbox" aria-expanded="false" aria-controls="ctrl" /></template>',
    // Abstract roles (ARIA §5.3) are skipped per §4.1 fallback semantics —
    // `widget` isn't an authoring role, so the UA walks past it to the next
    // recognised token. Here `button` has no required attrs → valid.
    '<template><div role="widget button" /></template>',
    // Abstract role followed by a concrete role that IS satisfied.
    '<template><div role="command slider" aria-valuenow="0" /></template>',
    // Unknown roles are skipped — rule only checks required attrs for known roles.
    '<template><div role="foobar" /></template>',
  ],

  invalid: [
    {
      code: '<template><div role="combobox" aria-controls="someId" /></template>',
      output: null,
      errors: [
        {
          message: 'The attribute aria-expanded is required by the role combobox',
        },
      ],
    },
    {
      code: '<template><div role="option"  /></template>',
      output: null,
      errors: [{ message: 'The attribute aria-selected is required by the role option' }],
    },
    // Plain widget roles missing all required attrs — basic coverage that
    // peer plugins (jsx-a11y / vue-a11y / angular-eslint) also flag.
    {
      code: '<template><div role="slider" /></template>',
      output: null,
      errors: [{ message: 'The attribute aria-valuenow is required by the role slider' }],
    },
    {
      code: '<template><div role="checkbox" /></template>',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role checkbox' }],
    },
    {
      code: '<template><CustomComponent role="checkbox" aria-required="true" /></template>',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role checkbox' }],
    },
    {
      code: '<template><SomeComponent role="scrollbar" @aria-now={{this.valuenow}} aria-controls={{some-id}} /></template>',
      output: null,
      errors: [
        {
          message: 'The attribute aria-valuenow is required by the role scrollbar',
        },
      ],
    },
    {
      code: '<template>{{some-component role="heading"}}</template>',
      output: null,
      errors: [{ message: 'The attribute aria-level is required by the role heading' }],
    },
    {
      code: '<template>{{foo role="slider"}}</template>',
      output: null,
      errors: [
        {
          message: 'The attribute aria-valuenow is required by the role slider',
        },
      ],
    },
    {
      code: '<template>{{foo role="checkbox"}}</template>',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role checkbox' }],
    },

    // Undocumented {input type, role} pairings are NOT exempted.
    {
      code: '<template><input type="checkbox" role="radio" /></template>',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role radio' }],
    },
    // {{input}} helper with off-whitelist role is flagged too.
    {
      code: '<template>{{input type="text" role="switch"}}</template>',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role switch' }],
    },
    {
      code: '<template>{{input type="checkbox" role="radio"}}</template>',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role radio' }],
    },
    {
      code: '<template><input type="radio" role="switch" /></template>',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role switch' }],
    },
    {
      code: '<template><input type="radio" role="checkbox" /></template>',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role checkbox' }],
    },
    {
      code: '<template><input type="text" role="switch" /></template>',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role switch' }],
    },
    {
      // No `type` attribute; defaults to text.
      code: '<template><input role="switch" /></template>',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role switch' }],
    },

    // menuitemcheckbox / menuitemradio on <input> are NOT exempted —
    // axobject-query's MenuItemCheckBoxRole / MenuItemRadioRole lists only
    // an ARIA concept, no HTML concept for <input>. Flagged for missing
    // aria-checked.
    {
      code: '<template><input type="checkbox" role="menuitemcheckbox" /></template>',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role menuitemcheckbox' }],
    },
    {
      code: '<template><input type="radio" role="menuitemradio" /></template>',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role menuitemradio' }],
    },
    // Case-insensitive role matching — uppercase role missing required props is flagged.
    {
      code: '<template><div role="COMBOBOX"></div></template>',
      output: null,
      errors: [
        {
          message: 'The attributes aria-controls, aria-expanded are required by the role combobox',
        },
      ],
    },
    // Role-fallback list: when the primary role is missing required props, flag it.
    {
      code: '<template><div role="combobox listbox"></div></template>',
      output: null,
      errors: [
        {
          message: 'The attributes aria-controls, aria-expanded are required by the role combobox',
        },
      ],
    },
    // Abstract role (`widget`) followed by a concrete role that's missing
    // required attrs — UA skips the abstract, lands on `slider`, which
    // requires aria-valuenow.
    {
      code: '<template><div role="widget slider"></div></template>',
      output: null,
      errors: [
        {
          message: 'The attribute aria-valuenow is required by the role slider',
        },
      ],
    },
    // Strict-mode {{input}} is a scope binding, not Ember's classic helper
    // (which doesn't exist as a strict-mode export from @ember/component).
    // The semantic-role exemption must NOT apply — we can't prove the
    // imported identifier renders a native <input>. Flag the missing ARIA.
    {
      filename: 'component.gjs',
      code: '<template>{{input type="checkbox" role="switch"}}</template>',
      output: null,
      errors: [
        {
          message: 'The attribute aria-checked is required by the role switch',
        },
      ],
    },
    {
      filename: 'component.gts',
      code: '<template>{{input type="range" role="slider"}}</template>',
      output: null,
      errors: [
        {
          message: 'The attribute aria-valuenow is required by the role slider',
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

    // Semantic inputs supply required ARIA state natively (via axobject-query
    // elementAXObjects lookup).
    '<input type="checkbox" role="switch" />',
    '<input type="radio" role="radio" />',
    '<input type="checkbox" role="checkbox" />',
    '<input type="Checkbox" role="switch" />',
    '<input type="CHECKBOX" role="switch" />',
    '<input type="range" role="slider" />',

    // Classic Ember {{input}} helper renders a native <input>; same lookup.
    '{{input type="checkbox" role="switch"}}',
    '{{input type="Checkbox" role="switch"}}',
    '{{input type="range" role="slider"}}',
  ],
  invalid: [
    {
      code: '<div role="combobox" aria-controls="someId" />',
      output: null,
      errors: [{ message: 'The attribute aria-expanded is required by the role combobox' }],
    },
    {
      code: '<div role="option"  />',
      output: null,
      errors: [{ message: 'The attribute aria-selected is required by the role option' }],
    },
    {
      code: '<CustomComponent role="checkbox" aria-required="true" />',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role checkbox' }],
    },
    {
      code: '<SomeComponent role="scrollbar" @aria-now={{this.valuenow}} aria-controls={{some-id}} />',
      output: null,
      errors: [{ message: 'The attribute aria-valuenow is required by the role scrollbar' }],
    },
    {
      code: '{{some-component role="heading"}}',
      output: null,
      errors: [{ message: 'The attribute aria-level is required by the role heading' }],
    },
    {
      code: '{{foo role="slider"}}',
      output: null,
      errors: [
        {
          message: 'The attribute aria-valuenow is required by the role slider',
        },
      ],
    },
    {
      code: '{{foo role="checkbox"}}',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role checkbox' }],
    },

    // Undocumented {input type, role} pairings are NOT exempted.
    {
      code: '<input type="checkbox" role="radio" />',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role radio' }],
    },
    {
      code: '<input type="radio" role="switch" />',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role switch' }],
    },
    {
      code: '<input type="radio" role="checkbox" />',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role checkbox' }],
    },
    {
      code: '<input type="text" role="switch" />',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role switch' }],
    },
    {
      // No `type` attribute; defaults to text.
      code: '<input role="switch" />',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role switch' }],
    },

    // {{input}} helper with off-whitelist role is flagged too.
    {
      code: '{{input type="text" role="switch"}}',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role switch' }],
    },
    {
      code: '{{input type="checkbox" role="radio"}}',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role radio' }],
    },

    // menuitemcheckbox / menuitemradio on <input> are NOT exempted.
    {
      code: '<input type="checkbox" role="menuitemcheckbox" />',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role menuitemcheckbox' }],
    },
    {
      code: '<input type="radio" role="menuitemradio" />',
      output: null,
      errors: [{ message: 'The attribute aria-checked is required by the role menuitemradio' }],
    },
  ],
});
