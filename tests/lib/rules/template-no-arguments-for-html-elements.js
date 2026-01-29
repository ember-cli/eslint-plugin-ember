const rule = require('../../../lib/rules/template-no-arguments-for-html-elements');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-arguments-for-html-elements', rule, {
  valid: [
    '<template><div class="container">Content</div></template>',
    '<template><button type="submit">Submit</button></template>',
    '<template><MyComponent @title="Hello" @onClick={{this.handler}} /></template>',
    '<template><CustomButton @disabled={{true}} /></template>',
    '<template><input value={{this.value}} /></template>',
  ],

  invalid: [
    {
      code: '<template><div @title="Hello">Content</div></template>',
      output: null,
      errors: [
        {
          message:
            '@arguments can only be used on components, not HTML elements. Use regular attributes instead.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: '<template><button @onClick={{this.handler}}>Click</button></template>',
      output: null,
      errors: [
        {
          message:
            '@arguments can only be used on components, not HTML elements. Use regular attributes instead.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
    {
      code: '<template><span @data={{this.info}}>Text</span></template>',
      output: null,
      errors: [
        {
          message:
            '@arguments can only be used on components, not HTML elements. Use regular attributes instead.',
          type: 'GlimmerAttrNode',
        },
      ],
    },
  ],
});
