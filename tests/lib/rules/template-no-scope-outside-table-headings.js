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
  
    // Test cases ported from ember-template-lint
    '<template><th scope="row">Some table heading></th></template>',
    `<template>
    <table>
      <th scope="col">Table header</th>
      <td>Some data</td>
    </table>
    </template>`,
    '<template><CustomComponent scope /></template>',
    '<template><CustomComponent scope="row" /></template>',
    '<template><CustomComponent scope={{foo}} /></template>',
    '<template>{{foo-component scope="row"}}</template>',
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
  
    // Test cases ported from ember-template-lint
    {
      code: '<template><td scope="row"></td></template>',
      output: null,
      errors: [{ messageId: 'noScopeOutsideTableHeadings' }],
    },
    {
      code: '<template><td scope></td></template>',
      output: null,
      errors: [{ messageId: 'noScopeOutsideTableHeadings' }],
    },
    {
      code: '<template><a scope="row" /></template>',
      output: null,
      errors: [{ messageId: 'noScopeOutsideTableHeadings' }],
    },
    {
      code: `<template>
<table>
<th>Some header</th>
<td scope="col">Some data</td>
</table>
</template>`,
      output: null,
      errors: [{ messageId: 'noScopeOutsideTableHeadings' }],
    },
  ],
});
