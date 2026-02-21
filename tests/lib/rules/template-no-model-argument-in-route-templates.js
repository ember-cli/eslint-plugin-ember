//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-model-argument-in-route-templates');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-model-argument-in-route-templates', rule, {
  valid: [
    {
      filename: 'app/templates/index.hbs',
      code: '<template>{{this.model}}</template>',
    },
    {
      filename: 'app/templates/users.hbs',
      code: '<template>{{@data}}</template>',
    },
    {
      filename: 'app/components/user-card.gjs',
      code: '<template>{{@model}}</template>',
    },
  
    // Test cases ported from ember-template-lint
    '<template>{{model}}</template>',
    '<template>{{@modelythingy}}</template>',
  ],
  invalid: [
    {
      filename: 'app/templates/index.hbs',
      code: '<template>{{@model}}</template>',
      output: '<template>{{this.model}}</template>',
      errors: [{ messageId: 'noModelArgumentInRouteTemplates' }],
    },
    {
      filename: 'app/templates/users.hbs',
      code: '<template>{{@model.name}}</template>',
      output: '<template>{{this.model.name}}</template>',
      errors: [{ messageId: 'noModelArgumentInRouteTemplates' }],
    },
    {
      filename: 'app/templates/posts/show.hbs',
      code: '<template>{{@model.id}}</template>',
      output: '<template>{{this.model.id}}</template>',
      errors: [{ messageId: 'noModelArgumentInRouteTemplates' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template>{{@model.foo}}</template>',
      output: null,
      errors: [{ messageId: 'noModelArgumentInRouteTemplates' }],
    },
    {
      code: '<template>{{@model.foo.bar}}</template>',
      output: null,
      errors: [{ messageId: 'noModelArgumentInRouteTemplates' }],
    },
  ],
});
