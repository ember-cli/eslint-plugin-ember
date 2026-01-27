const rule = require('../../../lib/rules/template-no-heading-inside-button');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-heading-inside-button', rule, {
  valid: [
    '<template><button>Click me</button></template>',
    '<template><h1>Title</h1></template>',
    '<template><div><h2>Heading</h2></div></template>',
  ],
  invalid: [
    {
      code: '<template><button><h1>Bad</h1></button></template>',
      output: null,
      errors: [{ messageId: 'noHeading' }],
    },
    {
      code: '<template><div role="button"><h2>Bad</h2></div></template>',
      output: null,
      errors: [{ messageId: 'noHeading' }],
    },
  ],
});
