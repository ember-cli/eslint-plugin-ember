// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-return-from-computed');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('require-return-from-computed', rule, {
  valid: [
    {
      code: 'let foo = computed("test", function() { return ""; })',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'let foo = computed("test", { get() { return true; }, set() { return true; } })',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'let foo = computed("test", function() { if (true) { return ""; } return ""; })',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'let foo = computed("test", { get() { data.forEach(function() { }); return true; }, set() { return true; } })',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'let foo = computed("test", function() { data.forEach(function() { }); return ""; })',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    }
  ],
  invalid: [
    {
      code: 'let foo = computed("test", function() { })',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Always return a value from computed properties'
      }]
    },
    {
      code: 'let foo = computed("test", function() { if (true) { return ""; } })',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Always return a value from computed properties'
      }]
    },
    {
      code: 'let foo = computed("test", { get() {}, set() {} })',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          message: 'Always return a value from computed properties'
        },
        {
          message: 'Always return a value from computed properties'
        }
      ]
    },
    {
      code: 'let foo = computed("test", function() { })',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Always return a value from computed properties'
      }]
    },
    {
      code: 'let foo = computed({ get() { return "foo"; }, set() { }})',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Always return a value from computed properties'
      }]
    },
    {
      code: 'let foo = computed({ get() { }, set() { return "foo"; }})',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Always return a value from computed properties'
      }]
    }
  ],
});
