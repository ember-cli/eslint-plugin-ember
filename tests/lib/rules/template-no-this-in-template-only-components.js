const path = require('node:path');
const rule = require('../../../lib/rules/template-no-this-in-template-only-components');
const RuleTester = require('eslint').RuleTester;

const FIXTURES = path.resolve(
  __dirname,
  '../../fixtures/template-no-this-in-template-only-components'
);

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-this-in-template-only-components', rule, {
  valid: [
    '<template>{{@foo}}</template>',
    '<template>{{welcome-page}}</template>',
    '<template><WelcomePage /></template>',
    '<template><MyComponent @prop={{can "edit" @model}} /></template>',
    '<template>{{my-component model=model}}</template>',
    // Class components should not be flagged (not template-only)
    'class MyComponent extends Component { <template>{{this.foo}}</template> }',
    'class MyComponent extends Component { <template>{{this.bar}} {{this.baz}}</template> }',
  ],
  invalid: [
    {
      code: '<template>{{this.foo}}</template>',
      output: '<template>{{@foo}}</template>',
      errors: [{ messageId: 'noThis' }],
    },

    {
      code: '<template>{{my-component model=this.model}}</template>',
      output: '<template>{{my-component model=@model}}</template>',
      errors: [{ messageId: 'noThis' }],
    },
    {
      code: '<template>{{my-component action=(action this.myAction)}}</template>',
      output: '<template>{{my-component action=(action @myAction)}}</template>',
      errors: [{ messageId: 'noThis' }],
    },
    {
      code: '<template><MyComponent @prop={{can "edit" this.model}} /></template>',
      output: '<template><MyComponent @prop={{can "edit" @model}} /></template>',
      errors: [{ messageId: 'noThis' }],
    },
    {
      code: '<template>{{input id=(concat this.elementId "-username")}}</template>',
      output: null,
      errors: [{ messageId: 'noThis' }],
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

hbsRuleTester.run('template-no-this-in-template-only-components', rule, {
  valid: [
    '{{welcome-page}}',
    '<WelcomePage />',
    '<MyComponent @prop={{can "edit" @model}} />',
    '{{my-component model=model}}',
  ],
  invalid: [
    {
      code: '{{my-component model=this.model}}',
      output: '{{my-component model=@model}}',
      errors: [
        {
          message:
            "Usage of 'this' in path 'this.model' is not allowed in a template-only component. Use '@model' if it is a named argument.",
        },
      ],
    },
    {
      code: '{{my-component action=(action this.myAction)}}',
      output: '{{my-component action=(action @myAction)}}',
      errors: [
        {
          message:
            "Usage of 'this' in path 'this.myAction' is not allowed in a template-only component. Use '@myAction' if it is a named argument.",
        },
      ],
    },
    {
      code: '<MyComponent @prop={{can "edit" this.model}} />',
      output: '<MyComponent @prop={{can "edit" @model}} />',
      errors: [
        {
          message:
            "Usage of 'this' in path 'this.model' is not allowed in a template-only component. Use '@model' if it is a named argument.",
        },
      ],
    },
    {
      code: '{{input id=(concat this.elementId "-username")}}',
      output: null,
      errors: [
        {
          message:
            "Usage of 'this' in path 'this.elementId' is not allowed in a template-only component. Use '@elementId' if it is a named argument.",
        },
      ],
    },
  ],
});

// Test .hbs files with explicit filenames to verify filesystem-based detection.
// Route templates (app/templates/ but not app/templates/components/) should be skipped.
const hbsFilenameTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsFilenameTester.run('template-no-this-in-template-only-components (hbs filenames)', rule, {
  valid: [
    // Route templates should never be flagged (they always have a controller context)
    {
      filename: 'app/templates/application.hbs',
      code: '{{this.foo}}',
    },
    // Nested route template path
    {
      filename: 'app/templates/posts/show.hbs',
      code: '{{this.foo}}',
    },
    // Co-located component with a real .js companion class on disk
    {
      filename: path.join(FIXTURES, 'app/components/with-class.hbs'),
      code: '{{this.foo}}',
    },
    // Co-located component with a real .ts companion class on disk
    {
      filename: path.join(FIXTURES, 'app/components/with-ts-class.hbs'),
      code: '{{this.foo}}',
    },
    // Classic structure with a real .js companion class at app/components/<name>.js
    {
      filename: path.join(FIXTURES, 'app/templates/components/classic-with-class.hbs'),
      code: '{{this.foo}}',
    },
    // Files outside any app/addon directory: cannot determine layout, don't flag
    {
      filename: '/some/random/path/foo.hbs',
      code: '{{this.foo}}',
    },
  ],
  invalid: [
    // Template-only .hbs component (no companion file on disk — the path doesn't exist)
    {
      filename: 'app/components/nonexistent-test-component.hbs',
      code: '{{this.foo}}',
      output: '{{@foo}}',
      errors: [{ messageId: 'noThis' }],
    },
    // Classic structure template-only component (no companion file on disk)
    {
      filename: 'app/templates/components/nonexistent-test-component.hbs',
      code: '{{this.bar}}',
      output: '{{@bar}}',
      errors: [{ messageId: 'noThis' }],
    },
    // addon/components: same logic should apply
    {
      filename: 'addon/components/nonexistent-test-component.hbs',
      code: '{{this.foo}}',
      output: '{{@foo}}',
      errors: [{ messageId: 'noThis' }],
    },
    // Built-in property (elementId) is not auto-fixable even when companion is missing
    {
      filename: 'app/components/nonexistent-test-component.hbs',
      code: '{{this.elementId}}',
      output: null,
      errors: [{ messageId: 'noThis' }],
    },
  ],
});
