const rule = require('../../../lib/rules/no-try-invoke');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('no-try-invoke', rule, {
  valid: [
    "tryInvoke(this, 'foo');",
    "import { tryInvoke } from '@ember/utils'; foo.tryInvoke(this, 'foo');",
    "import { tryInvoke } from '@ember/utils'; tryInvoke.foo(this, 'foo');",
    "import { tryInvoke } from '@ember/utils'; foo();",
  ],
  invalid: [
    {
      code: `
        import { tryInvoke } from '@ember/utils';
        tryInvoke(this, 'foo');
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
        import { tryInvoke, isPresent } from '@ember/utils';
        tryInvoke(this, 'foo', ['bar']);
      `,
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE,
          type: 'CallExpression',
        },
      ],
    },
  ],
});
