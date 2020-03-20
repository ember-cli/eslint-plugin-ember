const rule = require('../../../lib/rules/no-invalid-dependent-keys');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('no-invalid-dependent-keys', rule, {
  valid: [
    '{ test: computed("a", "b", function() {}) }',
    '{ test: computed(function() {}) }',
    '{ test: computed("a.test", "b.test", function() {}) }',
    '{ test: computed("a.{test,test2}", "b", function() {}) }',
    '{ test: computed("a.{test,test2}", "c", "b", function() {}) }',
    '{ test: computed("model.a.{test,test2}", "model.b.{test3,test4}", function() {}) }',
    '{ test: computed("foo.bar.{name,place}", "foo.qux.[]", "foo.baz.{thing,@each.stuff}", function() {}) }',
    '{ test: computed("foo.bar.{name,place,baz,stuff,test.@each.content}","foo.bar.fields.@each.{name,value}","foo.bar.custom.@each.{question,choice}", function() {})}',
    '{ test: computed("foo1.bar1.{name1,place1,baz1,stuff1,test1.@each.content1,fields1.@each.{name1,value1},custom1.@each.{question1,choice1}}", function() {})}',
    '{ test: computed.or("model.{projects,files.@each.{isSaving,test}}", "foo.bar.place") }',
    '{ test: computed.or("foo.bar.name", "foo.bar.place") }',
    '{ test: computed.and("foo.bar.name", "foo.bar.place") }',
    '{ test: Ember.computed.filterBy("a", "b", false) }',
    'myFunction("{ key: string }, saving,test}", "b}", false)',
    'myFunction("A string containing curly braces {}}")',
  ],
  invalid: [
    {
      code: '{ test: computed("foo.{name,place", "foo.name,place}", function() {}) }',
      output: null,
      errors: [
        {
          ruleId: 'no-invalid-dependent-keys',
          severity: 1,
          message: ERROR_MESSAGE,
          line: 1,
          column: 18,
          type: 'Literal',
          endLine: 1,
          endColumn: 35,
        },
        {
          ruleId: 'no-invalid-dependent-keys',
          severity: 1,
          message: ERROR_MESSAGE,
          line: 1,
          column: 37,
          type: 'Literal',
          endLine: 1,
          endColumn: 54,
        },
      ],
    },
    {
      code: '{ test: computed("foo.{bar.{name,place},qux.[],{thing,@each.stuff}", function() {}) }',
      output: null,
      errors: [
        {
          ruleId: 'no-invalid-dependent-keys',
          severity: 1,
          message: ERROR_MESSAGE,
          line: 1,
          column: 18,
          type: 'Literal',
          endLine: 1,
          endColumn: 68,
        },
      ],
    },
    {
      code:
        '{ test:  computed("foo.{bar.{name,place,baz,stuff,test.@each.content}", function() {}) }',
      output: null,
      errors: [
        {
          ruleId: 'no-invalid-dependent-keys',
          severity: 1,
          message: ERROR_MESSAGE,
          line: 1,
          column: 19,
          type: 'Literal',
          endLine: 1,
          endColumn: 71,
        },
      ],
    },
    {
      code:
        '{ test:  computed("foo1.bar1.{name1,place1,baz1,stuff1,test1.@each.content1,fields1.@each.{name1,value1},custom1.@each.{question1,choice1}}}", function() {}) }',
      output: null,
      errors: [
        {
          ruleId: 'no-invalid-dependent-keys',
          severity: 1,
          message: ERROR_MESSAGE,
          line: 1,
          column: 19,
          type: 'Literal',
          endLine: 1,
          endColumn: 142,
        },
      ],
    },
  ],
});
