'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../rules/named-functions-in-promises');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
eslintTester.run('named-functions-in-promises', rule, {
  valid: [
    {
      code: 'user.save().then(this._reloadUser.bind(this));',
      parserOptions: {ecmaVersion: 6},
    }
  ],
  invalid: [
    {
      code: 'user.save().then(() => {return user.reload();});',
      parserOptions: {ecmaVersion: 6},
      errors: [{
        message: 'Use named functions defined on objects to handle promises',
      }],
    }
  ]
});
