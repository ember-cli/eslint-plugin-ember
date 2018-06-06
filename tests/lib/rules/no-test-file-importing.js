const rule = require('../../../lib/rules/no-test-file-importing');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
});
const MESSAGE = rule.meta.message;

ruleTester.run('no-test-file-importing', rule, {
  valid: [
    {
      code: `
        import setupModule from './some-test-helper';
        import { module, test } from 'qunit';

        module('Acceptance | module', setupModule());
      `
    }
  ],
  invalid: [
    {
      code: `
        import setupModule from './some-other-test';
        import { module, test } from 'qunit';

        module('Acceptance | module', setupModule());
      `,
      errors: [
        {
          message: MESSAGE
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
      errors: [
        {
          message: MESSAGE
        }
      ]
    },
    {
      code: `
        import testModule from '../../test-dir/another-test';
        import { module, test } from 'qunit';

        module('Acceptance | module', testModule());
      `,
      errors: [
        {
          message: MESSAGE
        }
      ]
    }
  ]
});
