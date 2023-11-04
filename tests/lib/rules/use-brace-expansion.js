// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/use-brace-expansion');
const RuleTester = require('eslint').RuleTester;
const { addComputedImport } = require('../../helpers/test-case');

const { ERROR_MESSAGE } = rule;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { legacyDecorators: true },
  },
});

eslintTester.run('use-brace-expansion', rule, {
  valid: [
    '{ test: computed("a", "b", function() {}) }',
    '{ test: computed(function() {}) }',
    '{ test: computed("a.test", "b.test", function() {}) }',
    '{ test: computed("a.{test,test2}", "b", function() {}) }',
    '{ test: computed("a.{test,test2}", "c", "b", function() {}) }',
    '{ test: computed("model.a.{test,test2}", "model.b.{test3,test4}", function() {}) }',
    '{ test: computed("foo.bar.{name,place}", "foo.qux.[]", "foo.baz.{thing,@each.stuff}", function() {}) }',
    '{ test: computed.or("foo.bar.name", "foo.bar.place") }',
    '{ test: computed.and("foo.bar.name", "foo.bar.place") }',
    "{ test: Ember.computed.filterBy('a', 'b', false) }",

    // Decorator:
    "class Test { @computed('a.{test1,test2}') get someProp() { return true; } }",
  ].map(addComputedImport),
  invalid: [
    {
      code: '{ test: computed("foo.{name,place}", "foo.[]", "foo.{thing,@each.stuff}", function() {}) }',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: "import Ember from 'ember'; { test: Ember.computed('foo.{name,place}', 'foo.[]', 'foo.{thing,@each.stuff}', function() {}) }",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '{ test: computed("a.test", "a.test2", function() {}) }',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '{ test: computed("a.{same,level}", "a.{not,nested}", function() {}) }',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '{ test: computed("a.b.c.d", "a.b.deep.props", function() {}) }',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '{ test: computed("a.{test,test2}", "c", "a.test3.test4", function() {}) }',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '{ test: computed("a.{test,test2}", "a.test3", function() {}) }',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: '{ test: computed("a.test", "a.test2", function() {}).volatile() }',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: "class Test { @computed('a.test1', 'a.test2') get someProp() { return true; } }",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
  ].map(addComputedImport),
});
