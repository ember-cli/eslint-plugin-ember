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

      export default registerHelper('findAllContaining', function (app, selector, text) {
        return [...document.querySelectorAll(selector)]
          .filter((element) => {
            return RegExp(text).test(element.textContent);
          });
      });
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
