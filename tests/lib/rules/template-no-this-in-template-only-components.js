const rule = require('../../../lib/rules/template-no-this-in-template-only-components');
const RuleTester = require('eslint').RuleTester;

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
