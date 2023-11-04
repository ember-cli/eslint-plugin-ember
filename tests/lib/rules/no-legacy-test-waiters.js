const rule = require('../../../lib/rules/no-legacy-test-waiters');

const { ERROR_MESSAGE } = rule;
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2022,
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
            .finally(() => waiter.endAsync(token));
        }
      });`,
    `
      import { registerWaiter } from 'table-waiters';

      registerWaiter();
    `,
    `
      import { unregisterWaiter } from 'table-waiters';

      unregisterWaiter();
    `,
    `
      import { registerHelper } from '@ember/test';
      registerHelper();

      // Other calls:
      registerWaiter();
      unregisterWaiter();
      otherCall();
      SomeObject.otherCall();
    `,
    `
      import { registerWaiter, unregisterWaiter } from '@ember/test';

      // Wrong function calls but look similar.

      SomeObject.registerWaiter();
      registerWaiter.otherFunction();

      SomeObject.unregisterWaiter();
      unregisterWaiter.otherFunction();
    `,
  ],
  invalid: [
    {
      code: `
        import { registerWaiter } from '@ember/test';

        registerWaiter(() => {
          return counter === 0;
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        import { registerWaiter as reg } from '@ember/test';

        reg(() => {
          return counter === 0;
        });
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
        import { registerWaiter, unregisterWaiter } from '@ember/test';

        registerWaiter(waiter);
        unregisterWaiter(waiter);
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE }, { message: ERROR_MESSAGE }],
    },
    {
      code: `
        import { registerWaiter as reg, unregisterWaiter as unreg } from '@ember/test';

        reg(waiter);
        unreg(waiter);
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE }, { message: ERROR_MESSAGE }],
    },
  ],
});
