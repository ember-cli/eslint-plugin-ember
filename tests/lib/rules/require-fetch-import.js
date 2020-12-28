'use strict';

const rule = require('../../../lib/rules/require-fetch-import');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
  env: { browser: true },
});

ruleTester.run('require-fetch-import', rule, {
  valid: [
    `
      import fetch from 'fetch';

      fetch('/something');
    `,
    `
      fetch('/something');

      import fetch from 'fetch';
    `,
    `
      import { default as fetch } from 'fetch';

      fetch('/something');
    `,
    "foo('/something');",
  ],

  invalid: [
    {
      code: "fetch('/something');",
      output: null,
      errors: [{ message: ERROR_MESSAGE, type: 'CallExpression', line: 1, column: 1 }],
    },
  ],
});
