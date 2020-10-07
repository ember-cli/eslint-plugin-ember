const rule = require('../../../lib/rules/no-tryinvoke');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('no-tryinvoke', rule, {
  valid: [
    {
      code: `this.foo?.()`,
    },
  ],
  invalid: [
    {
      code: `
        import { tryInvoke } from '@ember/utils';
        tryInvoke(this, 'foo');
      `,
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
    {
      code: `
        import { tryInvoke, isPresent } from '@ember/utils';
        tryInvoke(this, 'foo', ['bar']);
      `,
      errors: [
        {
          message: ERROR_MESSAGE,
        },
      ],
    },
  ],
});
