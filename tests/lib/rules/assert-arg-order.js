//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/assert-arg-order');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module'
  }
});
ruleTester.run('assert-arg-order', rule, {
  valid: [
    {
      code: "myFunction(true, 'My string.');"
    },
    {
      code: "Ember.myFunction(true, 'My string.');"
    },
    {
      code: "OtherClass.assert(true, 'My string.');"
    },
    {
      code: "assert('My description.');"
    },
    {
      code: "Ember.assert('My description.');"
    },
    {
      code: "assert('My description.', true);"
    },
    {
      code: "Ember.assert('My description.', true);"
    },
    {
      code: "const CONDITION = true; assert('My description.', CONDITION);"
    },
    {
      code: "const DESCRIPTION = 'description'; assert(DESCRIPTION, true);"
    },
    {
      code: "const DESCRIPTION = 'description'; const CONDITION = true; assert(DESCRIPTION, CONDITION);"
    }
  ],
  invalid: [
    {
      code: "assert(true, 'My description.');",
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    },
    {
      code: "Ember.assert(true, 'My description.');",
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    },
    {
      code: 'assert(true, `My ${123} description.`);', // eslint-disable-line no-template-curly-in-string
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    },
    {
      code: "const CONDITION = true; assert(CONDITION, 'My description.');",
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    },
    {
      code: 'const CONDITION = true; assert(CONDITION, `My ${123} description.`);', // eslint-disable-line no-template-curly-in-string
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    }
  ]
});
