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

    // Decorator:
    {
      // TODO: this should be an invalid test case.
      // Still missing native class and decorator support: https://github.com/ember-cli/eslint-plugin-ember/issues/560
      code: 'class Test { @computed() get someProp() {} }',
      parser: require.resolve('babel-eslint'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: { legacyDecorators: true },
      },
    },
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
