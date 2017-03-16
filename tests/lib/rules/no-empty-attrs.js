// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-empty-attrs');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
const message = 'Supply proper attribute type';

eslintTester.run('no-empty-attrs', rule, {
  valid: [
    {
      code: 'export default Model.extend();',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Model.extend({name: attr("string"), points: attr("number"), dob: attr("date")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Model.extend({name: attr("string")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: `someArrayOfStrings.filter(function(attr) {
        return attr.underscore();
      });`,
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: `export default Model.extend({
        someArray: someArrayOfStrings.filter(function(attr) {
          return attr.underscore();
        }),
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
  ],
  invalid: [
    {
      code: `export default Model.extend({
        name: attr(),
        points: attr("number"),
        dob: attr("date")
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Model.extend({
        name: attr("string"),
        points: attr("number"),
        dob: attr()
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message, line: 4 }],
    },
    {
      code: `export default Model.extend({
        name: attr("string"),
        points: attr(),
        dob: attr("date")
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message, line: 3 }],
    },
    {
      code: `export default Model.extend({
        name: attr("string"),
        points: attr(),
        dob: attr(),
        someComputedProperty: computed.bool(true)
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message, line: 3 }, { message, line: 4 }],
    },
    {
      code: `export default Model.extend({
        name: attr(),
        points: attr(),
        dob: attr()
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{ message, line: 2 }, { message, line: 3 }, { message, line: 4 }],
    },
  ],
});
