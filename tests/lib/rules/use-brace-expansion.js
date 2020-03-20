// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/use-brace-expansion');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 6,
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
  ],
  invalid: [
    {
      code:
        '{ test: computed("foo.{name,place}", "foo.[]", "foo.{thing,@each.stuff}", function() {}) }',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
          line: 1,
          endLine: 1,
          column: 18,
          endColumn: 73,
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
          line: 1,
          endLine: 1,
          column: 18,
          endColumn: 37,
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
          line: 1,
          endLine: 1,
          column: 18,
          endColumn: 52,
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
          line: 1,
          endLine: 1,
          column: 18,
          endColumn: 45,
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
          line: 1,
          endLine: 1,
          column: 18,
          endColumn: 56,
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
          line: 1,
          endLine: 1,
          column: 18,
          endColumn: 45,
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
          line: 1,
          endLine: 1,
          column: 18,
          endColumn: 37,
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
          line: 1,
          endLine: 1,
          column: 24,
          endColumn: 33,
        },
      ],
    },
  ],
});
