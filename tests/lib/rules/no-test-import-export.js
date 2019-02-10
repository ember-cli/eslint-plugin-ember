const rule = require('../../../lib/rules/no-test-import-export');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
});
const NO_IMPORT_MESSAGE = rule.meta.importMessage;
const NO_EXPORT_MESSAGE = rule.meta.exportMessage;

ruleTester.run('no-test-file-importing', rule, {
  valid: [
    {
      code: `
        import setupModule from './some-test-helper';
        import { module, test } from 'qunit';

        module('Acceptance | module', setupModule());
      `
    },
    {
      filename: 'tests/some-test-helper.js',
      code: `
        export function beforeEachSetup(){};
      `,
    }
  ],
  invalid: [
    {
      code: `
        import setupModule from './some-other-test';
        import { module, test } from 'qunit';

        module('Acceptance | module', setupModule());
      `,
      output: null,
      errors: [
        {
          message: NO_IMPORT_MESSAGE
        }
      ]
    },
    {
      code: `
        import {
          beforeEachSetup,
          testName,
        } from './some-other-test';
        import { module, test } from 'qunit';

        module('Acceptance | module', beforeEachSetup());
      `,
      output: null,
      errors: [
        {
          message: NO_IMPORT_MESSAGE
        }
      ]
    },
    {
      code: `
        import testModule from '../../test-dir/another-test';
        import { module, test } from 'qunit';

        module('Acceptance | module', testModule());
      `,
      output: null,
      errors: [
        {
          message: NO_IMPORT_MESSAGE
        }
      ]
    },
    {
      filename: 'tests/some-test.js',
      code: `
        export function beforeEachSetup(){};
      `,
      output: null,
      errors: [
        {
          message: NO_EXPORT_MESSAGE
        }
      ]
    },
    {
      filename: 'tests/some-test.js',
      code: `
        function beforeEachSetup(){};

        export default {beforeEachSetup};
      `,
      output: null,
      errors: [
        {
          message: NO_EXPORT_MESSAGE
        }
      ]
    },
  ]
});
