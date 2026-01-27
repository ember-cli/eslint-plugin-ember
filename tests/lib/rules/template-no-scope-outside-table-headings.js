//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/template-no-scope-outside-table-headings');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('ember-eslint-parser'),
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('template-no-scope-outside-table-headings', rule, {
  valid: [
    '<template><th scope="col">Header</th></template>',
    '<template><td scope="row">Cell</td></template>',
    '<template><th scope="row">Header</th></template>',
    '<template><div>Content</div></template>',
  ],
  invalid: [
    {
      code: '<template><div scope="col">Not a table cell</div></template>',
      output: null,
      errors: [{ messageId: 'noScopeOutsideTableHeadings' }],
    },
    {
      code: '<template><span scope="row">Wrong element</span></template>',
      output: null,
      errors: [{ messageId: 'noScopeOutsideTableHeadings' }],
    },
    {
      code: '<template><p scope="col">Paragraph</p></template>',
      output: null,
      errors: [{ messageId: 'noScopeOutsideTableHeadings' }],
    },
  ],
});
