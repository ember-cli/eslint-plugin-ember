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
      code: "import { observer, computed } from '@ember/object';",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: "import { observer as foo } from '@ember/object';",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: "import { addObserver } from '@ember/object/observers';",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: "import { removeObserver } from '@ember/object/observers';",
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'ImportDeclaration',
        },
      ],
    },
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
      code: 'Ember.addObserver("foo", this, "rerun");',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
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
