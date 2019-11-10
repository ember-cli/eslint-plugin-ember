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
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 6,
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
  ],
  invalid: [
    {
      code: 'Ember.observer("text", function() {});',
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
