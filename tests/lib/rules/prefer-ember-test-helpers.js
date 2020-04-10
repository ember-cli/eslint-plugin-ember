/**
 * @fileoverview help users writing tests in Ember using @ember/test-helpers check their imports to ensure they are using the correct method rather than the native method on window
 * @author Connie C Chang
 */
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

ruleTester.run('prefer-ember-test-helpers', rule, {
  valid: [
    `import { blur } from '@ember/test-helpers';

    test('foo', async function(assert) {
      await blur();
    });`,

    `import { find } from '@ember/test-helpers';

    test('foo', async function(assert) {
      await find();
    });`,

    `import { focus } from '@ember/test-helpers';

    test('foo', async function(assert) {
      await focus();
    });`,
  ],

  invalid: [
    {
      code: `test('foo', async function(assert) {
        await blur();
      });`,
      output: null,
      errors: [
        {
          message: 'Import the `blur()` method from Ember test-helpers',
        },
      ],
    },
    {
      code: `test('foo', async function(assert) {
        await find();
      });`,
      output: null,
      errors: [
        {
          message: 'Import the `find()` method from Ember test-helpers',
        },
      ],
    },
    {
      code: `test('foo', async function(assert) {
        await focus();
      });`,
      output: null,
      errors: [
        {
          message: 'Import the `focus()` method from Ember test-helpers',
        },
      ],
    },
  ],
});
