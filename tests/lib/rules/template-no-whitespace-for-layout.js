//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-whitespace-for-layout');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-whitespace-for-layout', rule, {
  valid: [
    '<template><div>Hello World</div></template>',
    '<template><div>Hello  World</div></template>',
    '<template><div>Text</div></template>',
  ],
  invalid: [
    {
      code: '<template><div>Hello   World</div></template>',
      output: null,
      errors: [{ messageId: 'noWhitespaceForLayout' }],
    },
    {
      code: '<template><div>Text    with    spaces</div></template>',
      output: null,
      errors: [{ messageId: 'noWhitespaceForLayout' }],
    },
    {
      code: '<template><div>Multiple     spaces</div></template>',
      output: null,
      errors: [{ messageId: 'noWhitespaceForLayout' }],
    },
  ],
});
