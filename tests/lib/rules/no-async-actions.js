'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-async-actions.js');
const RuleTester = require('eslint').RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const message = 'Do not use async actions';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  }
});

ruleTester.run('no-async-actions', rule, {
  valid: [
    {
      code: `
      Component.extend({
      actions: {
      handleClick() {
      // ...
      }
      }
      });`,
    }

  ],

  invalid: [
    {
      code: `Component.extend({
        actions: {
          async handleClick() {
            // ...
          }
        }
      });`,
      output: null,
      errors: [{
        message,
      }]
    },
    {
      code: `Component.extend({
        actions: {
          handleClick() {
            return something.then(() => { 
              let hello = "world";
            });
          }
        }
      });`,
      output: null,
      errors: [{
        message,
      }]
    },
    {
      code: `Component.extend({
          @action
          async handleClick() {
            // ...
          }
      });`,
      output: null,
      errors: [{
        message,
      }]
    },
    {
      code: `Component.extend({
          @action
          handleClick() {
            return something.then(() => { 
              let hello = "world";
            });
          }
      });`,
      output: null,
      errors: [{
        message,
      }]
    },

  ]
});
