const rule = require('../../../lib/rules/template-no-inline-styles');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});
ruleTester.run('template-no-inline-styles', rule, {
  valid: [
    '<template><div class="foo"></div></template>',
    '<template><div></div></template>',
    '<template><span></span></template>',
    '<template><ul class="dummy"></ul></template>',
    '<template><div style={{foo}}></div></template>',
    '<template><div style={{html-safe (concat "background-image: url(" url ")")}}></div></template>',
  ],
  invalid: [
    {
      code: '<template><div style="color: red"></div></template>',
      output: null,
      errors: [{ messageId: 'noInlineStyles' }],
    },
    {
      code: '<template><div style="color:blue;margin-left:30px;"></div></template>',
      output: null,
      errors: [{ messageId: 'noInlineStyles' }],
    },
    {
      // ConcatStatement should be invalid even with allowDynamicStyles (default true)
      code: '<template><div style="{{foo}} bar"></div></template>',
      output: null,
      errors: [{ messageId: 'noInlineStyles' }],
    },
  ],
});
