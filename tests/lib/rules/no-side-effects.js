// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-side-effects');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('no-side-effects', rule, {
  valid: [
    {
      code: 'testAmount: alias("test.length")',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'testAmount: computed("test.length", { get() { return ""; }, set() { set(this, "testAmount", test.length); }})',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'let foo = computed("test", function() { someMap.set(this, "testAmount", test.length); return ""; })',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'import Ember from "ember"; import Foo from "some-other-thing"; let foo = computed("test", function() { Foo.set(this, "testAmount", test.length); return ""; });',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    }
  ],
  invalid: [
    {
      code: 'prop: computed("test", function() {this.set("testAmount", test.length); return "";})',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Don\'t introduce side-effects in computed properties',
      }],
    }, {
      code: 'prop: computed("test", function() {set(this, "testAmount", test.length); return "";})',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Don\'t introduce side-effects in computed properties',
      }],
    },
    {
      code: 'prop: computed("test", function() {if (get(this, "testAmount")) { set(this, "testAmount", test.length); } return "";})',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Don\'t introduce side-effects in computed properties'
      }]
    },
    {
      code: 'testAmount: computed("test.length", { get() { set(this, "testAmount", test.length); }, set() { set(this, "testAmount", test.length); }})',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Don\'t introduce side-effects in computed properties'
      }]
    },
    {
      code: 'testAmount: computed("test.length", function() { const setSomething = () => { set(this, "testAmount", test.length); }; setSomething(); })',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Don\'t introduce side-effects in computed properties'
      }]
    },
    {
      code: 'let foo = computed("test", function() { Ember.set(this, "testAmount", test.length); return ""; })',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Don\'t introduce side-effects in computed properties'
      }]
    },
    {
      code: 'import Foo from "ember"; let foo = computed("test", function() { Foo.set(this, "testAmount", test.length); return ""; })',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Don\'t introduce side-effects in computed properties'
      }]
    },
    {
      code: 'import EmberFoo from "ember"; import Foo from "some-other-thing"; let foo = computed("test", function() { EmberFoo.set(this, "testAmount", test.length); return ""; });',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Don\'t introduce side-effects in computed properties'
      }]
    }
  ],
});
