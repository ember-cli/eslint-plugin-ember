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
    `let div = <template>{{@greeting}}</template>

<template>
  <div @greeting="hello" />
</template>`,
  
    // Test cases ported from ember-template-lint
    '<template><Input @name=1 /></template>',
    `<template>{{#let (component 'foo') as |bar|}} <bar @name="1" as |n|><n/></bar> {{/let}}</template>`,
    '<template><@externalComponent /></template>',
    `<template><MyComponent>
    <:slot @name="Header"></:slot>
  </MyComponent></template>`,
    '<template><@foo.bar @name="2" /></template>',
    '<template><this.name @boo="bar"></this.name></template>',
    '<template><@foo @name="2" /></template>',
    '<template><foo.some.name @name="1" /></template>',
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
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><div @value="1"></div></template>',
      output: null,
      errors: [{ message: '@arguments can only be used on components, not HTML elements. Use regular attributes instead.' }],
    },
    {
      code: '<template><div @value></div></template>',
      output: null,
      errors: [{ message: '@arguments can only be used on components, not HTML elements. Use regular attributes instead.' }],
    },
    {
      code: '<template><img @src="12"></template>',
      output: null,
      errors: [{ message: '@arguments can only be used on components, not HTML elements. Use regular attributes instead.' }],
    },
  ],
});
