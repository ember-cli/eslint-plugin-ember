const rule = require('../../../lib/rules/no-get');
const RuleTester = require('eslint').RuleTester;

const { makeErrorMessageForGet, ERROR_MESSAGE_GET_PROPERTIES } = rule;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

ruleTester.run('no-get', rule, {
  valid: [
    // **************************
    // get
    // **************************

    // Nested property path.
    "this.get('foo.bar');",
    "get(this, 'foo.bar');",

    // Template literals.
    {
      code: 'this.get(`foo`);',
      parserOptions: { ecmaVersion: 6 },
    },
    {
      code: 'get(this, `foo`);',
      parserOptions: { ecmaVersion: 6 },
    },

    // Not `this`.
    "foo.get('bar');",
    "get(foo, 'bar');",

    // Not `get`.
    "this.foo('bar');",
    "foo(this, 'bar');",

    // Unknown extra argument.
    "this.get('foo', 'bar');",
    "get(this, 'foo', 'bar');",

    // Non-string parameter.
    'this.get(5);',
    'this.get(MY_PROP);',
    'get(this, 5);',
    'get(this, MY_PROP);',

    // Unknown sub-function call:
    "this.get.foo('bar');",
    "get.foo(this, 'bar');",

    // **************************
    // getProperties
    // **************************

    // Nested property path.
    "this.getProperties('foo', 'bar.baz');",
    "this.getProperties(['foo', 'bar.baz']);", // With parameters in array.
    "getProperties(this, 'foo', 'bar.baz');",
    "getProperties(this, ['foo', 'bar.baz']);", // With parameters in array.

    // Template literals.
    'this.getProperties(`prop1`, `prop2`);',
    'getProperties(this, `prop1`, `prop2`);',

    // Not `this`.
    "myObject.getProperties('prop1', 'prop2');",

    // Not `getProperties`.
    "this.foo('prop1', 'prop2');",

    // Non-string parameter.
    'this.getProperties(MY_PROP);',
    'this.getProperties(...MY_PROPS);',
    'this.getProperties([MY_PROP]);',
    'getProperties(this, MY_PROP);',
    'getProperties(this, ...MY_PROPS);',
    'getProperties(this, [MY_PROP]);',

    // Unknown sub-function call:
    "this.getProperties.foo('prop1', 'prop2');",
  ],
  invalid: [
    // **************************
    // get
    // **************************

    {
      code: "this.get('foo');",
      output: null,
      errors: [{ message: makeErrorMessageForGet('foo', false) }],
    },
    {
      code: "get(this, 'foo');",
      output: null,
      errors: [{ message: makeErrorMessageForGet('foo', true) }],
    },
    {
      code: "this.get('foo').someFunction();",
      output: null,
      errors: [{ message: makeErrorMessageForGet('foo', false) }],
    },

    // **************************
    // getProperties
    // **************************

    {
      code: "this.getProperties('prop1', 'prop2');",
      output: null,
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      code: "this.getProperties(['prop1', 'prop2']);", // With parameters in array.
      output: null,
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      code: "getProperties(this, 'prop1', 'prop2');",
      output: null,
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
    {
      code: "getProperties(this, ['prop1', 'prop2']);", // With parameters in array.
      output: null,
      errors: [{ message: ERROR_MESSAGE_GET_PROPERTIES, type: 'CallExpression' }],
    },
  ],
});
