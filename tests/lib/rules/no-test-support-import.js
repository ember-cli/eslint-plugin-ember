const rule = require('../../../lib/rules/no-test-support-import');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

const { ERROR_MESSAGE_NO_IMPORT } = rule;

ruleTester.run('no-test-support-import', rule, {
  valid: [
    {
      filename: 'foo/tests/some-test-helper.js',
      code: `
      import setupModule from './test-support/some-test-helper';
      import { module, test } from 'qunit';

      module('Acceptance | module', setupModule());
    `,
    },
    {
      filename: 'foo/test-support/some-test-helper.js',
      code: `
      import setupModule from './test-support/some-test-helper';
      import { module, test } from 'qunit';

      module('Acceptance | module', setupModule());
    `,
    },
    {
      filename: 'foo/addon-test-support/some-test-helper.js',
      code: `
      import setupModule from './test-support/some-test-helper';
      import { module, test } from 'qunit';

      module('Acceptance | module', setupModule());
    `,
    },
  ],
  invalid: [
    {
      code: `
        import setupModule from './test-support/some-test-helper';
      `,
      filename: 'app/routes/index.js',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_NO_IMPORT,
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `
        import setupModule from 'foo/test-support/some-test-helper';
      `,
      filename: '@ember/foo/addon/components/index.js',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_NO_IMPORT,
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `
        import setupModule from 'foo/test-support/some-test-helper';
      `,
      filename: 'foo/test-support-foo/index.js',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_NO_IMPORT,
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code: `
        import setupModule from './test-support/some-test-helper';
      `,
      filename: 'app/components/index.js',
      output: null,
      errors: [
        {
          message: ERROR_MESSAGE_NO_IMPORT,
          type: 'ImportDeclaration',
        },
      ],
    },
  ],
});
