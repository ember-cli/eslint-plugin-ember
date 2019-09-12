//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-deeply-nested-dependent-keys-with-each');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('no-deeply-nested-dependent-keys-with-each', rule, {
  valid: [
    'Ember.computed(function() {})',
    "Ember.computed('foo', function() {})",
    "Ember.computed('foo', function() {}).readOnly()",
    "Ember.computed('foo.bar', function() {})",
    "Ember.computed('foo.bar.@each.baz', function() {})",
    "Ember.computed('foo.@each.bar', function() {})",
    "Ember.computed('foo.@each.{bar,baz}', function() {})",
    'computed(function() {})',
    "computed('foo', function() {})",
    "computed('foo', function() {}).readOnly()",
    "computed('foo.bar', function() {})",
    "computed('foo.bar.@each.baz', function() {})",
    "computed('foo.@each.bar', function() {})",
    "computed('foo.@each.{bar,baz}', function() {})",

    // Not Ember's `computed` function:
    "otherClass.computed('foo.@each.bar.baz', function() {})",
    "otherClass.myFunction('foo.@each.bar.baz', function() {})",
    "myFunction('foo.@each.bar.baz', function() {})",
    "Ember.myFunction('foo.@each.bar.baz', function() {})",
    "computed.unrelatedFunction('foo.@each.bar.baz', function() {})",
    "Ember.computed.unrelatedFunction('foo.@each.bar.baz', function() {})",
  ],
  invalid: [
    {
      code: "Ember.computed('foo.@each.bar.baz', function() {})",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: "Ember.computed('foo.@each.bar.baz', function() {}).readOnly()",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: "Ember.computed('foo.@each.bar.[]', function() {})",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: "Ember.computed('foo.@each.bar.@each.baz', function() {})",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: "computed('foo.@each.bar.baz', function() {})",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: "computed('foo.@each.bar.baz', function() {}).readOnly()",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: "computed('foo.@each.bar.[]', function() {})",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: "computed('foo.@each.bar.@each.baz', function() {})",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
  ],
});
