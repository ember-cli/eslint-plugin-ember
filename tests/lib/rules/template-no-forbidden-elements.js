const rule = require('../../../lib/rules/template-no-forbidden-elements');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-forbidden-elements', rule, {
  valid: [{ code: '<template><div></div></template>', options: [['script']] }
    // Test cases ported from ember-template-lint
    '<template><header></header></template>',
    '<template><footer></footer></template>',
    '<template><p></p></template>',
    '<template><head><meta charset="utf-8"></head></template>',
  ],
  invalid: [
    {
      code: '<template><script></script></template>',
      output: null,
      options: [['script']],
      errors: [{ messageId: 'forbidden' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><html></html></template>',
      output: null,
      errors: [{ messageId: 'forbidden' }],
    },
    {
      code: '<template><style></style></template>',
      output: null,
      errors: [{ messageId: 'forbidden' }],
    },
    {
      code: '<template><meta charset="utf-8"></template>',
      output: null,
      errors: [{ messageId: 'forbidden' }],
    },
    {
      code: '<template><html></html></template>',
      output: null,
      errors: [{ messageId: 'forbidden' }],
    },
    {
      code: '<template><head><html></html></head></template>',
      output: null,
      errors: [{ messageId: 'forbidden' }],
    },
  ],
});
