'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-test-this-set-get');
const RuleTester = require('eslint').RuleTester;

const { makeThisErrorMessage, makeImportedErrorMessage } = rule;

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
    {
      filename: TEST_FILE_NAME_JS,
      code: 'import { set } from "@ember/object"; test("x", function () { set(obj, "foo", 1); });',
    },
    // Not flagged outside of test files.
    {
      filename: 'some-component.gjs',
      code: 'function f() { this.set("foo", 1); }',
    },
    {
      filename: 'some-component.gjs',
      code: 'import { set } from "@ember/object"; function f() { set(obj, "foo", 1); }',
    },
    // Not flagged for unrelated methods on `this`.
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'test("x", function () { this.owner.lookup("foo"); });',
    },
    // Not flagged for free `set`/`get`/... calls when NOT imported from `@ember/object`.
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
      code: 'import { set } from "some-other-module"; test("x", function () { set(obj, "foo", 1); });',
    },
    // Not flagged for unrelated method on something else.
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'test("x", function () { foo.set("a", 1); });',
    },
    // Not flagged for unrelated imports from `@ember/object`.
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'import { computed } from "@ember/object"; test("x", function () { computed(); });',
    },
  ],
  invalid: [
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'test("x", function () { this.set("foo", 1); });',
      output: null,
      errors: [{ message: makeThisErrorMessage('set'), type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME_GTS,
      code: 'test("x", function () { this.set("foo", 1); });',
      output: null,
      errors: [{ message: makeThisErrorMessage('set'), type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'test("x", function () { this.get("foo"); });',
      output: null,
      errors: [{ message: makeThisErrorMessage('get'), type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME_GTS,
      code: 'test("x", function () { this.get("foo"); });',
      output: null,
      errors: [{ message: makeThisErrorMessage('get'), type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'test("x", function () { this.setProperties({ foo: 1 }); });',
      output: null,
      errors: [{ message: makeThisErrorMessage('setProperties'), type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME_GTS,
      code: 'test("x", function () { this.getProperties("foo", "bar"); });',
      output: null,
      errors: [{ message: makeThisErrorMessage('getProperties'), type: 'CallExpression' }],
    },
    // Computed `this["set"](...)` form.
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'test("x", function () { this["set"]("foo", 1); });',
      output: null,
      errors: [{ message: makeThisErrorMessage('set'), type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME_GTS,
      code: 'test("x", function () { this["getProperties"]("foo"); });',
      output: null,
      errors: [{ message: makeThisErrorMessage('getProperties'), type: 'CallExpression' }],
    },
    // Imported from `@ember/object`.
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'import { set } from "@ember/object"; test("x", function () { set(obj, "foo", 1); });',
      output: null,
      errors: [{ message: makeImportedErrorMessage('set'), type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME_GTS,
      code: 'import { get } from "@ember/object"; test("x", function () { get(obj, "foo"); });',
      output: null,
      errors: [{ message: makeImportedErrorMessage('get'), type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'import { setProperties } from "@ember/object"; test("x", function () { setProperties(obj, { foo: 1 }); });',
      output: null,
      errors: [{ message: makeImportedErrorMessage('setProperties'), type: 'CallExpression' }],
    },
    {
      filename: TEST_FILE_NAME_GTS,
      code: 'import { getProperties } from "@ember/object"; test("x", function () { getProperties(obj, "foo", "bar"); });',
      output: null,
      errors: [{ message: makeImportedErrorMessage('getProperties'), type: 'CallExpression' }],
    },
    // Aliased import.
    {
      filename: TEST_FILE_NAME_GJS,
      code: 'import { set as emberSet } from "@ember/object"; test("x", function () { emberSet(obj, "foo", 1); });',
      output: null,
      errors: [{ message: makeImportedErrorMessage('set'), type: 'CallExpression' }],
    },
  ],
});
