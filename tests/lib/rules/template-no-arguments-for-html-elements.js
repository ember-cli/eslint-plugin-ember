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
    // Custom elements aren't in the html-tags/svg-tags allowlists, so they're
    // not flagged. Accepted false negative — web component namespace is open.
    '<template><my-element @foo="x" /></template>',
    // Namespaced/path component invocations aren't in the allowlists either.
    '<template><NS.Foo @bar="baz" /></template>',
    // Named blocks (colon-prefixed) aren't in the allowlists either.
    '<template><Thing><:slot @item="x">content</:slot></Thing></template>',
    `let div = <template>{{@greeting}}</template>

<template>
  <div @greeting="hello" />
</template>`,
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
    {
      // SVG element — in svg-tags allowlist.
      code: '<template><circle @r="5" /></template>',
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
      // MathML element — in mathml-tag-names allowlist.
      code: '<template><mfrac @numerator="x" /></template>',
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
