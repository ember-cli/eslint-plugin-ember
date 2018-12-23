// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-computed-without-dependent-keys');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('no-computed-without-dependent-keys', rule, {
  valid: [
    { code: '{ test: computed("a", "b", function() {}) }' },
    { code: '{ test: computed(function() {}).volatile() }' },
    { code: '{ test: computed.and("a", "b") }' }
  ],
  invalid: [
    {
      code: '{ test: computed(function() {}) }',
      errors: [{
        message: 'A computed property needs dependent keys'
      }]
    },
    {
      code: '{ test: computed(function() {}).readOnly() }',
      errors: [{
        message: 'A computed property needs dependent keys'
      }]
    },
  ],
});
