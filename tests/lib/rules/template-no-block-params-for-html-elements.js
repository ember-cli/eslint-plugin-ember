const rule = require('../../../lib/rules/template-no-block-params-for-html-elements');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-block-params-for-html-elements', rule, {
  valid: [
    `let div = <template>{{yield "hello"}}</template>;
    <template>
      <div as |greeting|>{{greeting}}</div>
    </template>
    `,
    '<template><div>Content</div></template>',
    '<template><MyComponent as |item|>{{item.name}}</MyComponent></template>',
    '<template>{{#each this.items as |item|}}<li>{{item}}</li>{{/each}}</template>',
    '<template><button>Click</button></template>',
  ],

  invalid: [
    {
      code: '<template><div as |content|>{{content}}</div></template>',
      output: null,
      errors: [
        {
          message: 'Block params can only be used with components, not HTML elements.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: '<template><section as |data|><p>{{data}}</p></section></template>',
      output: null,
      errors: [
        {
          message: 'Block params can only be used with components, not HTML elements.',
          type: 'GlimmerElementNode',
        },
      ],
    },
    {
      code: '<template><ul as |items|><li>{{items}}</li></ul></template>',
      output: null,
      errors: [
        {
          message: 'Block params can only be used with components, not HTML elements.',
          type: 'GlimmerElementNode',
        },
      ],
    },
  ],
});
