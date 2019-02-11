// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jquery-ember-run');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('jquery-ember-run', rule, {
  valid: [
    {
      code: 'Ember.$("#something-rendered-by-jquery-plugin").on("click", () => {Ember.run.bind(this, this._handlerActionFromController);});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
  ],
  invalid: [
    {
      code: 'Ember.$("#something-rendered-by-jquery-plugin").on("click", () => {this._handlerActionFromController();});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{
        message: 'Don\'t use jQuery without Ember Run Loop',
      }],
    },
  ],
});
