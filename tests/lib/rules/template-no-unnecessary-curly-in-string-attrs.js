//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-unnecessary-curly-in-string-attrs');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-unnecessary-curly-in-string-attrs', rule, {
  valid: [
    '<template><div class="static">Text</div></template>',
    '<template><div class={{this.dynamic}}>Text</div></template>',
  ],
  invalid: [
    {
      code: '<template><div class={{"static"}}>Text</div></template>',
      output: null,
      errors: [{ messageId: 'unnecessaryCurlyInStringAttr' }],
    },
  ],
});
