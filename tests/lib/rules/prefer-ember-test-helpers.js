'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/prefer-ember-test-helpers');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
});

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const TEST_FILE_NAME = 'some-test.js';

ruleTester.run('prefer-ember-test-helpers', rule, {
  valid: [
    {
      filename: TEST_FILE_NAME,
      code: `import { blur } from '@ember/test-helpers';

      test('foo', async function(assert) {
        await blur();
      });`,
    },

    {
      filename: TEST_FILE_NAME,
      code: `import { find } from '@ember/test-helpers';

      test('foo', async function(assert) {
        await find();
      });`,
    },

    {
      filename: TEST_FILE_NAME,
      code: `import { focus } from '@ember/test-helpers';

      test('foo', async function(assert) {
        await focus();
      });`,
    },
  ],

  invalid: [
    {
      filename: TEST_FILE_NAME,
      code: `test('foo', async function(assert) {
        await blur();
      });`,
      output: null,
      errors: [
        {
          message: 'Import the `blur()` method from @ember/test-helpers',
        },
      ],
    },
    {
      filename: TEST_FILE_NAME,
      code: `test('foo', async function(assert) {
        await find();
      });`,
      output: null,
      errors: [
        {
          message: 'Import the `find()` method from @ember/test-helpers',
        },
      ],
    },
    {
      filename: TEST_FILE_NAME,
      code: `test('foo', async function(assert) {
        await focus();
      });`,
      output: null,
      errors: [
        {
          message: 'Import the `focus()` method from @ember/test-helpers',
        },
      ],
    },
  ],
});
