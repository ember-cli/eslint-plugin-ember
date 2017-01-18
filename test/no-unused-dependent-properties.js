/**
 * @fileoverview Ensure there are no unused dependent properties in computed properties
 * @author Alex LaFroscia
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../rules/no-unused-dependent-properties'),
  RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });
ruleTester.run('no-unused-dependent-properties', rule, {
  valid: [
    {
      code: `
        {
          foo: computed('bar', function() {
            let bar = this.get('bar');
          })
        }
      `
    }, {
      code: `
        {
          foo: computed('bar', function() {
            let bar = get(this, 'bar');
          })
        }
      `
    }, {
      code: `
        {
          foo: computed('bar', 'baz', function() {
            let bar = this.get('bar');
            let baz = this.get('baz');
          })
        }
      `
    }, {
      code: `
        {
          foo: computed('bar', 'baz', function() {
            let bar = get(this, 'bar');
            let baz = get(this, 'baz');
          })
        }
      `
    }, {
      code: `
        {
          foo: computed('array.@each', function() {
            let array = get(this, 'array');
          })
        }
      `
    }, {
      code: `
        {
          foo: computed('array.@each', function() {
            let array = this.get('array');
          })
        }
      `
    }, {
      code: `
        {
          foo: computed('object.{bar,baz}', function() {
            let bar = this.get('object.bar');
            let baz = this.get('object.baz');
          })
        }
      `
    }, {
      code: `
        {
          foo: observer('bar', function() {
            let bar = this.get('bar');
          })
        }
      `
    }, {
      code: `
        {
          foo: observer('bar', function() {
            let bar = get(this, 'bar');
          })
        }
      `
    }
  ],

  invalid: [
    {
      code: '',
      errors: [{
        message: 'Unused dependent key `bar`',
        type: 'Literal'
      }]
    }
  ]
});
