// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-return-from-computed');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

eslintTester.run('require-return-from-computed', rule, {
  valid: [
    'let foo = computed("test", function() { return ""; })',
    'let foo = computed("test", { get() { return true; }, set() { return true; } })',
    'let foo = computed("test", function() { if (true) { return ""; } return ""; })',
    'let foo = computed("test", { get() { data.forEach(function() { }); return true; }, set() { return true; } })',
    'let foo = computed("test", function() { data.forEach(function() { }); return ""; })',
  ],
  invalid: [
    {
      code: 'let foo = computed("test", function() { })',
      output: null,
      errors: [
        {
          message: 'Always return a value from computed properties',
        },
      ],
    },
    {
      code: 'let foo = computed("test", function() { if (true) { return ""; } })',
      output: null,
      errors: [
        {
          message: 'Always return a value from computed properties',
        },
      ],
    },
    {
      code: 'let foo = computed("test", { get() {}, set() {} })',
      output: null,
      errors: [
        {
          message: 'Always return a value from computed properties',
        },
        {
          message: 'Always return a value from computed properties',
        },
      ],
    },
    {
      code: 'let foo = computed({ get() { return "foo"; }, set() { }})',
      output: null,
      errors: [
        {
          message: 'Always return a value from computed properties',
        },
      ],
    },
    {
      code: 'let foo = computed({ get() { }, set() { return "foo"; }})',
      output: null,
      errors: [
        {
          message: 'Always return a value from computed properties',
        },
      ],
    },
  ],
});
