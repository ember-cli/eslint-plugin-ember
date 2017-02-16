// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-function-prototype-extensions');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
eslintTester.run('no-function-prototype-extensions', rule, {
  valid: [
    {
      code: 'export default Controller.extend();',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Controller.extend({actions: {}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Controller.extend({test: function () {}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Controller.extend({init() {}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Controller.extend({test: computed("abc", function () {})});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Controller.extend({test: observer("abc", function () {})});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Controller.extend({test: service()});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Controller.extend({actions: {test() {}}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Controller.extend({actions: {test: function () {}}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Controller.extend({test: function () {}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Controller.extend({test: on("init", function () {})});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Controller.extend({test: observer("abc", function () {abc.on();})});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Controller.extend({test: function () {$("body").on("click", abc);}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Controller.extend({test() {$("body").on("click", abc);}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Controller.extend({test() {$("body").on("click", abc).on("click", function () {});}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
  ],
  invalid: [
    {
      code: 'export default Controller.extend({test: function() {}.property("abc")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Don\'t use Ember\'s function prototype extensions',
      }],
    },
    {
      code: 'export default Controller.extend({test: function() {}.observe("abc")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Don\'t use Ember\'s function prototype extensions',
      }],
    },
    {
      code: 'export default Controller.extend({test: function() {}.on("init")});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Don\'t use Ember\'s function prototype extensions',
      }],
    },
  ],
});
