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
      import { waitFor, settled } from '@ember/test-helpers';

      async () => {
        await waitFor('.foo');
        await settled();
      }
    `,
    `
      import { waitFor, settled } from '@ember/test-helpers';

      async () => {
        await waitFor('.foo');
        await settled;
      }
    `,
    `
      import { settled } from '@ember/test-helpers';

      async () => {
        await settled();
      }
    `,
    `
      import { settled } from '@ember/test-helpers';

      async () => {
        this.set('foo', 42);
        await settled();
      }
    `,
    `
      import { settled } from '@ember/test-helpers';

      async () => {
        let promise = waitFor('.foo');
        await promise;
        await settled();
      }
    `,
    `
      import { settled } from '@ember/test-helpers';

      function click() {}

      async () => {
        await click('.foo');
        await settled();
      }
    `,
    `
      import { settled } from '@ember/test-helpers';

      export async function visit(url) {
        try {
          something();
        } catch {}

        await settled();
      }
    `,
  ],
  invalid: [
    {
      code: `
        import { click, settled } from '@ember/test-helpers';

        async () => {
          await click('.foo');
          await settled();
        }
      `,
      output: `
        import { click, settled } from '@ember/test-helpers';

        async () => {
          await click('.foo');
\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020
        }
      `,
      errors: [{ message: ERROR_MESSAGE, line: 6, column: 11, endLine: 6, endColumn: 27 }],
    },
    {
      code: `
        import { fillIn, settled } from '@ember/test-helpers';

        async () => {
          await fillIn('.foo');
          await settled();
        }
      `,
      output: `
        import { fillIn, settled } from '@ember/test-helpers';

        async () => {
          await fillIn('.foo');
\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020
        }
      `,
      errors: [{ message: ERROR_MESSAGE, line: 6, column: 11, endLine: 6, endColumn: 27 }],
    },
    {
      code: `
        import { settled } from '@ember/test-helpers';

        async () => {
          await settled();
          await settled();
        }
      `,
      output: `
        import { settled } from '@ember/test-helpers';

        async () => {
          await settled();
\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020
        }
      `,
      errors: [{ message: ERROR_MESSAGE, line: 6, column: 11, endLine: 6, endColumn: 27 }],
    },
    {
      code: `
        import { click as cliiiick, settled } from '@ember/test-helpers';

        async () => {
          await cliiiick('.foo');
          await settled();
        }
      `,
      output: `
        import { click as cliiiick, settled } from '@ember/test-helpers';

        async () => {
          await cliiiick('.foo');
\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020
        }
      `,
      errors: [{ message: ERROR_MESSAGE, line: 6, column: 11, endLine: 6, endColumn: 27 }],
    },
  ],
});
