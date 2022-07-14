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
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
});

eslintTester.run('jquery-ember-run', rule, {
  valid: [
    // jQuery/bind from Ember
    `import Ember from "ember";
     Ember.$("#item").on("click", () => { Ember.run.bind(this, this.handle); });`,
    `import Ember from "ember";
     Ember.$("#item").on("click", () => { Ember.run.debounce(this, this.handle); });`,

    // jQuery from Ember with destructuring
    `import Ember from "ember";
     const { $ } = Ember;
     $("#item").on("click", () => { Ember.run.bind(this, this.handle); });`,

    // Global jQuery
    {
      code: `
      import { bind } from "@ember/runloop";
      $("#item").on("click", () => { bind(this, this.handle); });`,
      globals: { $: true },
    },

    // Imported jQuery
    `import { bind } from "@ember/runloop";
     import $ from "jquery";
     $("#item").on("click", () => { bind(this, this.handle); });`,
    `import { debounce } from "@ember/runloop";
     import $ from "jquery";
     $("#item").on("click", () => { debounce(this, this.handle); });`,

    // No callback
    'import $ from "jquery"; $("#item");',
    'import $ from "jquery"; $("#item").on("click");',
    'import $ from "jquery"; $("#item").on("click", function() {});',
    'import $ from "jquery"; $("#item").on("click", () => {});',

    // Callback but not jQuery
    'notJquery("#item").on("click", () => {this.handle();});',

    // Not `on`
    'import $ from "jquery"; $("#item").notOn("click", () => {this.handle();});',
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
      code: 'import Ember from "ember"; const { $ } = Ember; $("#item").on("click", () => { this.handle(); });',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'MemberExpression' }],
    },
    {
      // Global jQuery
      code: '$("#item").on("click", () => {this.handle();});',
      output: null,
      globals: { $: true },
      errors: [{ message: ERROR_MESSAGE, type: 'MemberExpression' }],
    },
    {
      // Imported jQuery
      code: 'import $ from "jquery"; $("#item").on("click", () => { this.handle(); });',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'MemberExpression' }],
    },
    {
      // With function call that isn't a runloop function
      code: 'import $ from "jquery"; $("#item").on("click", () => { unknownFunction(); });',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },
    {
      // With unknown imported runloop function
      code: 'import { unknownFunction } from "@ember/runloop"; import $ from "jquery"; $("#item").on("click", () => { unknownFunction(); });',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'Identifier' }],
    },
    {
      // With assignment
      code: 'import $ from "jquery"; $("#item").on("click", () => { this.value = 1; });',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'AssignmentExpression' }],
    },
    {
      // With not from Ember
      code: 'import $ from "jquery"; $("#item").on("click", () => { notEmber.run.bind(); });',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'MemberExpression' }],
    },
    {
      // With not from Ember.run
      code: 'import Ember from "ember"; import $ from "jquery"; $("#item").on("click", () => { Ember.notRun.bind(); });',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'MemberExpression' }],
    },
    {
      // With unknown function call from Ember.run
      code: 'import Ember from "ember"; import $ from "jquery"; $("#item").on("click", () => { Ember.run.unknownFunction(); });',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'MemberExpression' }],
    },
  ],
});
