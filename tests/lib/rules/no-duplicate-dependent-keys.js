'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-duplicate-dependent-keys');
const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
const parserOptions = { ecmaVersion: 6, sourceType: 'module' };
ruleTester.run('no-duplicate-dependent-keys', rule, {

  valid: [
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
        foo: computed('model.{foo,bar}', 'model.bar', function() {})
      }
      `,
      parserOptions,
    }
  ],

  invalid: [
    {
      code: `
      {
        foo: computed('model.foo', 'model.bar', 'model.baz', 'model.foo', function() {})
      }
      `,
      parserOptions,
      errors: [{
        message: 'Fill me in.',
      }]
    },
    {
      code: `
      {
        foo: computed('model.{foo,bar}', 'model.bar', function() {})
      }
      `,
      parserOptions,
      errors: [{
        message: 'Fill me in.',
      }]
    }
  ]
});
