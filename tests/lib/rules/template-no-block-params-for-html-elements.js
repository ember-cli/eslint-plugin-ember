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
    '<template><div></div></template>',
    '<template><Checkbox as |blockName|></Checkbox></template>',
    '<template><@nav.Link as |blockName|></@nav.Link></template>',
    '<template><this.foo as |blah|></this.foo></template>',
    '<template>{{#let (component \'foo\') as |bar|}} <bar @name="1" as |n|><n/></bar> {{/let}}</template>',
    '<template><Something><:Item as |foo|></:Item></Something></template>',
    '<template><Layouts.Navigation @tag="div" as |navs|><navs></navs></Layouts.Navigation></template>',
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
    {
      code: '<template><div as |blockName|></div></template>',
      output: null,
      errors: [{ message: 'Block params can only be used with components, not HTML elements.' }],
    },
    {
      code: '<template><div as |a b c|></div></template>',
      output: null,
      errors: [{ message: 'Block params can only be used with components, not HTML elements.' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-block-params-for-html-elements (hbs)', rule, {
  valid: [
    '<div></div>',
    '<Checkbox as |blockName|></Checkbox>',
    '<@nav.Link as |blockName|></@nav.Link>',
    '<this.foo as |blah|></this.foo>',
    '{{#let (component \'foo\') as |bar|}} <bar @name="1" as |n|><n/></bar> {{/let}}',
    '<Something><:Item as |foo|></:Item></Something>',
    '<Layouts.Navigation @tag="div" as |navs|><navs></navs></Layouts.Navigation>',
  ],
  invalid: [
    {
      code: '<div as |blockName|></div>',
      output: null,
      errors: [{ message: 'Block params can only be used with components, not HTML elements.' }],
    },
    {
      code: '<div as |a b c|></div>',
      output: null,
      errors: [{ message: 'Block params can only be used with components, not HTML elements.' }],
    },
  ],
});
