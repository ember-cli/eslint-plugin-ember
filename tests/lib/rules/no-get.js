const rule = require('../../../lib/rules/no-get');
const RuleTester = require('eslint').RuleTester;

const { makeErrorMessage } = rule;

const ruleTester = new RuleTester();

ruleTester.run('no-get', rule, {
  valid: [
    // Nested property path.
    "this.get('foo.bar');",
    "get(this, 'foo.bar');",

    // Not `this`.
    "foo.get('bar');",
    "get(foo, 'bar');",

    // Not `get`.
    "this.foo('bar');",
    "foo(this, 'bar');",

    // Unknown extra argument.
    "this.get('foo', 'bar');",
    "get(this, 'foo', 'bar');",

    // Unexpected argument type.
    'this.get(5);',
    'get(this, 5);',

    // Unknown sub-function call:
    "this.get.foo('bar');",
    "get.foo(this, 'bar');",
  ],
  invalid: [
    {
      code: "this.get('foo');",
      output: null,
      errors: [{ message: makeErrorMessage('foo', false) }]
    },
    {
      code: "get(this, 'foo');",
      output: null,
      errors: [{ message: makeErrorMessage('foo', true) }]
    }
  ]
});
