//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-bare-yield');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-bare-yield', rule, {
  valid: [
    // yield with params inside a class
    `import Component from '@glimmer/component';
     class MyComponent extends Component {
       <template>{{yield this}}</template>
     }`,
    // yield with params inside a function
    `function myComponent() {
       return <template>{{yield this}}</template>;
     }`,
    '<template>{{yield @model}}</template>',
    '<template><div>Content</div></template>',
    // yield this at module level is allowed by this rule (template-no-unavailable-this handles the `this` part)
    '<template>{{yield this}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{yield}}</template>',
      output: null,
      errors: [{ messageId: 'noBareYield' }],
    },
  ],
});
