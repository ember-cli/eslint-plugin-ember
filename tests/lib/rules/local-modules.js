// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/local-modules');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('local-modules', rule, {
  valid: [
    {
      code: 'export default Model.extend()',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Model.extend({})',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Route.extend({})',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'title: attr("string")',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'title: computed.alias("test")',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'Ember.MODEL_FACTORY_INJECTIONS = true;',
      parserOptions: { ecmaVersion: 6 },
    },
  ],
  invalid: [
    {
      code: 'export default DS.Model.extend({})',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Create local version of DS.Model',
        },
      ],
    },
    {
      code: 'export default Ember.Route.extend({});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Create local version of Ember.Route',
        },
      ],
    },
    {
      code: 'title: DS.attr("string")',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Create local version of DS.attr',
        },
      ],
    },
    {
      code: 'title: Ember.computed.alias("test")',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Create local version of Ember.computed',
        },
      ],
    },
  ],
});
