const rule = require('../../../lib/rules/template-no-aria-unsupported-elements');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-aria-unsupported-elements', rule, {
  valid: [
    '<template><div role="button" aria-label="Submit"></div></template>',
    '<template><button aria-pressed="true">Toggle</button></template>',
    '<template><input aria-label="Username"></template>',
    // These elements are not in the unsupported set (only html, meta, script, style are)
    '<template><title aria-label="Page Title"></title></template>',
    '<template><head role="banner"></head></template>',
    '<template><base aria-hidden="true"></template>',
    '<template><link aria-label="Stylesheet"></template>',
  ],

  invalid: [
    {
      code: '<template><meta role="button"></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template><script aria-label="Script"></script></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template><style role="presentation"></style></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template><html role="application"></html></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
  ],
});
