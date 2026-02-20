const rule = require('../../../lib/rules/template-no-curly-component-invocation');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

function generateError(name) {
  const parts = name.split('/');
  const angleBracketName = parts
    .map((part) => {
      return part
        .split('-')
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join('');
    })
    .join('::');
  return `You are using the component {{${name}}} with curly component syntax. You should use <${angleBracketName}> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. \`'no-curly-component-invocation': { allow: ['${name}'] }\`.`;
}

ruleTester.run('template-no-curly-component-invocation', rule, {
  valid: [
    '<template>{{foo}}</template>',
    '<template>{{foo.bar}}</template>',
    '<template>{{42}}</template>',
    '<template>{{true}}</template>',
    '<template>{{foo bar}}</template>',
    '<template>{{#each items as |item|}}{{item}}{{/each}}</template>',
    '<template>{{#if someProperty}}yay{{/if}}</template>',
    '<template><FooBar /></template>',
    '<template>{{#some-component foo="bar"}}foo{{/some-component}}</template>',
    {
      code: '<template>{{foo-bar}}</template>',
      options: [{ allow: ['foo-bar'] }],
    },
  ],
  invalid: [
    {
      code: '<template>{{foo-bar}}</template>',
      output: null,
      errors: [
        {
          message: generateError('foo-bar'),
        },
      ],
    },
    {
      code: '<template>{{nested/component}}</template>',
      output: null,
      errors: [
        {
          message: generateError('nested/component'),
        },
      ],
    },
    {
      code: '<template>{{#foo-bar}}content{{/foo-bar}}</template>',
      output: null,
      errors: [
        {
          message:
            "You are using the component {{#foo-bar}} with curly component syntax. You should use <FooBar> instead. If it is actually a helper you must manually add it to the 'no-curly-component-invocation' rule configuration, e.g. `'no-curly-component-invocation': { allow: ['foo-bar'] }`.",
        },
      ],
    },
  ],
});
