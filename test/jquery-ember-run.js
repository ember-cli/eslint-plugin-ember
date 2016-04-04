'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../rules/jquery-ember-run');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new RuleTester();
eslintTester.run('jquery-ember-run', rule, {
  valid: [
    {
      code: 'Ember.$("#something-rendered-by-jquery-plugin").on("click", () => {Ember.run.bind(this, this._handlerActionFromController);});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
    }
  ],
  invalid: [
    {
      code: 'Ember.$("#something-rendered-by-jquery-plugin").on("click", () => {this._handlerActionFromController();});',
      parserOptions: {ecmaVersion: 6, sourceType: "module"},
      errors: [{
        message: 'Don\'t use jQuery without Ember Run Loop',
      }],
    }
  ]
});
