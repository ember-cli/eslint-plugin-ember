const rule = require('../../../lib/rules/template-attribute-order');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-attribute-order', rule, {
  valid: [
    '<template><div class="foo" id="bar"></div></template>',
    '<template><button class="btn" role="button" aria-label="Submit"></button></template>',
    '<template><input type="text" name="username" value=""></template>',
    '<template><div data-test-id="foo"></div></template>',
  ],

  invalid: [
    {
      code: '<template><div id="bar" class="foo"></div></template>',
      output: null,
      errors: [{ messageId: 'wrongOrder' }],
    },
    {
      code: '<template><button aria-label="Submit" role="button"></button></template>',
      output: null,
      errors: [{ messageId: 'wrongOrder' }],
    },
    {
      code: '<template><input name="username" type="text"></template>',
      output: null,
      errors: [{ messageId: 'wrongOrder' }],
    },
  ],
});
