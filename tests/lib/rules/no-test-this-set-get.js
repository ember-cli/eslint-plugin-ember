'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-test-this-set-get');
const RuleTester = require('eslint').RuleTester;

const { makeErrorMessage } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const TEST_FILE_NAME_GJS = 'some-test.gjs';
const TEST_FILE_NAME_GTS = 'some-test.gts';
const TEST_FILE_NAME_JS = 'some-test.js';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('no-test-this-set-get', rule, {
  valid: [
    // Not flagged in plain .js test files (only gjs/gts).
    {
      filename: TEST_FILE_NAME_JS,
      code: 'test("x", function () { this.set("foo", 1); });',
    },
    {
      filename: TEST_FILE_NAME_JS,
      code: 'test("x", function () { this.get("foo"); });',
    },
    // Not flagged outside of test files.
    {
      filename: 'some-component.gjs',
      code: 'function f() { this.set("foo", 1); }',
    },
    // Not flagged for unrelated methods on `this`.
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'test("x", function () { this.owner.lookup("foo"); });',
    },
    // Not flagged for free `set`/`get`/`setProperties`/`getProperties` calls.
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'test("x", function () { set(obj, "foo", 1); });',
    },
    {
      filename: TEST_FILE_NAME_GTS,
      code: 'test("x", function () { get(obj, "foo"); });',
    },
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'test("x", function () { setProperties(obj, { foo: 1 }); });',
    },
    {
      filename: TEST_FILE_NAME_GTS,
      code: 'test("x", function () { getProperties(obj, "foo", "bar"); });',
    },
    // Not flagged for unrelated method on something else.
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'test("x", function () { foo.set("a", 1); });',
    },
    // Not flagged for computed `this[...]`.
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'test("x", function () { this["set"]("foo", 1); });',
    },
  ],
  invalid: [
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'test("x", function () { this.set("foo", 1); });',
      output: null,
      errors: [{ message: makeErrorMessage('set'), type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME_GTS,
      code: 'test("x", function () { this.set("foo", 1); });',
      output: null,
      errors: [{ message: makeErrorMessage('set'), type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'test("x", function () { this.get("foo"); });',
      output: null,
      errors: [{ message: makeErrorMessage('get'), type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME_GTS,
      code: 'test("x", function () { this.get("foo"); });',
      output: null,
      errors: [{ message: makeErrorMessage('get'), type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'test("x", function () { this.setProperties({ foo: 1 }); });',
      output: null,
      errors: [{ message: makeErrorMessage('setProperties'), type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME_GTS,
      code: 'test("x", function () { this.getProperties("foo", "bar"); });',
      output: null,
      errors: [{ message: makeErrorMessage('getProperties'), type: 'CallExpression' }],
    },
  ],
});
