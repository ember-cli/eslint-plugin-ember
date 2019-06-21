//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-volatile-computed-properties');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('no-volatile-computed-properties', rule, {
  valid: [
    'computed()',
    "computed('prop', function() { return this.prop; })",
    'computed().other()',
    'volatile()',
    'other().volatile()',
    'volatile().computed()',
  ],
  invalid: [
    {
      code: 'computed().volatile()',
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },

    {
      code: "computed('prop', function() { return this.prop; }).volatile()",
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },
  ],
});
