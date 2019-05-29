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
    // Simple variable declaration.
    'const abc = 123;',

    // Not `this`.
    "const { abc, def } = myObject.getProperties('abc', 'def');",
    "const { abc, def } = this.get('something').getProperties('abc', 'def');",

    // Template literals.
    'const { abc, def } = this.getProperties(`abc`, `def`);',
    'const { abc, def } = getProperties(this, `abc`, `def`);',

    // Destructuring assignment but no `getProperties`.
    'const { abc, def } = this;',

    // No destructuring.
    "const properties = this.getProperties('abc', 'def');",
    "const properties = this.getProperties(['abc', 'def']);", // With parameters in array.
    "const properties = getProperties(this, 'abc', 'def');",
    "const properties = getProperties(this, ['abc', 'def']);", // With parameters in array.

    // Destructuring assignment with nested path.
    "const { foo, barBaz } = this.getProperties('foo', 'bar.baz');",
    "const { foo, barBaz } = this.getProperties(['foo', 'bar.baz']);", // With parameters in array.
    "const { foo, barBaz } = getProperties(this, 'foo', 'bar.baz');",
    "const { foo, barBaz } = getProperties(this, ['foo', 'bar.baz']);", // With parameters in array.

    // With some wrapping function call.
    "const { abc, def } = someFunction(this.getProperties('abc', 'def'));",

    // With non-string parameter.
    'const { abc } = this.getProperties(MY_PROP);',
    'const { abc } = this.getProperties([MY_PROP]);',
    'const { abc } = getProperties(this, MY_PROP);',
    'const { abc } = getProperties(this, [MY_PROP]);'
  ],
  invalid: [
    {
      code: "const { abc, def } = this.getProperties('abc', 'def');",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    },
    {
      code: "const { abc, def } = this.getProperties(['abc', 'def']);", // With parameters in array.
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    },
    {
      code: "const { abc, def } = getProperties(this, 'abc', 'def');",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    },
    {
      code: "const { abc, def } = getProperties(this, ['abc', 'def']);", // With parameters in array.
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    },

    // With `let`.
    {
      code: "let { abc, def } = this.getProperties('abc', 'def');",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    }
  ]
});
