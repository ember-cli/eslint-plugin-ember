'use strict';

const rule = require('../../../lib/rules/no-current-route-name');
const RuleTester = require('eslint').RuleTester;

const { ERROR_MESSAGE } = rule;

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

ruleTester.run('no-current-route-name', rule, {
  valid: [
    "assert.equal(currentURL(), '/foo');",
    "assert.equal(currentRouteName(), '/foo');",

    `
      import { currentURL } from '@ember/test-helpers';

      assert.equal(currentURL(), '/foo');
    `,

    // who knows...
    `
      import { currentURL as currentRouteName } from '@ember/test-helpers';

      assert.equal(currentRouteName(), '/foo');
    `,
  ],

  invalid: [
    {
      code: `
        import { currentRouteName } from '@ember/test-helpers';

        assert.equal(currentRouteName(), '/foo');
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 4, column: 22 }],
    },
    {
      code: `
        import { currentRouteName as foo } from '@ember/test-helpers';

        assert.equal(foo(), '/foo');
      `,
      output: null,
      errors: [{ message: ERROR_MESSAGE, line: 4, column: 22 }],
    },
  ],
});
