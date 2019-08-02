'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-duplicate-dependent-keys');
const RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const { ERROR_MESSAGE } = rule;
const ruleTester = new RuleTester();
const parserOptions = { ecmaVersion: 6, sourceType: 'module' };
ruleTester.run('no-duplicate-dependent-keys', rule, {
  valid: [
    {
      code: `
      {
        test: computed.match("email", /^.+@.+/)
      }
      `,
      parserOptions,
    },
    {
      code: `
      {
        foo: computed('model.foo', 'model.bar', 'model.baz', function() {})
      }
      `,
      parserOptions,
    },
    {
      code: `
      {
        foo: computed('model.{foo,bar}', 'model.qux', function() {})
      }
      `,
      parserOptions,
    },
    {
      code: `
      {
        foo: Ember.computed('model.{foo,bar}', 'model.qux', function() {
        }).volatile()
      }
      `,
      parserOptions,
    },
    {
      code: `
      {
        foo: Ember.computed('model.{foo,bar}', 'model.qux', 'collection.@each.fooProp', function() {
        }).volatile()
      }
      `,
      parserOptions,
    },
    {
      code: `
      {
        foo: Ember.computed('model.{foo,bar}', 'model.qux', 'collection.[]', function() {
        }).volatile()
      }
      `,
      parserOptions,
    },
    {
      code: `
      {
        foo: Ember.computed('model.{foo,bar}', 'model.qux', 'collection.@each.{foo,bar}', function() {
        }).volatile()
      }
      `,
      parserOptions,
    },
    {
      code: `
      {
        foo: Ember.computed('collection.@each.{foo,bar}', 'collection.@each.qux', function() {
        }).volatile()
      }
      `,
      parserOptions,
    },
    {
      code: `
      {
        foo: Ember.computed('collection.@each.foo', 'collection.@each.qux', function() {
        }).volatile()
      }
      `,
      parserOptions,
    },
    {
      code: `
      {
        foo: Ember.computed('collection.{foo.@each.prop, bar}', 'collection.foo.@each.qux', function() {
        }).volatile()
      }
      `,
      parserOptions,
    },
  ],
  invalid: [
    {
      code: `
      {
        foo: computed('model.foo', 'model.bar', 'model.baz', 'model.foo', function() {})
      }
      `,
      parserOptions,
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
        foo: computed('model.{foo,bar}', 'model.bar', function() {})
      }
      `,
      parserOptions,
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
      parserOptions,
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
      parserOptions,
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
        foo: computed('collection.{foo.@each.qux,bar}', 'collection.foo.@each.qux', function() {})
      }
      `,
      parserOptions,
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
      parserOptions,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
  ],
});
