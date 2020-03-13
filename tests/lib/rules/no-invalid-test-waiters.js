'use strict';

const rule = require('../../../lib/rules/no-invalid-test-waiters');

const { MODULE_SCOPE_ERROR_MESSAGE, DIRECT_ASSIGNMENT_ERROR_MESSAGE } = rule;
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

ruleTester.run('no-invalid-test-waiters', rule, {
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
    `
    import { buildWaiter } from 'ember-test-waiters';

    function useWaiter() {
      let myWaiter = somethingElse.buildWaiter('waiterName');
    }
  `,
    `
    import { buildWaiter } from 'ember-test-waiters';

    function useWaiter() {
      let myWaiter = buildWaiter.somethingElse('waiterName');
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
      errors: [{ message: MODULE_SCOPE_ERROR_MESSAGE }],
    },
    {
      code: `
      import { buildWaiter as b } from 'ember-test-waiters';

      function useWaiter() {
          let myOtherWaiter = b('the second');
      }
      `,
      output: null,
      errors: [{ message: MODULE_SCOPE_ERROR_MESSAGE }],
    },
    {
      code: `
      import { buildWaiter } from 'ember-test-waiters';

      const someFunction = () => { buildWaiter('waiterName'); };
      `,
      output: null,
      errors: [{ message: DIRECT_ASSIGNMENT_ERROR_MESSAGE }],
    },
  ],
});
