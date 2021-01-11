// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jquery-ember-run');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const { ERROR_MESSAGE } = rule;
const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

eslintTester.run('jquery-ember-run', rule, {
  valid: [
    // jQuery/bind from Ember
    `import Ember from "ember";
     Ember.$("#item").on("click", () => { Ember.run.bind(this, this.handle); });`,

    // jQuery from Ember with destructuring
    `import Ember from "ember";
     const { $ } = Ember;
     $("#item").on("click", () => { Ember.run.bind(this, this.handle); });`,

    // Global jQuery
    `import { bind } from "@ember/runloop";
     $("#item").on("click", () => { bind(this, this.handle); });`,

    // Imported jQuery
    `import { bind } from "@ember/runloop";
     import $ from "jquery";
     $("#item").on("click", () => { bind(this, this.handle); });`,

    // No callback
    '$("#item");',
    '$("#item").on("click");',

    // Callback but not jQuery
    'notJquery("#item").on("click", () => {this.handle();});',
  ],
  invalid: [
    {
      // jQuery from Ember
      code: 'import Ember from "ember"; Ember.$("#item").on("click", () => { this.handle(); });',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'MemberExpression' }],
    },
    {
      // jQuery from Ember with destructuring
      code:
        'import Ember from "ember"; const { $ } = Ember; $("#item").on("click", () => { this.handle(); });',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'MemberExpression' }],
    },
    {
      // Global jQuery
      code: '$("#item").on("click", () => {this.handle();});',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'MemberExpression' }],
    },
    {
      // Imported jQuery
      code: 'import $ from "jquery"; $("#item").on("click", () => { this.handle(); });',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'MemberExpression' }],
    },
  ],
});
