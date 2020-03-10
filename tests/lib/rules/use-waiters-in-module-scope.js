'use strict';

const rule = require('../../../lib/rules/use-waiters-in-module-scope');

const { ERROR_MESSAGE } = rule;
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

ruleTester.run('use-waiters-in-module-scope', rule, {
  valid: [
    `
    import { buildWaiter } from 'ember-test-waiters';

    let myWaiter = buildWaiter('waiterName');
  `,
    `
    import { buildWaiter } from 'table-waiters';

    function useWaiter() {
      let myOtherWaiter = buildWaiter('the second');
    }
  `,
  ],

  invalid: [
    {
      code: `
      import { buildWaiter } from 'ember-test-waiters';

      function useWaiter() {
          let myOtherWaiter = buildWaiter('the second');
      }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
    {
      code: `
      import { buildWaiter as b } from 'ember-test-waiters';

      function useWaiter() {
          let myOtherWaiter = b('the second');
      }
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE }],
    },
  ],
});
