const rule = require('../../../lib/rules/template-no-bare-strings');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-bare-strings', rule, {
  valid: [
    '<template>{{t "hello.world"}}</template>',
    '<template><div>&amp;</div></template>',
    '<template><div>   </div></template>',
    {
      code: '<template><div>Welcome</div></template>',
      options: [{ allowlist: ['Welcome'] }],
    },
  ],

  invalid: [
    {
      code: '<template><div>Hello World</div></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><button>Click me</button></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
    {
      code: '<template><p>Some text content here</p></template>',
      output: null,
      errors: [{ messageId: 'bareString' }],
    },
  ],
});
