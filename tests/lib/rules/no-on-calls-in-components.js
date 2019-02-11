// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-on-calls-in-components');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester();
const message = 'Don\'t use .on() for component lifecycle events.';

eslintTester.run('no-on-calls-in-components', rule, {
  valid: [
    {
      code: 'export default Component.extend();',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({actions: {}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({abc: service()});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({abc: inject.service()});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({abc: false});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({classNames: ["abc", "def"]});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({abc: computed(function () {})});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({abc: observer("abc", function () {})});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({abc: observer("abc", function () {test.on("xyz", def)})});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({abc: function () {test.on("xyz", def)}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({abc() {$("body").on("click", def)}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({didInsertElement() {$("body").on("click", def).on("click", function () {})}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({actions: {abc() {test.on("xyz", def)}}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({actions: {abc() {$("body").on("click", def).on("click", function () {})}}});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
    {
      code: 'export default Component.extend({abc: on("nonLifecycleEvent", function() {})});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
    },
  ],
  invalid: [
    {
      code: `export default Component.extend({
        test: on("didInsertElement", function () {})
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component.extend({
        test: on("init", observer("someProperty", function () {
          return true;
        })),
        someComputedProperty: computed.bool(true)
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component.extend({
        test: Ember.on("didInsertElement", function () {}),
        someComputedProperty: Ember.computed.readOnly('Hello World!'),
        anotherTest: Ember.on("willDestroyElement", function () {})
      });`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{ message, line: 2 }, { message, line: 4 }],
    },
    {
      filename: 'example-app/components/some-component/component.js',
      code: 'export default CustomComponent.extend({test: on("didInsertElement", function () {})});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{
        message: 'Don\'t use .on() for component lifecycle events.',
      }],
    },
    {
      filename: 'example-app/components/some-component.js',
      code: 'export default CustomComponent.extend({test: on("didInsertElement", function () {})});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{
        message: 'Don\'t use .on() for component lifecycle events.',
      }],
    },
    {
      filename: 'example-app/twised-path/some-file.js',
      code: 'export default Component.extend({test: on("didInsertElement", function () {})});',
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      output: null,
      errors: [{
        message: 'Don\'t use .on() for component lifecycle events.',
      }],
    },
  ],
});
