//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-get-properties');
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

ruleTester.run('no-get-properties', rule, {
  valid: [
    // Not `this`.
    "myObject.getProperties('abc', 'def');",
    "this.get('something').getProperties('abc', 'def');",

    // Template literals.
    'this.getProperties(`abc`, `def`);',
    'getProperties(this, `abc`, `def`);',

    // Destructuring assignment with nested path.
    "this.getProperties('foo', 'bar.baz');",
    "this.getProperties(['foo', 'bar.baz']);", // With parameters in array.
    "getProperties(this, 'foo', 'bar.baz');",
    "getProperties(this, ['foo', 'bar.baz']);", // With parameters in array.

    // With non-string parameter.
    'this.getProperties(MY_PROP);',
    'this.getProperties([MY_PROP]);',
    'getProperties(this, MY_PROP);',
    'getProperties(this, [MY_PROP]);'
  ],
  invalid: [
    {
      code: "this.getProperties('abc', 'def');",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    },
    {
      code: "this.getProperties(['abc', 'def']);", // With parameters in array.
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    },
    {
      code: "getProperties(this, 'abc', 'def');",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    },
    {
      code: "getProperties(this, ['abc', 'def']);", // With parameters in array.
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    },
  ]
});
