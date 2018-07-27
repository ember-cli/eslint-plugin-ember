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
      code: `
        import Ember from 'ember';

        export default Ember.Component.extend({
          someFunc() {
            if (Ember.testing) {
              doSomething();
            } else {
              doSomethingElse();
            }
          }
        });
      `
    },
    {
      code: `
        import Ember from 'ember';

        export default Ember.Component.extend({
          someFunc() {
            doSomething(Ember.testing ? 0 : 400);
          }
        });
      `
    },
    { code: 'foo.testing = true;' },
    { code: 'const { testing } = FooBar;' },
    { code: 'const testing = FooBar.testing' },
    { code: 'const testing = true;' },
  ],
  invalid: [
    {
      code: `
        import Ember from 'ember';

        export default Ember.Component.extend({
          init() {
            this.isTesting = Ember.testing;
          }
        });
      `,
      errors: [{ message: messages[1] }]
    },
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
      code: `
        import FooEmber from 'ember';

        const testDelay = FooEmber.testing ? 0 : 400
      `,
      errors: [{ message: messages[0] }]
    },
    {
      code: 'const IS_TESTING = Ember.testing;',
      errors: [{ message: messages[1] }, { message: messages[0] }]
    },
    {
      code: 'const { testing } = Ember;',
      errors: [{ message: messages[2] }]
    },
    {
      code: `
        import FooEmber from 'ember';

        const { testing } = FooEmber;
      `,
      errors: [{ message: messages[2] }]
    }
  ]
});
