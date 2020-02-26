const rule = require('../../../lib/rules/no-legacy-test-waiters');

const { ERROR_MESSAGE } = rule;
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

ruleTester.run('no-legacy-test-waiters', rule, {
  valid: [
    `
      import Component from '@ember/component';
      import { buildWaiter } from 'ember-test-waiters';

      let waiter = buildWaiter('my-waiter');

      export default Component.extend({
        init() {
          let token = waiter.beginAsync();

          someAsync()
            .then(() => console.log('hi'))
            .finally(() => waiter.endAsync(token));
        }
      });`,
  ],
  invalid: [
    {
      code: `
        import Component from '@ember/component';
        import { registerWaiter } from '@ember/test';

        let counter = 0;

        if (DEBUG) {
          registerWaiter(() => {
            return counter === 0;
          });
        }

        export default Component.extend({
          init() {
            counter++;
            someAsync()
              .then(() => console.log('hi'))
              .finally(() => counter--);
          }
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE }, { message: ERROR_MESSAGE }],
    },
    {
      code: `
        import Component from '@ember/component';
        import { registerWaiter, unregisterWaiter } from '@ember/test';

        let counter = 0;
        let waiter = () => {
          return counter === 0;
        }

        if (DEBUG) {
          registerWaiter(waiter);
        }

        export default Component.extend({
          init() {
            counter++;
            someAsync()
              .then(() => console.log('hi'))
              .finally(() => counter--);
          },

          willDestroy() {
            unregisterWaiter(waiter);
          }
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE }, { message: ERROR_MESSAGE }, { message: ERROR_MESSAGE }],
    },
  ],
});
