'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-async-actions.js');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------


const ruleTester = new RuleTester({});

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
        message: ERROR_MESSAGE,
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
        message: ERROR_MESSAGE,
      }]
    },
    {
      code: `Component.extend({
          @action
          async handleClick() {
            // ...
          }
      });`,
      parser: 'babel-eslint',
      output: null,
      errors: [{
        message: ERROR_MESSAGE,
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
      parser: 'babel-eslint',
      output: null,
      errors: [{
        message: ERROR_MESSAGE,
      }]
    },

  ]
});
