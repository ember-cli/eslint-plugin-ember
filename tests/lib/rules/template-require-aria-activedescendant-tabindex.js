const rule = require('../../../lib/rules/template-require-aria-activedescendant-tabindex');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-require-aria-activedescendant-tabindex', rule, {
  valid: [
    '<template><div aria-activedescendant="item-1" tabindex="0">List</div></template>',
    '<template><div aria-activedescendant="item-2" tabindex="-1">List</div></template>',
    '<template><div>Normal div</div></template>',
  
    // Test cases ported from ember-template-lint
    '<template><div tabindex="-1"></div></template>',
    '<template><div aria-activedescendant="some-id" tabindex=0></div></template>',
    '<template><input aria-activedescendant="some-id" /></template>',
    '<template><input aria-activedescendant={{foo}} tabindex={{0}} /></template>',
    '<template><div aria-activedescendant="option0" tabindex="0"></div></template>',
    '<template><CustomComponent aria-activedescendant="choice1" /></template>',
    '<template><CustomComponent aria-activedescendant="option1" tabIndex="-1" /></template>',
    '<template><CustomComponent aria-activedescendant={{foo}} tabindex={{bar}} /></template>',
  ],

  invalid: [
    {
      code: '<template><div aria-activedescendant="item-1">List</div></template>',
      output: null,
      errors: [{ messageId: 'missingTabindex' }],
    },
    {
      code: '<template><ul aria-activedescendant="option-1">Options</ul></template>',
      output: null,
      errors: [{ messageId: 'missingTabindex' }],
    },
    {
      code: '<template><span aria-activedescendant="elem">Container</span></template>',
      output: null,
      errors: [{ messageId: 'missingTabindex' }],
    },
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><input aria-activedescendant="option0" tabindex="-2" /></template>',
      output: null,
      errors: [{ messageId: 'missingTabindex' }],
    },
    {
      code: '<template><div aria-activedescendant={{bar}} /></template>',
      output: null,
      errors: [{ messageId: 'missingTabindex' }],
    },
    {
      code: '<template><div aria-activedescendant={{foo}} tabindex={{-1}}></div></template>',
      output: null,
      errors: [{ messageId: 'missingTabindex' }],
    },
    {
      code: '<template><div aria-activedescendant="fixme" tabindex=-100></div></template>',
      output: null,
      errors: [{ messageId: 'missingTabindex' }],
    },
  ],
});
