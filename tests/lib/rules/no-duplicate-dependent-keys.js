'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-duplicate-dependent-keys');
const RuleTester = require('eslint').RuleTester;
const { addComputedImport } = require('../../helpers/test-case');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const { ERROR_MESSAGE } = rule;
const ruleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: { legacyDecorators: true },
  },
});
ruleTester.run('no-duplicate-dependent-keys', rule, {
  valid: [
    `
      {
        test: computed.match("email", /^.+@.+/)
      }
      `,
    `
      {
        foo: computed('model.foo', 'model.bar', 'model.baz', function() {})
      }
      `,
    `
      {
        foo: computed('model.{foo,bar}', 'model.qux', function() {})
      }
      `,
    `
      {
        foo: Ember.computed('model.{foo,bar}', 'model.qux', function() {
        }).volatile()
      }
      `,
    `
      {
        foo: Ember.computed('model.{foo,bar}', 'model.qux', 'collection.@each.fooProp', function() {
        }).volatile()
      }
      `,
    `
      {
        foo: Ember.computed('model.{foo,bar}', 'model.qux', 'collection.[]', function() {
        }).volatile()
      }
      `,
    `
      {
        foo: Ember.computed('model.{foo,bar}', 'model.qux', 'collection.@each.{foo,bar}', function() {
        }).volatile()
      }
      `,
    `
      {
        foo: Ember.computed('collection.@each.{foo,bar}', 'collection.@each.qux', function() {
        }).volatile()
      }
      `,
    `
      {
        foo: Ember.computed('collection.@each.foo', 'collection.@each.qux', function() {
        }).volatile()
      }
      `,
    `
      {
        foo: Ember.computed('collection.{foo.@each.prop, bar}', 'collection.foo.@each.qux', function() {
        }).volatile()
      }
      `,
  ].map(addComputedImport),
  invalid: [
    {
      code: `
      {
        foo: computed('model.foo', 'model.bar', 'model.baz', 'model.foo', function() {})
      }
      `,
      output: `
      {
        foo: computed('model.foo', 'model.bar', 'model.baz',  function() {})
      }
      `,
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
    {
      code: `
      import Ember from 'ember';
      { foo: Ember.computed('model.foo', 'model.bar', 'model.baz', 'model.foo', function() {}) }
      `,
      output: `
      import Ember from 'ember';
      { foo: Ember.computed('model.foo', 'model.bar', 'model.baz',  function() {}) }
      `,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
      {
        foo: computed('model.{foo,bar}', 'model.bar', function() {})
      }
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
    {
      code: `
      {
        foo: computed('collection.@each.{foo,bar}', 'model.bar', 'collection.@each.bar', function() {})
      }
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
    {
      code: `
      {
        foo: computed('collection.@each.foo', 'model.bar', 'collection.@each.foo', function() {})
      }
      `,
      output: `
      {
        foo: computed('collection.@each.foo', 'model.bar',  function() {})
      }
      `,
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
    {
      code: `
      {
        foo: computed('collection.{foo.@each.qux,bar}', 'collection.foo.@each.qux', function() {})
      }
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
    {
      code: `
      {
        foo: computed('a.b.c.{foo.@each.qux,bar}', 'a.b.c.baz.[]', 'a.b.c.foo.@each.qux', function() {})
      }
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
    {
      code: "class Test { @computed('a', 'a') get someProp() { return true; } }",
      output: "class Test { @computed('a' ) get someProp() { return true; } }",
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
  ].map(addComputedImport),
});
