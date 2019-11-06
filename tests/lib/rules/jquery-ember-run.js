// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jquery-ember-run');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

eslintTester.run('jquery-ember-run', rule, {
  valid: [
    'Ember.$("#something-rendered-by-jquery-plugin").on("click", () => {Ember.run.bind(this, this._handlerActionFromController);});',
  ],
  invalid: [
    {
      code:
        'Ember.$("#something-rendered-by-jquery-plugin").on("click", () => {this._handlerActionFromController();});',
      output: null,
      errors: [
        {
          message: "Don't use jQuery without Ember Run Loop",
        },
      ],
    },
  ],
});
