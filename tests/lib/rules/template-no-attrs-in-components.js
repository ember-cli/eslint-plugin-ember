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
    '<template>{{attrs}}</template>',

    '<template><div></div></template>',
    '<template>{{foo}}</template>',
    '<template><div>{{foo.bar}}</div></template>',
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
    {
      code: '<template>{{attrs.foo}}</template>',
      output: null,
      errors: [{ messageId: 'noThisAttrs' }],
    },
    {
      code: '<template><div class={{attrs.foo}}></div></template>',
      output: null,
      errors: [{ messageId: 'noThisAttrs' }],
    },
    {
      code: '<template>{{#if attrs.foo}}bar{{/if}}</template>',
      output: null,
      errors: [{ messageId: 'noThisAttrs' }],
    },
    {
      code: '<template>{{bar foo=attrs.foo}}</template>',
      output: null,
      errors: [{ messageId: 'noThisAttrs' }],
    },
    {
      code: '<template>{{component attrs.foo}}</template>',
      output: null,
      errors: [{ messageId: 'noThisAttrs' }],
    },
    {
      code: '<template>{{bar/baz (hash foo=attrs.foo)}}</template>',
      output: null,
      errors: [{ messageId: 'noThisAttrs' }],
    },
  ],
});
