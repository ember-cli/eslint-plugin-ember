// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/use-brace-expansion');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('use-brace-expansion', rule, {
  valid: [
    { code: '{ test: computed("a", "b", function() {}) }' },
    { code: '{ test: computed(function() {}) }' },
    { code: '{ test: computed("a.test", "b.test", function() {}) }' },
    { code: '{ test: computed("a.{test,test2}", "b", function() {}) }' },
    { code: '{ test: computed("a.{test,test2}", "c", "b", function() {}) }' },
    {
      code: '{ test: computed("model.a.{test,test2}", "model.b.{test3,test4}", function() {}) }',
    },
    {
      code:
        '{ test: computed("foo.bar.{name,place}", "foo.qux.[]", "foo.baz.{thing,@each.stuff}", function() {}) }',
    },
    { code: '{ test: computed.or("foo.bar.name", "foo.bar.place") }' },
    { code: '{ test: computed.and("foo.bar.name", "foo.bar.place") }' },
    { code: "{ test: Ember.computed.filterBy('a', 'b', false) }" },
  ],
  invalid: [
    {
      code:
        '{ test: computed("foo.{name,place}", "foo.[]", "foo.{thing,@each.stuff}", function() {}) }',
      output: null,
      errors: [
        {
          message: 'Use brace expansion',
        },
      ],
    },
    {
      code: '{ test: computed("a.test", "a.test2", function() {}) }',
      output: null,
      errors: [
        {
          message: 'Use brace expansion',
        },
      ],
    },
    {
      code: '{ test: computed("a.{same,level}", "a.{not,nested}", function() {}) }',
      output: null,
      errors: [
        {
          message: 'Use brace expansion',
        },
      ],
    },
    {
      code: '{ test: computed("a.b.c.d", "a.b.deep.props", function() {}) }',
      output: null,
      errors: [
        {
          message: 'Use brace expansion',
        },
      ],
    },
    {
      code: '{ test: computed("a.{test,test2}", "c", "a.test3.test4", function() {}) }',
      output: null,
      errors: [
        {
          message: 'Use brace expansion',
        },
      ],
    },
    {
      code: '{ test: computed("a.{test,test2}", "a.test3", function() {}) }',
      output: null,
      errors: [
        {
          message: 'Use brace expansion',
        },
      ],
    },
    {
      code: '{ test: computed("a.test", "a.test2", function() {}).volatile() }',
      output: null,
      errors: [
        {
          message: 'Use brace expansion',
        },
      ],
    },
  ],
});
