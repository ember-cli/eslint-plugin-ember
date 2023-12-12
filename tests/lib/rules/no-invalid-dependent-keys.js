const rule = require('../../../lib/rules/no-invalid-dependent-keys');
const { addComputedImport } = require('../../helpers/test-case');
const RuleTester = require('eslint').RuleTester;

const {
  ERROR_MESSAGE_UNBALANCED_BRACES,
  ERROR_MESSAGE_UNNECESSARY_BRACES,
  ERROR_MESSAGE_TERMINAL_AT_EACH,
  ERROR_MESSAGE_MIDDLE_BRACKETS,
  ERROR_MESSAGE_LEADING_TRAILING_PERIOD,
  ERROR_MESSAGE_INVALID_CHARACTER,
} = rule;

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

eslintTester.run('no-invalid-dependent-keys', rule, {
  valid: [
    // Normal usage
    '{ test: computed("a", "b", function() {}) }',
    '{ test: computed(function() {}) }',
    '{ test: computed() }',
    '{ test: computed(SOME_VAR, function() {}) }',
    '{ test: computed(...SOME_ARRAY, function() {}) }',
    '{ test: computed("a.test", "b.test", function() {}) }',
    '{ test: computed("a.[]", function() {}) }',
    '{ test: computed("a.@each.id", function() {}) }',

    // Braces
    '{ test: computed("a.{test,test2}", "b", function() {}) }',
    '{ test: computed("a.{test,test2}", "c", "b", function() {}) }',
    '{ test: computed("model.a.{test,test2}", "model.b.{test3,test4}", function() {}) }',
    '{ test: computed("foo.bar.{name,place}", "foo.qux.[]", "foo.baz.{thing,@each.stuff}", function() {}) }',
    '{ test: computed("foo.bar.{name,place,baz,stuff,test.@each.content}","foo.bar.fields.@each.{name,value}","foo.bar.custom.@each.{question,choice}", function() {})}',
    '{ test: computed("foo1.bar1.{name1,place1,baz1,stuff1,test1.@each.content1,fields1.@each.{name1,value1},custom1.@each.{question1,choice1}}", function() {})}',

    // Macros
    '{ test: computed.or("model.{projects,files.@each.{isSaving,test}}", "foo.bar.place") }',
    '{ test: computed.or("foo.bar.name", "foo.bar.place") }',
    '{ test: computed.or("foo.bar.{name,place}") }',
    '{ test: computed.and("foo.bar.name", "foo.bar.place") }',
    '{ test: Ember.computed.filterBy("a", "b", false) }',

    // Unrelated functions
    'myFunction("{ key: string }, saving,test}", "b}", false)',
    'myFunction("A string containing curly braces {}}")',
  ].map(addComputedImport),
  invalid: [
    // Unbalanced braces
    {
      code: '{ test: computed("foo.{name,place", "foo.name,place}", function() {}) }',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_UNBALANCED_BRACES,
          type: 'Literal',
        },
        {
          message: ERROR_MESSAGE_UNBALANCED_BRACES,
          type: 'Literal',
        },
      ],
    },
    {
      code: '{ test: computed("foo.{bar.{name,place},qux.[],{thing,@each.stuff}", function() {}) }',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_UNBALANCED_BRACES,
          type: 'Literal',
        },
      ],
    },
    {
      code: "import Ember from 'ember'; { test: Ember.computed('foo.{bar.{name,place},qux.[],{thing,@each.stuff}', function() {}) }",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_UNBALANCED_BRACES,
          type: 'Literal',
        },
      ],
    },
    {
      code: '{ test:  computed("foo.{bar.{name,place,baz,stuff,test.@each.content}", function() {}) }',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_UNBALANCED_BRACES,
          type: 'Literal',
        },
      ],
    },
    {
      code: '{ test:  computed("foo1.bar1.{name1,place1,baz1,stuff1,test1.@each.content1,fields1.@each.{name1,value1},custom1.@each.{question1,choice1}}}", function() {}) }',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_UNBALANCED_BRACES,
          type: 'Literal',
        },
      ],
    },

    // Unnecessary braces
    {
      code: '{ test: computed("foo.{bar}", function() {}) }',
      output: '{ test: computed("foo.bar", function() {}) }',
      errors: [
        {
          message: ERROR_MESSAGE_UNNECESSARY_BRACES,
          type: 'Literal',
        },
      ],
    },
    {
      code: '{ test: computed("foo.{bar}.{abc}", function() {}) }',
      output: '{ test: computed("foo.bar.abc", function() {}) }',
      errors: [
        {
          message: ERROR_MESSAGE_UNNECESSARY_BRACES,
          type: 'Literal',
        },
      ],
    },

    // @each
    {
      code: 'computed("foo.@each", function() {})',
      output: 'computed("foo.[]", function() {})',
      errors: [
        {
          message: ERROR_MESSAGE_TERMINAL_AT_EACH,
          type: 'Literal',
        },
      ],
    },

    // []
    {
      code: 'computed("foo.[].bar", function() {})',
      output: 'computed("foo.@each.bar", function() {})',
      errors: [
        {
          message: ERROR_MESSAGE_MIDDLE_BRACKETS,
          type: 'Literal',
        },
      ],
    },

    // Extra periods
    {
      code: 'computed(".foo.bar", function() {})',
      output: 'computed("foo.bar", function() {})',
      errors: [
        {
          message: ERROR_MESSAGE_LEADING_TRAILING_PERIOD,
          type: 'Literal',
        },
      ],
    },
    {
      code: 'computed("foo.bar.", function() {})',
      output: 'computed("foo.bar", function() {})',
      errors: [
        {
          message: ERROR_MESSAGE_LEADING_TRAILING_PERIOD,
          type: 'Literal',
        },
      ],
    },

    // Spaces
    {
      code: 'computed(" foo . bar", function() {})',
      output: 'computed("foo.bar", function() {})',
      errors: [
        {
          message: ERROR_MESSAGE_INVALID_CHARACTER,
          type: 'Literal',
        },
      ],
    },

    // Decorator
    {
      code: "class Test { @computed('foo.{name,place') get someProp() { return true; } }",
      output: null,
      errors: [{ message: ERROR_MESSAGE_UNBALANCED_BRACES, type: 'Literal' }],
    },
  ].map(addComputedImport),
});
