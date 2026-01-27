const rule = require('../../../lib/rules/template-no-aria-hidden-body');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-aria-hidden-body', rule, {
  valid: [
    '<template><body></body></template>',
    '<template><div aria-hidden="true"></div></template>',
    '<template><body><h1>Hello world</h1></body></template>',
    '<template><body><p aria-hidden="true">Some things are better left unsaid</p></body></template>',
  ],
  invalid: [
    {
      code: '<template><body aria-hidden="true"></body></template>',
      output: '<template><body></body></template>',
      errors: [{ messageId: 'noAriaHiddenBody' }],
    },
    {
      code: '<template><body aria-hidden></body></template>',
      output: '<template><body></body></template>',
      errors: [{ messageId: 'noAriaHiddenBody' }],
    },
  ],
});

const hbsRuleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser/hbs'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

hbsRuleTester.run('template-no-aria-hidden-body (hbs)', rule, {
  valid: [
    '<body></body>',
    '<body><h1>Hello world</h1></body>',
    '<body><p aria-hidden="true">Some things are better left unsaid</p></body>',
  ],
  invalid: [
    {
      code: '<body aria-hidden="true"></body>',
      output: '<body></body>',
      errors: [{ messageId: 'noAriaHiddenBody' }],
    },
    {
      code: '<body aria-hidden></body>',
      output: '<body></body>',
      errors: [{ messageId: 'noAriaHiddenBody' }],
    },
  ],
});
