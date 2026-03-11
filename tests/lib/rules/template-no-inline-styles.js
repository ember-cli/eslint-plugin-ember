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
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

hbsRuleTester.run('template-no-inline-styles', rule, {
  valid: [
    '<div></div>',
    '<span></span>',
    '<ul class="dummy"></ul>',
    '<div style={{foo}}></div>',
    '<div style={{html-safe (concat "background-image: url(" url ")")}}></div>',
  ],
  invalid: [
    {
      code: '<div style="width: 100px"></div>',
      output: null,
      errors: [{ messageId: 'noInlineStyles' }],
    },
    {
      code: '<div style="{{foo}} {{bar}}"></div>',
      output: null,
      errors: [{ messageId: 'noInlineStyles' }],
    },
    {
      code: '<div style=""></div>',
      output: null,
      errors: [{ messageId: 'noInlineStyles' }],
    },
    {
      code: '<div style="color:blue;margin-left:30px;"></div>',
      output: null,
      errors: [{ messageId: 'noInlineStyles' }],
    },
    {
      code: '<div style={{foo}}></div>',
      output: null,
      options: [{ allowDynamicStyles: false }],
      errors: [{ messageId: 'noInlineStyles' }],
    },
    {
      code: '<div style></div>',
      output: null,
      errors: [{ messageId: 'noInlineStyles' }],
    },
  ],
});
