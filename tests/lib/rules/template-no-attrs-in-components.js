const rule = require('../../../lib/rules/template-no-attrs-in-components');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-attrs-in-components', rule, {
  valid: [
    // Not a component template path: nothing is flagged, regardless of content.
    {
      code: '<template>{{@value}}</template>',
      filename: 'app/templates/application.hbs',
    },
    {
      code: '<template>{{this.value}}</template>',
      filename: 'app/templates/application.hbs',
    },
    // `this.attrs.*` is not a real Ember API, but it is NOT what this rule
    // targets — upstream only flags bare `attrs.*`. So outside of a component
    // template, `this.attrs.*` should not be flagged.
    {
      code: '<template>{{this.attrs.foo}}</template>',
      filename: 'app/templates/application.hbs',
    },
    // Even `attrs.*` itself is only flagged inside component templates.
    {
      code: '<template>{{attrs.value}}</template>',
      filename: 'app/templates/application.hbs',
    },
    // Inside a component template, non-attrs paths are fine.
    {
      code: '<template>{{@value}}</template>',
      filename: 'app/templates/components/foo.hbs',
    },
    {
      code: '<template>{{this.value}}</template>',
      filename: 'app/templates/components/foo.hbs',
    },
    // Upstream does NOT flag `this.attrs.*`; only bare `attrs.*`.
    {
      code: '<template>{{this.attrs.foo}}</template>',
      filename: 'app/templates/components/foo.hbs',
    },
    // Pod-style components path matches the gate, but no `attrs` usage.
    {
      code: '<template>{{@value}}</template>',
      filename: 'app/components/foo/template.hbs',
    },
    // `-components/` path gate, no `attrs` usage.
    {
      code: '<template>{{@value}}</template>',
      filename: 'app/ui-components/foo.hbs',
    },
  ],
  invalid: [
    // Bare `attrs.*` inside `templates/components/` — flagged.
    {
      code: '<template>{{attrs.foo}}</template>',
      filename: 'app/templates/components/foo.hbs',
      output: null,
      errors: [{ messageId: 'noAttrs' }],
    },
    // Bare `attrs` (no dotted tail) inside `templates/components/` — flagged.
    {
      code: '<template>{{attrs}}</template>',
      filename: 'app/templates/components/foo.hbs',
      output: null,
      errors: [{ messageId: 'noAttrs' }],
    },
    // Pod-style path `components/*/template` — flagged.
    {
      code: '<template>{{attrs.name}}</template>',
      filename: 'app/components/foo/template.hbs',
      output: null,
      errors: [{ messageId: 'noAttrs' }],
    },
    // `ui/components` path — flagged.
    {
      code: '<template>{{attrs.name}}</template>',
      filename: 'app/ui/components/foo.hbs',
      output: null,
      errors: [{ messageId: 'noAttrs' }],
    },
    // `-components/` path — flagged.
    {
      code: '<template>{{attrs.name}}</template>',
      filename: 'app/ui-components/foo.hbs',
      output: null,
      errors: [{ messageId: 'noAttrs' }],
    },
  ],
});
