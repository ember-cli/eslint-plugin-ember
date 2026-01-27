const rule = require('../../../lib/rules/template-no-unavailable-this');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-unavailable-this', rule, {
  valid: [
    // this inside a class body
    `import Component from '@glimmer/component';
     class MyComponent extends Component {
       <template>{{this.name}}</template>
     }`,
    // this inside a function
    `function myComponent() {
       return <template>{{this.name}}</template>;
     }`,
    // this inside an arrow function that is inside a class (arrow inherits this from class)
    `import Component from '@glimmer/component';
     class MyComponent extends Component {
       foo = () => {
         return <template>{{this.name}}</template>;
       }
     }`,
    // No this at all
    '<template>{{@value}}</template>',
    '<template><div>Content</div></template>',
    // yield this inside a class (this is valid, other rules handle yield specifics)
    `import Component from '@glimmer/component';
     class MyComponent extends Component {
       <template>{{yield this}}</template>
     }`,
  ],
  invalid: [
    // this.property at module level
    {
      code: '<template>{{this.name}}</template>',
      output: null,
      errors: [{ messageId: 'noUnavailableThis' }],
    },
    // bare this at module level
    {
      code: '<template>{{this}}</template>',
      output: null,
      errors: [{ messageId: 'noUnavailableThis' }],
    },
    // yield this at module level (this rule catches the `this`, yield rule catches yield semantics)
    {
      code: '<template>{{yield this}}</template>',
      output: null,
      errors: [{ messageId: 'noUnavailableThis' }],
    },
    // multiple this references at module level
    {
      code: '<template>{{this.foo}} {{this.bar}}</template>',
      output: null,
      errors: [{ messageId: 'noUnavailableThis' }, { messageId: 'noUnavailableThis' }],
    },
    // deeply nested this.property at module level
    {
      code: '<template>{{this.foo.bar.baz}}</template>',
      output: null,
      errors: [{ messageId: 'noUnavailableThis' }],
    },
    // arrow function at module level (arrow functions don't have their own this)
    {
      code: `const myComponent = () => {
       return <template>{{this}}</template>;
     }`,
      output: null,
      errors: [{ messageId: 'noUnavailableThis' }],
    },
  ],
});
