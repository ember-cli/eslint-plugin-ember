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
      filename: 'app/templates/application.hbs',
      code: '<template>{{@value}}</template>',
    },
    {
      filename: 'app/templates/application.hbs',
      code: '<template>{{this.value}}</template>',
    },
    // `this.attrs.*` is not a real Ember API, but it is NOT what this rule
    // targets — only bare `attrs.*` is flagged. So outside of a component
    // template, `this.attrs.*` should not be flagged.
    {
      filename: 'app/templates/application.hbs',
      code: '<template>{{this.attrs.foo}}</template>',
    },
    // Even `attrs.*` itself is only flagged inside component templates.
    {
      filename: 'app/templates/application.hbs',
      code: '<template>{{attrs.value}}</template>',
    },
    // Inside a component template, non-attrs paths are fine.
    {
      filename: 'app/templates/components/foo.hbs',
      code: '<template>{{@value}}</template>',
    },
    {
      filename: 'app/templates/components/foo.hbs',
      code: '<template>{{this.value}}</template>',
    },
    // This rule does NOT flag `this.attrs.*`; only bare `attrs.*`.
    {
      filename: 'app/templates/components/foo.hbs',
      code: '<template>{{this.attrs.foo}}</template>',
    },
    // Pod-style components path matches the gate, but no `attrs` usage.
    {
      filename: 'app/components/foo/template.hbs',
      code: '<template>{{@value}}</template>',
    },
    // `-components/` path gate, no `attrs` usage.
    {
      filename: 'app/ui-components/foo.hbs',
      code: '<template>{{@value}}</template>',
    },
  ],
  invalid: [
    // Bare `attrs.*` inside `templates/components/` — flagged.
    {
      filename: 'app/templates/components/foo.hbs',
      code: '<template>{{attrs.foo}}</template>',
      output: null,
      errors: [{ messageId: 'noAttrs' }],
    },
    // Bare `attrs` (no dotted tail) inside `templates/components/` — flagged.
    {
      filename: 'app/templates/components/foo.hbs',
      code: '<template>{{attrs}}</template>',
      output: null,
      errors: [{ messageId: 'noAttrs' }],
    },
    // Pod-style path `components/*/template` — flagged.
    {
      filename: 'app/components/foo/template.hbs',
      code: '<template>{{attrs.name}}</template>',
      output: null,
      errors: [{ messageId: 'noAttrs' }],
    },
    // `ui/components` path — flagged.
    {
      filename: 'app/ui/components/foo.hbs',
      code: '<template>{{attrs.name}}</template>',
      output: null,
      errors: [{ messageId: 'noAttrs' }],
    },
    // `-components/` path — flagged.
    {
      filename: 'app/ui-components/foo.hbs',
      code: '<template>{{attrs.name}}</template>',
      output: null,
      errors: [{ messageId: 'noAttrs' }],
    },
  ],
});
