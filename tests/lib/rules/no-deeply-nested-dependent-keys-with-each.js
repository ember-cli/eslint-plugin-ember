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
    "Ember.computed('foo.bar', function() {})",
    "Ember.computed('foo.bar.@each.baz', function() {})",
    "Ember.computed('foo.@each.bar', function() {})",
    "Ember.computed('foo.@each.{bar,baz}', function() {})",
    "computed('foo.bar', function() {})",
    "computed('foo.bar.@each.baz', function() {})",
    "computed('foo.@each.bar', function() {})",
    "computed('foo.@each.{bar,baz}', function() {})",
    "computed('foo.@each.{bar,baz}', function() {})",

    // Not Ember's `computed`:
    "otherClass.computed('foo.@each.bar.baz', function() {})",
    "otherClass.myFunction('foo.@each.bar.baz', function() {})",
    "myFunction('foo.@each.bar.baz', function() {})"
  ],
  invalid: [
    {
      code: "Ember.computed('foo.@each.bar.baz', function() {})",
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    },
    {
      code: "Ember.computed('foo.@each.bar.[]', function() {})",
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    },
    {
      code: "Ember.computed('foo.@each.bar.@each.baz', function() {})",
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }]
    }
  ]
});
