// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-on-calls-in-components');
const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
});

const message = "Don't use .on() for component lifecycle events.";

eslintTester.run('no-on-calls-in-components', rule, {
  valid: [
    'export default Component.extend();',
    'export default Component.extend({actions: {}});',
    'export default Component.extend({abc: service()});',
    'export default Component.extend({abc: inject.service()});',
    'export default Component.extend({abc: false});',
    'export default Component.extend({classNames: ["abc", "def"]});',
    'export default Component.extend({abc: computed(function () {})});',
    'export default Component.extend({abc: observer("abc", function () {})});',
    'export default Component.extend({abc: observer("abc", function () {test.on("xyz", def)})});',
    'export default Component.extend({abc: function () {test.on("xyz", def)}});',
    'export default Component.extend({abc() {$("body").on("click", def)}});',
    'export default Component.extend({didInsertElement() {$("body").on("click", def).on("click", function () {})}});',
    'export default Component.extend({actions: {abc() {test.on("xyz", def)}}});',
    'export default Component.extend({actions: {abc() {$("body").on("click", def).on("click", function () {})}}});',
    'export default Component.extend({abc: on("nonLifecycleEvent", function() {})});',
    {
      code: `
      let foo = { bar: 'baz' };

      export default Component.extend({
        ...foo,
      });
      `,
      parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
    },
  ],
  invalid: [
    {
      code: `export default Component.extend({
        test: on("didInsertElement", function () {})
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      // With object variable.
      code: 'const body = { test: on("didInsertElement", function () {}) }; export default Component.extend(body);',
      output: null,
      errors: [{ message, line: 1 }],
    },
    {
      code: `export default Component.extend({
        test: on("init", observer("someProperty", function () {
          return true;
        })),
        someComputedProperty: computed.bool(true)
      });`,
      output: null,
      errors: [{ message, line: 2 }],
    },
    {
      code: `export default Component.extend({
        test: Ember.on("didInsertElement", function () {}),
        someComputedProperty: Ember.computed.readOnly('Hello World!'),
        anotherTest: Ember.on("willDestroyElement", function () {})
      });`,
      output: null,
      errors: [
        { message, line: 2 },
        { message, line: 4 },
      ],
    },
    {
      filename: 'example-app/components/some-component/component.js',
      code: 'export default CustomComponent.extend({test: on("didInsertElement", function () {})});',
      output: null,
      errors: [
        {
          message: "Don't use .on() for component lifecycle events.",
        },
      ],
    },
    {
      filename: 'example-app/components/some-component.js',
      code: 'export default CustomComponent.extend({test: on("didInsertElement", function () {})});',
      output: null,
      errors: [
        {
          message: "Don't use .on() for component lifecycle events.",
        },
      ],
    },
    {
      filename: 'example-app/twisted-path/some-file.js',
      code: 'export default Component.extend({test: on("didInsertElement", function () {})});',
      output: null,
      errors: [
        {
          message: "Don't use .on() for component lifecycle events.",
        },
      ],
    },
  ],
});
