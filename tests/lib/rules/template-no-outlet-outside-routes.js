//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-outlet-outside-routes');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-outlet-outside-routes', rule, {
  valid: [
    '<template><div>Content</div></template>',
    '<template>{{foo}}</template>',
    '<template>{{button}}</template>',
  ],
  invalid: [
    {
      code: '<template>{{outlet}}</template>',
      output: null,
      errors: [{ messageId: 'noOutletOutsideRoutes' }],
    },
    {
      code: '<template><div>{{outlet}}</div></template>',
      output: null,
      errors: [{ messageId: 'noOutletOutsideRoutes' }],
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

hbsRuleTester.run('template-no-outlet-outside-routes', rule, {
  valid: [
    '{{foo}}',
    '{{button}}',
    '{{#outlet}}Why?!{{/outlet}}',
    '{{#outlet}}Works because ambiguous{{/outlet}}',
  ],
  invalid: [],
});
