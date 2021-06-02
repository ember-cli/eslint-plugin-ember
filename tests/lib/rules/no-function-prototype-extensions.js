// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-function-prototype-extensions');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
});

eslintTester.run('no-function-prototype-extensions', rule, {
  valid: [
    'export default Controller.extend();',
    'export default Controller.extend({actions: {}});',
    'export default Controller.extend({test: function () {}});',
    'export default Controller.extend({init() {}});',
    'export default Controller.extend({test: computed("abc", function () {})});',
    'export default Controller.extend({test: observer("abc", function () {})});',
    'export default Controller.extend({test: beforeObserver("abc", function () {})});',
    'export default Controller.extend({test: service()});',
    'export default Controller.extend({actions: {test() {}}});',
    'export default Controller.extend({actions: {test: function () {}}});',
    'export default Controller.extend({test: on("init", function () {})});',
    'export default Controller.extend({test: observer("abc", function () {abc.on();})});',
    'export default Controller.extend({test: beforeObserver("abc", function () {abc.on();})});',
    'export default Controller.extend({test: function () {$("body").on("click", abc);}});',
    'export default Controller.extend({test() {$("body").on("click", abc);}});',
    'export default Controller.extend({test() {$("body").on("click", abc).on("click", function () {});}});',
  ],
  invalid: [
    {
      code: 'export default Controller.extend({test: function() {}.property("abc")});',
      output: null,
      errors: [
        {
          message: "Don't use Ember's function prototype extensions",
        },
      ],
    },
    {
      code: 'export default Controller.extend({test: function() {}.observes("abc")});',
      output: null,
      errors: [
        {
          message: "Don't use Ember's function prototype extensions",
        },
      ],
    },
    {
      code: 'export default Controller.extend({test: function() {}.observesBefore("abc")});',
      output: null,
      errors: [
        {
          message: "Don't use Ember's function prototype extensions",
        },
      ],
    },
    {
      code: 'export default Controller.extend({test: function() {}.on("init")});',
      output: null,
      errors: [
        {
          message: "Don't use Ember's function prototype extensions",
        },
      ],
    },
  ],
});
