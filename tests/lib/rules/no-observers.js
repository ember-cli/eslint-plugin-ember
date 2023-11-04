// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-observers');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const eslintTester = new RuleTester({
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
});

eslintTester.run('no-observers', rule, {
  valid: [
    'export default Controller.extend();',
    'export default Controller.extend({actions: {},});',

    `
    import { action } from '@ember/object';
    class FooComponent extends Component {
      @action
      clickHandler() {}
    }`,

    // Not an Ember observer:
    'import { observer } from "@ember/object"; observer.foo();',
    'import { observer } from "@ember/object"; foo.observer();',
    'import { observer } from "@ember/object"; foo.observer.bar()',
    'import { observer } from "@ember/object"; foo()',
    'import Ember from "ember"; import { observer } from "@ember/object"; Ember.foo()',

    // Import missing:
    'observer();',
    'Ember.observer();',
    'observes();',
    'addObserver();',

    // removeObserver is allowed (we only need to report addObserver).
    'import { removeObserver } from "@ember/object/observers"; removeObserver();',
    'import Ember from "ember"; Ember.removeObserver();',
  ],
  invalid: [
    {
      code: `
        export default Component.extend({
          fooBar() {
            this.foo.addObserver("bar", this, "rerun");
          }
        });
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        export default Component.extend({
          fooBar() {
            this.addObserver("bar", this, "rerun");
          }
        });
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
        export default Component.extend({
          fooBar(baz) {
            baz.addObserver("bar", this, "rerun");
          }
        });
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 'import Ember from "ember"; Ember.addObserver("foo", this, "rerun");',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 'import { addObserver } from "@ember/object/observers"; addObserver();',
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression' }],
    },
    {
      code: 'import Ember from "ember"; Ember.observer("text", function() {});',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: 'import { observer } from "@ember/object"; observer("text", function() {});',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `
      import { observes } from '@ember-decorators/object';
      class FooComponent extends Component {
        @observes('baz')
        bar() {}
      }`,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'Decorator',
        },
      ],
    },
  ],
});
