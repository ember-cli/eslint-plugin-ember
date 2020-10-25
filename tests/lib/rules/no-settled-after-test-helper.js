const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-settled-after-test-helper');

const { ERROR_MESSAGE } = rule;

const ruleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
});

ruleTester.run('no-settled-after-test-helper', rule, {
  valid: [
    `
      async () => {
        await waitFor('.foo');
        await settled();
      }
    `,
    `
      async () => {
        await waitFor('.foo');
        await settled;
      }
    `,
    `
      async () => {
        await settled();
      }
    `,
    `
      async () => {
        this.set('foo', 42);
        await settled();
      }
    `,
    `
      async () => {
        let promise = waitFor('.foo');
        await promise;
        await settled();
      }
    `,
  ],
  invalid: [
    {
      code: `
        async () => {
          await click('.foo');
          await settled();
        }
      `,
      output: `
        async () => {
          await click('.foo');
\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020
        }
      `,
      errors: [{ message: ERROR_MESSAGE, line: 4, column: 11, endLine: 4, endColumn: 27 }],
    },
    {
      code: `
        async () => {
          await fillIn('.foo');
          await settled();
        }
      `,
      output: `
        async () => {
          await fillIn('.foo');
\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020
        }
      `,
      errors: [{ message: ERROR_MESSAGE, line: 4, column: 11, endLine: 4, endColumn: 27 }],
    },
    {
      code: `
        async () => {
          await settled();
          await settled();
        }
      `,
      output: `
        async () => {
          await settled();
\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020
        }
      `,
      errors: [{ message: ERROR_MESSAGE, line: 4, column: 11, endLine: 4, endColumn: 27 }],
    },
  ],
});
