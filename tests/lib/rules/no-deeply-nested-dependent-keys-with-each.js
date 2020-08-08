//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-deeply-nested-dependent-keys-with-each');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: { legacyDecorators: true },
  },
});
ruleTester.run('no-deeply-nested-dependent-keys-with-each', rule, {
  valid: [
    "import Ember from 'ember'; Ember.computed(function() {})",
    "import Ember from 'ember'; Ember.computed('foo', function() {})",
    "import Ember from 'ember'; Ember.computed('foo', function() {}).readOnly()",
    "import Ember from 'ember'; Ember.computed('foo.bar', function() {})",
    "import Ember from 'ember'; Ember.computed('foo.bar.@each.baz', function() {})",
    "import Ember from 'ember'; Ember.computed('foo.@each.bar', function() {})",
    "import Ember from 'ember'; Ember.computed('foo.@each.{bar,baz}', function() {})",
    "import { computed } from '@ember/object'; computed(function() {})",
    "import { computed } from '@ember/object'; computed('foo', function() {})",
    "import { computed } from '@ember/object'; computed('foo', function() {}).readOnly()",
    "import { computed } from '@ember/object'; computed('foo.bar', function() {})",
    "import { computed } from '@ember/object'; computed('foo.bar.@each.baz', function() {})",
    "import { computed } from '@ember/object'; computed('foo.@each.bar', function() {})",
    "import { computed } from '@ember/object'; computed('foo.@each.{bar,baz}', function() {})",

    // Not Ember's `computed` function:
    "otherClass.computed('foo.@each.bar.baz', function() {})",
    "otherClass.myFunction('foo.@each.bar.baz', function() {})",
    "myFunction('foo.@each.bar.baz', function() {})",
    "import Ember from 'ember'; Ember.myFunction('foo.@each.bar.baz', function() {})",
    "import { computed } from '@ember/object'; computed.unrelatedFunction('foo.@each.bar.baz', function() {})",
    "import Ember from 'ember'; Ember.computed.unrelatedFunction('foo.@each.bar.baz', function() {})",
  ],
  invalid: [
    {
      code: "import Ember from 'ember'; Ember.computed('foo.@each.bar.baz', function() {})",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code:
        "import Ember from 'ember'; Ember.computed('foo.@each.bar.baz', function() {}).readOnly()",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: "import Ember from 'ember'; Ember.computed('foo.@each.bar.[]', function() {})",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: "import Ember from 'ember'; Ember.computed('foo.@each.bar.@each.baz', function() {})",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code:
        "import { computed } from '@ember/object'; computed('foo.@each.bar.baz', function() {})",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code:
        "import { computed } from '@ember/object'; computed('foo.@each.bar.baz', function() {}).readOnly()",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: "import { computed } from '@ember/object'; computed('foo.@each.bar.[]', function() {})",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code:
        "import { computed } from '@ember/object'; computed('foo.@each.bar.@each.baz', function() {})",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code:
        "import { computed } from '@ember/object'; class Test { @computed('foo.@each.bar.baz') get someProp() { return true; } }",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
  ],
});
