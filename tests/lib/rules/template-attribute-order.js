const rule = require('../../../lib/rules/template-attribute-order');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-attribute-order', rule, {
  valid: [
    // Alphabetized attributes
    '<template><div class="foo" id="bar"></div></template>',
    '<template><button aria-label="Submit" class="btn" role="button"></button></template>',
    '<template><input name="username" type="text" value=""></template>',
    '<template><div data-test-id="foo"></div></template>',
    // Arguments before attributes (default order)
    '<template><MyComponent @arg="val" class="foo" /></template>',
  ],

  invalid: [
    {
      code: '<template><div id="bar" class="foo"></div></template>',
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: '<template><button role="button" aria-label="Submit"></button></template>',
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
    },
    {
      code: '<template><input type="text" name="username"></template>',
      output: null,
      errors: [{ messageId: 'notAlphabetized' }],
    },
  ],
});
