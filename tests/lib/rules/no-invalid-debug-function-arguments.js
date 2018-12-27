//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-invalid-debug-function-arguments');
const RuleTester = require('eslint').RuleTester;

const { DEBUG_FUNCTIONS, ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const VALID_USAGES_BASIC = [
  {
    code: "myFunction(true, 'My string.');"
  },
  {
    code: "Ember.myFunction(true, 'My string.');"
  }
];

const VALID_USAGES_FOR_EACH_DEBUG_FUNCTION = flatten(DEBUG_FUNCTIONS.map(debugFunction => [
  {
    code: `OtherClass.${debugFunction}(true, 'My string.');`
  },
  {
    code: `${debugFunction}();`
  },
  {
    code: `Ember.${debugFunction}();`
  },
  {
    code: `${debugFunction}('My description.');`
  },
  {
    code: `Ember.${debugFunction}('My description.');`
  },
  {
    code: `${debugFunction}('My description.', true);`
  },
  {
    code: `Ember.${debugFunction}('My description.', true);`
  },
  {
    code: `${debugFunction}('My description.', true, { id: 'some-id' });`
  },
  {
    code: `Ember.${debugFunction}('My description.', true, { id: 'some-id' });`
  },
  {
    code: `const CONDITION = true; ${debugFunction}('My description.', CONDITION);`
  },
  {
    code: `const DESCRIPTION = 'description'; ${debugFunction}(DESCRIPTION, true);`
  },
  {
    code: `const DESCRIPTION = 'description'; const CONDITION = true; ${debugFunction}(DESCRIPTION, CONDITION);`
  }
]));

const VALID_USAGES = [
  ...VALID_USAGES_BASIC,
  ...VALID_USAGES_FOR_EACH_DEBUG_FUNCTION
];

const INVALID_USAGES = flatten(DEBUG_FUNCTIONS.map(debugFunction => [
  {
    code: `${debugFunction}(true, 'My description.');`,
    errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
  },
  {
    code: `Ember.${debugFunction}(true, 'My description.');`,
    errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
  },
  {
    code: `${debugFunction}(true, 'My description.', { id: 'some-id' });`,
    errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
  },
  {
    code: `Ember.${debugFunction}(true, 'My description.', { id: 'some-id' });`,
    errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
  },
  {
    code: `${debugFunction}(true, \`My \${123} description.\`);`,
    errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
  },
  {
    code: `const CONDITION = true; ${debugFunction}(CONDITION, 'My description.');`,
    errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
  },
  {
    code: `const CONDITION = true; ${debugFunction}(CONDITION, \`My \${123} description.\`);`,
    errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
  }
]));

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module'
  }
});

ruleTester.run('no-invalid-debug-function-arguments', rule, {
  valid: VALID_USAGES,
  invalid: INVALID_USAGES
});

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function flatten(arr) {
  return arr.reduce((acc, val) => acc.concat(val));
}
