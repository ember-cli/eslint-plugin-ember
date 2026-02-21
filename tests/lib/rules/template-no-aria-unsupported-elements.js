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
  
    // Test cases ported from ember-template-lint
    '<template><meta charset="UTF-8" /></template>',
    '<template><html lang="en"></html></template>',
    '<template><script></script></template>',
    '<template><div></div></template>',
    '<template><div aria-foo="true"></div></template>',
    '<template><div role="foo"></div></template>',
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
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><meta charset="UTF-8" aria-hidden="false" /></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template><html lang="en" role="application"></html></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
    {
      code: '<template><script aria-hidden="false"></script></template>',
      output: null,
      errors: [{ messageId: 'unsupported' }],
    },
  ],
});
