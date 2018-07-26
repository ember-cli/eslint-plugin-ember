'use strict';

const rule = require('../../../lib/rules/no-ember-testing-in-module-scope');
const RuleTester = require('eslint').RuleTester;

const messages = rule.meta.messages;
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

ruleTester.run('no-ember-testing-in-module-scope', rule, {
  valid: [
    {
      code: 'foo.testing = true;'
    },
    {
      code: `
        import Ember from 'ember';

        export default Ember.Component.extend({
          init() {
            this.isTesting = Ember.testing;
          }
        });
      `
    },
    { code: 'const { testing } = FooBar;' },
    { code: 'const testing = FooBar.testing' },
    { code: 'const testing = true;' }
  ],
  invalid: [
    {
      code: `
        import Ember from 'ember';

        export default Ember.component.extend({
          isTesting: Ember.testing
        });
      `,
      errors: [{ message: messages[0] }]
    },
    {
      code: 'const IS_TESTING = Ember.testing;',
      errors: [{ message: messages[0] }]
    },
    {
      code: 'const { testing } = Ember;',
      errors: [{ message: messages[1] }]
    }
  ]
});
