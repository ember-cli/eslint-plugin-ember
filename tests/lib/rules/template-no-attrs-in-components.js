const rule = require('../../../lib/rules/template-no-attrs-in-components');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-attrs-in-components', rule, {
  valid: [
    '<template>{{@value}}</template>',
    '<template>{{this.value}}</template>',
    // Class component with normal this access
    `import Component from '@glimmer/component';
     class MyComponent extends Component {
       <template>{{this.args.name}}</template>
     }`,
    // Bare attrs is not accessible without this, so it's allowed
    '<template>{{attrs.value}}</template>',
    '<template>{{attrs}}</template>',
    `import Component from '@glimmer/component';
     class MyComponent extends Component {
       <template>{{attrs.name}}</template>
     }`,
  ],
  invalid: [
    {
      code: '<template>{{this.attrs.value}}</template>',
      output: null,
      errors: [{ messageId: 'noThisAttrs' }],
    },
    {
      code: '<template>{{this.attrs}}</template>',
      output: null,
      errors: [{ messageId: 'noThisAttrs' }],
    },
    // Class component using this.attrs
    {
      code: `import Component from '@glimmer/component';
       class MyComponent extends Component {
         <template>{{this.attrs.name}}</template>
       }`,
      output: null,
      errors: [{ messageId: 'noThisAttrs' }],
    },
  ],
});
