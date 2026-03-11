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
